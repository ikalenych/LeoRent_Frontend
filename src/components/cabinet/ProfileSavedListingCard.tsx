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
      className="group mx-auto h-90 w-full max-w-75 shrink-0 overflow-hidden rounded-2xl bg-surface font-display shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer min-[480px]:h-105 min-[480px]:max-w-97.5"
    >
      <div className="relative h-47.5 w-full overflow-hidden min-[480px]:h-64">
        <img
          src={photos[0]?.url ?? "/placeholder.jpg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <span
          className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${
            isRealtor ? "bg-realtor" : "bg-primary"
          }`}
        >
          {isRealtor ? "Рієлтор" : "Власник"}
        </span>

        <span className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-text-title shadow-sm">
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
          className="absolute right-3 bottom-3 cursor-pointer rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-sm transition-colors duration-150 hover:bg-white"
          aria-label="Видалити зі збережених"
        >
          <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
        </button>
      </div>

      <div className="flex h-42.5 flex-col justify-between px-4 py-3 min-[480px]:h-41">
        <div className="flex flex-col gap-1">
          <span
            className={`self-start rounded-full px-2.5 py-0.5 text-xs leading-5 font-medium ${
              isDaily
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isDaily ? "Подобово" : "Тривала оренда"}
          </span>

          <h3 className="line-clamp-1 text-base leading-snug font-semibold text-text-title transition-colors duration-200 group-hover:text-primary">
            {title}
          </h3>

          <div className="flex items-center gap-1 text-sm text-text-description">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {location}
              {district ? `, ${district}` : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-gray-100 pt-3 text-sm text-text-description">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" />
            {rooms} к.
          </span>

          <span className="flex items-center gap-1.5">
            <LayoutGrid className="h-4 w-4" />
            {square} м²
          </span>

          <span className="flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            {floor}/{floorInHouse} пов.
          </span>
        </div>
      </div>
    </div>
  );
}
