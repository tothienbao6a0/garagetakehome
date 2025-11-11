import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, AlertCircle } from "lucide-react";

interface InvoiceFormProps {
  url: string;
  setUrl: (url: string) => void;
  error: string;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function InvoiceForm({ url, setUrl, error, isPending, onSubmit }: InvoiceFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
  );
}

