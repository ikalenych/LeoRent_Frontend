import { useEffect, useMemo, useState } from "react";
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

export type PhotoItem = {
  id: string;
  file: File | null;
  fileName: string;
  fileType: string;
  fileSize: number;
  preview: string;
};

type PersistedDocumentMeta = {
  name: string;
  size: number;
  type: string;
};

type CreateListingDraft = {
  currentStep: ListingStep;
  stepOneData: ListingStepOneData;
  verification: VerificationState;
  selectedDocumentMeta: PersistedDocumentMeta | null;
  photos: PhotoItem[];
};

const CREATE_LISTING_DRAFT_KEY = "create-listing-draft";

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

const initialVerification: VerificationState = {
  status: "idle",
  address: "",
  ownerName: "",
  addressMatched: false,
  ownerMatched: false,
  documentAnalyzed: false,
  errorMessage: "",
};

function getInitialDraft(): CreateListingDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const rawDraft = window.localStorage.getItem(CREATE_LISTING_DRAFT_KEY);
    if (!rawDraft) return null;

    return JSON.parse(rawDraft) as CreateListingDraft;
  } catch {
    return null;
  }
}

export default function CreateListing() {
  const initialDraft = useMemo(() => getInitialDraft(), []);

  const [currentStep, setCurrentStep] = useState<ListingStep>(
    initialDraft?.currentStep ?? 1,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocumentMeta, setSelectedDocumentMeta] =
    useState<PersistedDocumentMeta | null>(
      initialDraft?.selectedDocumentMeta ?? null,
    );
  const [photos, setPhotos] = useState<PhotoItem[]>(initialDraft?.photos ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stepOneData, setStepOneData] = useState<ListingStepOneData>(
    initialDraft?.stepOneData ?? initialStepOneData,
  );

  const [verification, setVerification] = useState<VerificationState>(
    initialDraft?.verification ?? initialVerification,
  );

  useEffect(() => {
    try {
      const draft: CreateListingDraft = {
        currentStep,
        stepOneData,
        verification,
        selectedDocumentMeta: selectedFile
          ? {
              name: selectedFile.name,
              size: selectedFile.size,
              type: selectedFile.type,
            }
          : selectedDocumentMeta,
        photos: photos.map((photo) => ({
          id: photo.id,
          file: null,
          fileName: photo.fileName,
          fileType: photo.fileType,
          fileSize: photo.fileSize,
          preview: photo.preview,
        })),
      };

      window.localStorage.setItem(
        CREATE_LISTING_DRAFT_KEY,
        JSON.stringify(draft),
      );
    } catch (error) {
      console.error("Failed to save create listing draft:", error);
    }
  }, [
    currentStep,
    stepOneData,
    verification,
    selectedFile,
    selectedDocumentMeta,
    photos,
  ]);

  function clearDraft() {
    window.localStorage.removeItem(CREATE_LISTING_DRAFT_KEY);
  }

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
    setSelectedDocumentMeta({
      name: file.name,
      size: file.size,
      type: file.type,
    });

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
    setSelectedDocumentMeta(null);
    setVerification(initialVerification);
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
        hasDocument: Boolean(selectedFile || selectedDocumentMeta),
        document: selectedFile
          ? {
              name: selectedFile.name,
              size: selectedFile.size,
              type: selectedFile.type,
            }
          : selectedDocumentMeta,
      },
      photos: photos.map((photo, index) => ({
        id: photo.id,
        name: photo.fileName,
        size: photo.fileSize,
        type: photo.fileType,
        isPrimary: index === 0,
      })),
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);

      console.log("CREATE_LISTING_PAYLOAD", payload);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      clearDraft();
      alert("Оголошення успішно підготовлено до публікації.");
    } catch (error) {
      console.error("Failed to publish listing:", error);
      alert("Не вдалося підготувати оголошення до публікації.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-page min-h-screen pb-10">
      <div className="mx-auto max-w-310 px-4 pt-8 sm:px-6 lg:px-8">
        <CreateListingProgress currentStep={currentStep} />

        {currentStep === 1 ? (
          <CreateListingStepOne
            onNext={goToNextStep}
            formData={stepOneData}
            onChange={handleStepOneChange}
          />
        ) : null}

        {currentStep === 2 ? (
          <CreateListingStepTwo
            onBack={goToPreviousStep}
            onNext={goToNextStep}
            onVerify={handleVerifyDocument}
            onRemoveDocument={handleRemoveDocument}
            selectedFile={selectedFile}
            documentMeta={
              selectedFile
                ? {
                    name: selectedFile.name,
                    size: selectedFile.size,
                    type: selectedFile.type,
                  }
                : selectedDocumentMeta
            }
            verification={verification}
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
      </div>
    </section>
  );
}
