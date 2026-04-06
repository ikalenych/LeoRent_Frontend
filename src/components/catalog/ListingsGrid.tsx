import { useState } from "react";
import { Link } from "react-router-dom";
import ApartmentCard from "../ApartmentCard";
import Pagination from "./Pagination";
import type { ApartmentCardProps } from "../../types/apartment";

interface ListingsGridProps {
  apartments: Omit<ApartmentCardProps, "isLiked" | "onLike">[];
  perPage?: number;
  isMultiColumn?: boolean;
}

export default function ListingsGrid({
  apartments,
  perPage = 6,
  isMultiColumn = false,
}: ListingsGridProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(apartments.length / perPage);
  const paginated = apartments.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col gap-6">
      {paginated.length === 0 ? (
        <div className="py-20 text-center text-text-description font-display">
          Оголошень не знайдено. Спробуйте змінити фільтри.
        </div>
      ) : (
        <div
          className={`grid gap-5 ${
            isMultiColumn ? "grid-cols-2 2xl:grid-cols-3" : "grid-cols-1"
          }`}
        >
          {paginated.map((apt) => (
            <div key={apt.id} className="flex justify-center">
              <ApartmentCard {...apt} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination current={page} total={totalPages} onChange={setPage} />
      )}
    </div>
  );
}
