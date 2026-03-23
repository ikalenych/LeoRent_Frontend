import React, { useRef, useState, useEffect } from "react";
import DistrictCard from "./DistrictCard";

const placeholder = "https://placehold.co/600x400?text=Lviv";

const districts = [
  { id: 1, name: "Галицький", count: 720, imageUrl: placeholder },
  { id: 2, name: "Франківський", count: 550, imageUrl: placeholder },
  { id: 3, name: "Сихівський", count: 420, imageUrl: placeholder },
  { id: 4, name: "Личаківський", count: 310, imageUrl: placeholder },
  { id: 5, name: "Шевченківський", count: 600, imageUrl: placeholder },
  { id: 6, name: "Залізничний", count: 470, imageUrl: placeholder },
];

export const PopularDistricts: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;

    el?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-10 w-full bg-page-2">
      <div className="px-4 sm:px-6 lg:px-10 flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Популярні райони</h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition
              ${
                canScrollLeft
                  ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
          >
            ←
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition
              ${
                canScrollRight
                  ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="
          flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-10 pb-2
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {districts.map((district) => (
          <DistrictCard
            key={district.id}
            name={district.name}
            count={district.count}
            imageUrl={district.imageUrl}
          />
        ))}

        <div className="shrink-0 w-1" />
      </div>
    </section>
  );
};
