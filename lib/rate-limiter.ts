/**
 * Simple in-memory rate limiter using sliding window algorithm
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Rate limiter configuration
 */
export const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS: 30, // Maximum requests per window
  WINDOW_MS: 60000, // Time window in milliseconds (1 minute)
  CLEANUP_INTERVAL_MS: 300000, // Cleanup old entries every 5 minutes
} as const;

/**
 * Cleans up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}

// Schedule periodic cleanup
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, RATE_LIMIT_CONFIG.CLEANUP_INTERVAL_MS);
}

/**
 * Checks if a request should be rate limited
 * @param identifier - Unique identifier for the client (IP address, API key, etc.)
 * @returns Object with allowed status and rate limit info
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = store.get(identifier);

  // No existing entry or expired entry - create new one
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS,
    };
    store.set(identifier, newEntry);

    return {
      allowed: true,
      limit: RATE_LIMIT_CONFIG.MAX_REQUESTS,
      remaining: RATE_LIMIT_CONFIG.MAX_REQUESTS - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Increment count for existing entry
  entry.count += 1;

  const allowed = entry.count <= RATE_LIMIT_CONFIG.MAX_REQUESTS;
  const remaining = Math.max(0, RATE_LIMIT_CONFIG.MAX_REQUESTS - entry.count);

  return {
    allowed,
    limit: RATE_LIMIT_CONFIG.MAX_REQUESTS,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Extracts client identifier from request headers
 * Uses X-Forwarded-For header if available (for proxies), falls back to IP
 * @param headers - Request headers
 * @returns Client identifier string
 */
export function getClientIdentifier(headers: Headers): string {
  // Check for X-Forwarded-For header (when behind proxy/load balancer)
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, use the first one
    return forwarded.split(",")[0].trim();
  }

  // Check for X-Real-IP header
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  // In production, you might want to use a different strategy
  return "unknown";
}

/**
 * Resets rate limit for a specific identifier (useful for testing)
 * @param identifier - Client identifier to reset
 */
export function resetRateLimit(identifier: string): void {
  store.delete(identifier);
}
