import { useState } from "react";
import ApartmentCard from "../../ApartmentCard";
import type { ApartmentCardProps } from "../../../types/apartment";

const MOCK_APARTMENTS: Omit<ApartmentCardProps, "isLiked" | "onLike">[] = [
  {
    id: "1",
    title: "Затишна квартира в центрі",
    location: "вул. Вірменська",
    district: "Центр",
    cost: 18500,
    rooms: 2,
    square: 54,
    floor: 3,
    floorInHouse: 5,
    photos: [{ url: "https://picsum.photos/390/256" }],
    ownerType: "Owner",
  },
  {
    id: "2",
    title: "Лофт з панорамними вікнами",
    location: "просп. Чорновола",
    district: "Шевченківський",
    cost: 22000,
    rooms: 1,
    square: 42,
    floor: 12,
    floorInHouse: 16,
    photos: [{ url: "https://picsum.photos/390/256" }],
    ownerType: "Rieltor",
  },
  {
    id: "3",
    title: "Простора квартира біля парку",
    location: "вул. Городоцька",
    district: "Залізничний",
    cost: 15000,
    rooms: 3,
    square: 78,
    floor: 2,
    floorInHouse: 9,
    photos: [{ url: "https://picsum.photos/390/256" }],
    ownerType: "Owner",
  },
  {
    id: "4",
    title: "Сучасна студія на Сихові",
    location: "вул. Хуторівка",
    district: "Сихівський",
    cost: 12000,
    rooms: 1,
    square: 32,
    floor: 5,
    floorInHouse: 10,
    photos: [{ url: "https://picsum.photos/390/256" }],
    ownerType: "Rieltor",
  },
];

function getLikedFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem("likedApartments");
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveLikedToStorage(ids: Set<string>) {
  localStorage.setItem("likedApartments", JSON.stringify([...ids]));
}

export function ApartmentsSection() {
  const [likedIds, setLikedIds] = useState<Set<string>>(getLikedFromStorage);

  function handleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveLikedToStorage(next);
      return next;
    });
  }

  const visibleApartments = MOCK_APARTMENTS.slice(0, 3);
  const visibleApartmentsWide = MOCK_APARTMENTS.slice(0, 4);

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
          <a
            href="/apartments"
            className="text-primary hover:text-primary-hover text-sm font-medium transition-colors sm:self-start"
          >
            Всі оголошення →
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6 2xl:hidden">
          {visibleApartments.map((apt) => (
            <ApartmentCard
              key={apt.id}
              {...apt}
              isLiked={likedIds.has(apt.id)}
              onLike={handleLike}
            />
          ))}
        </div>

        <div className="hidden 2xl:flex flex-wrap justify-center gap-6">
          {visibleApartmentsWide.map((apt) => (
            <ApartmentCard
              key={apt.id}
              {...apt}
              isLiked={likedIds.has(apt.id)}
              onLike={handleLike}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
