import { Hero } from "../components/home/hero/Hero";
import { Features } from "../components/home/features/Features";
import { PopularDistricts } from "../components/home/districtCard/PopularDistricts";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <PopularDistricts />
    </main>
  );
}
