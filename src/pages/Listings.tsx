import { Seo } from "../components/seo/Seo";
import { ListingsSection } from "../components/catalog/ListingsSection";

const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";

export default function Listings() {
  return (
    <>
      <Seo
        title="LeoRent - всі оголошення з оренди квартир у Львові"
        description="Переглядайте всі актуальні оголошення з оренди квартир у Львові на LeoRent. Зручний каталог з фільтрами за ціною, кількістю кімнат та типом оренди допоможе швидко знайти ідеальне житло."
        canonical={`${SITE_URL}/listings`}
      />
      <main>
        <ListingsSection />
      </main>
    </>
  );
}
