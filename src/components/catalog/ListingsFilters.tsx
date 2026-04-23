import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import type { RentType } from "../../types/apartment";

export interface FilterState {
  district: string;
  priceMin: number;
  priceMax: number;
  rooms: number[];
  squareMin: number;
  squareMax: number;
  floorMin: number;
  floorMax: number;
  withFurniture: boolean;
  petsAllowed: boolean;
  ownerType: "all" | "Owner" | "Rieltor";
  rentType: "all" | RentType;
}

export const DEFAULT_FILTERS: FilterState = {
  district: "",
  priceMin: 0,
  priceMax: 0,
  rooms: [],
  squareMin: 0,
  squareMax: 0,
  floorMin: 0,
  floorMax: 0,
  withFurniture: false,
  petsAllowed: false,
  ownerType: "all",
  rentType: "all",
};

const DISTRICTS = [
  "Галицький",
  "Залізничний",
  "Личаківський",
  "Сихівський",
  "Франківський",
  "Шевченківський",
];

export interface FilterProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onReset: () => void;
  onApply: () => void;
  totalResults: number;
  isDirty: boolean;
  isLoadingPreview: boolean;
}

function hasAnyFilter(f: FilterState) {
  return (
    !!f.district ||
    f.priceMin > 0 ||
    f.priceMax > 0 ||
    f.rooms.length > 0 ||
    f.squareMin > 0 ||
    f.squareMax > 0 ||
    f.floorMin > 0 ||
    f.floorMax > 0 ||
    f.withFurniture ||
    f.petsAllowed ||
    f.ownerType !== "all" ||
    f.rentType !== "all"
  );
}

function NumInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      placeholder={placeholder}
      value={value || ""}
      onKeyDown={(e) =>
        ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
      }
      onChange={(ev) => onChange(Math.max(0, Number(ev.target.value)))}
      className="w-full text-sm bg-page border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary font-display"
    />
  );
}

