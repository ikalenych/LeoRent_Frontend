import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Lock,
  MapPin,
  ScanSearch,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { Button } from "../ui/Button";

const acceptedDocuments = [
  "Витяг про право власності",
  "Договір купівлі-продажу",
  "Договір дарування",
  "Технічний паспорт",
];

const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

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

type DocumentMeta = {
  name: string;
  size: number;
  type: string;
};

type CreateListingStepTwoProps = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  onVerify: (file: File) => void;
  onRemoveDocument: () => void;
  selectedFile: File | null;
  documentMeta: DocumentMeta | null;
  verification: VerificationState;
};

export function CreateListingStepTwo({
  onNext,
  onBack,
  nextLabel,
  selectedFile,
  documentMeta,
  verification,
  onVerify,
  onRemoveDocument,
}: CreateListingStepTwoProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function validateFile(file: File | null) {
    if (!file) return null;

    const isValidType =
      allowedTypes.includes(file.type) ||
      /\.(pdf|jpg|jpeg|png)$/i.test(file.name);

    if (!isValidType) return null;
    if (file.size > 10 * 1024 * 1024) return null;

    return file;
  }

  function handleFile(file: File | null) {
    const validFile = validateFile(file);
    if (!validFile) return;
    onVerify(validFile);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    handleFile(file);
  }

  function handleRemoveFile() {
    onRemoveDocument();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  }

  function renderIndicator(isSuccess: boolean) {
    if (verification.status === "verifying") {
      return (
        <LoaderCircle
          size={16}
          strokeWidth={2}
          className="animate-spin text-cyan-300"
        />
      );
    }

    if (verification.status === "success" && isSuccess) {
      return (
        <CheckCircle2 size={16} strokeWidth={2.2} className="text-lime-400" />
      );
    }

    return <div className="h-4 w-4 rounded-full bg-white/20" />;
  }

  const currentDocument = selectedFile
    ? {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      }
    : documentMeta;

  return (
    <section className="bg-page pb-10 pt-8 font-display">
      <div className="mx-auto max-w-190">
        <h1 className="mb-8 text-[44px] font-semibold leading-none text-text-title">
          Верифікація власності
        </h1>

        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-[#dfe8fb] bg-[#f5f8ff] px-5 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#5b7fc7]">
            <Lock size={18} strokeWidth={2} />
          </div>

          <p className="text-[15px] text-text-title">
            Система звірить документ з адресою оголошення та вашим ПІБ з акаунту
          </p>
        </div>

        <p className="mb-4 text-[16px] font-medium text-text-title">
          Завантажте документ
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_0.95fr]">
          <div>
            <label className="block cursor-pointer">
              <div
                className={`flex min-h-47.5 flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-8 text-center transition ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-primary/35 bg-[#f3fffb] hover:border-primary/55"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(15,23,41,0.08)]">
                  <UploadCloud
                    size={28}
                    strokeWidth={2}
                    className="text-primary"
                  />
                </div>

                <p className="mb-2 text-[18px] font-medium leading-7 text-text-title">
                  Перетягніть PDF або JPG до 10MB
                </p>

                <p className="max-w-75 text-[14px] leading-6 text-text-description">
                  Витяг з реєстру, договір купівлі-продажу або техпаспорт
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>
            </label>
          </div>

          <div className="rounded-3xl border border-black/10 bg-surface px-5 py-5 shadow-[0_10px_30px_rgba(15,23,41,0.05)]">
            <div className="mb-4 flex items-center gap-2">
              <ScanSearch
                size={16}
                strokeWidth={2}
                className="text-text-description"
              />
              <p className="text-[16px] font-semibold text-text-title">
                Приймаються наступні документи:
              </p>
            </div>

            <div className="space-y-3">
              {acceptedDocuments.map((document) => (
                <div
                  key={document}
                  className="flex items-start gap-3 text-[15px] leading-6 text-text-description"
                >
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="mt-1 shrink-0 text-primary"
                  />
                  <span>{document}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {currentDocument && (
          <div className="relative mt-4 rounded-2xl border border-black/10 bg-surface py-4 pl-4 pr-10">
            <button
              type="button"
              onClick={handleRemoveFile}
              aria-label="Видалити файл"
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-text-description/70 transition hover:bg-black/5 hover:text-text-title"
            >
              <X size={12} strokeWidth={2.2} />
            </button>

            <div className="flex min-w-0 items-start gap-3">
              <FileText
                size={18}
                strokeWidth={2}
                className="mt-0.5 shrink-0 text-text-description"
              />

              <div className="min-w-0 space-y-1">
                <p className="truncate text-[15px] font-medium text-text-title">
                  {currentDocument.name}
                </p>
                <p className="text-[14px] leading-6 text-text-description">
                  {(currentDocument.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-3xl bg-[#10182b] px-6 py-5 text-white shadow-[0_18px_34px_rgba(15,23,41,0.18)]">
          <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-4">
            <div className="flex items-center gap-3 text-[15px] text-white/85">
              <MapPin size={16} strokeWidth={2} className="shrink-0" />
              <span>
                Звіряємо адресу:
                {verification.address ? ` ${verification.address}` : ""}
              </span>
            </div>
            <div className="mt-0.5">
              {renderIndicator(verification.addressMatched)}
            </div>

            <div className="flex items-center gap-3 text-[15px] text-white/85">
              <User size={16} strokeWidth={2} className="shrink-0" />
              <span>
                Звіряємо власника:
                {verification.ownerName ? ` ${verification.ownerName}` : ""}
              </span>
            </div>
            <div className="mt-0.5">
              {renderIndicator(verification.ownerMatched)}
            </div>

            <div className="flex items-center gap-3 text-[15px] text-white/85">
              <FileText size={16} strokeWidth={2} className="shrink-0" />
              <span>
                {verification.status === "verifying"
                  ? "Аналізуємо документ"
                  : "Аналіз документу"}
              </span>
            </div>
            <div className="mt-0.5">
              {renderIndicator(verification.documentAnalyzed)}
            </div>
          </div>

          {verification.status === "verifying" && (
            <p className="mt-4 text-[14px] text-white/60">
              Перевіряємо документ, будь ласка, зачекайте...
            </p>
          )}

          {verification.status === "error" && (
            <p className="mt-4 text-[14px] text-rose-300">
              {verification.errorMessage}
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onBack}
            className="w-full rounded-2xl border border-black/10 bg-surface shadow-none sm:min-w-30 sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowLeft size={18} strokeWidth={2} />
              Назад
            </span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={verification.status !== "success"}
            onClick={onNext}
            className="w-full rounded-2xl font-semibold shadow-[0_10px_24px_rgba(16,185,129,0.22)] sm:min-w-31.5 sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              {nextLabel ?? "Далі"}
              <ArrowRight size={18} strokeWidth={2} />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
