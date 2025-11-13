"use client";

import { usePDFGenerator } from "@/hooks/use-pdf-generator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Navbar } from "@/components/Navbar";
import { InvoiceForm } from "@/components/InvoiceForm";
import { HowItWorks } from "@/components/HowItWorks";

export default function Home() {
  const {
    url,
    setUrl,
    error,
    isPending,
    generatePDF,
    previewPDF,
    pdfUrl,
    closePreview,
  } = usePDFGenerator();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-6">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-semibold text-black mb-4">
              Generate Invoices
            </h1>
            <p className="text-lg text-gray-600">
              Create professional PDF invoices for fire truck listings
            </p>
          </div>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="space-y-6">
              <InvoiceForm
                url={url}
                setUrl={setUrl}
                error={error}
                isPending={isPending}
                onSubmit={generatePDF}
                onPreview={previewPDF}
              />
              <HowItWorks />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* PDF Preview Modal */}
      <Dialog open={!!pdfUrl} onOpenChange={() => closePreview()}>
        <DialogContent className="sm:max-w-5xl w-[95vw] h-[85vh] p-0 gap-0 flex flex-col" showCloseButton={true}>
          <DialogHeader className="px-6 py-4 border-b border-gray-200 shrink-0">
            <DialogTitle className="text-xl font-semibold">
              Invoice Preview
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden min-h-0">
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
