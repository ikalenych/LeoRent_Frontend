import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";

type CreateListingStepThreeProps = {
  onBack?: () => void;
};

export function CreateListingStepThree({
  onBack,
}: CreateListingStepThreeProps) {
  return (
    <section className="bg-page py-10 font-display">
      <div className="mx-auto max-w-155">
        <div className="text-center">
          <h1 className="mb-3 text-3xl font-bold text-text-title">
            Крок 3 placeholder
          </h1>

          <p className="text-base text-text-description">
            Тут буде завантаження фото та публікація.
          </p>
        </div>

        <div className="mt-8 flex justify-start">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onBack}
            className="font-display"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={18} strokeWidth={2} />
              Назад
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
