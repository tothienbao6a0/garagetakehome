"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, AlertCircle } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [url]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">
              Garage Invoice Generator
            </CardTitle>
            <CardDescription className="text-base">
              Generate professional PDF invoices for fire truck listings
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label 
                  htmlFor="url" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Listing URL
                </label>
                <Input
                  id="url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://withgarage.com/listing/..."
                  required
                  className="h-11"
                />
                <p className="text-sm text-muted-foreground">
                  Paste a Garage fire truck listing URL
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Invoice...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate PDF Invoice
                  </>
                )}
              </Button>
            </form>

            <div className="pt-6 border-t">
              <h3 className="text-sm font-semibold mb-3">
                How it works:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Paste a Garage fire truck listing URL</li>
                <li>We'll fetch the truck details from the listing</li>
                <li>A professional PDF invoice will be generated</li>
                <li>Download and share with your fire department</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
