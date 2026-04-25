import { ShieldCheck, BadgeCheck, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: ShieldCheck,
    title: "AI-фільтрація",
    description: "Знайди ідеальну квартиру за допомогою штучного інтелекту",
  },
  {
    icon: BadgeCheck,
    title: "Тільки перевірені оголошення",
    description: "Якість важливіша за кількість",
  },
  {
    icon: MapPin,
    title: "Квартири лише у Львові",
    description: "Знайди квартиру у будь-якому куточку міста",
  },
];

export function Features() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-surface border-b border-gray-100">
      {/* 
        До xl (1280px) — стак у колонку.
        На xl+ — 3 колонки з вертикальними роздільниками.
      */}
      <div className="w-full px-4 sm:px-8 md:px-16 py-8 md:py-14 xl:py-20 grid grid-cols-1 xl:grid-cols-3 divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
        {features.map(({ icon: Icon, title, description }, i) => (
          <div
            key={title}
            className={`flex items-center justify-center py-5 xl:py-0 xl:px-14 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{
              transition: "opacity 700ms ease-out, transform 700ms ease-out",
              transitionDelay: inView ? `${i * 250}ms` : "0ms",
            }}
          >
            <div className="group flex items-center gap-5 w-full max-w-sm sm:max-w-md xl:max-w-none px-5 py-4 rounded-2xl transition-colors duration-200 hover:bg-emerald-50 cursor-default">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-emerald-100 group-hover:scale-110 flex items-center justify-center transition-all duration-200">
                <Icon className="w-6 h-6 text-primary" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold text-text-title text-base">
                  {title}
                </p>
                <p className="font-display text-text-description text-sm mt-1 leading-snug">
                  {description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
