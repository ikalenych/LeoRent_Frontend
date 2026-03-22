type ListingStep = 1 | 2 | 3;

interface CreateListingProgressProps {
  currentStep: ListingStep;
}

const stepConfig = {
  1: {
    label: "1. Інформація",
    description: "Крок 1 з 3: Інформація, Верифікація, Публікація",
  },
  2: {
    label: "2. Верифікація",
    description: "Крок 2 з 3: Інформація, Верифікація, Публікація",
  },
  3: {
    label: "3. Публікація",
    description: "Крок 3 з 3: Інформація, Верифікація, Публікація",
  },
} as const;

export function CreateListingProgress({
  currentStep,
}: CreateListingProgressProps) {
  const progressWidth = `${(currentStep / 3) * 100}%`;

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-10">
        <div className="mx-auto max-w-155">
          <div className="mb-2 flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-emerald-500">
              {stepConfig[currentStep].label}
            </span>

            <span className="text-slate-400">
              {stepConfig[currentStep].description}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: progressWidth }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
