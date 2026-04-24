import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export function SectionCard({
  children,
  dark = false,
  className = "",
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl p-6",
        dark
          ? "bg-surface-dark text-surface shadow-[0_14px_28px_rgba(15,23,41,0.18)]"
          : "bg-surface shadow-[0_8px_24px_rgba(15,23,41,0.06)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  icon,
  title,
  light = false,
}: {
  icon: React.ReactNode;
  title: string;
  light?: boolean;
}) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <h2
        className={`text-[28px] font-bold leading-none ${light ? "text-surface" : "text-text-title"}`}
      >
        {title}
      </h2>
    </div>
  );
}

export function FieldLabel({
  htmlFor,
  children,
  light = false,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-[14px] font-medium ${light ? "text-white/70" : "text-text-description"}`}
    >
      {children}
    </label>
  );
}

export function BaseInput({
  id,
  placeholder,
  type = "text",
  dark = false,
  value,
  onChange,
  error,
  inputMode,
  pattern,
  maxLength,
}: {
  id?: string;
  placeholder?: string;
  type?: string;
  dark?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  inputMode?: string;
  pattern?: string;
  maxLength?: number;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      inputMode={inputMode as React.HTMLAttributes<HTMLInputElement>["inputMode"]}
      pattern={pattern}
      maxLength={maxLength}
      className={`h-14 w-full rounded-2xl border px-4 text-[16px] font-display outline-none transition placeholder:text-[14px] sm:placeholder:text-[16px] ${
        dark
          ? error
            ? "border-red-400 bg-[#0b1220] text-surface placeholder:text-white/30 focus:ring-4 focus:ring-red-400/10"
            : "border-white/10 bg-[#0b1220] text-surface placeholder:text-white/30 hover:border-white/20 focus:border-primary focus:ring-4 focus:ring-primary/10"
          : error
            ? "border-red-400 bg-surface text-text-title placeholder:text-text-description/60 focus:ring-4 focus:ring-red-400/10"
            : "border-black/10 bg-surface text-text-title placeholder:text-text-description/60 hover:border-black/20 focus:border-primary focus:ring-4 focus:ring-primary/10"
      }`}
    />
  );
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  dark = false,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  dark?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-14 w-full items-center justify-between rounded-2xl border px-4 text-left text-[16px] outline-none transition ${
          dark
            ? error
              ? "border-red-400 bg-[#0b1220] text-surface"
              : "border-white/10 bg-[#0b1220] text-surface hover:border-white/20"
            : error
              ? "border-red-400 bg-surface text-text-title"
              : "border-black/10 bg-surface text-text-title hover:border-black/20"
        } ${!value ? (dark ? "text-white/30" : "text-text-description/60") : ""} ${
          open
            ? error
              ? "ring-4 ring-red-400/10"
              : "border-primary ring-4 ring-primary/10"
            : ""
        }`}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          size={18}
          className={`transition ${open ? "rotate-180" : ""} ${
            dark ? "text-white/50" : "text-text-description/60"
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-2xl border shadow-xl ${
            dark ? "border-white/10 bg-[#101827]" : "border-black/10 bg-surface"
          }`}
        >
          <div className="max-h-64 overflow-y-auto p-2">
            {options.map((option) => {
              const isSelected = value === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] transition ${
                    dark
                      ? isSelected
                        ? "bg-primary/15 text-surface"
                        : "text-white/80 hover:bg-white/5"
                      : isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-text-title hover:bg-page"
                  }`}
                >
                  <span>{option}</span>
                  {isSelected ? (
                    <Check size={16} className="text-primary" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function ChipButton({
  label,
  active,
  onClick,
  error = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  error?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 items-center justify-center rounded-2xl border px-5 text-[15px] font-medium transition ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : error
            ? "border-red-400 bg-surface text-text-title"
            : "border-black/10 bg-surface text-text-title hover:border-black/20"
      }`}
    >
      {label}
    </button>
  );
}

export function ToggleButton({
  label,
  active,
  dark = false,
  onClick,
  error = false,
}: {
  label: string;
  active: boolean;
  dark?: boolean;
  onClick: () => void;
  error?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center rounded-full border px-5 text-[14px] font-medium transition ${
        dark
          ? active
            ? "border-text-title bg-text-title text-surface"
            : error
              ? "border-red-400 bg-surface text-text-title"
              : "border-black/10 bg-surface text-text-title hover:border-black/20"
          : active
            ? "border-primary bg-primary/10 text-primary"
            : error
              ? "border-red-400 bg-surface text-text-title"
              : "border-black/10 bg-surface text-text-title hover:border-black/20"
      }`}
    >
      {label}
    </button>
  );
}

export function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />

      <span className="flex h-5 w-5 items-center justify-center rounded-md border border-black/15 bg-surface transition peer-checked:border-primary peer-checked:bg-primary/10 peer-focus:ring-4 peer-focus:ring-primary/10">
        <Check
          size={14}
          strokeWidth={3}
          className={`transition ${
            checked ? "text-primary opacity-100" : "opacity-0"
          }`}
        />
      </span>

      <span className="text-[16px] text-text-title">{label}</span>
    </label>
  );
}
