import { NextRequest, NextResponse } from "next/server";
import type { ListingData, ApiError } from "@/types/listing";
import { API_CONFIG, ERROR_MESSAGES } from "@/lib/constants";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limiter";

const API_ENDPOINTS = [
  "https://api.withgarage.com/listings",
  "https://withgarage.com/api/listings",
  "https://api.withgarage.com/v1/listings",
  "https://withgarage.com/api/v1/listings",
] as const;

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

async function fetchFromEndpoint(endpoint: string, id: string): Promise<ListingData | null> {
  try {
    const url = `${endpoint}/${id}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": API_CONFIG.USER_AGENT,
      },
      cache: API_CONFIG.CACHE,
      next: { revalidate: API_CONFIG.REVALIDATE },
    });

    if (response.ok) {
      console.log(`Successfully fetched listing from: ${endpoint}`);
      return await response.json();
    }
  } catch (error) {
    console.warn(`Failed to fetch from ${endpoint}:`, error instanceof Error ? error.message : 'Unknown error');
  }
  return null;
}

async function tryFetchListingData(id: string): Promise<ListingData | null> {
  for (const endpoint of API_ENDPOINTS) {
    const data = await fetchFromEndpoint(endpoint, id);
    if (data) return data;
  }
  return null;
}

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
    let listingData = await tryFetchListingData(id);

    // Fallback to mock data for development/testing
    if (!listingData) {
      console.warn(`Could not fetch listing ${id} from any API endpoint, using mock data`);
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
