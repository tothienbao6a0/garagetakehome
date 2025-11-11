// Helper functions for invoice generation

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateInvoiceNumber(listingId: string): string {
  return `INV-${listingId.substring(0, 8).toUpperCase()}`;
}

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

