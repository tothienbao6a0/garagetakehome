import { useState, useCallback, useTransition } from "react";
import type { ListingData, ApiError } from "@/types/listing";
import { UUID_REGEX, ERROR_MESSAGES } from "@/lib/constants";

interface UsePDFGeneratorReturn {
  url: string;
  setUrl: (url: string) => void;
  error: string;
  isPending: boolean;
  generatePDF: (e: React.FormEvent) => Promise<void>;
  previewPDF: (e: React.FormEvent) => Promise<void>;
  pdfUrl: string | null;
  closePreview: () => void;
}

export function usePDFGenerator(): UsePDFGeneratorReturn {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const extractListingId = useCallback((url: string): string => {
    const match = url.match(UUID_REGEX);
    if (!match) {
      throw new Error(ERROR_MESSAGES.INVALID_URL);
    }
    return match[2]; // Group 2 is the listing ID (group 1 is the domain)
  }, []);

  const fetchListingData = useCallback(async (listingId: string): Promise<ListingData> => {
    const response = await fetch(`/api/listing?id=${listingId}`);
    
    if (!response.ok) {
      const data: ApiError = await response.json();
      throw new Error(data.error || ERROR_MESSAGES.FETCH_FAILED);
    }
    
    return response.json();
  }, []);

  const generatePDFFromData = useCallback(async (listingData: ListingData): Promise<Blob> => {
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.PDF_GENERATION_FAILED);
    }

    return response.blob();
  }, []);

  const downloadPDF = useCallback((blob: Blob, listingId: string): void => {
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `garage-invoice-${listingId}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }, []);

  const generatePDF = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const listingId = extractListingId(url);
        const listingData = await fetchListingData(listingId);
        const pdfBlob = await generatePDFFromData(listingData);
        downloadPDF(pdfBlob, listingId);
      } catch (err) {
        setError(err instanceof Error ? err.message : ERROR_MESSAGES.UNEXPECTED_ERROR);
      }
    });
  }, [url, extractListingId, fetchListingData, generatePDFFromData, downloadPDF]);

  const previewPDF = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const listingId = extractListingId(url);
        const listingData = await fetchListingData(listingId);
        const pdfBlob = await generatePDFFromData(listingData);

        // Create object URL for preview
        const previewUrl = window.URL.createObjectURL(pdfBlob);
        setPdfUrl(previewUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : ERROR_MESSAGES.UNEXPECTED_ERROR);
      }
    });
  }, [url, extractListingId, fetchListingData, generatePDFFromData]);

  const closePreview = useCallback(() => {
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [pdfUrl]);

  return {
    url,
    setUrl,
    error,
    isPending,
    generatePDF,
    previewPDF,
    pdfUrl,
    closePreview,
  };
}

