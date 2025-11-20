import { NextRequest, NextResponse } from "next/server";
import type { ListingData, ApiError } from "@/types/listing";
import { API_CONFIG, ERROR_MESSAGES } from "@/lib/constants";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limiter";
import { formatAttribute } from "@/lib/attribute-labels";

/**
 * Fetches the current Next.js buildId from Garage homepage
 * The buildId is required for the data API and changes with each deployment
 */
async function getBuildId(): Promise<string | null> {
  try {
    const response = await fetch("https://www.shopgarage.com", {
      headers: { "User-Agent": API_CONFIG.USER_AGENT },
      cache: API_CONFIG.CACHE,
      next: { revalidate: API_CONFIG.REVALIDATE },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const match = html.match(/"buildId":"([^"]+)"/);
    return match ? match[1] : null;
  } catch (error) {
    console.warn("Failed to fetch buildId:", error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Fetches listing data from Garage's Next.js data API
 * This is the proper way to get listing data as a clean JSON response
 */
async function fetchListingFromAPI(slug: string): Promise<ListingData | null> {
  try {
    // Get current buildId
    const buildId = await getBuildId();
    if (!buildId) {
      return null;
    }

    // Fetch from Next.js data API
    const apiUrl = `https://www.shopgarage.com/_next/data/${buildId}/listing/${slug}.json`;
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": API_CONFIG.USER_AGENT,
        "Accept": "application/json",
      },
      cache: API_CONFIG.CACHE,
      next: { revalidate: API_CONFIG.REVALIDATE },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const listingPreview = data?.pageProps?.listingPreview;

    if (!listingPreview) {
      return null;
    }

    // Extract all meaningful attributes
    const attributes = listingPreview.listingAttributes || [];
    const attributeValues: string[] = [];

    let mileage: number | undefined;
    let model: string | undefined;
    let year: number | undefined;

    // Known attribute IDs for backwards compatibility
    const MILEAGE_ATTR_ID = '7d794d55-f1dd-4b5d-90ab-b277e202ceed';
    const MODEL_ATTR_ID = '0f5716f2-0d28-4516-a693-ecd1f4436f0f';

    // Extract and format all attributes (including booleans)
    for (const attr of attributes) {
      const value = attr.value;
      const categoryAttributeId = attr.categoryAttributeId;

      // Extract known fields for backwards compatibility
      if (categoryAttributeId === MILEAGE_ATTR_ID && /^\d+$/.test(value)) {
        mileage = parseInt(value, 10);
      } else if (categoryAttributeId === MODEL_ATTR_ID) {
        model = value;
      }

      // Format attribute with label (returns null for skipped values)
      const formatted = formatAttribute(categoryAttributeId, value);
      if (formatted) {
        attributeValues.push(formatted);
      }
    }

    // Extract year from title if present (e.g., "2009 Spartan..." or "NEW BUILD 2024 RAM...")
    const yearMatch = listingPreview.listingTitle?.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      year = parseInt(yearMatch[1], 10);
    }

    // Remove duplicate values (case-insensitive) while preserving order
    const seen = new Set<string>();
    const uniqueValues = attributeValues.filter(v => {
      const lower = v.toLowerCase();
      if (seen.has(lower)) {
        return false;
      }
      seen.add(lower);
      return true;
    });

    // Create formatted specs string from all attributes
    const specs = uniqueValues.join(' • ');

    // Note: Detailed descriptions are not available in the initial page data
    // They're loaded dynamically via JavaScript after page load
    // For an invoice, the title already contains the key information
    const description = '';

    // Map the Garage API response to our ListingData interface
    return {
      id: listingPreview.id,
      title: listingPreview.listingTitle || "",
      description: description,
      price: listingPreview.sellingPrice || 0,
      year: year,
      make: listingPreview.itemBrand,
      model: model,
      mileage: mileage,
      specs: specs || undefined, // Formatted string of all attributes
      imageUrl: listingPreview.imageUrl || undefined, // Primary product image
    };
  } catch (error) {
    console.warn(`Failed to fetch listing from API:`, error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Fallback: Fetches listing by following redirect to get the slug
 * Used when the listing slug is unknown (only have UUID)
 */
async function fetchListingWithSlugResolution(id: string): Promise<ListingData | null> {
  try {
    // Fetch the listing page with the ID to get redirected to the full slug
    const response = await fetch(`https://www.shopgarage.com/listing/${id}`, {
      headers: {
        "User-Agent": API_CONFIG.USER_AGENT,
        "Accept": "text/html",
      },
      cache: API_CONFIG.CACHE,
      next: { revalidate: API_CONFIG.REVALIDATE },
      redirect: "manual", // Don't auto-follow so we can extract the slug
    });

    // If we get a redirect, extract the slug from the Location header
    if (response.status === 307 || response.status === 308) {
      const location = response.headers.get("location");
      if (location) {
        const slugMatch = location.match(/\/listing\/([^?]+)/);
        if (slugMatch) {
          const slug = slugMatch[1];
          console.log(`Resolved slug for ${id}: ${slug}`);
          return await fetchListingFromAPI(slug);
        }
      }
    }

    return null;
  } catch (error) {
    console.warn(`Failed to resolve slug for ${id}:`, error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Mock listing data for development/testing when API is unavailable
 * Note: ID is added dynamically from the request parameter
 */
const MOCK_LISTING_DATA: Omit<ListingData, "id"> = {
  title: "2018 Pierce Enforcer Pumper",
  description:
    "Excellent condition fire truck with 1500 GPM pump, 750-gallon water tank, and foam system. Well-maintained with complete service records. Features include LED lighting, hydraulic rescue tools, and advanced communications system.",
  price: 425000,
  year: 2018,
  make: "Pierce",
  model: "Enforcer",
  mileage: 15000,
};


function validateListingData(data: ListingData): boolean {
  return !!(data.title && typeof data.price === "number");
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Rate limiting check
  const clientId = getClientIdentifier(request.headers);
  const rateLimit = checkRateLimit(clientId);

  // Add rate limit headers to all responses
  const rateLimitHeaders = {
    "X-RateLimit-Limit": rateLimit.limit.toString(),
    "X-RateLimit-Remaining": rateLimit.remaining.toString(),
    "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
  };

  if (!rateLimit.allowed) {
    return NextResponse.json<ApiError>(
      { error: "Rate limit exceeded. Please try again later." },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders,
          "Retry-After": Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
        }
      }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json<ApiError>(
      { error: ERROR_MESSAGES.MISSING_ID },
      { status: 400, headers: rateLimitHeaders }
    );
  }

  try {
    let listingData: ListingData | null = null;

    // Strategy 1: Try with full slug if provided (most efficient)
    // User might provide full slug like "2008-Crimson-Spartan-Pumper-dbb3fcda-..."
    if (id.includes('-')) {
      console.log(`Attempting to fetch with slug: ${id}`);
      listingData = await fetchListingFromAPI(id);
    }

    // Strategy 2: If just UUID provided, resolve the slug first
    if (!listingData) {
      console.log(`Attempting to resolve slug for UUID: ${id}`);
      listingData = await fetchListingWithSlugResolution(id);
    }

    // Strategy 3: Fallback to mock data for development/testing
    if (!listingData) {
      console.warn(`Could not fetch listing ${id} from Garage API, using mock data`);
      listingData = { id, ...MOCK_LISTING_DATA };
    }

    // Validate required fields
    if (!validateListingData(listingData)) {
      return NextResponse.json<ApiError>(
        { error: ERROR_MESSAGES.INVALID_DATA },
        { status: 500, headers: rateLimitHeaders }
      );
    }

    return NextResponse.json<ListingData>(listingData, { headers: rateLimitHeaders });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json<ApiError>(
      { error: ERROR_MESSAGES.FETCH_FAILED },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
