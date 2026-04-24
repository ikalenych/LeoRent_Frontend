import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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

type StoredUser = {
  first_name?: string;
  last_name?: string;
  email?: string;
  name?: string;
  fullName?: string;
};

const CREATE_LISTING_DRAFT_KEY = "create-listing-draft";

const initialStepOneData: ListingStepOneData = {
  address: "",
  district: "",
  title: "",
  description: "",
  rentType: "Подобова оренда",
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

function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const rawUser = window.localStorage.getItem("user");
    if (!rawUser) return null;
    return JSON.parse(rawUser) as StoredUser;
  } catch {
    return null;
  }
}

function getUserDisplayName(user: StoredUser | null) {
  if (!user) return "";
  if (user.fullName?.trim()) return user.fullName.trim();
  if (user.name?.trim()) return user.name.trim();
  const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  if (fullName) return fullName;
  if (user.first_name?.trim()) return user.first_name.trim();
  if (user.email?.trim()) return user.email.split("@")[0];
  return "";
}

export default function CreateListing() {
  const { user, getFreshToken } = useAuth();
  const isRealtor = user?.user_type === "AGENT";
  const navigate = useNavigate();
  const initialDraft = useMemo(() => getInitialDraft(), []);

  const [currentStep, setCurrentStep] = useState<ListingStep>(() => {
    const draftStep = initialDraft?.currentStep ?? 1;
    if (isRealtor && draftStep === 3) {
      return 2;
    }
    return draftStep as ListingStep;
  });
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

  const storedUser = useMemo(() => getStoredUser(), []);
  const ownerDisplayName = getUserDisplayName(storedUser);

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
      if (prev === 1) return 2;
      if (prev === 2) return isRealtor ? 2 : 3;
      return 3;
    });
  }

  function goToPreviousStep() {
    setCurrentStep((prev) => {
      if (prev === 1) return 1;
      return prev === 2 ? 1 : 2;
    });
  }

  function handleStepOneChange(data: Partial<ListingStepOneData>) {
    setStepOneData((prev) => ({ ...prev, ...data }));
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

    const listingAddress = stepOneData.address.trim();
    const ownerName = ownerDisplayName.trim();

    if (!listingAddress) {
      setVerification({
        status: "error",
        address: "",
        ownerName,
        addressMatched: false,
        ownerMatched: Boolean(ownerName),
        documentAnalyzed: false,
        errorMessage: "Спочатку вкажіть адресу об'єкта на першому кроці.",
      });
      return;
    }

    if (!ownerName) {
      setVerification({
        status: "error",
        address: listingAddress,
        ownerName: "",
        addressMatched: true,
        ownerMatched: false,
        documentAnalyzed: false,
        errorMessage: "Не вдалося отримати ім'я користувача з профілю.",
      });
      return;
    }

    setVerification({
      status: "success",
      address: listingAddress,
      ownerName,
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
    const freshToken = await getFreshToken();

    if (!freshToken) {
      alert("Будь ласка, увійдіть в акаунт, щоб опублікувати оголошення.");
      return;
    }
    if (!stepOneData.title.trim()) {
      alert("Вкажіть назву оголошення.");
      return;
    }
    if (!stepOneData.price.trim()) {
      alert("Вкажіть вартість.");
      return;
    }

    const priceInteger = parseInt(stepOneData.price.trim(), 10);
    if (
      !/^[0-9]+$/.test(stepOneData.price.trim()) ||
      !Number.isFinite(priceInteger)
    ) {
      alert("Вартість має бути цілим числом без копійок.");
      return;
    }

    if (photos.length === 0) {
      alert("Додайте хоча б одне фото.");
      return;
    }

    const photosWithFiles = photos.filter((photo) => photo.file !== null);
    if (photosWithFiles.length === 0) {
      alert(
        "Файли фото не збереглись. Будь ласка, додайте фото знову перед публікацією.",
      );
      return;
    }

    const rentTypeMapped =
      stepOneData.rentType === "Подобова оренда" ? "DAILY" : "DEFAULT";

    const detailsPayload: Record<string, boolean> = {
      wifi: false,
      elevator: false,
      washing_machine: false,
      parking: false,
      furniture: false,
      animals: false,
      balcony: false,
      conditioner: false,
    };
    for (const amenity of stepOneData.amenities) {
      if (amenity in detailsPayload) {
        detailsPayload[amenity] = true;
      }
    }

    const buildingTypeMap: Record<string, string> = {
      Панельний: "panel",
      Монолітний: "monolith",
      Цегляний: "brick",
      "Дерев'яний": "wood",
    };
    const repairTypeMap: Record<string, string> = {
      Євроремонт: "euro",
      Косметичний: "cosmetic",
      "Без ремонту": "none",
      Дизайнерський: "design",
    };

    const apiPayload = {
      title: stepOneData.title.trim(),
      description: stepOneData.description.trim(),
      location: stepOneData.address.trim(),
      district: stepOneData.district,
      cost: priceInteger,
      rent_type: rentTypeMapped,
      rooms: stepOneData.rooms ? parseInt(stepOneData.rooms) : 0,
      square: stepOneData.area ? Number(stepOneData.area) : 0,
      floor: stepOneData.floor ? Number(stepOneData.floor) : 0,
      floor_in_house: stepOneData.totalFloors
        ? Number(stepOneData.totalFloors)
        : 0,
      type_:
        buildingTypeMap[stepOneData.buildingType] ?? stepOneData.buildingType,
      renovation_type: repairTypeMap[stepOneData.repair] ?? stepOneData.repair,
      details: detailsPayload,
    };

    try {
      setIsSubmitting(true);
      const baseUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${baseUrl}/apartment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${freshToken}`,
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("CreateListing error response:", errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Apartment created:", result);
      const apartmentId = result.id_ ?? result.id;

      const uploadedUrls: string[] = [];

      for (const photo of photosWithFiles) {
        const formData = new FormData();
        formData.append("file", photo.file!);

        const safeFileName = photo.file!.name.replace(/\s+/g, "-");
        const fileKey = `apartments/${apartmentId}/${crypto.randomUUID()}-${safeFileName}`;

        const uploadResponse = await fetch(
          `${baseUrl}/photos/upload-from-file?file_key=${encodeURIComponent(fileKey)}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${freshToken}`,
            },
            body: formData,
          },
        );

        if (!uploadResponse.ok) {
          console.error(`Failed to upload file ${photo.fileName}`);
          continue;
        }

        const uploadResult = await uploadResponse.json();

        if (uploadResult.success && uploadResult.public_url) {
          uploadedUrls.push(uploadResult.public_url);
          console.log(
            `Uploaded ${photo.fileName} → ${uploadResult.public_url}`,
          );
        } else {
          console.error(
            `Upload failed for ${photo.fileName}:`,
            uploadResult.error,
          );
        }
      }

      if (uploadedUrls.length > 0) {
        const picturesPayload = uploadedUrls.map((url) => ({
          source: url,
          metadata: {},
        }));

        const photosResponse = await fetch(
          `${baseUrl}/apartment/${apartmentId}/pictures`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${freshToken}`,
            },
            body: JSON.stringify({ pictures: picturesPayload }),
          },
        );

        if (!photosResponse.ok) {
          const photosError = await photosResponse.text();
          console.error("Failed to attach pictures:", photosError);
        } else {
          console.log("Pictures attached successfully");
        }
      }

      clearDraft();
      navigate(`/listings/${apartmentId}`);
    } catch (error) {
      console.error("Failed to publish listing:", error);
      alert("Не вдалося опублікувати оголошення. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-page min-h-screen pb-10">
      <div className="mx-auto max-w-310 px-4 pt-8 sm:px-6 lg:px-8">
        <CreateListingProgress
          currentStep={currentStep}
          totalSteps={isRealtor ? 2 : 3}
        />

        {currentStep === 1 ? (
          <CreateListingStepOne
            onNext={goToNextStep}
            formData={stepOneData}
            onChange={handleStepOneChange}
          />
        ) : null}

        {currentStep === 2 ? (
          isRealtor ? (
            <CreateListingStepThree
              onBack={goToPreviousStep}
              onPublish={handlePublishListing}
              isSubmitting={isSubmitting}
              photos={photos}
              onPhotosChange={setPhotos}
            />
          ) : (
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
          )
        ) : null}

        {currentStep === 3 && !isRealtor ? (
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
