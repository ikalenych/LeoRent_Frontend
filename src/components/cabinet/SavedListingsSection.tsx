import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import ProfileSavedListingCard, {
  type ProfileListingCardData,
} from "./ProfileSavedListingCard";

interface SavedListingsSectionProps {
  listings: ProfileListingCardData[];
}

const INITIAL_VISIBLE = 3;
const EXPANDED_VISIBLE = 6;
const LOAD_MORE_STEP = 3;

export default function SavedListingsSection({
  listings,
}: SavedListingsSectionProps) {
  const [items, setItems] = useState(listings);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [pendingRemove, setPendingRemove] =
    useState<ProfileListingCardData | null>(null);

  useEffect(() => {
    setItems(listings);
  }, [listings]);

  const visibleListings = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );

  const hasMore = visibleCount < items.length;
  const isExpandedFromInitial = visibleCount >= EXPANDED_VISIBLE;

  function handleExpand() {
    if (visibleCount < EXPANDED_VISIBLE) {
      setVisibleCount(Math.min(EXPANDED_VISIBLE, items.length));
      return;
    }

    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, items.length));
  }

  function handleConfirmRemove() {
    if (!pendingRemove) return;

    setItems((prev) => prev.filter((item) => item.id !== pendingRemove.id));
    setPendingRemove(null);
    setVisibleCount((prev) =>
      Math.min(prev, Math.max(items.length - 1, INITIAL_VISIBLE)),
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[22px] font-bold text-slate-900">
            Збережені оголошення
          </h2>

          <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 text-sm font-semibold text-slate-500">
            {items.length}
          </span>
        </div>
      </div>

      {items.length ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleListings.map((listing) => (
              <ProfileSavedListingCard
                key={listing.id}
                {...listing}
                onRequestRemove={setPendingRemove}
              />
            ))}
          </div>

          {hasMore ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleExpand}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 text-[15px] font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {isExpandedFromInitial ? "Показати ще" : "Дивитись всі"}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-3xl bg-white px-6 py-10 text-center text-slate-500 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
          У вас поки немає збережених оголошень
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(pendingRemove)}
        title="Видалити зі збережених?"
        description="Оголошення буде прибране зі списку збережених."
        confirmText="Видалити"
        cancelText="Скасувати"
        confirmVariant="danger"
        onConfirm={handleConfirmRemove}
        onCancel={() => setPendingRemove(null)}
      />
    </section>
  );
}
