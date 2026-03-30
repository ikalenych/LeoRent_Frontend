import { useState, useMemo } from "react";
import ListingsHeader from "./ListingsHeader";
import ListingsGrid from "./ListingsGrid";
import { MOCK_APARTMENTS } from "../../constants/mockApartments";
import { sortApartments, type SortOption } from "../../utils/apartments";

export function ListingsSection() {
  const [sort, setSort] = useState<SortOption>("newest");

  const apartments = useMemo(
    () => sortApartments(MOCK_APARTMENTS, sort),
    [sort],
  );

  return (
    <section className="mx-auto px-10 py-8">
      <ListingsHeader
        total={apartments.length}
        sort={sort}
        onSortChange={setSort}
      />
      <ListingsGrid apartments={apartments} perPage={6} />
    </section>
  );
}
