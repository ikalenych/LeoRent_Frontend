type ListingStep = 1 | 2 | 3;

interface CreateListingProgressProps {
  currentStep: ListingStep;
}

const stepConfig = {
  1: {
    label: "1. Інформація",
    description: "Крок 1 із 3 — основні дані",
  },
  2: {
    label: "2. Верифікація",
    description: "Крок 2 із 3 — підтвердження",
  },
  3: {
    label: "3. Публікація",
    description: "Крок 3 із 3 — перевірка і публікація",
  },
} as const;

export function CreateListingProgress({
  currentStep,
}: CreateListingProgressProps) {
  const progressWidth = `${(currentStep / 3) * 100}%`;

  return (
    <section className=" font-display">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-155">
          <div className="mb-2 flex items-start gap-4 text-sm">
            <span className="shrink-0 font-medium text-primary">
              {stepConfig[currentStep].label}
            </span>

            <span className="ml-auto max-w-55 text-right text-text-description sm:max-w-none">
              {stepConfig[currentStep].description}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-black/15">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: progressWidth }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
