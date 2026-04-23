import { Heart, MapPin, BedDouble, LayoutGrid, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLiked } from "../context/LikedContext";
import type { ApartmentCardProps } from "../types/apartment";

type ApartmentCardViewProps = ApartmentCardProps & {
  isLiked?: boolean;
  onLike?: (id: string) => void;
};

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
  rentType,
  isLiked,
  onLike,
}: ApartmentCardViewProps) {
  const navigate = useNavigate();
  const { liked, toggleLike } = useLiked();

  const isRealtor = ownerType === "Rieltor";
  const isDaily = rentType === "Daily";
  const formattedCost = cost.toLocaleString("uk-UA");

  const likedState = typeof isLiked === "boolean" ? isLiked : liked.has(id);

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (onLike) {
      onLike(id);
      return;
    }

    void toggleLike(id);
  };

  return (
    <div
      onClick={() => navigate(`/listings/${id}`)}
      className="group bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 w-[300px] h-[360px] min-[480px]:w-[390px] min-[480px]:h-[420px] font-display cursor-pointer shrink-0"
    >
      <div className="relative w-full h-[190px] min-[480px]:h-[256px] overflow-hidden">
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
          onClick={handleLikeClick}
          className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full transition-colors duration-150 shadow-sm cursor-pointer"
          aria-label="Додати до обраного"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              likedState
                ? "fill-rose-500 text-rose-500"
                : "text-text-description"
            }`}
          />
        </button>
      </div>

      <div className="px-4 py-3 flex flex-col justify-between h-[170px] min-[480px]:h-[164px]">
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
