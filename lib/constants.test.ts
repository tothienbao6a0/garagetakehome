import { describe, it, expect } from "vitest";
import { UUID_REGEX, ERROR_MESSAGES, API_CONFIG } from "./constants";

describe("Constants", () => {
  describe("UUID_REGEX", () => {
    it("should match valid listing URLs with UUIDs", () => {
      const validUrls = [
        "https://withgarage.com/listing/abc-123-def",
        "http://withgarage.com/listing/550e8400-e29b-41d4-a716-446655440000",
        "/listing/abc-123",
        "https://example.com/listing/test-id-123",
      ];

      validUrls.forEach((url) => {
        const match = url.match(UUID_REGEX);
        expect(match).not.toBeNull();
        expect(match![1]).toBeTruthy();
      });
    });

    it("should extract UUID from valid URLs", () => {
      const tests = [
        { url: "https://withgarage.com/listing/abc-123-xyz", expected: "abc-123-xyz" },
        { url: "/listing/test-id", expected: "test-id" },
        { url: "https://site.com/listing/uuid-123", expected: "uuid-123" },
      ];

      tests.forEach(({ url, expected }) => {
        const match = url.match(UUID_REGEX);
        expect(match).not.toBeNull();
        expect(match![1]).toBe(expected);
      });
    });

    it("should not match invalid URLs", () => {
      const invalidUrls = [
        "https://withgarage.com/list/abc-123",
        "https://withgarage.com/listing/",
        "https://withgarage.com",
        "no-listing-here",
      ];

      invalidUrls.forEach((url) => {
        expect(UUID_REGEX.test(url)).toBe(false);
      });
    });
  });

  describe("ERROR_MESSAGES", () => {
    it("should have all required error messages", () => {
      expect(ERROR_MESSAGES.INVALID_URL).toBeDefined();
      expect(ERROR_MESSAGES.FETCH_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.PDF_GENERATION_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.UNEXPECTED_ERROR).toBeDefined();
      expect(ERROR_MESSAGES.MISSING_FIELDS).toBeDefined();
      expect(ERROR_MESSAGES.INVALID_DATA).toBeDefined();
      expect(ERROR_MESSAGES.MISSING_ID).toBeDefined();
    });

    it("should have meaningful error messages", () => {
      expect(ERROR_MESSAGES.INVALID_URL).toContain("Invalid");
      expect(ERROR_MESSAGES.FETCH_FAILED).toContain("Failed");
      expect(ERROR_MESSAGES.PDF_GENERATION_FAILED).toContain("PDF");
    });
  });

  describe("API_CONFIG", () => {
    it("should have correct cache configuration", () => {
      expect(API_CONFIG.CACHE).toBe("no-store");
      expect(API_CONFIG.REVALIDATE).toBe(0);
      expect(API_CONFIG.USER_AGENT).toBe("Garage-Invoice-Generator");
    });
  });
});
