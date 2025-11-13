/**
 * Known attribute IDs extracted from Garage's categoryAttributeId UUIDs
 *
 * Note: Garage does not expose attribute labels in their SSG (__NEXT_DATA__) data.
 * These are loaded dynamically via JavaScript after page load.
 * We only format values we can definitively identify, everything else shows raw value.
 */

// Known attribute IDs that we can confidently identify
const MILEAGE_ATTR_ID = '7d794d55-f1dd-4b5d-90ab-b277e202ceed';

/**
 * Format an attribute value - only formats values we can confidently identify
 * Returns the raw value for everything else to avoid guesswork
 */
export function formatAttribute(categoryAttributeId: string, value: string): string | null {
  // Skip zeros - they're often placeholder values
  if (value === '0') {
    return null;
  }

  // Skip empty values
  if (!value || value.trim() === '') {
    return null;
  }

  // Handle booleans - skip them as we don't know what they represent
  if (value === 'true' || value === 'false') {
    return null;
  }

  // Format mileage specifically since we know this ID
  if (categoryAttributeId === MILEAGE_ATTR_ID && /^\d+$/.test(value)) {
    return `${parseInt(value, 10).toLocaleString()} miles`;
  }

  // Return all other values as-is (model, make, type, numeric values, etc.)
  return value;
}