// ─── Десктоп ───────────────────────────────────────────────────
export function DesktopFilters({
  filters,
  onChange,
  onReset,
  onApply,
  totalResults,
  isDirty,
  isLoadingPreview,
}: FilterProps) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  const toggleRoom = (r: number) => {
    const next = filters.rooms.includes(r)
      ? filters.rooms.filter((x) => x !== r)
      : [...filters.rooms, r];
    set("rooms", next);
  };

  const hasAny = hasAnyFilter(filters);

  return (
    <aside className="w-[260px] shrink-0 bg-surface rounded-2xl shadow-sm p-5 font-display flex flex-col gap-5 h-fit">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-text-title text-base">Фільтри</span>
        {hasAny && (
          <button
            onClick={onReset}
            className="text-sm text-primary hover:text-primary-hover transition-colors cursor-pointer"
          >
            Очистити
          </button>
        )}
      </div>

      {/* Район */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-description uppercase tracking-wide">
          Район
        </label>
        <div className="relative">
          <select
            value={filters.district}
            onChange={(e) => set("district", e.target.value)}
            className="w-full appearance-none text-sm text-text-title bg-page border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary pr-8"
          >
            <option value="">Всі райони</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-description pointer-events-none" />
        </div>
      </div>

      {/* Ціна */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-text-description uppercase tracking-wide">
          Ціна (ГРН)
        </label>
        <div className="flex gap-2">
          <NumInput
            placeholder="Від"
            value={filters.priceMin}
            onChange={(v) => set("priceMin", v)}
          />
          <NumInput
            placeholder="До"
            value={filters.priceMax}
            onChange={(v) => set("priceMax", v)}
          />
        </div>
      </div>

      {/* Кімнати */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-text-description uppercase tracking-wide">
          Кількість кімнат
        </label>
        <div className="flex gap-1.5">
          {([1, 2, 3, 4] as const).map((r) => (
            <button
              key={r}
              onClick={() => toggleRoom(r)}
              className={`flex-1 py-1.5 rounded-xl text-sm font-medium transition-colors border cursor-pointer ${
                filters.rooms.includes(r)
                  ? "bg-primary text-white border-primary"
                  : "bg-page border-gray-200 text-text-description hover:border-primary"
              }`}
            >
              {r === 4 ? "4+" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Площа і поверх */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-description uppercase tracking-wide">
            Площа м²
          </label>
          <div className="flex gap-2">
            <NumInput
              placeholder="Від"
              value={filters.squareMin}
              onChange={(v) => set("squareMin", v)}
            />
            <NumInput
              placeholder="До"
              value={filters.squareMax}
              onChange={(v) => set("squareMax", v)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-description uppercase tracking-wide">
            Поверх
          </label>
          <div className="flex gap-2">
            <NumInput
              placeholder="Від"
              value={filters.floorMin}
              onChange={(v) => set("floorMin", v)}
            />
            <NumInput
              placeholder="До"
              value={filters.floorMax}
              onChange={(v) => set("floorMax", v)}
            />
          </div>
        </div>
      </div>

      {/* Чекбокси */}
      <div className="flex flex-col gap-2.5">
        {[
          { key: "withFurniture" as const, label: "З меблями" },
          { key: "petsAllowed" as const, label: "Можна з тваринами" },
        ].map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-2 text-sm text-text-title cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters[key]}
              onChange={(e) => set(key, e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Тип оголошення */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-text-description uppercase tracking-wide">
          Тип оголошення
        </label>
        {(["all", "Owner", "Rieltor"] as const).map((type) => (
          <label
            key={type}
            className="flex items-center gap-2 text-sm text-text-title cursor-pointer"
          >
            <input
              type="radio"
              name="ownerType-desktop"
              checked={filters.ownerType === type}
              onChange={() => set("ownerType", type)}
              className="accent-primary"
            />
            {type === "all" ? "Всі" : type === "Owner" ? "Власник" : "Рієлтор"}
          </label>
        ))}
      </div>

      {/* Тип оренди */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-text-description uppercase tracking-wide">
          Тип оренди
        </label>
        {(["all", "Default", "Daily"] as const).map((type) => (
          <label
            key={type}
            className="flex items-center gap-2 text-sm text-text-title cursor-pointer"
          >
            <input
              type="radio"
              name="rentType-desktop"
              checked={filters.rentType === type}
              onChange={() => set("rentType", type)}
              className="accent-primary"
            />
            {type === "all"
              ? "Всі"
              : type === "Default"
                ? "Тривала оренда"
                : "Подобово"}
          </label>
        ))}
      </div>

      {isDirty && (
        <button
          onClick={onApply}
          className="w-full bg-primary hover:bg-primary-hover text-white font-medium text-sm py-3 rounded-xl transition-colors cursor-pointer"
        >
          Показати {isLoadingPreview ? "..." : totalResults} варіантів
        </button>
      )}
    </aside>
  );
}

// ─── Мобілка ───────────────────────────────────────────────────
type ChipKey =
  | "district"
  | "rooms"
  | "ownerType"
  | "price"
  | "square"
  | "extra"
  | "rentType";

export function MobileFilters({
  filters,
  onChange,
  onReset,
  onApply,
  totalResults,
  isDirty,
}: FilterProps) {
  const [openChip, setOpenChip] = useState<ChipKey | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  const toggleRoom = (r: number) => {
    const next = filters.rooms.includes(r)
      ? filters.rooms.filter((x) => x !== r)
      : [...filters.rooms, r];
    set("rooms", next);
  };

  const toggle = (chip: ChipKey) =>
    setOpenChip((prev) => (prev === chip ? null : chip));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenChip(null);
      }
    };
    if (openChip) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openChip]);

  const hasDistrict = !!filters.district;
  const hasRooms = filters.rooms.length > 0;
  const hasOwner = filters.ownerType !== "all";
  const hasPrice = filters.priceMin > 0 || filters.priceMax > 0;
  const hasSquare = filters.squareMin > 0 || filters.squareMax > 0;
  const hasExtra = filters.withFurniture || filters.petsAllowed;
  const hasRentType = filters.rentType !== "all";
  const hasAny = hasAnyFilter(filters);

  const roomsLabel = hasRooms
    ? [...filters.rooms]
        .sort((a, b) => a - b)
        .map((r) => (r === 4 ? "4+" : r))
        .join(", ") + " к."
    : "Кількість кімнат";
  const districtLabel = filters.district || "Район";
  const ownerLabel =
    filters.ownerType === "all"
      ? "Тип оголошення"
      : filters.ownerType === "Owner"
        ? "Власник"
        : "Рієлтор";
  const priceLabel = !hasPrice
    ? "Ціна"
    : filters.priceMin && filters.priceMax
      ? `${filters.priceMin.toLocaleString("uk-UA")} — ${filters.priceMax.toLocaleString("uk-UA")} ₴`
      : filters.priceMin
        ? `від ${filters.priceMin.toLocaleString("uk-UA")} ₴`
        : `до ${filters.priceMax.toLocaleString("uk-UA")} ₴`;
  const squareLabel = !hasSquare
    ? "Площа м²"
    : `${filters.squareMin || ""}–${filters.squareMax || ""} м²`;
  const extraLabel =
    filters.withFurniture && filters.petsAllowed
      ? "З меблями, з тваринами"
      : filters.withFurniture
        ? "З меблями"
        : filters.petsAllowed
          ? "З тваринами"
          : "Додатково";
  const rentTypeLabel =
    filters.rentType === "Daily"
      ? "Подобово"
      : filters.rentType === "Default"
        ? "Тривала оренда"
        : "Тип оренди";

  const chipBase =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer select-none font-display";
  const chipOn = "bg-primary text-white border-primary";
  const chipOff =
    "bg-surface text-text-title border-gray-200 hover:border-primary";

  const ClearIcon = ({ onClear }: { onClear: () => void }) => (
    <X
      className="w-3.5 h-3.5"
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
    />
  );

  return (
    <div className="flex flex-col gap-3 mb-4" ref={dropdownRef}>
      <div className="flex flex-wrap gap-2 items-center">
        {/* Район */}
        <button
          onClick={() => toggle("district")}
          className={`${chipBase} ${hasDistrict ? chipOn : chipOff}`}
        >
          {districtLabel}
          {hasDistrict ? (
            <ClearIcon
              onClear={() => {
                set("district", "");
                setOpenChip(null);
              }}
            />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Кімнати */}
        <button
          onClick={() => toggle("rooms")}
          className={`${chipBase} ${hasRooms ? chipOn : chipOff}`}
        >
          {roomsLabel}
          {hasRooms ? (
            <ClearIcon
              onClear={() => {
                set("rooms", []);
                setOpenChip(null);
              }}
            />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Ціна */}
        <button
          onClick={() => toggle("price")}
          className={`${chipBase} ${hasPrice ? chipOn : chipOff}`}
        >
          {priceLabel}
          {hasPrice ? (
            <ClearIcon
              onClear={() => {
                set("priceMin", 0);
                set("priceMax", 0);
                setOpenChip(null);
              }}
            />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Площа */}
        <button
          onClick={() => toggle("square")}
          className={`${chipBase} ${hasSquare ? chipOn : chipOff}`}
        >
          {squareLabel}
          {hasSquare ? (
            <ClearIcon
              onClear={() => {
                set("squareMin", 0);
                set("squareMax", 0);
                setOpenChip(null);
              }}
            />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Тип оголошення */}
        <button
          onClick={() => toggle("ownerType")}
          className={`${chipBase} ${hasOwner ? chipOn : chipOff}`}
        >
          {ownerLabel}
          {hasOwner ? (
            <ClearIcon
              onClear={() => {
                set("ownerType", "all");
                setOpenChip(null);
              }}
            />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Тип оренди */}
        <button
          onClick={() => toggle("rentType")}
          className={`${chipBase} ${hasRentType ? chipOn : chipOff}`}
        >
          {rentTypeLabel}
          {hasRentType ? (
            <ClearIcon
              onClear={() => {
                set("rentType", "all");
                setOpenChip(null);
              }}
            />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Додатково */}
        <button
          onClick={() => toggle("extra")}
          className={`${chipBase} ${hasExtra ? chipOn : chipOff}`}
        >
          {extraLabel}
          {hasExtra ? (
            <ClearIcon
              onClear={() => {
                set("withFurniture", false);
                set("petsAllowed", false);
                setOpenChip(null);
              }}
            />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {hasAny && (
          <button
            onClick={onReset}
            className="text-sm text-primary hover:text-primary-hover transition-colors cursor-pointer px-1 font-display"
          >
            Очистити все
          </button>
        )}
      </div>

      {/* Дропдауни */}
      {openChip === "district" && (
        <div className="relative z-50 bg-surface rounded-2xl shadow-lg p-4 flex flex-col gap-1 border border-gray-100">
          <button
            onClick={() => {
              set("district", "");
              setOpenChip(null);
            }}
            className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${!filters.district ? "bg-primary text-white" : "hover:bg-page text-text-title"}`}
          >
            Всі райони
          </button>
          {DISTRICTS.map((d) => (
            <button
              key={d}
              onClick={() => {
                set("district", d);
                setOpenChip(null);
              }}
              className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${filters.district === d ? "bg-primary text-white" : "hover:bg-page text-text-title"}`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {openChip === "rooms" && (
        <div className="relative z-50 bg-surface rounded-2xl shadow-lg p-4 border border-gray-100">
          <div className="flex gap-2">
            {([1, 2, 3, 4] as const).map((r) => (
              <button
                key={r}
                onClick={() => toggleRoom(r)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                  filters.rooms.includes(r)
                    ? "bg-primary text-white border-primary"
                    : "bg-page border-gray-200 text-text-description hover:border-primary"
                }`}
              >
                {r === 4 ? "4+" : r}
              </button>
            ))}
          </div>
        </div>
      )}

      {openChip === "price" && (
        <div className="relative z-50 bg-surface rounded-2xl shadow-lg p-4 border border-gray-100 flex flex-col gap-3">
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Від"
              value={filters.priceMin || ""}
              onKeyDown={(e) =>
                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
              }
              onChange={(e) =>
                set("priceMin", Math.max(0, Number(e.target.value)))
              }
              className="w-full text-sm bg-page border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-display"
            />
            <input
              type="number"
              placeholder="До"
              value={filters.priceMax || ""}
              onKeyDown={(e) =>
                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
              }
              onChange={(e) =>
                set("priceMax", Math.max(0, Number(e.target.value)))
              }
              className="w-full text-sm bg-page border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-display"
            />
          </div>
          <button
            onClick={() => setOpenChip(null)}
            className="bg-primary hover:bg-primary-hover text-white font-medium text-sm py-2 rounded-xl transition-colors cursor-pointer font-display"
          >
            ОК
          </button>
        </div>
      )}

      {openChip === "square" && (
        <div className="relative z-50 bg-surface rounded-2xl shadow-lg p-4 border border-gray-100 flex flex-col gap-3">
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Від"
              value={filters.squareMin || ""}
              onKeyDown={(e) =>
                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
              }
              onChange={(e) =>
                set("squareMin", Math.max(0, Number(e.target.value)))
              }
              className="w-full text-sm bg-page border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-display"
            />
            <input
              type="number"
              placeholder="До"
              value={filters.squareMax || ""}
              onKeyDown={(e) =>
                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
              }
              onChange={(e) =>
                set("squareMax", Math.max(0, Number(e.target.value)))
              }
              className="w-full text-sm bg-page border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-display"
            />
          </div>
          <button
            onClick={() => setOpenChip(null)}
            className="bg-primary hover:bg-primary-hover text-white font-medium text-sm py-2 rounded-xl transition-colors cursor-pointer font-display"
          >
            ОК
          </button>
        </div>
      )}

      {openChip === "ownerType" && (
        <div className="relative z-50 bg-surface rounded-2xl shadow-lg p-4 flex flex-col gap-1 border border-gray-100">
          {(["all", "Owner", "Rieltor"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                set("ownerType", type);
                setOpenChip(null);
              }}
              className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${filters.ownerType === type ? "bg-primary text-white" : "hover:bg-page text-text-title"}`}
            >
              {type === "all"
                ? "Всі"
                : type === "Owner"
                  ? "Власник"
                  : "Рієлтор"}
            </button>
          ))}
        </div>
      )}

      {openChip === "rentType" && (
        <div className="relative z-50 bg-surface rounded-2xl shadow-lg p-4 flex flex-col gap-1 border border-gray-100">
          {(["all", "Default", "Daily"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                set("rentType", type);
                setOpenChip(null);
              }}
              className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${filters.rentType === type ? "bg-primary text-white" : "hover:bg-page text-text-title"}`}
            >
              {type === "all"
                ? "Всі"
                : type === "Default"
                  ? "Тривала оренда"
                  : "Подобово"}
            </button>
          ))}
        </div>
      )}

      {openChip === "extra" && (
        <div className="relative z-50 bg-surface rounded-2xl shadow-lg p-4 border border-gray-100 flex flex-col gap-2">
          {[
            { key: "withFurniture" as const, label: "З меблями" },
            { key: "petsAllowed" as const, label: "Можна з тваринами" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-2 text-sm text-text-title cursor-pointer px-1 py-1"
            >
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={(e) => set(key, e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              {label}
            </label>
          ))}
        </div>
      )}

      {isDirty && openChip === null && (
        <button
          onClick={onApply}
          className="w-full bg-primary hover:bg-primary-hover text-white font-medium text-sm py-3 rounded-xl transition-colors cursor-pointer font-display"
        >
          Показати {totalResults} варіантів
        </button>
      )}
    </div>
  );
}
