import type { ApartmentCardProps } from "../types/apartment";

type Apt = Omit<ApartmentCardProps, "isLiked" | "onLike">;

export type SortOption = "newest" | "price_asc" | "price_desc";

export function sortApartments(apartments: Apt[], sort: SortOption): Apt[] {
  return [...apartments].sort((a, b) => {
    if (sort === "price_asc") return a.cost - b.cost;
    if (sort === "price_desc") return b.cost - a.cost;
    return Number(b.id) - Number(a.id);
  });
}
