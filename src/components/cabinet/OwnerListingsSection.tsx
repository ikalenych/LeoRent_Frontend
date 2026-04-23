import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
}

export default function OwnerListingsSection({
  listings,
}: OwnerListingsSectionProps) {
  const navigate = useNavigate();
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<OwnerListingRow | null>(
    null,
  );

  const displayItems = useMemo(
    () => listings.filter((item) => !deletedIds.has(item.id)),
    [listings, deletedIds],
  );

  function handleConfirmDelete() {
    if (!pendingDelete) return;

    setDeletedIds((prev) => new Set([...prev, pendingDelete.id]));
    setPendingDelete(null);
  }

  return (
    <section className="mt-14">
      {displayItems.length ? (
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
              onClick={() => navigate("/create-listing")}
              className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-2xl bg-primary px-6 text-[15px] font-medium text-white shadow-[0_10px_25px_rgba(22,155,98,0.24)] transition hover:opacity-90 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Додати оголошення
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="hidden grid-cols-[2.6fr_1.2fr_1fr_0.5fr] gap-4 border-b border-slate-100 px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-400 lg:grid">
              <span>Об'єкт</span>
              <span>Район</span>
              <span>Ціна</span>
              <span>Дії</span>
            </div>

            <div className="divide-y divide-slate-100">
              {displayItems.map((listing) => (
                <div
                  key={listing.id}
                  className="grid gap-4 px-6 py-5 lg:grid-cols-[2.6fr_1.2fr_1fr_0.5fr] lg:items-center"
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
                      onClick={() => setPendingDelete(listing)}
                      className="text-slate-500 transition hover:text-red-500 cursor-pointer"
                      aria-label="Видалити оголошення"
                    >
                      <Trash2 className="h-4 w-4" />
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
            onClick={() => navigate("/create-listing")}
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
        description="Після підтвердження оголошення буде видалене зі списку."
        confirmText="Видалити"
        cancelText="Скасувати"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
