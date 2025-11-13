/**
 * Helper functions for invoice generation
 */

/**
 * Formats a number as USD currency without decimal places
 * @param price - The price to format
 * @returns Formatted price string (e.g., "$425,000")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats a date in long format
 * @param date - The date to format (defaults to current date)
 * @returns Formatted date string (e.g., "January 15, 2025")
 */
export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generates an invoice number from a listing ID
 * @param listingId - The listing UUID
 * @returns Invoice number (e.g., "INV-ABC12345")
 */
export function generateInvoiceNumber(listingId: string): string {
  return `INV-${listingId.substring(0, 8).toUpperCase()}`;
}

/**
 * Formats fire truck specifications into a readable string
 * @param specs - Object containing year, make, model, and mileage
 * @returns Formatted specs string (e.g., "2018 • Pierce • Enforcer • 15,000 miles")
 */
export function formatItemSpecs(specs: {
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
}): string {
  const parts = [
    specs.year?.toString(),
    specs.make,
    specs.model,
    specs.mileage && `${specs.mileage.toLocaleString()} miles`,
  ].filter(Boolean);

  return parts.join(" • ");
}

