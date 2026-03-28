import { Heart, MapPin, BedDouble, LayoutGrid, Layers } from "lucide-react";
import type { ApartmentCardProps } from "../types/apartment";

export default function ApartmentCard({
  id,
  title,
  location,
  district,
  cost,
  rooms,
  square,
  floor,
  floorInHouse,
  photos,
  ownerType,
  isLiked = false,
  onLike,
}: ApartmentCardProps) {
  const isRealtor = ownerType === "Rieltor";
  const formattedCost = cost.toLocaleString("uk-UA");

  return (
    <div className="group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 w-[300px] h-[340px] min-[480px]:w-[390px] min-[480px]:h-[407px] font-display cursor-pointer shrink-0">
      <div className="relative w-full h-[190px] min-[480px]:h-[256px] overflow-hidden">
        <img
          src={photos[0]?.url ?? "/placeholder.jpg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium text-white ${
            isRealtor ? "bg-realtor" : "bg-primary"
          }`}
        >
          {isRealtor ? "Рієлтор" : "Власник"}
        </span>

        <span className="absolute top-3 right-3 bg-white text-text-title font-semibold text-sm px-3 py-1 rounded-full shadow-sm">
          {formattedCost} ₴
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(id);
          }}
          className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full transition-colors duration-150 shadow-sm"
          aria-label="Додати до обраного"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? "fill-rose-500 text-rose-500" : "text-text-description"
            }`}
          />
        </button>
      </div>

      <div className="h-[150px] min-[480px]:h-[149px] px-4 py-3 flex flex-col justify-between">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-text-title group-hover:text-emerald-500 font-semibold text-base leading-snug line-clamp-1 transition-colors duration-200">
            {title}
          </h3>

          <div className="flex items-center gap-1 text-text-description text-sm">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {location}
              {district ? `, ${district}` : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-text-description text-sm border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4" />
            {rooms} к.
          </span>
          <span className="flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4" />
            {square} м²
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            {floor}/{floorInHouse} пов.
          </span>
        </div>
      </div>
    </div>
  );
}
