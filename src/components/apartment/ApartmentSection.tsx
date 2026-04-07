import { MOCK_APARTMENTS } from "../../constants/mockApartments";
import { MOCK_USERS } from "../../constants/mockUsers";
import { ApartmentGallery } from "./ApartmentGallery";
import { ApartmentInfo } from "./ApartmentInfo";
import { ApartmentOwnerCard } from "./ApartmentOwnerCard";
import { ApartmentMap } from "./ApartmentMap";

interface Props {
  id: string;
}

export function ApartmentSection({ id }: Props) {
  const apartment = MOCK_APARTMENTS.find((a) => a.id === id);
  const owner = apartment
    ? (MOCK_USERS.find((u) => u.id === apartment.ownerId) ?? null)
    : null;

  if (!apartment) {
    return (
      <div className="py-20 text-center text-text-description font-display">
        Квартиру не знайдено
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
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

        <div className="lg:w-[280px] shrink-0">
          <ApartmentOwnerCard
            apartmentId={apartment.id}
            cost={apartment.cost}
            isDaily={apartment.rentType === "Daily"}
            owner={owner}
          />
        </div>
      </div>
    </div>
  );
}
