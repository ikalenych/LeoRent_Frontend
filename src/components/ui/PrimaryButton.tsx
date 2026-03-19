import type { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

export function PrimaryButton({
  children,
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = true,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${
        fullWidth ? "w-full" : ""
      } h-14 rounded-[14px] bg-emerald-500 text-[16px] font-semibold font-display text-white shadow-[0_10px_20px_rgba(16,185,129,0.25)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? "Завантаження..." : children}
    </button>
  );
}
