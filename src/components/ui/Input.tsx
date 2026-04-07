import type { InputHTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  icon?: ReactNode;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  helperText?: string;
}

export function Input({
  label,
  id,
  type = "text",
  placeholder = "",
  error,
  icon,
  disabled = false,
  showPasswordToggle = false,
  helperText,
  className = "",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle && showPassword ? "text" : type;

  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="mb-2 block text-base font-display font-semibold text-text-title"
      >
        {label}
      </label>

      <div className="relative">
        {icon ? (
          <span
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
              error ? "text-red-400" : "text-slate-400"
            }`}
          >
            {icon}
          </span>
        ) : null}

        <input
          id={id}
          type={inputType}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          className={`h-13 w-full rounded-2xl border bg-slate-50 ${
            icon ? "pl-12" : "pl-4"
          } ${showPasswordToggle ? "pr-12" : "pr-4"} text-base font-display text-text-title placeholder:text-slate-400 outline-none transition ${
            error
              ? "border-red-300 bg-red-50/40 focus:border-red-500"
              : "border-slate-200 focus:border-primary"
          } ${disabled ? "cursor-not-allowed opacity-70" : ""} ${className}`}
          {...props}
        />

        {showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
              error
                ? "text-red-400 hover:text-red-500"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {showPassword ? (
              <EyeOff size={20} strokeWidth={1.75} />
            ) : (
              <Eye size={20} strokeWidth={1.75} />
            )}
          </button>
        ) : null}
      </div>

      {error ? (
        <div
          id={`${id}-error`}
          className="mt-2 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm"
          role="alert"
          aria-live="polite"
        >
          <AlertTriangle
            size={18}
            strokeWidth={1.9}
            className="mt-0.5 shrink-0 text-red-500"
          />
          <p className="text-sm font-medium leading-6">{error}</p>
        </div>
      ) : helperText ? (
        <p id={`${id}-helper`} className="mt-1 text-sm text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
