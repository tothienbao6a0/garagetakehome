import { NextRequest, NextResponse } from "next/server";
import type { ListingData, ApiError } from "@/types/listing";
import { API_CONFIG, ERROR_MESSAGES } from "@/lib/constants";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limiter";

/**
 * Fetches listing data by scraping the Garage listing page
 * The website uses Next.js SSG with data embedded in the page
 */
async function fetchListingFromPage(id: string): Promise<ListingData | null> {
  try {
    // The listing URL format is: https://www.shopgarage.com/listing/{title}-{uuid}
    // But we can try with just the UUID and follow redirects, or try the Next.js data API
    const baseUrl = "https://www.shopgarage.com/listing";

    // Try fetching with just the ID - the site might redirect to the correct slug
    const response = await fetch(`${baseUrl}/${id}`, {
      headers: {
        "User-Agent": API_CONFIG.USER_AGENT,
        "Accept": "text/html",
      },
      cache: API_CONFIG.CACHE,
      next: { revalidate: API_CONFIG.REVALIDATE },
      redirect: "follow", // Follow redirects to get to the canonical URL
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Extract __NEXT_DATA__ from the page
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
    if (!nextDataMatch) {
      return null;
    }

    const nextData = JSON.parse(nextDataMatch[1]);
    const listingPreview = nextData?.props?.pageProps?.listingPreview;

    if (!listingPreview) {
      return null;
    }

    // Extract useful data from listingAttributes
    const attributes = listingPreview.listingAttributes || [];
    let mileage: number | undefined;
    let model: string | undefined;
    let year: number | undefined;

    // Known attribute IDs (these are consistent across listings)
    const MILEAGE_ATTR_ID = '7d794d55-f1dd-4b5d-90ab-b277e202ceed';
    const MODEL_ATTR_ID = '0f5716f2-0d28-4516-a693-ecd1f4436f0f';

    // Parse attributes to extract specific fields
    for (const attr of attributes) {
      const value = attr.value;

      // Extract mileage by known UUID
      if (attr.categoryAttributeId === MILEAGE_ATTR_ID && /^\d+$/.test(value)) {
        mileage = parseInt(value, 10);
      }

      // Extract model by known UUID
      if (attr.categoryAttributeId === MODEL_ATTR_ID && value !== 'true' && value !== 'false') {
        model = value;
      }

      // Fallback: if we haven't found a model yet, look for string values that look like model names
      if (!model && /^[A-Za-z\s]+$/.test(value) && value.length > 3 && value.length < 50) {
        const lowerValue = value.toLowerCase();
        // Skip boolean values and brand names
        if (lowerValue !== 'true' && lowerValue !== 'false' && lowerValue !== listingPreview.itemBrand?.toLowerCase()) {
          model = value;
        }
      }
    }

    // Extract year from title if present (e.g., "2009 Spartan...")
    const yearMatch = listingPreview.listingTitle?.match(/^(\d{4})\s/);
    if (yearMatch) {
      year = parseInt(yearMatch[1], 10);
    }

    // Note: Detailed descriptions are not available in the initial page data
    // They're loaded dynamically via JavaScript after page load
    // For an invoice, the title already contains the key information
    const description = '';

    // Map the Garage API response to our ListingData interface
    return {
      id: listingPreview.id || id,
      title: listingPreview.listingTitle || "",
      description: description,
      price: listingPreview.sellingPrice || 0,
      year: year,
      make: listingPreview.itemBrand,
      model: model,
      mileage: mileage,
    };
  } catch (error) {
    console.warn(`Failed to fetch listing from page:`, error instanceof Error ? error.message : 'Unknown error');
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
    // Fetch listing data from the Garage website
    let listingData = await fetchListingFromPage(id);

    // Fallback to mock data for development/testing
    if (!listingData) {
      console.warn(`Could not fetch listing ${id} from Garage website, using mock data`);
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
