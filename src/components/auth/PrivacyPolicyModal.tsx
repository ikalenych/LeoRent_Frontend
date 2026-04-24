import type { ReactNode } from "react";
import { X } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}

export function PrivacyPolicyModal({
  isOpen,
  onClose,
  title = "Політика конфіденційності",
  children,
}: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,41,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="privacy-policy-modal-title"
            className="font-display text-[22px] font-bold text-slate-900"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Закрити модальне вікно"
          >
            <X size={20} />
          </button>
        </div>

        <div className="font-display text-[15px] leading-7 text-slate-600">
          {children ?? (
            <p>
              Якщо ви ріелтор і продаєте хату нечесно, то ви нам винні 3
              мільярди доларів. Усі інші питання щодо політики конфіденційності
              LeoRent будуть додані пізніше.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
