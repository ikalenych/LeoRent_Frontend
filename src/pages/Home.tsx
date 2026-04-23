import { Seo } from "../components/seo/Seo";
import { Hero } from "../components/home/hero/Hero";
import { Features } from "../components/home/features/Features";
import { PopularDistricts } from "../components/home/districtCard/PopularDistricts";
import { ApartmentsSection } from "../components/home/apartament/ApartmentsSection";

const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";

export default function Home() {
  return (
    <>
      <Seo
        title="LeoRent - оренда квартир у Львові"
        description="LeoRent сервіс для пошуку оренди квартир у Львові. Переглядайте актуальні оголошення, популярні райони та житло з фільтрами за ціною, кімнатами й типом оренди."
        canonical={`${SITE_URL}/`}
      />

      <main>
        <Hero />
        <Features />
        <ApartmentsSection />
        <PopularDistricts />
      </main>
    </>
  );
}
