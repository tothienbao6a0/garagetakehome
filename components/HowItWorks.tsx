const STEPS = [
  "Paste a Garage listing URL above",
  "We'll fetch the item details from the listing",
  "A professional PDF invoice will be generated instantly",
  "Download and share for your purchase process",
] as const;

export function HowItWorks() {
  return (
    <div className="pt-6 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-black mb-3">
        How it works
      </h3>
      <ol className="space-y-2 text-sm text-gray-600">
        {STEPS.map((step, index) => (
          <li key={index} className="flex gap-3">
            <span className="font-medium text-black">{index + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

