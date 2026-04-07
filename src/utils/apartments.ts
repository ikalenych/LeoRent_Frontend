import type { ApartmentCardProps } from "../types/apartment";
import type { FilterState } from "../components/catalog/ListingsFilters";

type Apt = Omit<ApartmentCardProps, "isLiked" | "onLike">;

export type SortOption = "newest" | "price_asc" | "price_desc";

export function sortApartments(apartments: Apt[], sort: SortOption): Apt[] {
  return [...apartments].sort((a, b) => {
    if (sort === "price_asc") return a.cost - b.cost;
    if (sort === "price_desc") return b.cost - a.cost;
    return Number(b.id) - Number(a.id);
  });
}

export function filterApartments(
  apartments: Apt[],
  filters: FilterState,
): Apt[] {
  return apartments.filter((a) => {
    if (filters.district && a.district !== filters.district) return false;
    if (filters.priceMin && a.cost < filters.priceMin) return false;
    if (filters.priceMax && a.cost > filters.priceMax) return false;
    if (filters.rooms.length > 0) {
      const match = filters.rooms.some((r) =>
        r === 4 ? a.rooms >= 4 : a.rooms === r,
      );
      if (!match) return false;
    }
    if (filters.squareMin && a.square < filters.squareMin) return false;
    if (filters.squareMax && a.square > filters.squareMax) return false;
    if (filters.floorMin && a.floor < filters.floorMin) return false;
    if (filters.floorMax && a.floor > filters.floorMax) return false;
    if (filters.ownerType !== "all" && a.ownerType !== filters.ownerType)
      return false;
    if (filters.rentType !== "all" && a.rentType !== filters.rentType)
      return false;
    if (filters.withFurniture && !a.details?.furniture) return false;
    if (filters.petsAllowed && !a.details?.pets) return false;
    return true;
  });
}
