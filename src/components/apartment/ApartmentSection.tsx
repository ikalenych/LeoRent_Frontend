import { useEffect, useState } from "react";
import { fetchApartmentById } from "../../api/apartments";
import { mapFullToCard, mapOwnerInfo } from "../../mappers/apartment.mapper";
import { ApartmentGallery } from "./ApartmentGallery";
import { ApartmentInfo } from "./ApartmentInfo";
import { ApartmentOwnerCard } from "./ApartmentOwnerCard";
import { ApartmentMap } from "./ApartmentMap";
import type { ApartmentCardProps } from "../../types/apartment";
import type { MockUser } from "../../types/user";

interface Props {
  id: string;
}

export function ApartmentSection({ id }: Props) {
  const [apartment, setApartment] = useState<Omit<
    ApartmentCardProps,
    "isLiked" | "onLike"
  > | null>(null);
  const [owner, setOwner] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchApartmentById(id)
      .then((data) => {
        setApartment(mapFullToCard(data));
        setOwner(mapOwnerInfo(data));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="w-full h-72 rounded-2xl bg-gray-200" />
        <div className="h-6 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || !apartment) {
    return (
      <div className="py-20 text-center text-text-description font-display">
        Квартиру не знайдено
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 pb-10 lg:pb-0">
        <ApartmentGallery photos={apartment.photos} title={apartment.title} />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <ApartmentInfo
              title={apartment.title}
              description={apartment.description}
              location={apartment.location}
              district={apartment.district}
              details={apartment.details}
            />
            <ApartmentMap location={apartment.location} />
          </div>

          {/* Десктоп */}
          <div className="hidden lg:block lg:w-[280px] shrink-0">
            <ApartmentOwnerCard
              apartmentId={apartment.id}
              cost={apartment.cost}
              isDaily={apartment.rentType === "Daily"}
              owner={owner}
            />
          </div>
        </div>
      </div>

      {/* Мобілка — floating panel під стиль хедера */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1100]">
        <ApartmentOwnerCard
          apartmentId={apartment.id}
          cost={apartment.cost}
          isDaily={apartment.rentType === "Daily"}
          owner={owner}
          mobile
        />
      </div>
    </>
  );
}
