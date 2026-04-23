import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import ProfileSavedListingCard, {
  type ProfileListingCardData,
} from "./ProfileSavedListingCard";
import { useAuth } from "../../context/AuthContext";

interface SavedListingsSectionProps {
  listings: ProfileListingCardData[];
}

const INITIAL_VISIBLE = 3;
const EXPANDED_VISIBLE = 6;
const LOAD_MORE_STEP = 3;

export default function SavedListingsSection({
  listings,
}: SavedListingsSectionProps) {
  const { getFreshToken } = useAuth();
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollLeftRef = useRef<number | null>(null);

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [pendingRemove, setPendingRemove] =
    useState<ProfileListingCardData | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const displayItems = useMemo(
    () => listings.filter((item) => !deletedIds.has(item.id)),
    [listings, deletedIds],
  );

  const visibleListings = useMemo(
    () => displayItems.slice(0, visibleCount),
    [displayItems, visibleCount],
  );

  const hasMore = visibleCount < displayItems.length;
  const isExpandedFromInitial = visibleCount >= EXPANDED_VISIBLE;

  useEffect(() => {
    if (pendingScrollLeftRef.current === null || !mobileScrollerRef.current) {
      return;
    }

    mobileScrollerRef.current.scrollTo({
      left: pendingScrollLeftRef.current,
      behavior: "auto",
    });

    pendingScrollLeftRef.current = null;
  }, [visibleCount]);

  function handleExpand() {
    if (mobileScrollerRef.current) {
      pendingScrollLeftRef.current = mobileScrollerRef.current.scrollLeft;
    }

    if (visibleCount < EXPANDED_VISIBLE) {
      setVisibleCount(Math.min(EXPANDED_VISIBLE, displayItems.length));
      return;
    }

    setVisibleCount((prev) =>
      Math.min(prev + LOAD_MORE_STEP, displayItems.length),
    );
  }

  async function handleConfirmRemove() {
    if (!pendingRemove) return;

    try {
      setIsRemoving(true);

      const freshToken = await getFreshToken();
      if (!freshToken) {
        alert("Увійдіть в акаунт.");
        return;
      }

      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${baseUrl}/apartment/${pendingRemove.id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${freshToken}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Toggle like failed:", errorText);
        throw new Error("Failed to toggle like");
      }

      setDeletedIds((prev) => new Set([...prev, pendingRemove.id]));
      setVisibleCount((prev) =>
        Math.min(prev, Math.max(displayItems.length - 1, INITIAL_VISIBLE)),
      );
      setPendingRemove(null);
    } catch (error) {
      console.error("Failed to remove saved listing:", error);
      alert("Не вдалося видалити оголошення зі збережених.");
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <section className="mt-10">
      {displayItems.length ? (
        <>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-[22px] font-bold text-slate-900">
                Збережені оголошення
              </h2>

              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 text-sm font-semibold text-slate-500">
                {displayItems.length}
              </span>
            </div>
          </div>

          <div className="md:hidden">
            <div
              ref={mobileScrollerRef}
              className={`-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${displayItems.length === 1 ? "justify-center" : ""}`}
            >
              {visibleListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex w-[calc(100%-2rem)] shrink-0 snap-center justify-center"
                >
                  <ProfileSavedListingCard
                    {...listing}
                    onRequestRemove={setPendingRemove}
                  />
                </div>
              ))}

              {hasMore ? (
                <div className="flex w-[calc(100%-2rem)] shrink-0 snap-center justify-center">
                  <button
                    type="button"
                    onClick={handleExpand}
                    className="flex h-90 w-full max-w-75 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm transition hover:border-slate-400 hover:bg-slate-50 min-[480px]:h-105 min-[480px]:max-w-97.5"
                  >
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <ArrowRight className="h-5 w-5" />
                    </span>

                    <span className="text-base font-semibold text-slate-900">
                      {isExpandedFromInitial ? "Показати ще" : "Дивитись всі"}
                    </span>

                    <span className="mt-2 text-sm text-slate-500">
                      Ще {displayItems.length - visibleCount} огол.
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-3">
            {visibleListings.map((listing) => (
              <ProfileSavedListingCard
                key={listing.id}
                {...listing}
                onRequestRemove={setPendingRemove}
              />
            ))}
          </div>

          {hasMore ? (
            <div className="mt-8 hidden justify-center md:flex">
              <button
                type="button"
                onClick={handleExpand}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 text-[15px] font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 cursor-pointer"
              >
                {isExpandedFromInitial ? "Показати ще" : "Дивитись всі"}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
          <p className="text-lg font-semibold text-slate-900">
            Немає збережених оголошень
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Почніть збирати улюблені оголошення, щоб легше їх знайти пізніше
          </p>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(pendingRemove)}
        title="Видалити зі збережених?"
        description="Оголошення буде прибране зі списку збережених."
        confirmText={isRemoving ? "Видалення..." : "Видалити"}
        cancelText="Скасувати"
        confirmVariant="danger"
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          if (!isRemoving) setPendingRemove(null);
        }}
      />
    </section>
  );
}
