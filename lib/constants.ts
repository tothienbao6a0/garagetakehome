export const UUID_REGEX = /\/listing\/([\w-]+)/i;

export const ERROR_MESSAGES = {
  INVALID_URL: "Invalid listing URL format. Expected: .../listing/{uuid}",
  FETCH_FAILED: "Failed to fetch listing data",
  PDF_GENERATION_FAILED: "Failed to generate PDF",
  UNEXPECTED_ERROR: "An unexpected error occurred",
  MISSING_FIELDS: "Missing required fields: title, price, or id",
  INVALID_DATA: "Invalid listing data received",
  MISSING_ID: "Listing ID is required",
} as const;

export const API_CONFIG = {
  CACHE: "no-store" as const,
  REVALIDATE: 0,
  USER_AGENT: "Garage-Invoice-Generator",
} as const;

