import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  className?: string;
}

export function ErrorAlert({ message, className = "" }: ErrorAlertProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700 ${className}`}
    >
      <AlertTriangle size={18} strokeWidth={2} />
      <span className="font-display text-[14px]">{message}</span>
    </div>
  );
}
