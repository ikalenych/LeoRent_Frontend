import { ShieldCheck, BadgeCheck, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: ShieldCheck,
    title: "AI-верифікація",
    description: "Безпека понад усе",
  },
  {
    icon: BadgeCheck,
    title: "Тільки перевірені оголошення",
    description: "Якість важливіша за кількість",
  },
  {
    icon: MapPin,
    title: "Всі райони Львова",
    description: "Від центру до Сихова",
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
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-surface border-b border-gray-100">
      <div className="w-full px-4 sm:px-8 md:px-16 py-10 md:py-20 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {features.map(({ icon: Icon, title, description }, i) => (
          <div
            key={title}
            className={`flex items-center justify-center py-6 md:py-0 md:px-14 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{
              transition: "opacity 700ms ease-out, transform 700ms ease-out",
              transitionDelay: inView ? `${i * 250}ms` : "0ms",
            }}
          >
            <div className="group flex items-center gap-5 px-6 py-4 rounded-2xl transition-colors duration-200 hover:bg-emerald-50 cursor-default">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-emerald-100 group-hover:scale-110 flex items-center justify-center transition-all duration-200">
                <Icon className="w-6 h-6 text-primary" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-display font-semibold text-text-title text-base">
                  {title}
                </p>
                <p className="font-display text-text-description text-sm mt-1">
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
