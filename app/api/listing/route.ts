import { NextRequest, NextResponse } from "next/server";
import type { ListingData, ApiError } from "@/types/listing";
import { API_CONFIG, ERROR_MESSAGES } from "@/lib/constants";

const API_ENDPOINTS = [
  "https://api.withgarage.com/listings",
  "https://withgarage.com/api/listings",
  "https://api.withgarage.com/v1/listings",
  "https://withgarage.com/api/v1/listings",
] as const;

const MOCK_LISTING: Omit<ListingData, "id"> = {
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
    const response = await fetch(`${endpoint}/${id}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": API_CONFIG.USER_AGENT,
      },
      cache: API_CONFIG.CACHE,
      next: { revalidate: API_CONFIG.REVALIDATE },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Silently continue to next endpoint
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
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json<ApiError>(
      { error: ERROR_MESSAGES.MISSING_ID },
      { status: 400 }
    );
  }

  try {
    let listingData = await tryFetchListingData(id);

    // Fallback to mock data for development/testing
    if (!listingData) {
      console.warn("Could not fetch from Garage API, using mock data");
      listingData = { id, ...MOCK_LISTING };
    }

    // Validate required fields
    if (!validateListingData(listingData)) {
      return NextResponse.json<ApiError>(
        { error: ERROR_MESSAGES.INVALID_DATA },
        { status: 500 }
      );
    }

    return NextResponse.json<ListingData>(listingData);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json<ApiError>(
      { error: ERROR_MESSAGES.FETCH_FAILED },
      { status: 500 }
    );
  }
}
