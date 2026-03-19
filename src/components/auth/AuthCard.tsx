import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <section className="flex justify-center px-4 py-10 md:px-6 md:py-14">
      <div
        className={`w-full max-w-118 rounded-3xl border border-gray-100 bg-white px-8 py-8 shadow-[0_10px_40px_rgba(15,23,41,0.08)] ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
