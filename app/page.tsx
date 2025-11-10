"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Extract UUID from URL
      const match = url.match(/\/listing\/([a-f0-9-]+)/i);
      if (!match) {
        throw new Error("Invalid listing URL format. Expected: .../listing/{uuid}");
      }

      const listingId = match[1];

      // Fetch listing data
      const response = await fetch(`/api/listing?id=${listingId}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch listing data");
      }

      const listingData = await response.json();

      // Generate PDF
      const pdfResponse = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });

      if (!pdfResponse.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Download PDF
      const blob = await pdfResponse.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `garage-invoice-${listingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Garage Invoice Generator
            </h1>
            <p className="text-slate-600">
              Generate professional PDF invoices for fire truck listings
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="url" 
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Listing URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://withgarage.com/listing/..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                required
              />
              <p className="mt-2 text-sm text-slate-500">
                Paste a Garage fire truck listing URL
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating Invoice...
                </>
              ) : (
                "Generate PDF Invoice"
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              How it works:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
              <li>Paste a Garage fire truck listing URL</li>
              <li>We'll fetch the truck details from the listing</li>
              <li>A professional PDF invoice will be generated</li>
              <li>Download and share with your fire department</li>
            </ol>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Built for Garage • Take-home Assignment
        </p>
      </div>
    </div>
  );
}

