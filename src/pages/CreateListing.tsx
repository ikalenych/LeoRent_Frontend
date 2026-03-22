import { useState } from "react";
import { CreateListingProgress } from "../components/listing/CreateListingProgress";
import { CreateListingStepOne } from "../components/listing/CreateListingStepOne";
import { CreateListingStepTwo } from "../components/listing/CreateListingStepTwo";
import { CreateListingStepThree } from "../components/listing/CreateListingStepThree";

type ListingStep = 1 | 2 | 3;

export default function CreateListing() {
  const [currentStep] = useState<ListingStep>(1);

  return (
    <div className="min-h-screen bg-slate-50">
      <CreateListingProgress currentStep={currentStep} />

      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        {currentStep === 1 ? <CreateListingStepOne /> : null}
        {currentStep === 2 ? <CreateListingStepTwo /> : null}
        {currentStep === 3 ? <CreateListingStepThree /> : null}
      </main>
    </div>
  );
}
