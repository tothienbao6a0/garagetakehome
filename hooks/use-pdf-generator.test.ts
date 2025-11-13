import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePDFGenerator } from "./use-pdf-generator";

describe("usePDFGenerator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("should initialize with empty values", () => {
    const { result } = renderHook(() => usePDFGenerator());

    expect(result.current.url).toBe("");
    expect(result.current.error).toBe("");
    expect(result.current.isPending).toBe(false);
  });

  it("should update URL", () => {
    const { result } = renderHook(() => usePDFGenerator());

    act(() => {
      result.current.setUrl("https://withgarage.com/listing/abc-123");
    });

    expect(result.current.url).toBe("https://withgarage.com/listing/abc-123");
  });

  it("should handle invalid URL format", async () => {
    const { result } = renderHook(() => usePDFGenerator());

    act(() => {
      result.current.setUrl("https://invalid-url.com");
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    act(() => {
      result.current.generatePDF(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.error).toContain("Invalid listing URL");
    });
  });

  it("should successfully generate PDF with valid URL", async () => {
    const mockListingData = {
      id: "abc-123",
      title: "Test Truck",
      price: 100000,
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockListingData,
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(["pdf content"], { type: "application/pdf" }),
      });

    const { result } = renderHook(() => usePDFGenerator());

    act(() => {
      result.current.setUrl("https://withgarage.com/listing/abc-123");
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    act(() => {
      result.current.generatePDF(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.error).toBe("");
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/listing?id=abc-123");
  });

  it("should handle API fetch error", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Listing not found" }),
    });

    const { result } = renderHook(() => usePDFGenerator());

    act(() => {
      result.current.setUrl("https://withgarage.com/listing/abc-123");
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    act(() => {
      result.current.generatePDF(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.error).toContain("Listing not found");
    });
  });

  it("should handle PDF generation error", async () => {
    const mockListingData = {
      id: "abc-123",
      title: "Test Truck",
      price: 100000,
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockListingData,
      })
      .mockResolvedValueOnce({
        ok: false,
      });

    const { result } = renderHook(() => usePDFGenerator());

    act(() => {
      result.current.setUrl("https://withgarage.com/listing/abc-123");
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    act(() => {
      result.current.generatePDF(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.error).toContain("Failed to generate PDF");
    });
  });
});
