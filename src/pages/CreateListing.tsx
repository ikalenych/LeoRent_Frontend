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

type ListingStepOneData = {
  address: string;
  district: string;
  title: string;
  description: string;
  rentType: string;
  rooms: string;
  area: string;
  floor: string;
  totalFloors: string;
  buildingType: string;
  repair: string;
  price: string;
  minTerm: string;
  amenities: string[];
};

type PhotoItem = {
  id: string;
  file: File;
  preview: string;
};

const initialStepOneData: ListingStepOneData = {
  address: "",
  district: "",
  title: "",
  description: "",
  rentType: "Подобово",
  rooms: "",
  area: "",
  floor: "",
  totalFloors: "",
  buildingType: "",
  repair: "",
  price: "",
  minTerm: "",
  amenities: [],
};

export default function CreateListing() {
  const [currentStep, setCurrentStep] = useState<ListingStep>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stepOneData, setStepOneData] =
    useState<ListingStepOneData>(initialStepOneData);

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

  function handleStepOneChange(data: Partial<ListingStepOneData>) {
    setStepOneData((prev) => ({
      ...prev,
      ...data,
    }));
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

  async function handlePublishListing() {
    if (!stepOneData.title.trim()) {
      alert("Вкажіть назву оголошення.");
      return;
    }

    if (!stepOneData.price.trim()) {
      alert("Вкажіть вартість.");
      return;
    }

    if (photos.length === 0) {
      alert("Додайте хоча б одне фото.");
      return;
    }

    const payload = {
      listing: {
        address: stepOneData.address.trim(),
        district: stepOneData.district,
        title: stepOneData.title.trim(),
        description: stepOneData.description.trim(),
        rentType: stepOneData.rentType,
        rooms: stepOneData.rooms,
        area: stepOneData.area ? Number(stepOneData.area) : null,
        floor: stepOneData.floor ? Number(stepOneData.floor) : null,
        totalFloors: stepOneData.totalFloors
          ? Number(stepOneData.totalFloors)
          : null,
        buildingType: stepOneData.buildingType,
        repair: stepOneData.repair,
        price: Number(stepOneData.price),
        minTerm: stepOneData.minTerm,
        amenities: stepOneData.amenities,
      },
      verification: {
        status: verification.status,
        address: verification.address,
        ownerName: verification.ownerName,
        addressMatched: verification.addressMatched,
        ownerMatched: verification.ownerMatched,
        documentAnalyzed: verification.documentAnalyzed,
        hasDocument: Boolean(selectedFile),
        document: selectedFile
          ? {
              name: selectedFile.name,
              size: selectedFile.size,
              type: selectedFile.type,
            }
          : null,
      },
      photos: photos.map((photo, index) => ({
        id: photo.id,
        name: photo.file.name,
        size: photo.file.size,
        type: photo.file.type,
        isPrimary: index === 0,
      })),
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);

      console.log("CREATE_LISTING_PAYLOAD", payload);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Оголошення успішно підготовлено до публікації.");
    } catch (error) {
      console.error("Failed to publish listing:", error);
      alert("Не вдалося підготувати оголошення до публікації.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-page">
      <CreateListingProgress currentStep={currentStep} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {currentStep === 1 ? (
          <CreateListingStepOne
            onNext={goToNextStep}
            formData={stepOneData}
            onChange={handleStepOneChange}
          />
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
          <CreateListingStepThree
            onBack={goToPreviousStep}
            onPublish={handlePublishListing}
            isSubmitting={isSubmitting}
            photos={photos}
            onPhotosChange={setPhotos}
          />
        ) : null}
      </main>
    </div>
  );
}
