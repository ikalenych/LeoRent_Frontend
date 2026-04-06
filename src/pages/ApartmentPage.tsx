import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MOCK_APARTMENTS } from "../constants/mockApartments";
import { ApartmentGallery } from "../components/apartment/ApartmentGallery";

export default function ApartmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const apartment = MOCK_APARTMENTS.find((a) => a.id === id);

  if (!apartment) {
    return (
      <main className="px-6 py-20 text-center text-text-description font-display">
        Квартиру не знайдено
      </main>
    );
  }

  return (
    <main className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-10 py-8 font-display">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-text-description hover:text-text-title transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </button>

      <ApartmentGallery photos={apartment.photos} title={apartment.title} />
    </main>
  );
}
