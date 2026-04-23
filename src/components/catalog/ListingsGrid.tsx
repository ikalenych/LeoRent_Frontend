import ApartmentCard from "../ApartmentCard";
import Pagination from "./Pagination";
import type { ApartmentCardProps } from "../../types/apartment";

interface ListingsGridProps {
  apartments: Omit<ApartmentCardProps, "isLiked" | "onLike">[];
  isMultiColumn?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ListingsGrid({
  apartments,
  isMultiColumn = false,
  currentPage,
  totalPages,
  onPageChange,
}: ListingsGridProps) {
  return (
    <div className="flex flex-col gap-6">
      {apartments.length === 0 ? (
        <div className="py-20 text-center text-text-description font-display">
          Оголошень не знайдено. Спробуйте змінити фільтри.
        </div>
      ) : (
        <div
          className={`grid gap-5 ${
            isMultiColumn ? "grid-cols-2 2xl:grid-cols-3" : "grid-cols-1"
          }`}
        >
          {apartments.map((apt) => (
            <div key={apt.id} className="flex justify-center">
              <ApartmentCard {...apt} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          current={currentPage}
          total={totalPages}
          onChange={onPageChange}
        />
      )}
    </div>
  );
}
