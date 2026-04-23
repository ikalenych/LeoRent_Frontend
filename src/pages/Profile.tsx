import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLiked } from "../context/LikedContext";
import ProfileHeader from "../components/cabinet/ProfileHeader";
import OwnerListingsSection, {
  type OwnerListingRow,
} from "../components/cabinet/OwnerListingsSection";
import ApartmentCard from "../components/ApartmentCard";
import ConfirmModal from "../components/cabinet/ConfirmModal";
import type { ApartmentCardProps } from "../types/apartment";

type BackendUser = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  user_type?: "OWNER" | "AGENT" | "DEFAULT";
  firebase_uid?: string;
  is_verified?: boolean;
};

function getFullName(user: BackendUser | null) {
  if (!user) return "Користувач";

  const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  if (fullName) return fullName;

  if (user.first_name?.trim()) return user.first_name.trim();

  if (user.email?.trim()) return user.email.split("@")[0];

  return "Користувач";
}

function mapUserTypeToProfileRole(
  userType?: "OWNER" | "AGENT" | "DEFAULT",
): "Tenant" | "Owner" | "Rieltor" {
  switch (userType) {
    case "OWNER":
      return "Owner";
    case "AGENT":
      return "Rieltor";
    default:
      return "Tenant";
  }
}

function mapUserTypeToRoleLabel(userType?: "OWNER" | "AGENT" | "DEFAULT") {
  switch (userType) {
    case "OWNER":
      return "Власник";
    case "AGENT":
      return "Рієлтор";
    default:
      return "Орендар";
  }
}

export default function Profile() {
  const authUser = useAuth().user;
  const storedUser = authUser as BackendUser | null;
  const { likedApartmentsRaw, isLikedLoading, toggleLike } = useLiked();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null,
  );

  const savedListings: ApartmentCardProps[] = likedApartmentsRaw.map(
    (item) => ({
      id: String(item.id_),
      ownerId: String(item.owner_id ?? ""),
      title: item.title ?? "Без назви",
      description: item.description ?? "",
      location: item.location ?? "Невідома локація",
      district: item.district ?? "",
      cost: Number(item.cost ?? 0),
      rooms: Number(item.rooms ?? 0),
      square: Number(item.square ?? 0),
      floor: Number(item.floor ?? 0),
      floorInHouse: Number(item.floor_in_house ?? 0),
      ownerType: item.owner_type === "Rieltor" ? "Rieltor" : "Owner",
      rentType: item.rent_type === "Daily" ? "Daily" : "Default",
      photos:
        Array.isArray(item.pictures) && item.pictures.length > 0
          ? item.pictures.map((pic) => ({
              url: pic.url ?? "/placeholder.jpg",
            }))
          : [{ url: "/placeholder.jpg" }],
      details: {},
    }),
  );

  const ownerListings: OwnerListingRow[] = [];

  const user = {
    fullName: getFullName(storedUser),
    email: storedUser?.email ?? "Немає email",
    role: mapUserTypeToProfileRole(storedUser?.user_type),
    roleLabel: mapUserTypeToRoleLabel(storedUser?.user_type),
  };

  const isOwnerView = user.role === "Owner" || user.role === "Rieltor";

  const handleCardLikeClick = (id: string) => {
    setSelectedListingId(id);
    setConfirmOpen(true);
  };

  const handleConfirmUnlike = async () => {
    if (!selectedListingId) return;

    await toggleLike(selectedListingId);
    setConfirmOpen(false);
    setSelectedListingId(null);
  };

  const handleCancelUnlike = () => {
    setConfirmOpen(false);
    setSelectedListingId(null);
  };

  return (
    <div className="bg-[#F7F8FC]">
      <main className="mx-auto max-w-310 px-4 py-8 sm:px-6 lg:px-8">
        <ProfileHeader
          fullName={user.fullName}
          email={user.email}
          role={user.role}
          roleLabel={user.roleLabel}
        />

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">
              Збережені оголошення
            </h2>
          </div>

          {isLikedLoading ? (
            <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
              Завантаження...
            </div>
          ) : savedListings.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
              У вас ще немає збережених оголошень.
            </div>
          ) : (
            <div className="flex flex-wrap gap-5">
              {savedListings.map((listing) => (
                <div key={listing.id}>
                  <ApartmentCard
                    {...listing}
                    onLike={handleCardLikeClick}
                    isLiked
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {isOwnerView ? <OwnerListingsSection listings={ownerListings} /> : null}
      </main>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Прибрати зі збережених?"
        description="Оголошення буде видалене з вашого списку збережених."
        confirmText="Прибрати"
        cancelText="Скасувати"
        confirmVariant="danger"
        onConfirm={handleConfirmUnlike}
        onCancel={handleCancelUnlike}
      />
    </div>
  );
}
