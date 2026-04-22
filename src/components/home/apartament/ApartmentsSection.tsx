import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApartmentCard from "../../ApartmentCard";
import { fetchApartments } from "../../../api/apartments";
import { mapPreviewToCard } from "../../../mappers/apartment.mapper";
import type { ApartmentCardProps } from "../../../types/apartment";

type Apt = Omit<ApartmentCardProps, "isLiked" | "onLike">;

export function ApartmentsSection() {
  const [apartments, setApartments] = useState<Apt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApartments()
      .then((data) => {
        const mapped = data.apartments.map(mapPreviewToCard); // ← .apartments
        setApartments(mapped.slice(0, 4)); // ← перші 4, не останні
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-page py-10 px-6">
      <div className="px-10 sm:px-6 lg:px-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-text-title font-display font-semibold text-2xl">
              Нові пропозиції
            </h2>
            <p className="text-text-description text-sm mt-1">
              Найкращі квартири, що з'явилися сьогодні
            </p>
          </div>
          <Link
            to="/listings"
            className="text-primary hover:text-primary-hover text-sm font-medium transition-colors sm:self-start"
          >
            Всі оголошення →
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-72 h-80 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6">
            {apartments.map((apt) => (
              <ApartmentCard key={apt.id} {...apt} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
