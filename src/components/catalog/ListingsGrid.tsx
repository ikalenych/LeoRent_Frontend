import { useState } from "react";
import ApartmentCard from "../ApartmentCard";
import Pagination from "./Pagination";
import type { ApartmentCardProps } from "../../types/apartment";

interface ListingsGridProps {
  apartments: Omit<ApartmentCardProps, "isLiked" | "onLike">[];
  perPage?: number;
}

export default function ListingsGrid({
  apartments,
  perPage = 6,
}: ListingsGridProps) {
  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const totalPages = Math.ceil(apartments.length / perPage);
  const paginated = apartments.slice((page - 1) * perPage, page * perPage);

  const handleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {paginated.length === 0 ? (
        <div className="py-20 text-center text-text-description font-display">
          Оголошень не знайдено. Спробуйте змінити фільтри.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
          {paginated.map((apt) => (
            <div key={apt.id} className="flex justify-center">
              <ApartmentCard
                {...apt}
                isLiked={liked.has(apt.id)}
                onLike={handleLike}
              />
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
