        import type { ReactNode } from "react";

interface RoleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export function RoleCard({
  title,
  description,
  icon,
  selected = false,
  onClick,
}: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-h-60 w-full flex-col items-center justify-center rounded-3xl border bg-white px-6 py-8 text-center transition-all duration-200",
        selected
          ? "border-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.12)]"
          : "border-slate-200 hover:border-slate-300",
      ].join(" ")}
    >
      <div
        className={[
          "mb-8 flex h-16 w-16 items-center justify-center rounded-2xl",
          selected
            ? "bg-emerald-50 text-emerald-500"
            : "bg-violet-50 text-violet-400",
        ].join(" ")}
      >
        {icon}
      </div>

      <h3 className="mb-3 font-display text-[20px] font-bold text-slate-900">
        {title}
      </h3>

      <p className="font-display text-[16px] leading-6 text-slate-500">
        {description}
      </p>
    </button>
  );
}
