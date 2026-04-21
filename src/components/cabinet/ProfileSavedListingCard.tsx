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
  onRequestRemove,
}: ProfileSavedListingCardProps) {
  const navigate = useNavigate();

  const isRealtor = ownerType === "Rieltor";
  const formattedCost = cost.toLocaleString("uk-UA");

  return (
    <div
      onClick={() => navigate(`/listings/${id}`)}
      className="group w-full max-w-[340px] cursor-pointer overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(15,23,42,0.10)]"
    >
      <div className="relative h-[210px] w-full overflow-hidden">
        <img
          src={photos[0]?.url ?? "/placeholder.jpg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <span
          className={`absolute left-3 top-3 rounded-xl px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
            isRealtor
              ? "bg-[#DCE8FF] text-[#5B7BEA]"
              : "bg-[#57E3B1] text-[#0E6B4D]"
          }`}
        >
          {isRealtor ? "Рієлтор" : "Власник"}
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
              rentType: "Monthly",
            });
          }}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:bg-white"
          aria-label="Видалити зі збережених"
        >
          <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
        </button>
      </div>

      <div className="flex min-h-[150px] flex-col justify-between px-4 py-4">
        <div>
          <h3 className="text-[18px] font-bold leading-6 text-slate-900">
            {formattedCost} грн
          </h3>

          <div className="mt-2 flex items-center gap-1 text-[15px] text-slate-500">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {location}
              {district ? `, ${district}` : ""}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-4 text-[14px] text-slate-500">
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
            {floor}/{floorInHouse}
          </span>
        </div>
      </div>
    </div>
  );
}
