import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/InvoicePDF";
import { createElement } from "react";
import type { ListingData, ApiError } from "@/types/listing";
import { ERROR_MESSAGES, INPUT_LIMITS } from "@/lib/constants";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limiter";

function sanitizeString(str: string | undefined, maxLength: number): string {
  if (!str) return "";
  // Remove any control characters and limit length
  return str.replace(/[\x00-\x1F\x7F]/g, "").slice(0, maxLength);
}

function validateListingData(data: unknown): data is ListingData {
  if (!data || typeof data !== "object") return false;

  const listing = data as Partial<ListingData>;
  return !!(
    listing.id &&
    listing.title &&
    typeof listing.price === "number"
  );
}

function sanitizeListingData(data: ListingData): ListingData {
  return {
    ...data,
    id: sanitizeString(data.id, INPUT_LIMITS.ID_MAX_LENGTH),
    title: sanitizeString(data.title, INPUT_LIMITS.TITLE_MAX_LENGTH),
    description: sanitizeString(data.description, INPUT_LIMITS.DESCRIPTION_MAX_LENGTH),
    make: sanitizeString(data.make, INPUT_LIMITS.STRING_FIELD_MAX_LENGTH),
    model: sanitizeString(data.model, INPUT_LIMITS.STRING_FIELD_MAX_LENGTH),
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
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

  try {
    const listingData: unknown = await request.json();

    // Validate required fields
    if (!validateListingData(listingData)) {
      return NextResponse.json<ApiError>(
        { error: ERROR_MESSAGES.MISSING_FIELDS },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Sanitize input data to prevent DoS attacks with large inputs
    const sanitizedData = sanitizeListingData(listingData);

    // Generate PDF
    const pdfElement = createElement(InvoicePDF, { listing: sanitizedData });
    const pdfBuffer = await renderToBuffer(pdfElement as any);

    // Return PDF as response
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="garage-invoice-${listingData.id}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
        ...rateLimitHeaders,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json<ApiError>(
      { error: ERROR_MESSAGES.PDF_GENERATION_FAILED },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
