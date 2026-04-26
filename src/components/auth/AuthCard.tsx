                            import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <section className="flex justify-center px-4 py-10 md:py-14">
      <div
        className={`w-full rounded-3xl border border-gray-100 bg-white px-6 py-8 shadow-[0_10px_40px_rgba(15,23,41,0.08)] sm:px-8 ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
