import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
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
  renovationType: string;
  buildingType: string;
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
  renovationType: "",
  buildingType: "",
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
    !!f.renovationType ||
    !!f.buildingType ||
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

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
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

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between text-sm bg-page border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-colors hover:border-primary cursor-pointer font-display text-left"
      >
        <span
          className={
            selected?.value ? "text-text-title" : "text-text-description"
          }
        >
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-description transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          <div>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors cursor-pointer font-display ${
                  value === opt.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-title hover:bg-page"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RadioOption({
  checked,
  onChange,
  label,
  name,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  name: string;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-text-title cursor-pointer group">
      <span
        onClick={onChange}
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          checked
            ? "border-primary bg-primary"
            : "border-gray-300 bg-page group-hover:border-primary/50"
        }`}
      >
        {checked && (
          <span className="w-1.5 h-1.5 rounded-full bg-white block" />
        )}
      </span>
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span onClick={onChange}>{label}</span>
    </label>
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
        <CustomSelect
          value={filters.district}
          onChange={(v) => set("district", v)}
          placeholder="Всі райони"
          options={[
            { value: "", label: "Всі райони" },
            ...DISTRICTS.map((d) => ({ value: d, label: d })),
          ]}
        />
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

      {/* Тип ремонту */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-description uppercase tracking-wide">
          Тип ремонту
        </label>
        <CustomSelect
          value={filters.renovationType}
          onChange={(v) => set("renovationType", v)}
          placeholder="Всі типи"
          options={[
            { value: "", label: "Всі типи" },
            { value: "euro", label: "Євроремонт" },
            { value: "cosmetic", label: "Косметичний" },
            { value: "design", label: "Дизайнерський" },
            { value: "none", label: "Без ремонту" },
          ]}
        />
      </div>

      {/* Тип будинку */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-description uppercase tracking-wide">
          Тип будинку
        </label>
        <CustomSelect
          value={filters.buildingType}
          onChange={(v) => set("buildingType", v)}
          placeholder="Всі типи"
          options={[
            { value: "", label: "Всі типи" },
            { value: "panel", label: "Панельний" },
            { value: "monolith", label: "Монолітний" },
            { value: "brick", label: "Цегляний" },
          ]}
        />
      </div>

      {/* Тип оголошення */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-text-description uppercase tracking-wide">
          Тип оголошення
        </label>
        {(["all", "Owner", "Rieltor"] as const).map((type) => (
          <RadioOption
            key={type}
            name="ownerType-desktop"
            checked={filters.ownerType === type}
            onChange={() => set("ownerType", type)}
            label={
              type === "all" ? "Всі" : type === "Owner" ? "Власник" : "Рієлтор"
            }
          />
        ))}
      </div>

      {/* Тип оренди */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-text-description uppercase tracking-wide">
          Тип оренди
        </label>
        {(["all", "Default", "Daily"] as const).map((type) => (
          <RadioOption
            key={type}
            name="rentType-desktop"
            checked={filters.rentType === type}
            onChange={() => set("rentType", type)}
            label={
              type === "all"
                ? "Всі"
                : type === "Default"
                  ? "Тривала оренда"
                  : "Подобово"
            }
          />
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

type ChipKey =
  | "district"
  | "rooms"
  | "ownerType"
  | "price"
  | "square"
  | "renovationType"
  | "buildingType"
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 130, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    // Check initial scroll state
    handleScroll();
  }, []);

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
  const hasRenovationType = !!filters.renovationType;
  const hasBuildingType = !!filters.buildingType;
  const hasRentType = filters.rentType !== "all";
  const hasAny = hasAnyFilter(filters);

  const roomsLabel = hasRooms
    ? [...filters.rooms]
        .sort((a, b) => a - b)
        .map((r) => (r === 4 ? "4+" : r))
        .join(", ") + " к."
    : "Кімнати";
  const districtLabel = filters.district || "Район";
  const ownerLabel =
    filters.ownerType === "all"
      ? "Оголошення"
      : filters.ownerType === "Owner"
        ? "Власник"
        : "Рієлтор";
  const priceLabel = !hasPrice
    ? "Ціна"
    : filters.priceMin && filters.priceMax
      ? `${filters.priceMin.toLocaleString("uk-UA")}–${filters.priceMax.toLocaleString("uk-UA")} ₴`
      : filters.priceMin
        ? `від ${filters.priceMin.toLocaleString("uk-UA")} ₴`
        : `до ${filters.priceMax.toLocaleString("uk-UA")} ₴`;
  const squareLabel = !hasSquare
    ? "Площа"
    : `${filters.squareMin || ""}–${filters.squareMax || ""} м²`;
  const renovationTypeLabel =
    filters.renovationType === "euro"
      ? "Євроремонт"
      : filters.renovationType === "cosmetic"
        ? "Косметичний"
        : filters.renovationType === "design"
          ? "Дизайнерський"
          : filters.renovationType === "none"
            ? "Без ремонту"
            : "Ремонт";
  const buildingTypeLabel =
    filters.buildingType === "panel"
      ? "Панельний"
      : filters.buildingType === "monolith"
        ? "Монолітний"
        : filters.buildingType === "brick"
          ? "Цегляний"
          : "Будинок";
  const rentTypeLabel =
    filters.rentType === "Daily"
      ? "Подобово"
      : filters.rentType === "Default"
        ? "Тривала оренда"
        : "Оренда";

  const chipBase =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer select-none font-display whitespace-nowrap shrink-0";
  const chipOn = "bg-primary text-white border-primary";
  const chipOff =
    "bg-surface text-text-title border-gray-200 hover:border-primary";

  const ClearIcon = ({ onClear }: { onClear: () => void }) => (
    <X
      className="w-3 h-3 opacity-80"
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
    />
  );

  const dropdownClass =
    "bg-surface border border-gray-100 rounded-2xl shadow-lg overflow-hidden";
  const dropdownItemBase =
    "w-full text-left text-sm px-4 py-3 transition-colors cursor-pointer font-display";
  const dropdownItemActive = "bg-primary/10 text-primary font-medium";
  const dropdownItemInactive = "text-text-title hover:bg-page";

  const arrowBtn = (dir: "left" | "right", disabled: boolean) => (
    <button
      onClick={() => scrollBy(dir === "left" ? -1 : 1)}
      className={`shrink-0 w-7 h-7 rounded-full border border-gray-200 bg-surface flex items-center justify-center transition-opacity cursor-pointer ${
        disabled ? "opacity-25 pointer-events-none" : "opacity-100"
      }`}
    >
      {dir === "left" ? (
        <ChevronLeft className="w-3.5 h-3.5 text-text-title" />
      ) : (
        <ChevronRight className="w-3.5 h-3.5 text-text-title" />
      )}
    </button>
  );

  return (
    <div className="flex flex-col gap-3 mb-4" ref={dropdownRef}>
      {/* Chip scroll row */}
      <div className="relative flex items-center gap-1.5">
        {arrowBtn("left", !canScrollLeft)}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto py-0.5 flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
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
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${openChip === "district" ? "rotate-180" : ""}`}
              />
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
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${openChip === "rooms" ? "rotate-180" : ""}`}
              />
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
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${openChip === "price" ? "rotate-180" : ""}`}
              />
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
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${openChip === "square" ? "rotate-180" : ""}`}
              />
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
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${openChip === "rentType" ? "rotate-180" : ""}`}
              />
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
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${openChip === "ownerType" ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {/* Тип ремонту */}
          <button
            onClick={() => toggle("renovationType")}
            className={`${chipBase} ${hasRenovationType ? chipOn : chipOff}`}
          >
            {renovationTypeLabel}
            {hasRenovationType ? (
              <ClearIcon
                onClear={() => {
                  set("renovationType", "");
                  setOpenChip(null);
                }}
              />
            ) : (
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${openChip === "renovationType" ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {/* Тип будинку */}
          <button
            onClick={() => toggle("buildingType")}
            className={`${chipBase} ${hasBuildingType ? chipOn : chipOff}`}
          >
            {buildingTypeLabel}
            {hasBuildingType ? (
              <ClearIcon
                onClear={() => {
                  set("buildingType", "");
                  setOpenChip(null);
                }}
              />
            ) : (
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${openChip === "buildingType" ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {/* Очистити все — в кінці ряду */}
          {hasAny && (
            <button
              onClick={onReset}
              className="shrink-0 text-sm text-primary hover:text-primary-hover transition-colors cursor-pointer px-1 font-display whitespace-nowrap"
            >
              Очистити
            </button>
          )}
        </div>

        {arrowBtn("right", !canScrollRight)}
      </div>

      {/* Дропдауни */}
      {openChip === "district" && (
        <div className={dropdownClass}>
          <div>
            <button
              onClick={() => {
                set("district", "");
                setOpenChip(null);
              }}
              className={`${dropdownItemBase} ${!filters.district ? dropdownItemActive : dropdownItemInactive}`}
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
                className={`${dropdownItemBase} ${filters.district === d ? dropdownItemActive : dropdownItemInactive}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {openChip === "rooms" && (
        <div className={`${dropdownClass} p-4`}>
          <div className="flex gap-2">
            {([1, 2, 3, 4] as const).map((r) => (
              <button
                key={r}
                onClick={() => toggleRoom(r)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
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
        <div className={`${dropdownClass} p-4 flex flex-col gap-3`}>
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
              className="w-full text-sm bg-page border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary font-display"
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
              className="w-full text-sm bg-page border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary font-display"
            />
          </div>
          <button
            onClick={() => setOpenChip(null)}
            className="bg-primary hover:bg-primary-hover text-white font-medium text-sm py-2.5 rounded-xl transition-colors cursor-pointer font-display"
          >
            ОК
          </button>
        </div>
      )}

      {openChip === "square" && (
        <div className={`${dropdownClass} p-4 flex flex-col gap-3`}>
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
              className="w-full text-sm bg-page border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary font-display"
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
              className="w-full text-sm bg-page border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary font-display"
            />
          </div>
          <button
            onClick={() => setOpenChip(null)}
            className="bg-primary hover:bg-primary-hover text-white font-medium text-sm py-2.5 rounded-xl transition-colors cursor-pointer font-display"
          >
            ОК
          </button>
        </div>
      )}

      {openChip === "ownerType" && (
        <div className={dropdownClass}>
          <div>
            {(["all", "Owner", "Rieltor"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  set("ownerType", type);
                  setOpenChip(null);
                }}
                className={`${dropdownItemBase} ${filters.ownerType === type ? dropdownItemActive : dropdownItemInactive}`}
              >
                {type === "all"
                  ? "Всі"
                  : type === "Owner"
                    ? "Власник"
                    : "Рієлтор"}
              </button>
            ))}
          </div>
        </div>
      )}

      {openChip === "rentType" && (
        <div className={dropdownClass}>
          <div>
            {(["all", "Default", "Daily"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  set("rentType", type);
                  setOpenChip(null);
                }}
                className={`${dropdownItemBase} ${filters.rentType === type ? dropdownItemActive : dropdownItemInactive}`}
              >
                {type === "all"
                  ? "Всі"
                  : type === "Default"
                    ? "Тривала оренда"
                    : "Подобово"}
              </button>
            ))}
          </div>
        </div>
      )}

      {openChip === "renovationType" && (
        <div className={dropdownClass}>
          <div>
            {[
              { value: "", label: "Всі типи" },
              { value: "euro", label: "Євроремонт" },
              { value: "cosmetic", label: "Косметичний" },
              { value: "design", label: "Дизайнерський" },
              { value: "none", label: "Без ремонту" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  set("renovationType", value);
                  setOpenChip(null);
                }}
                className={`${dropdownItemBase} ${filters.renovationType === value ? dropdownItemActive : dropdownItemInactive}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {openChip === "buildingType" && (
        <div className={dropdownClass}>
          <div>
            {[
              { value: "", label: "Всі типи" },
              { value: "panel", label: "Панельний" },
              { value: "monolith", label: "Монолітний" },
              { value: "brick", label: "Цегляний" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  set("buildingType", value);
                  setOpenChip(null);
                }}
                className={`${dropdownItemBase} ${filters.buildingType === value ? dropdownItemActive : dropdownItemInactive}`}
              >
                {label}
              </button>
            ))}
          </div>
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
