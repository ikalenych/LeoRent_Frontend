import { useState } from "react";
import { Phone, ShieldCheck, Heart, Check } from "lucide-react";
import { useLiked } from "../../context/LikedContext";
import { UserAvatar } from "../ui/UserAvatar";
import type { MockUser } from "../../types/user";

interface Props {
  apartmentId: string;
  cost: number;
  isDaily: boolean;
  owner: MockUser | null;
  mobile?: boolean;
}

export function ApartmentOwnerCard({
  apartmentId,
  cost,
  isDaily,
  owner,
  mobile = false,
}: Props) {
  const { liked, toggleLike } = useLiked();
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePhoneClick = async () => {
    if (!owner) return;
    if (!phoneVisible) {
      setPhoneVisible(true);
      return;
    }
    await navigator.clipboard.writeText(owner.phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Мобільна версія ──────────────────────────────────────────
  if (mobile) {
    return (
      <div className="px-3 pb-3 pt-2">
        <div className="bg-white/80 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl px-4 py-3 flex items-center gap-2 font-display">
          {/* Лайк */}
          <button
            onClick={() => toggleLike(apartmentId)}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
            aria-label="Додати до обраного"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                liked.has(apartmentId)
                  ? "fill-rose-500 text-rose-500"
                  : "text-gray-300"
              }`}
            />
          </button>

          {/* Ціна + власник */}
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-text-title leading-none truncate">
              {cost.toLocaleString("uk-UA")}
              <span className="text-xs font-medium text-text-description ml-1">
                ₴/{isDaily ? "доб" : "міс"}
              </span>
            </p>
            {owner && (
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="text-xs text-text-description truncate">
                  {owner.username} ·{" "}
                  {owner.type === "Rieltor" ? "Рієлтор" : "Власник"}
                </span>
              </div>
            )}
          </div>

          {/* Кнопка */}
          {owner && (
            <div className="relative shrink-0">
              <div
                className={`absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-text-title text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md whitespace-nowrap transition-all duration-300 ${
                  copied
                    ? "opacity-100 -translate-y-1"
                    : "opacity-0 translate-y-0 pointer-events-none"
                }`}
              >
                <Check className="w-3 h-3" />
                Скопійовано
              </div>
              <button
                onClick={handlePhoneClick}
                className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
                  phoneVisible
                    ? "bg-gray-50 border-gray-200 text-text-title text-xs"
                    : "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">
                  {phoneVisible ? owner.phoneNumber : "Зателефонувати"}
                </span>
                <span className="xs:hidden">
                  {phoneVisible ? owner.phoneNumber : "Дзвінок"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Десктопна версія ─────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-gray-100 shadow-sm bg-white p-5 flex flex-col gap-4 font-display sticky top-24">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-description mb-0.5">
            Оренда за {isDaily ? "добу" : "місяць"}
          </p>
          <p className="text-[1.6rem] font-bold text-text-title leading-none">
            {cost.toLocaleString("uk-UA")}
            <span className="text-base font-semibold text-text-description ml-1">
              ₴/{isDaily ? "доб" : "міс"}
            </span>
          </p>
        </div>
        <button
          onClick={() => toggleLike(apartmentId)}
          className="p-2 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
          aria-label="Додати до обраного"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              liked.has(apartmentId)
                ? "fill-rose-500 text-rose-500"
                : "text-gray-300"
            }`}
          />
        </button>
      </div>

      <div className="border-t border-gray-100" />

      {owner && (
        <div className="flex items-center gap-3">
          <UserAvatar username={owner.username} size="md" />
          <div>
            <p className="text-text-title font-semibold text-sm">
              {owner.username}
            </p>
            <div className="flex items-center gap-1 text-xs text-text-description">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>{owner.type === "Rieltor" ? "Рієлтор" : "Власник"}</span>
            </div>
          </div>
        </div>
      )}

      {owner && (
        <div className="relative">
          <div
            className={`absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-text-title text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md whitespace-nowrap transition-all duration-300 ${
              copied
                ? "opacity-100 -translate-y-1"
                : "opacity-0 translate-y-0 pointer-events-none"
            }`}
          >
            <Check className="w-3 h-3" />
            Скопійовано
          </div>
          <button
            onClick={handlePhoneClick}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 border ${
              phoneVisible
                ? "bg-gray-50 border-gray-200 text-text-title hover:bg-gray-100 cursor-pointer"
                : "border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white cursor-pointer"
            }`}
          >
            <Phone className="w-4 h-4" />
            {phoneVisible ? owner.phoneNumber : "Показати номер"}
          </button>
        </div>
      )}
    </div>
  );
}
