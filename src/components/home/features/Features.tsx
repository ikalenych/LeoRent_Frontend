import { ShieldCheck, BadgeCheck, MapPin } from "lucide-react";

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
  return (
    <section className="bg-surface border-b border-gray-100">
      <div className="w-full px-4 sm:px-8 md:px-16 py-10 md:py-20 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex items-center justify-center gap-5 py-6 md:py-0 md:px-14"
          >
            <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
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
        ))}
      </div>
    </section>
  );
}
