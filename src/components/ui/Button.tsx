import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "social";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-[0_10px_20px_rgba(16,185,129,0.25)]",
  secondary:
    "bg-surface border border-gray-200 text-text-title hover:bg-gray-50",
  outline:
    "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white",
  social: "bg-surface border border-gray-200 text-text-title hover:bg-gray-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-base",
  lg: "h-14 px-6 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-[14px] font-display font-semibold transition-all duration-200",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        disabled || loading ? "cursor-not-allowed opacity-60" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? "Завантаження..." : children}
    </button>
  );
}
