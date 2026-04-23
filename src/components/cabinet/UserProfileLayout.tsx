import ProfileHeader from "./ProfileHeader";
import SavedListingsSection from "./SavedListingsSection";
import OwnerListingsSection, {
  type OwnerListingRow,
} from "./OwnerListingsSection";
import type { ProfileListingCardData } from "./ProfileSavedListingCard";

type UserRole = "Tenant" | "Owner" | "Rieltor";

interface UserProfileLayoutProps {
  user: {
    fullName: string;
    email: string;
    role: UserRole;
    roleLabel: string;
  };
  savedListings: ProfileListingCardData[];
  ownerListings?: OwnerListingRow[];
  onOwnerListingDeleted?: (id: string) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export default function UserProfileLayout({
  user,
  savedListings,
  ownerListings = [],
  onOwnerListingDeleted,
  isLoading = false,
  errorMessage,
  onRetry,
}: UserProfileLayoutProps) {
  const isOwnerView = user.role === "Owner" || user.role === "Rieltor";

  return (
    <div className="bg-[#F7F8FC]">
      <main className="mx-auto max-w-310 px-4 py-8 sm:px-6 lg:px-8">
        <ProfileHeader
          fullName={user.fullName}
          email={user.email}
          role={user.role}
          roleLabel={user.roleLabel}
        />

        {errorMessage ? (
          <div className="mt-8 text-center">
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              Спробувати знову
            </button>
          </div>
        ) : isLoading ? (
          <>
            {/* Skeleton for Saved Listings */}
            <div className="mt-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="h-32 bg-slate-200 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skeleton for Owner Listings if applicable */}
            {isOwnerView && (
              <div className="mt-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
                  <div className="h-8 bg-slate-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
                    >
                      <div className="h-20 w-20 bg-slate-200 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <SavedListingsSection listings={savedListings} />

            {isOwnerView ? (
              <OwnerListingsSection
                listings={ownerListings}
                onDeleteSuccess={onOwnerListingDeleted}
              />
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
