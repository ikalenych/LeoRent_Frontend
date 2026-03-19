import type { ReactNode } from "react";

interface AuthInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export function AuthInput({
  label,
  id,
  type = "text",
  placeholder = "",
  error,
  icon,
  disabled = false,
}: AuthInputProps) {
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
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        ) : null}

        <input
          id={id}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          className={`h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 ${
            icon ? "pl-12" : "pl-4"
          } pr-4 text-base font-display text-text-title placeholder:text-slate-400 outline-none transition focus:border-primary ${
            disabled ? "cursor-not-allowed opacity-70" : ""
          } ${error ? "border-red-400" : ""}`}
        />
      </div>

      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
