import { Heart, MapPin, BedDouble, LayoutGrid, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ProfileListingCardData {
  id: string;
  title: string;
  location: string;
  district?: string;
  cost: number;
  rooms: number;
  square: number;
  floor: number;
  floorInHouse: number;
  photos: { url: string }[];
  ownerType: "Owner" | "Rieltor";
  rentType: "Monthly" | "Daily";
}

interface ProfileSavedListingCardProps extends ProfileListingCardData {
  onRequestRemove: (listing: ProfileListingCardData) => void;
}

export default function ProfileSavedListingCard({
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
  rentType,
  onRequestRemove,
}: ProfileSavedListingCardProps) {
  const navigate = useNavigate();

  const isRealtor = ownerType === "Rieltor";
  const isDaily = rentType === "Daily";
  const formattedCost = cost.toLocaleString("uk-UA");

  return (
    <div
      onClick={() => navigate(`/listings/${id}`)}
      className="group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 w-75 h-90 min-[480px]:w-97.5 min-[480px]:h-105 font-display cursor-pointer shrink-0"
    >
      <div className="relative w-full h-47.5 min-[480px]:h-64 overflow-hidden">
        <img
          src={photos[0]?.url ?? "/placeholder.jpg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
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
            e.preventDefault();
            e.stopPropagation();
            onRequestRemove({
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
              rentType,
            });
          }}
          className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full transition-colors duration-150 shadow-sm cursor-pointer"
          aria-label="Видалити зі збережених"
        >
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
        </button>
      </div>

      <div className="px-4 py-3 flex flex-col justify-between h-42.5 min-[480px]:h-41">
        <div className="flex flex-col gap-1">
          <span
            className={`self-start text-xs font-medium px-2.5 py-0.5 rounded-full leading-5 ${
              isDaily
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isDaily ? "Подобово" : "Тривала оренда"}
          </span>

          <h3 className="text-text-title group-hover:text-primary font-semibold text-base leading-snug line-clamp-1 transition-colors duration-200">
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
