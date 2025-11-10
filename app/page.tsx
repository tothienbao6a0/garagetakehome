"use client";

import { usePDFGenerator } from "@/hooks/use-pdf-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, AlertCircle } from "lucide-react";

export default function Home() {
  const { url, setUrl, error, isPending, generatePDF } = usePDFGenerator();

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
            <form onSubmit={generatePDF} className="space-y-6">
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
                  disabled={isPending}
                  className="h-11"
                  aria-describedby="url-description"
                  aria-invalid={!!error}
                />
                <p id="url-description" className="text-sm text-muted-foreground">
                  Paste a Garage fire truck listing URL
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isPending || !url.trim()}
                className="w-full h-11"
                size="lg"
              >
                {isPending ? (
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
