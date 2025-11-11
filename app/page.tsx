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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Garage style */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-12">
              <img src="/garage-logo.svg" alt="Garage" className="h-5 w-auto" />
              <nav className="hidden md:flex items-center gap-8">
                <a href="#" className="text-sm font-medium text-gray-900 hover:text-gray-600">Auctions</a>
                <a href="#" className="text-sm font-medium text-gray-900 hover:text-gray-600">Appraisal</a>
                <a href="#" className="text-sm font-medium text-gray-900 hover:text-gray-600">Sell</a>
                <a href="#" className="text-sm font-medium text-gray-900 hover:text-gray-600">Log in</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden lg:inline text-sm text-gray-600 mr-4">Invoice Generator</span>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Browse listings"
                  className="w-64 pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF6B2C] focus:border-transparent"
                  readOnly
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
              Generate Invoices
            </h1>
            <p className="text-lg text-gray-600">
              Create professional PDF invoices for fire truck listings
            </p>
          </div>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="pt-6 space-y-6">
              <form onSubmit={generatePDF} className="space-y-6">
                <div className="space-y-2">
                  <label 
                    htmlFor="url" 
                    className="text-sm font-medium text-black"
                  >
                    Listing URL
                  </label>
                  <Input
                    id="url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.shopgarage.com/listing/..."
                    required
                    disabled={isPending}
                    className="h-12 border-gray-300 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]"
                    aria-describedby="url-description"
                    aria-invalid={!!error}
                  />
                  <p id="url-description" className="text-sm text-gray-500">
                    Paste a Garage fire truck listing URL
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isPending || !url.trim()}
                  className="w-full h-12 bg-[#FF6B2C] hover:bg-[#E55A1F] text-white font-medium rounded-lg transition-colors"
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Invoice...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Generate PDF Invoice
                    </>
                  )}
                </Button>
              </form>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-black mb-3">
                  How it works
                </h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span className="font-medium text-black">1.</span>
                    <span>Paste a Garage fire truck listing URL above</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-black">2.</span>
                    <span>We'll fetch the truck details from the listing</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-black">3.</span>
                    <span>A professional PDF invoice will be generated instantly</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-black">4.</span>
                    <span>Download and share with your fire department</span>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
