import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ApartmentSection } from "../components/apartment/ApartmentSection";
import { Seo } from "../components/seo/Seo";
import { useEffect, useState } from "react";

const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";

export default function ApartmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [apartment, setApartment] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/apartment/${id}`,
      );
      const data = await res.json();
      setApartment(data);
    };

    fetchData();
  }, [id]);

  const title = apartment
    ? `${apartment.rooms}-кімнатна квартира у ${apartment.district}, ${apartment.price} грн | LeoRent`
    : "LeoRent квартира";

  const description = apartment
    ? `Здається ${apartment.rooms}-кімнатна квартира у Львові (${apartment.district}). Площа ${apartment.square} м², ${apartment.renovation_type} ремонт, ${apartment.price} грн.`
    : "Оголошення про оренду квартири у Львові";

  const image = apartment?.images?.[0] || "/default.webp";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonical={`${SITE_URL}/listings/${id}`}
        image={image}
      />

      <main className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-10 py-3 font-display">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-text-description hover:text-text-title transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>

        <ApartmentSection id={id!} />
      </main>
    </>
  );
}
