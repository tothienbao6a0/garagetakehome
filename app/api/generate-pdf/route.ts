import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/InvoicePDF";
import { createElement } from "react";
import type { ListingData, ApiError } from "@/types/listing";
import { ERROR_MESSAGES } from "@/lib/constants";

function validateListingData(data: unknown): data is ListingData {
  if (!data || typeof data !== "object") return false;
  
  const listing = data as Partial<ListingData>;
  return !!(
    listing.id &&
    listing.title &&
    typeof listing.price === "number"
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const listingData: unknown = await request.json();

    // Validate required fields
    if (!validateListingData(listingData)) {
      return NextResponse.json<ApiError>(
        { error: ERROR_MESSAGES.MISSING_FIELDS },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfElement = createElement(InvoicePDF, { listing: listingData });
    const pdfBuffer = await renderToBuffer(pdfElement as any);

    // Return PDF as response
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="garage-invoice-${listingData.id}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json<ApiError>(
      { error: ERROR_MESSAGES.PDF_GENERATION_FAILED },
      { status: 500 }
    );
  }
}
