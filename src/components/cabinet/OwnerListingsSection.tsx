import { Plus, ArrowRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

export interface OwnerListingRow {
  id: string;
  title: string;
  address: string;
  district: string;
  price: number;
  image: string;
}

interface OwnerListingsSectionProps {
  listings: OwnerListingRow[];
  onDeleteSuccess?: (id: string) => void;
}

export default function OwnerListingsSection({
  listings,
  onDeleteSuccess,
}: OwnerListingsSectionProps) {
  const navigate = useNavigate();
  const { getFreshToken } = useAuth();

  const [pendingDelete, setPendingDelete] = useState<OwnerListingRow | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;

    try {
      setIsDeleting(true);

      const freshToken = await getFreshToken();
      if (!freshToken) {
        alert("Увійдіть в акаунт.");
        return;
      }

      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/apartment/${pendingDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${freshToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete apartment failed:", errorText);
        throw new Error("Failed to delete apartment");
      }

      onDeleteSuccess?.(pendingDelete.id);
      setPendingDelete(null);
    } catch (error) {
      console.error("Failed to delete apartment:", error);
      alert("Не вдалося видалити оголошення.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="mt-14">
      {listings.length ? (
        <>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[26px] font-bold text-slate-900">
                Мої оголошення
              </h2>
              <p className="mt-1 text-[15px] text-slate-500">
                Керуйте створеними публікаціями
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/listing")}
              className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-2xl bg-primary px-6 text-[15px] font-medium text-white shadow-[0_10px_25px_rgba(22,155,98,0.24)] transition hover:opacity-90 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Додати оголошення
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="hidden grid-cols-[2.6fr_1.2fr_1fr_1fr] gap-4 border-b border-slate-100 px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-400 lg:grid">
              <span>Об'єкт</span>
              <span>Район</span>
              <span>Ціна</span>
              <span>Дії</span>
            </div>

            <div className="divide-y divide-slate-100">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="grid gap-4 px-6 py-5 lg:grid-cols-[2.6fr_1.2fr_1fr_1fr] lg:items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="h-14 w-14 rounded-xl object-cover"
                    />

                    <div>
                      <p className="font-semibold text-slate-900">
                        {listing.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {listing.address}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="inline-flex rounded-xl bg-slate-100 px-3 py-1 text-sm text-slate-600">
                      {listing.district}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-900">
                    {listing.price.toLocaleString("uk-UA")} грн
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/listings/${listing.id}`)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                    >
                      Переглянути
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPendingDelete(listing)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
          <p className="text-lg font-semibold text-slate-900">
            Немає створених оголошень
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Почніть створювати оголошення для здачі квартир у оренду
          </p>

          <button
            type="button"
            onClick={() => navigate("/listing")}
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-[15px] font-medium text-white shadow-[0_10px_25px_rgba(22,155,98,0.24)] transition hover:opacity-90 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Створити оголошення
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        title="Видалити оголошення?"
        description="Оголошення буде деактивоване та зникне з вашого списку."
        confirmText={isDeleting ? "Видалення..." : "Видалити"}
        cancelText="Скасувати"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) setPendingDelete(null);
        }}
      />
    </section>
  );
}
