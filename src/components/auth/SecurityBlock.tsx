import { ShieldCheck } from "lucide-react";

interface SecurityBlockProps {
  onClick?: () => void;
}

export function SecurityBlock({ onClick }: SecurityBlockProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 flex w-full items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-left transition hover:border-emerald-200 hover:bg-emerald-100/60"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500">
        <ShieldCheck size={20} strokeWidth={2} />
      </div>

      <span className="font-display text-[16px] font-semibold text-slate-900">
        Дані захищені протоколом LeoRent
      </span>
    </button>
  );
}
