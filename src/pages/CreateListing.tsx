import { useState } from "react";
import { CreateListingProgress } from "../components/listing/CreateListingProgress";
import { CreateListingStepOne } from "../components/listing/CreateListingStepOne";
import { CreateListingStepTwo } from "../components/listing/CreateListingStepTwo";
import { CreateListingStepThree } from "../components/listing/CreateListingStepThree";

type ListingStep = 1 | 2 | 3;

type VerificationStatus = "idle" | "verifying" | "success" | "error";

type VerificationState = {
  status: VerificationStatus;
  address: string;
  ownerName: string;
  addressMatched: boolean;
  ownerMatched: boolean;
  documentAnalyzed: boolean;
  errorMessage: string;
};

export default function CreateListing() {
  const [currentStep, setCurrentStep] = useState<ListingStep>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [verification, setVerification] = useState<VerificationState>({
    status: "idle",
    address: "",
    ownerName: "",
    addressMatched: false,
    ownerMatched: false,
    documentAnalyzed: false,
    errorMessage: "",
  });

  function goToNextStep() {
    setCurrentStep((prev) => {
      if (prev === 3) return 3;
      return (prev + 1) as ListingStep;
    });
  }

  function goToPreviousStep() {
    setCurrentStep((prev) => {
      if (prev === 1) return 1;
      return (prev - 1) as ListingStep;
    });
  }

  async function handleVerifyDocument(file: File) {
    setSelectedFile(file);

    setVerification({
      status: "verifying",
      address: "",
      ownerName: "",
      addressMatched: false,
      ownerMatched: false,
      documentAnalyzed: false,
      errorMessage: "",
    });

    await new Promise((resolve) => setTimeout(resolve, 2200));

    setVerification({
      status: "success",
      address: "вул. Шевченка 12",
      ownerName: "Іваненко І. В.",
      addressMatched: true,
      ownerMatched: true,
      documentAnalyzed: true,
      errorMessage: "",
    });
  }

  function handleRemoveDocument() {
    setSelectedFile(null);

    setVerification({
      status: "idle",
      address: "",
      ownerName: "",
      addressMatched: false,
      ownerMatched: false,
      documentAnalyzed: false,
      errorMessage: "",
    });
  }

  return (
    <div className="min-h-screen bg-page">
      <CreateListingProgress currentStep={currentStep} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {currentStep === 1 ? (
          <CreateListingStepOne onNext={goToNextStep} />
        ) : null}

        {currentStep === 2 ? (
          <CreateListingStepTwo
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            selectedFile={selectedFile}
            verification={verification}
            onVerifyDocument={handleVerifyDocument}
            onRemoveDocument={handleRemoveDocument}
          />
        ) : null}

        {currentStep === 3 ? (
          <CreateListingStepThree onBack={goToPreviousStep} />
        ) : null}
      </main>
    </div>
  );
}
