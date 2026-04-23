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
}

export default function UserProfileLayout({
  user,
  savedListings,
  ownerListings = [],
  onOwnerListingDeleted,
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

        <SavedListingsSection listings={savedListings} />

        {isOwnerView ? (
          <OwnerListingsSection
            listings={ownerListings}
            onDeleteSuccess={onOwnerListingDeleted}
          />
        ) : null}
      </main>
    </div>
  );
}
