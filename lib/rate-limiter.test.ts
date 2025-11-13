import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  resetRateLimit,
  getClientIdentifier,
  RATE_LIMIT_CONFIG,
} from "./rate-limiter";

describe("Rate Limiter", () => {
  beforeEach(() => {
    // Reset rate limit for test client before each test
    resetRateLimit("test-client");
  });

  describe("checkRateLimit", () => {
    it("should allow first request", () => {
      const result = checkRateLimit("test-client");

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(RATE_LIMIT_CONFIG.MAX_REQUESTS);
      expect(result.remaining).toBe(RATE_LIMIT_CONFIG.MAX_REQUESTS - 1);
    });

    it("should decrement remaining count on subsequent requests", () => {
      checkRateLimit("test-client"); // First request
      const result = checkRateLimit("test-client"); // Second request

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(RATE_LIMIT_CONFIG.MAX_REQUESTS - 2);
    });

    it("should block requests after limit is exceeded", () => {
      // Make MAX_REQUESTS + 1 requests
      for (let i = 0; i < RATE_LIMIT_CONFIG.MAX_REQUESTS; i++) {
        checkRateLimit("test-client");
      }

      const result = checkRateLimit("test-client");

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("should have different counters for different clients", () => {
      checkRateLimit("client-1");
      checkRateLimit("client-1");

      const result1 = checkRateLimit("client-1");
      const result2 = checkRateLimit("client-2");

      expect(result1.remaining).toBe(RATE_LIMIT_CONFIG.MAX_REQUESTS - 3);
      expect(result2.remaining).toBe(RATE_LIMIT_CONFIG.MAX_REQUESTS - 1);
    });

    it("should include reset time in response", () => {
      const result = checkRateLimit("test-client");
      const now = Date.now();

      expect(result.resetTime).toBeGreaterThan(now);
      expect(result.resetTime).toBeLessThanOrEqual(
        now + RATE_LIMIT_CONFIG.WINDOW_MS + 100
      ); // Small buffer for test execution time
    });
  });

  describe("resetRateLimit", () => {
    it("should reset rate limit for a client", () => {
      // Make some requests
      checkRateLimit("test-client");
      checkRateLimit("test-client");

      // Reset
      resetRateLimit("test-client");

      // Should be back to full limit
      const result = checkRateLimit("test-client");
      expect(result.remaining).toBe(RATE_LIMIT_CONFIG.MAX_REQUESTS - 1);
    });
  });

  describe("getClientIdentifier", () => {
    it("should extract IP from X-Forwarded-For header", () => {
      const headers = new Headers();
      headers.set("x-forwarded-for", "192.168.1.1, 10.0.0.1");

      const identifier = getClientIdentifier(headers);

      expect(identifier).toBe("192.168.1.1");
    });

    it("should extract IP from X-Real-IP header", () => {
      const headers = new Headers();
      headers.set("x-real-ip", "192.168.1.2");

      const identifier = getClientIdentifier(headers);

      expect(identifier).toBe("192.168.1.2");
    });

    it("should prefer X-Forwarded-For over X-Real-IP", () => {
      const headers = new Headers();
      headers.set("x-forwarded-for", "192.168.1.1");
      headers.set("x-real-ip", "192.168.1.2");

      const identifier = getClientIdentifier(headers);

      expect(identifier).toBe("192.168.1.1");
    });

    it("should return 'unknown' when no IP headers present", () => {
      const headers = new Headers();

      const identifier = getClientIdentifier(headers);

      expect(identifier).toBe("unknown");
    });
  });
});
