import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ApartmentPhoto } from "../../types/apartment";

interface Props {
  photos: ApartmentPhoto[];
  title: string;
}

export function ApartmentGallery({ photos, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const next = () =>
    setActiveIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  const lbPrev = () =>
    setLightbox((i) => (i == null ? 0 : i === 0 ? photos.length - 1 : i - 1));
  const lbNext = () =>
    setLightbox((i) => (i == null ? 0 : i === photos.length - 1 ? 0 : i + 1));

  if (photos.length === 0) return null;

  const rightPhotos = photos.slice(1, 5);

  return (
    <>
      {/* ===== DESKTOP lg+ ===== */}
      <div className="hidden lg:flex gap-2 rounded-2xl overflow-hidden h-[480px]">
        {/* Велика фото ЗЛІВА */}
        <div
          className="flex-[2] cursor-pointer overflow-hidden"
          onClick={() => setLightbox(0)}
        >
          <img
            src={photos[0].url}
            alt={`${title} — фото 1`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Менші фото СПРАВА */}
        {rightPhotos.length > 0 && (
          <div
            className={`flex-1 gap-2 ${
              rightPhotos.length === 4
                ? "grid grid-cols-2 grid-rows-2"
                : "flex flex-col"
            }`}
          >
            {rightPhotos.map((photo, i) => (
              <div
                key={i}
                className="relative flex-1 cursor-pointer overflow-hidden"
                onClick={() => setLightbox(i + 1)}
              >
                <img
                  src={photo.url}
                  alt={`${title} — фото ${i + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {i === rightPhotos.length - 1 && photos.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                    +{photos.length - 5} фото
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== MOBILE/TABLET < lg ===== */}
      <div className="lg:hidden relative w-full rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={photos[activeIndex].url}
          alt={`${title} — фото ${activeIndex + 1}`}
          className="w-full h-[260px] sm:h-[380px] object-cover cursor-pointer"
          onClick={() => setLightbox(activeIndex)}
        />

        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
              aria-label="Попереднє фото"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
              aria-label="Наступне фото"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              {activeIndex + 1} / {photos.length}
            </span>
          </>
        )}
      </div>

      {/* Dots мобілка */}
      {photos.length > 1 && (
        <div className="flex lg:hidden justify-center gap-1.5 mt-2">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-150 ${
                i === activeIndex ? "bg-primary w-4 h-2" : "bg-gray-300 w-2 h-2"
              }`}
              aria-label={`Фото ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ===== LIGHTBOX ===== */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightbox + 1} / {photos.length}
          </span>

          <img
            src={photos[lightbox].url}
            alt={`${title} — фото ${lightbox + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lbPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lbNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
