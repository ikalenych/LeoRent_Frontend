import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options = [
    { value: "newest", label: "Спочатку нові" },
    { value: "price_asc", label: "Ціна: від низької" },
    { value: "price_desc", label: "Ціна: від високої" },
  ];

  const selected = options.find((o) => o.value === sort);

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

      <div ref={ref} className="relative w-full sm:w-auto">
        <button
          onClick={() => setOpen((p) => !p)}
          className="font-display text-sm text-text-title bg-surface border border-gray-200 rounded-xl px-4 py-2 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto flex items-center justify-between gap-2"
        >
          <span
            className={selected ? "text-text-title" : "text-text-description"}
          >
            {selected?.label || "Сортування"}
          </span>

          <ChevronDown
            className={`w-4 h-4 text-text-description transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onSortChange(opt.value as SortOption);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-display transition-colors ${
                  sort === opt.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-title hover:bg-page"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
