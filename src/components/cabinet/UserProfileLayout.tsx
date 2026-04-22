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
    avatarUrl?: string;
  };
  savedListings: ProfileListingCardData[];
  ownerListings?: OwnerListingRow[];
}

export default function UserProfileLayout({
  user,
  savedListings,
  ownerListings = [],
}: UserProfileLayoutProps) {
  const isOwnerView = user.role === "Owner" || user.role === "Rieltor";

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <div className="mx-auto max-w-310 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <ProfileHeader
          fullName={user.fullName}
          email={user.email}
          roleLabel={user.roleLabel}
          avatarUrl={user.avatarUrl}
        />

        <SavedListingsSection listings={savedListings} />

        {isOwnerView ? <OwnerListingsSection listings={ownerListings} /> : null}
      </div>
    </main>
  );
}
