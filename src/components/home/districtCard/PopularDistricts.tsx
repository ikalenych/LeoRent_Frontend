import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DistrictCard from "./DistrictCard";

const API_URL = import.meta.env.VITE_API_URL as string;

type DistrictItem = {
  id: number;
  name: string;
  count: number;
  imageUrl: string;
};

const initialDistricts: DistrictItem[] = [
  {
    id: 1,
    name: "Галицький",
    count: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1520697830682-1f8f0f3c2a8a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Франківський",
    count: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Сихівський",
    count: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "Личаківський",
    count: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    name: "Шевченківський",
    count: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    name: "Залізничний",
    count: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80",
  },
];

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const PopularDistricts: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [districts, setDistricts] = useState(initialDistricts);
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

  useEffect(() => {
    const fetchDistrictCounts = async () => {
      try {
        const results = await Promise.all(
          initialDistricts.map(async (district) => {
            const params = new URLSearchParams();
            params.set("district", district.name);
            params.set("current_page", "1");
            params.set("page_size", "1");
            params.set("sort", "newest");

            const res = await fetch(
              `${API_URL}/apartment/?${params.toString()}`,
              {
                headers: authHeaders(),
              },
            );

            const data = await res.json();

            return {
              ...district,
              count: data.total ?? 0,
            };
          }),
        );

        setDistricts(results);
      } catch (error) {
        console.error("Failed to load district counts:", error);
      }
    };

    fetchDistrictCounts();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  const handleDistrictClick = (name: string) => {
    const params = new URLSearchParams();
    params.set("district", name);
    params.set("sort", "newest");
    params.set("page", "1");

    navigate(`/listings?${params.toString()}`);
  };

  return (
    <section className="py-10 w-full bg-page-2">
      <div className="px-4 sm:px-6 lg:px-10 flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Популярні райони</h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
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
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
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
          <div
            key={district.id}
            className="shrink-0 cursor-pointer"
            onClick={() => handleDistrictClick(district.name)}
          >
            <DistrictCard
              name={district.name}
              count={district.count}
              imageUrl={district.imageUrl}
            />
          </div>
        ))}

        <div className="shrink-0 w-1" />
      </div>
    </section>
  );
};
