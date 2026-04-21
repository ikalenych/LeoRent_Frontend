import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../../ui/Button";

const districts = [
  "Всі райони",
  "Галицький",
  "Личаківський",
  "Сихівський",
  "Франківський",
  "Залізничний",
];
const rooms = ["Будь-яка", "1", "2", "3", "4+"];
const durations = ["Тривала", "Подобова"];

interface SelectDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

function SelectDropdown({
  label,
  options,
  value,
  onChange,
}: SelectDropdownProps) {
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

  return (
    <div ref={ref} className="relative flex flex-col px-4 py-3 flex-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="mt-1 text-left text-white text-sm font-medium flex items-center justify-between gap-2 outline-none"
      >
        {value}
        <svg
          className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`absolute top-full left-0 mt-2 w-52 bg-white md:bg-white/25 md:backdrop-blur-md border border-gray-200 md:border-white/30 rounded-xl shadow-2xl z-[9999] overflow-hidden transition-all duration-300 ease-out ${
          open
            ? "opacity-100 max-h-64 translate-y-0 pointer-events-auto"
            : "opacity-0 max-h-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-1.5">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 md:hover:bg-white/20 ${
                value === opt
                  ? "text-emerald-500 md:text-white font-semibold"
                  : "text-gray-700 md:text-white/80"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSearchBar() {
  const navigate = useNavigate();
  const [district, setDistrict] = useState("Всі райони");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [room, setRoom] = useState("Будь-яка");
  const [duration, setDuration] = useState("Тривала");

  const handlePrice = (val: string, set: (v: string) => void) => {
    if (val.length <= 6) set(val);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (district !== "Всі райони") {
      params.set("district", district);
    }

    if (priceFrom) {
      params.set("price_min", priceFrom);
    }

    if (priceTo) {
      params.set("price_max", priceTo);
    }

    if (room !== "Будь-яка") {
      params.set("rooms", room === "4+" ? "4" : room);
    }

    params.set("rent_type", duration === "Подобова" ? "Daily" : "Default");
    params.set("sort", "newest");
    params.set("page", "1");

    navigate(`/listings?${params.toString()}`);
  };

  const fieldClass =
    "flex flex-col flex-1 border-b md:border-b-0 md:border-r border-white/20 last:border-0 overflow-visible";

  return (
    <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl flex flex-col md:flex-row items-stretch overflow-visible">
      <div className={fieldClass}>
        <SelectDropdown
          label="Район"
          options={districts}
          value={district}
          onChange={setDistrict}
        />
      </div>

      <div className={fieldClass}>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60 px-4 pt-3">
          Ціна від/до
        </span>
        <div className="flex items-center gap-2 px-4 pb-3 mt-1">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="від"
            value={priceFrom}
            onChange={(e) =>
              handlePrice(e.target.value.replace(/\D/g, ""), setPriceFrom)
            }
            className="w-full text-sm font-medium text-white placeholder:text-white/40 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-white/40 text-sm shrink-0">—</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="до"
            value={priceTo}
            onChange={(e) =>
              handlePrice(e.target.value.replace(/\D/g, ""), setPriceTo)
            }
            className="w-full text-sm font-medium text-white placeholder:text-white/40 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className={fieldClass}>
        <SelectDropdown
          label="Кімнат"
          options={rooms}
          value={room}
          onChange={setRoom}
        />
      </div>

      <div className={`${fieldClass} md:border-r-0`}>
        <SelectDropdown
          label="Тривалість"
          options={durations}
          value={duration}
          onChange={setDuration}
        />
      </div>

      <div className="p-2 flex items-center">
        <Button
          size="lg"
          className="w-full md:w-auto rounded-xl gap-2 px-10"
          onClick={handleSearch}
        >
          <Search size={18} />
          <span className="hidden sm:inline">Шукати</span>
        </Button>
      </div>
    </div>
  );
}
