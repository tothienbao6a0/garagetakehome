export const UUID_REGEX = /^https?:\/\/(?:www\.)?(withgarage\.com|shopgarage\.com)\/listing\/([\w-]+)/i;

export const ERROR_MESSAGES = {
  INVALID_URL: "Invalid listing URL. Please use a valid withgarage.com or shopgarage.com listing URL",
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

export const CONTACT_INFO = {
  EMAIL: "alaz@withgarage.com",
  COMPANY_NAME: "Garage Marketplace",
} as const;

export const INPUT_LIMITS = {
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 5000,
  ID_MAX_LENGTH: 100,
  STRING_FIELD_MAX_LENGTH: 200,
} as const;

