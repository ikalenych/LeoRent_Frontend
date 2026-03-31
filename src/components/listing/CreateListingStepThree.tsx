import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Info,
  Star,
  X,
} from "lucide-react";
import { Button } from "../ui/Button";

export type PhotoItem = {
  id: string;
  file: File;
  preview: string;
};

type CreateListingStepThreeProps = {
  onBack?: () => void;
  onPublish?: () => void;
  isSubmitting?: boolean;
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_PHOTOS = 5;

export function CreateListingStepThree({
  onBack,
  onPublish,
  isSubmitting = false,
  photos,
  onPhotosChange,
}: CreateListingStepThreeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const isMouseDownRef = useRef(false);
  const isMouseDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  useEffect(() => {
    function handleWindowMouseUp() {
      isMouseDownRef.current = false;
      isMouseDraggingRef.current = false;
    }

    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, []);

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    };
  }, []);

  function openFileDialog() {
    inputRef.current?.click();
  }

  function scrollSliderBy(offset: number) {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  }

  function validateFiles(files: File[]) {
    const validFiles: File[] = [];

    for (const file of files) {
      const isValidType =
        ACCEPTED_IMAGE_TYPES.includes(file.type) ||
        /\.(jpg|jpeg|png|webp)$/i.test(file.name);

      if (!isValidType) {
        setErrorMessage("Можна завантажувати лише JPG, PNG або WEBP.");
        continue;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage("Один або кілька файлів перевищують 10MB.");
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setErrorMessage("");
    }

    return validFiles;
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    const validFiles = validateFiles(Array.from(fileList));
    const availableSlots = MAX_PHOTOS - photos.length;

    if (availableSlots <= 0) {
      setErrorMessage(`Можна завантажити максимум ${MAX_PHOTOS} фото.`);
      return;
    }

    const mappedFiles = validFiles.slice(0, availableSlots).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    if (validFiles.length > availableSlots) {
      setErrorMessage(`Можна завантажити максимум ${MAX_PHOTOS} фото.`);
    }

    onPhotosChange([...photos, ...mappedFiles]);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    addFiles(event.target.files);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDropZoneDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDropZoneDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDropZoneDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function handleRemovePhoto(id: string) {
    const photoToRemove = photos.find((photo) => photo.id === id);

    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.preview);
    }

    onPhotosChange(photos.filter((photo) => photo.id !== id));
  }

  function handleSliderMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (!sliderRef.current) return;

    isMouseDownRef.current = true;
    isMouseDraggingRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = sliderRef.current.scrollLeft;
  }

  function handleSliderMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!isMouseDownRef.current || !sliderRef.current) return;

    const deltaX = event.clientX - dragStartXRef.current;

    if (Math.abs(deltaX) < 4) return;

    isMouseDraggingRef.current = true;
    event.preventDefault();
    sliderRef.current.scrollLeft = dragStartScrollLeftRef.current - deltaX;
  }

  function handleSliderMouseUp() {
    isMouseDownRef.current = false;

    requestAnimationFrame(() => {
      isMouseDraggingRef.current = false;
    });
  }

  function handleSliderMouseLeave() {
    isMouseDownRef.current = false;
    isMouseDraggingRef.current = false;
  }

  function handleCardClickCapture(event: React.MouseEvent) {
    if (isMouseDraggingRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  return (
    <section className="bg-page pb-10 pt-8 font-display">
      <div className="mx-auto max-w-190">
        <div className="mb-10">
          <h1 className="text-[44px] font-semibold leading-none text-text-title">
            Фото і публікація
          </h1>

          <p className="mt-4 text-[18px] leading-7 text-text-description">
            Завантажте якісні фотографії вашого помешкання, щоб привернути
            більше уваги орендарів.
          </p>
        </div>

        <div
          className={`rounded-[30px] border-2 border-dashed px-6 py-14 text-center transition ${
            isDragging
              ? "border-primary bg-primary/6"
              : "border-black/10 bg-white"
          }`}
          onClick={openFileDialog}
          onDragOver={handleDropZoneDragOver}
          onDragLeave={handleDropZoneDragLeave}
          onDrop={handleDropZoneDrop}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ecfff7] text-primary">
            <Camera size={28} strokeWidth={2.1} />
          </div>

          <p className="mt-6 text-[18px] font-medium leading-7 text-text-title">
            Перетягніть фото або натисніть для вибору
          </p>

          <p className="mt-2 text-[14px] leading-6 text-text-description">
            Підтримувані формати: JPG, PNG, WEBP. Макс. 10MB на файл.
          </p>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            className="sr-only"
            onChange={handleInputChange}
          />
        </div>

        {errorMessage ? (
          <p className="mt-3 text-[14px] leading-6 text-red-500">
            {errorMessage}
          </p>
        ) : null}

        {(photos.length > 0 || photos.length < MAX_PHOTOS) && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => scrollSliderBy(-220)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-text-title transition hover:border-primary/40 hover:text-primary"
                aria-label="Прокрутити фото вліво"
              >
                <ChevronLeft size={18} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => scrollSliderBy(220)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-text-title transition hover:border-primary/40 hover:text-primary"
                aria-label="Прокрутити фото вправо"
              >
                <ChevronRight size={18} strokeWidth={2.2} />
              </button>
            </div>

            <div
              ref={sliderRef}
              className="no-scrollbar overflow-x-auto pb-2 select-none"
              onMouseDown={handleSliderMouseDown}
              onMouseMove={handleSliderMouseMove}
              onMouseUp={handleSliderMouseUp}
              onMouseLeave={handleSliderMouseLeave}
              style={{
                cursor: isMouseDownRef.current ? "grabbing" : "grab",
              }}
            >
              <div className="flex w-max min-w-full gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    onClickCapture={handleCardClickCapture}
                    className={`shrink-0 rounded-[22px] ${
                      index === 0 ? "bg-primary p-0.5" : ""
                    }`}
                  >
                    <div className="group relative h-48 w-48.5 overflow-hidden rounded-[20px] bg-white shadow-[0_8px_24px_rgba(15,23,41,0.08)]">
                      {index === 0 && (
                        <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[12px] font-semibold text-white shadow">
                          <Star
                            size={12}
                            fill="currentColor"
                            strokeWidth={2}
                            className="shrink-0"
                          />
                          <span>Головне фото</span>
                        </div>
                      )}

                      <button
                        type="button"
                        aria-label="Видалити фото"
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-text-title shadow-[0_6px_16px_rgba(15,23,41,0.16)] transition hover:bg-white"
                      >
                        <X size={16} strokeWidth={2.2} />
                      </button>

                      <img
                        src={photo.preview}
                        alt={photo.file.name}
                        draggable={false}
                        className="pointer-events-none h-full w-full object-cover"
                      />
                    </div>
                  </div>
                ))}

                {photos.length < MAX_PHOTOS && (
                  <button
                    type="button"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={() => inputRef.current?.click()}
                    className="flex h-48 w-48.5 shrink-0 items-center justify-center rounded-[20px] border border-dashed border-black/12 bg-white text-text-description transition hover:border-primary/40 hover:text-primary"
                  >
                    <span className="flex flex-col items-center gap-3">
                      <ImagePlus size={28} strokeWidth={2} />
                      <span className="text-[14px] font-medium">
                        Додати ще фото
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#dbe8ff] bg-[#f3f7ff] px-5 py-4">
          <Info size={18} strokeWidth={2} className="shrink-0 text-[#4c74b9]" />
          <p className="text-[15px] leading-6 text-[#4265a7]">
            Перше фото буде на картці оголошення
          </p>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-black/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
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
            onClick={onPublish}
            disabled={isSubmitting}
            className="w-full rounded-2xl font-semibold shadow-[0_14px_28px_rgba(16,185,129,0.24)] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-80 sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              {isSubmitting ? "Публікація..." : "Опублікувати оголошення"}
              {!isSubmitting ? <ArrowRight size={18} strokeWidth={2} /> : null}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
