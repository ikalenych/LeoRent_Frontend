import type { ReactNode } from "react";

interface SocialButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function SocialButton({
  children,
  onClick,
  disabled = false,
}: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-14 w-full items-center justify-center rounded-[14px] border border-slate-200 bg-white text-[16px] font-medium font-display text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}
