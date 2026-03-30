import ListingsHeader from "./ListingsHeader";
import type { SortOption } from "./ListingsHeader";

export function ListingsSection() {
  return (
    <section className="mx-auto px-10 py-8">
      <ListingsHeader total={142} sort="newest" onSortChange={() => {}} />
    </section>
  );
}
