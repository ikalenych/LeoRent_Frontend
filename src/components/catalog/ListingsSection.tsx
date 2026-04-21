import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ListingsHeader from "./ListingsHeader";
import ListingsGrid from "./ListingsGrid";
import {
  DesktopFilters,
  MobileFilters,
  DEFAULT_FILTERS,
  type FilterState,
} from "./ListingsFilters";
import { fetchApartments } from "../../api/apartments";
import { mapPreviewToCard } from "../../mappers/apartment.mapper";
import {
  filterApartments,
  sortApartments,
  type SortOption,
} from "../../utils/apartments";
import type { ApartmentCardProps } from "../../types/apartment";

type Apt = Omit<ApartmentCardProps, "isLiked" | "onLike">;

function filtersToParams(f: FilterState, sort: SortOption): URLSearchParams {
  const p = new URLSearchParams();
  if (f.district) p.set("district", f.district);
  if (f.priceMin) p.set("priceMin", String(f.priceMin));
  if (f.priceMax) p.set("priceMax", String(f.priceMax));
  if (f.rooms.length) p.set("rooms", f.rooms.join(","));
  if (f.squareMin) p.set("squareMin", String(f.squareMin));
  if (f.squareMax) p.set("squareMax", String(f.squareMax));
  if (f.floorMin) p.set("floorMin", String(f.floorMin));
  if (f.floorMax) p.set("floorMax", String(f.floorMax));
  if (f.withFurniture) p.set("furniture", "1");
  if (f.petsAllowed) p.set("pets", "1");
  if (f.ownerType !== "all") p.set("ownerType", f.ownerType);
  if (f.rentType !== "all") p.set("rentType", f.rentType);
  if (sort !== "newest") p.set("sort", sort);
  return p;
}

function paramsToFilters(p: URLSearchParams): {
  filters: FilterState;
  sort: SortOption;
} {
  return {
    filters: {
      district: p.get("district") ?? "",
      priceMin: Number(p.get("priceMin")) || 0,
      priceMax: Number(p.get("priceMax")) || 0,
      rooms: p.get("rooms") ? p.get("rooms")!.split(",").map(Number) : [],
      squareMin: Number(p.get("squareMin")) || 0,
      squareMax: Number(p.get("squareMax")) || 0,
      floorMin: Number(p.get("floorMin")) || 0,
      floorMax: Number(p.get("floorMax")) || 0,
      withFurniture: p.get("furniture") === "1",
      petsAllowed: p.get("pets") === "1",
      ownerType: (p.get("ownerType") as FilterState["ownerType"]) ?? "all",
      rentType: (p.get("rentType") as FilterState["rentType"]) ?? "all",
    },
    sort: (p.get("sort") as SortOption) ?? "newest",
  };
}

export function ListingsSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = paramsToFilters(searchParams);

  const [allApartments, setAllApartments] = useState<Apt[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isMultiColumn, setIsMultiColumn] = useState(window.innerWidth >= 1200);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(
    initial.filters,
  );
  const [sort, setSort] = useState<SortOption>(initial.sort);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(
    initial.filters,
  );

  useEffect(() => {
    fetchApartments()
      .then((data) => setAllApartments(data.map(mapPreviewToCard)))
      .finally(() => setLoadingData(false));
  }, []);

  const isDirty =
    JSON.stringify(pendingFilters) !== JSON.stringify(appliedFilters);

  const previewCount = useMemo(
    () => filterApartments(allApartments, pendingFilters).length,
    [allApartments, pendingFilters],
  );

  const apartments = useMemo(() => {
    const filtered = filterApartments(allApartments, appliedFilters);
    return sortApartments(filtered, sort);
  }, [allApartments, appliedFilters, sort]);

  useEffect(() => {
    const params = filtersToParams(appliedFilters, sort);
    setSearchParams(params, { replace: true });
  }, [appliedFilters, sort]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      setIsMultiColumn(window.innerWidth >= 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleApply = () => setAppliedFilters(pendingFilters);
  const handleReset = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setSort("newest");
  };

  const filterProps = {
    filters: pendingFilters,
    onChange: setPendingFilters,
    onReset: handleReset,
    onApply: handleApply,
    totalResults: previewCount,
    isDirty,
  };

  return (
    <section className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
      <ListingsHeader
        total={apartments.length}
        sort={sort}
        onSortChange={setSort}
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
                <ListingsGrid
                  key={JSON.stringify(appliedFilters) + sort}
                  apartments={apartments}
                  perPage={6}
                  isMultiColumn={isMultiColumn}
                />
              </div>
            </div>
          ) : (
            <ListingsGrid
              key={JSON.stringify(appliedFilters) + sort + "m"}
              apartments={apartments}
              perPage={6}
              isMultiColumn={false}
            />
          )}
        </>
      )}
    </section>
  );
}
