import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, AlertCircle, Eye } from "lucide-react";

interface InvoiceFormProps {
  url: string;
  setUrl: (url: string) => void;
  error: string;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onPreview: (e: React.FormEvent) => void;
}

export function InvoiceForm({ url, setUrl, error, isPending, onSubmit, onPreview }: InvoiceFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <label
          htmlFor="url"
          className="block text-sm font-medium text-black"
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
          className="h-11 border-gray-300 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]"
          aria-describedby="url-description"
          aria-invalid={!!error}
        />
        <p id="url-description" className="text-sm text-gray-500 mt-2">
          Paste a Garage listing URL
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onPreview}
          disabled={isPending || !url.trim()}
          variant="outline"
          className="flex-1 h-12 border-gray-300 hover:bg-gray-50 text-gray-900 font-medium rounded-lg transition-colors"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Eye className="mr-2 h-5 w-5" />
              Preview
            </>
          )}
        </Button>

        <Button
          type="submit"
          disabled={isPending || !url.trim()}
          className="flex-1 h-12 bg-[#FF6B2C] hover:bg-[#E55A1F] text-white font-medium rounded-lg transition-colors"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Download PDF
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
