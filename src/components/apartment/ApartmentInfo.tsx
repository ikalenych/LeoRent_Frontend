import { MapPin } from "lucide-react";
import {
  Wifi,
  Car,
  Sofa,
  ArrowUpDown,
  WashingMachine,
  Wind,
  DoorOpen,
  PawPrint,
} from "lucide-react";
import type { ApartmentCardProps } from "../../types/apartment";

const DETAILS_LABELS = [
  { key: "wifi", label: "Wi-Fi", Icon: Wifi },
  { key: "elevator", label: "Ліфт", Icon: ArrowUpDown },
  { key: "washer", label: "Пральна машина", Icon: WashingMachine },
  { key: "parking", label: "Паркінг", Icon: Car },
  { key: "furniture", label: "Меблі", Icon: Sofa },
  { key: "pets", label: "Тварини", Icon: PawPrint },
  { key: "balcony", label: "Балкон", Icon: DoorOpen },
  { key: "ac", label: "Кондиціонер", Icon: Wind },
] as const;

type Props = Pick<
  ApartmentCardProps,
  "title" | "description" | "location" | "district" | "details"
>;

export function ApartmentInfo({
  title,
  description,
  location,
  district,
  details,
}: Props) {
  return (
    <div className="flex flex-col gap-4 font-display">
      {/* Район + локація */}
      <div className="flex items-center gap-2 text-sm text-text-description">
        {district && (
          <span className="bg-primary/10 text-primary font-semibold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wide">
            {district}
          </span>
        )}
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {location}, Львів
        </span>
      </div>

      {/* Заголовок */}
      <h1 className="text-text-title font-bold text-[1.65rem] leading-tight">
        {title}
      </h1>

      {/* Опис */}
      {description && (
        <p className="text-text-description text-sm leading-relaxed text-justify">
          {description}
        </p>
      )}

      {/* Зручності */}
      {details && (
        <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
          <h2 className="text-text-title font-semibold text-base">Зручності</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
            {DETAILS_LABELS.map(({ key, label, Icon }) => {
              const active = !!details[key];
              return (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${active ? "text-primary" : "text-gray-300"}`}
                  />
                  <span
                    className={active ? "text-text-title" : "text-gray-300"}
                  >
                    {label}
                  </span>
                  <span
                    className={`ml-auto w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    {active ? "✓" : "✗"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
