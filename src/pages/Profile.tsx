import { useCallback, useEffect, useMemo, useState } from "react";
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

type BackendApartmentPicture = {
  id_?: string;
  url: string;
  metadata?: Record<string, unknown>;
};

type BackendApartment = {
  id_?: string;
  id?: string;
  title: string;
  description?: string | null;
  location: string;
  district: string;
  cost: number;
  rent_type?: string;
  is_deleted?: boolean;
  rooms: number;
  square: number;
  floor: number;
  floor_in_house: number;
  owner_type?: string;
  picture?: string | null;
  pictures?: BackendApartmentPicture[];
};

type LikedApartmentsResponse = {
  apartments?: BackendApartment[];
};

type MyApartmentsResponse = {
  apartments?: BackendApartment[];
  items?: BackendApartment[];
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

function mapApartmentOwnerType(ownerType?: string): "Owner" | "Rieltor" {
  return ownerType === "AGENT" || ownerType === "UserType.AGENT"
    ? "Rieltor"
    : "Owner";
}

function mapApartmentRentType(rentType?: string): "Monthly" | "Daily" {
  return rentType === "DAILY" ? "Daily" : "Monthly";
}

function getApartmentImage(apartment: BackendApartment) {
  if (apartment.pictures?.length) {
    return apartment.pictures[0].url;
  }

  if (apartment.picture) {
    return apartment.picture;
  }

  return "/placeholder.jpg";
}

export default function Profile() {
  const { user: authUser, getFreshToken } = useAuth();
  const storedUser = authUser as BackendUser | null;
  const { likedApartmentsRaw, isLikedLoading, toggleLike } = useLiked();

  const [savedListings, setSavedListings] = useState<
    {
      id: string;
      title: string;
      location: string;
      district?: string;
      cost: number;
      rooms: number;
      square: number;
      floor: number;
      floorInHouse: number;
      photos: { url: string }[];
      ownerType: "Owner" | "Rieltor";
      rentType: "Monthly" | "Daily";
    }[]
  >([]);

  const [ownerListings, setOwnerListings] = useState<
    {
      id: string;
      title: string;
      address: string;
      district: string;
      price: number;
      image: string;
    }[]
  >([]);

  const [deletedOwnerIds, setDeletedOwnerIds] = useState<Set<string>>(
    new Set(),
  );

  const user = useMemo(
    () => ({
      fullName: getFullName(storedUser),
      email: storedUser?.email ?? "Немає email",
      role: mapUserTypeToProfileRole(storedUser?.user_type),
      roleLabel: mapUserTypeToRoleLabel(storedUser?.user_type),
    }),
    [storedUser],
  );

  const loadProfileData = useCallback(async () => {
    try {
      const freshToken = await getFreshToken();

      if (!freshToken) {
        setSavedListings([]);
        setOwnerListings([]);
        return;
      }

      const baseUrl = import.meta.env.VITE_API_URL;

      const [likedResponse, myResponse] = await Promise.all([
        fetch(`${baseUrl}/apartment/liked/`, {
          headers: {
            Authorization: `Bearer ${freshToken}`,
          },
        }),
        fetch(`${baseUrl}/apartment/my/?current_page=1&page_size=20`, {
          headers: {
            Authorization: `Bearer ${freshToken}`,
          },
        }),
      ]);

      const likedData: LikedApartmentsResponse = likedResponse.ok
        ? await likedResponse.json()
        : { apartments: [] };

      const myData: MyApartmentsResponse = myResponse.ok
        ? await myResponse.json()
        : { apartments: [] };

      const likedApartments = likedData.apartments ?? [];
      const myApartments = myData.apartments ?? myData.items ?? [];

      const mappedSavedListings = likedApartments.map((apartment) => ({
        id: apartment.id_ ?? apartment.id ?? "",
        title: apartment.title,
        location: apartment.location,
        district: apartment.district,
        cost: apartment.cost,
        rooms: apartment.rooms,
        square: apartment.square,
        floor: apartment.floor,
        floorInHouse: apartment.floor_in_house,
        ownerType: mapApartmentOwnerType(apartment.owner_type),
        rentType: mapApartmentRentType(apartment.rent_type),
        photos: [{ url: getApartmentImage(apartment) }],
      }));

      const mappedOwnerListings = myApartments
        .filter((apartment) => !apartment.is_deleted)
        .map((apartment) => ({
          id: apartment.id_ ?? apartment.id ?? "",
          title: apartment.title,
          address: apartment.location,
          district: apartment.district,
          price: apartment.cost,
          image: getApartmentImage(apartment),
        }))
        .filter((listing) => !deletedOwnerIds.has(listing.id));

      setSavedListings(mappedSavedListings);
      setOwnerListings(mappedOwnerListings);
    } catch (error) {
      console.error("Failed to load profile data:", error);
      setSavedListings([]);
      setOwnerListings([]);
    }
  }, [getFreshToken, deletedOwnerIds]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  function handleOwnerListingDeleted(id: string) {
    setDeletedOwnerIds((prev) => new Set([...prev, id]));
    setOwnerListings((prev) => prev.filter((listing) => listing.id !== id));
  }

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
    <UserProfileLayout
      user={user}
      savedListings={savedListings}
      ownerListings={ownerListings}
      onOwnerListingDeleted={handleOwnerListingDeleted}
    />
  );
}
