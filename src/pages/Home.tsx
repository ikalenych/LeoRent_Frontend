import { Hero } from "../components/home/hero/Hero";
import { Features } from "../components/home/features/Features";
import { PopularDistricts } from "../components/home/districtCard/PopularDistricts";
import { ApartmentsSection } from "../components/home/apartament/ApartmentsSection";
export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <ApartmentsSection />
      <PopularDistricts />
    </main>
  );
}
