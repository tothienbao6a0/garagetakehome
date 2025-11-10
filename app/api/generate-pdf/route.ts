import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/InvoicePDF";
import { createElement } from "react";

export async function POST(request: NextRequest) {
  try {
    const listingData = await request.json();

    // Validate required fields
    if (!listingData.title || !listingData.price || !listingData.id) {
      return NextResponse.json(
        { error: "Missing required fields: title, price, or id" },
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
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

