import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ListingsHeader from "./ListingsHeader";
import ListingsGrid from "./ListingsGrid";
import {
  DesktopFilters,
  MobileFilters,
  DEFAULT_FILTERS,
  type FilterState,
} from "./ListingsFilters";
import { mapPreviewToCard } from "../../mappers/apartment.mapper";
import type { SortOption } from "../../utils/apartments";
import type { ApartmentCardProps } from "../../types/apartment";

const API_URL = import.meta.env.VITE_API_URL as string;
const PAGE_SIZE = 6;

type Apt = Omit<ApartmentCardProps, "isLiked" | "onLike">;

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function filtersFromParams(params: URLSearchParams): FilterState {
  const rentTypeRaw = params.get("rent_type");
  const rentType =
    rentTypeRaw === "Daily"
      ? "Daily"
      : rentTypeRaw === "Default"
        ? "Default"
        : "all";

  const ownerTypeRaw = params.get("owner_type");
  const ownerType =
    ownerTypeRaw === "Owner"
      ? "Owner"
      : ownerTypeRaw === "Rieltor"
        ? "Rieltor"
        : "all";

  const roomsRaw = params.get("rooms");
  const rooms = roomsRaw ? roomsRaw.split(",").map(Number) : [];

  return {
    district: params.get("district") ?? "",
    priceMin: Number(params.get("price_min")) || 0,
    priceMax: Number(params.get("price_max")) || 0,
    rooms,
    squareMin: Number(params.get("square_min")) || 0,
    squareMax: Number(params.get("square_max")) || 0,
    floorMin: Number(params.get("floor_min")) || 0,
    floorMax: Number(params.get("floor_max")) || 0,
    renovationType: params.get("renovation_type") ?? "",
    buildingType: params.get("building_type") ?? "",
    rentType,
    ownerType,
  };
}

function buildUrlParams(filters: FilterState, sort: SortOption, page: number) {
  const params = new URLSearchParams();

  if (filters.district) params.set("district", filters.district);
  if (filters.priceMin) params.set("price_min", String(filters.priceMin));
  if (filters.priceMax) params.set("price_max", String(filters.priceMax));
  if (filters.rooms.length) params.set("rooms", filters.rooms.join(","));
  if (filters.squareMin) params.set("square_min", String(filters.squareMin));
  if (filters.squareMax) params.set("square_max", String(filters.squareMax));
  if (filters.floorMin) params.set("floor_min", String(filters.floorMin));
  if (filters.floorMax) params.set("floor_max", String(filters.floorMax));
  if (filters.renovationType)
    params.set("renovation_type", filters.renovationType);
  if (filters.buildingType) params.set("building_type", filters.buildingType);

  if (filters.rentType !== "all") {
    const map = { Default: "Default", Daily: "Daily" };
    params.set("rent_type", map[filters.rentType]);
  }

  if (filters.ownerType !== "all") {
    const map = { Owner: "Owner", Rieltor: "Rieltor" };
    params.set("owner_type", map[filters.ownerType]);
  }

  params.set("sort", sort);
  params.set("page", String(page));

  return params;
}

function buildApiParams(
  filters: FilterState,
  sort: SortOption,
  page: number,
  pageSize: number,
) {
  const params = buildUrlParams(filters, sort, page);
  params.delete("page");

  if (filters.renovationType)
    params.set("renovation_type", filters.renovationType);
  if (filters.buildingType) params.set("building_type", filters.buildingType);

  if (filters.rentType !== "all") {
    const map = { Default: "DEFAULT", Daily: "DAILY" };
    params.set("rent_type", map[filters.rentType]);
  }

  if (filters.ownerType !== "all") {
    const map = { Owner: "OWNER", Rieltor: "AGENT" };
    params.set("owner_type", map[filters.ownerType]);
  }

  params.set("current_page", String(page));
  params.set("page_size", String(pageSize));

  return params;
}

export function ListingsSection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = filtersFromParams(searchParams);
  const initialSort = (searchParams.get("sort") as SortOption) ?? "newest";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [apartments, setApartments] = useState<Apt[]>([]);
  const [total, setTotal] = useState(0);

  const [previewTotal, setPreviewTotal] = useState<number>(0);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [loadingData, setLoadingData] = useState(true);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isMultiColumn, setIsMultiColumn] = useState(window.innerWidth >= 1200);

  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(initialFilters);
  const [pendingFilters, setPendingFilters] =
    useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [page, setPage] = useState(initialPage);

  // ================= MAIN FETCH =================
  const fetchData = useCallback(async () => {
    setLoadingData(true);

    const params = buildApiParams(appliedFilters, sort, page, PAGE_SIZE);

    try {
      const res = await fetch(`${API_URL}/apartment/?${params}`, {
        headers: authHeaders(),
      });

      const data = await res.json();

      setApartments((data.apartments ?? []).map(mapPreviewToCard));
      setTotal(data.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  }, [appliedFilters, page, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ================= PREVIEW =================
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setPreviewLoading(true);

    const timeout = setTimeout(async () => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = buildApiParams(pendingFilters, sort, 1, 1);

        const res = await fetch(`${API_URL}/apartment/?${params}`, {
          headers: authHeaders(),
          signal: controller.signal,
        });

        const data = await res.json();

        setPreviewTotal(data.total ?? 0);
      } catch (e: any) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setPreviewLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [pendingFilters, sort]);

  // ================= RESIZE =================
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      setIsMultiColumn(window.innerWidth >= 1200);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= HANDLERS =================
  const isDirty =
    JSON.stringify(pendingFilters) !== JSON.stringify(appliedFilters);

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
    setSearchParams(buildUrlParams(appliedFilters, newSort, 1));
  };

  const handleApply = () => {
    setPage(1);
    setAppliedFilters(pendingFilters);
    setSearchParams(buildUrlParams(pendingFilters, sort, 1));
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    setSearchParams(buildUrlParams(appliedFilters, sort, p));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterProps = {
    filters: pendingFilters,
    onChange: setPendingFilters,
    onReset: () => {
      setPendingFilters(DEFAULT_FILTERS);
      setAppliedFilters(DEFAULT_FILTERS);
      setPage(1);
      setSort("newest");
      setSearchParams(buildUrlParams(DEFAULT_FILTERS, "newest", 1));
    },
    onApply: handleApply,

    totalResults: isDirty ? previewTotal : total,
    isDirty,
    isLoadingPreview: previewLoading,
  };

  const gridProps = {
    apartments,
    isMultiColumn,
    currentPage: page,
    totalPages: Math.ceil(total / PAGE_SIZE),
    onPageChange: handlePageChange,
  };

  return (
    <section className="max-w-[1600px] mx-auto px-6 lg:px-10 py-4">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-sm text-text-description hover:text-text-title transition-colors mb-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </button>

      <ListingsHeader
        total={total}
        sort={sort}
        onSortChange={handleSortChange}
      />

      {loadingData ? (
        <div className="flex flex-wrap gap-4 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-72 h-80 rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {!isDesktop && <MobileFilters {...filterProps} />}

          {isDesktop ? (
            <div className="flex gap-6 items-start">
              <DesktopFilters {...filterProps} />
              <div className="flex-1 min-w-0">
                <ListingsGrid {...gridProps} />
              </div>
            </div>
          ) : (
            <ListingsGrid {...gridProps} isMultiColumn={false} />
          )}
        </>
      )}
    </section>
  );
}
