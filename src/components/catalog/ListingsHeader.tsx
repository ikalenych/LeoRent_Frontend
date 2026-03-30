export type SortOption = "newest" | "price_asc" | "price_desc";

interface ListingsHeaderProps {
  total: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function ListingsHeader({
  total,
  sort,
  onSortChange,
}: ListingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-text-title font-display">
          Оренда квартир у Львові
        </h1>
        <p className="text-text-description text-sm mt-1 font-display">
          Знайдено {total} оголошень
        </p>
      </div>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="font-display text-sm text-text-title bg-surface border border-gray-200 rounded-xl px-4 py-2 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
      >
        <option value="newest">Спочатку нові</option>
        <option value="price_asc">Ціна: від низької</option>
        <option value="price_desc">Ціна: від високої</option>
      </select>
    </div>
  );
}
