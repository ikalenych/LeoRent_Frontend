import { HeroSearchBar } from "./HeroSearchBar";
import heroBg from "../../../assets/hero.jpg";

export function Hero() {
  return (
    <section className="relative w-full h-screen max-h-320 min-h-150 flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="Lviv"
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/50 to-transparent" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center gap-8">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-white text-center leading-tight drop-shadow-md">
          Знайди своє житло у <br /> Львові
        </h1>
        <div className="w-full">
          <HeroSearchBar />
        </div>
      </div>
    </section>
  );
}
