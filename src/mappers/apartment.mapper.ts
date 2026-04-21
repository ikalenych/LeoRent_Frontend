import type {
  BackendApartmentPreview,
  BackendApartmentFull,
  BackendUser,
} from "../api/apartments";
import type {
  ApartmentCardProps,
  UserType,
  RentType,
} from "../types/apartment";
import type { MockUser } from "../types/user";

export function mapRentType(type: string): RentType {
  return type === "DAILY" ? "Daily" : "Default";
}

export function mapUserType(type: string): UserType {
  const normalized = type.replace("UserType.", "").toUpperCase();
  if (normalized === "AGENT") return "Rieltor";
  return "Owner";
}

export function mapPreviewToCard(
  apt: BackendApartmentPreview,
): Omit<ApartmentCardProps, "isLiked" | "onLike"> {
  return {
    id: apt.id_,
    ownerId: apt.owner_type, // ← було apt.owner
    title: apt.title,
    location: apt.location,
    district: apt.district,
    cost: apt.cost,
    rooms: apt.rooms,
    square: apt.square,
    floor: apt.floor,
    floorInHouse: apt.floor_in_house,
    rentType: mapRentType(apt.rent_type),
    ownerType: mapUserType(apt.owner_type), // ← тепер реально маппиться
    photos: apt.picture ? [{ url: apt.picture }] : [],
  };
}

export function mapFullToCard(
  apt: BackendApartmentFull,
): Omit<ApartmentCardProps, "isLiked" | "onLike"> {
  const photos = apt.pictures?.length
    ? apt.pictures.map((p) => ({ url: p.url }))
    : [];

  return {
    id: apt.id_,
    ownerId: apt.owner_type, // ← було apt.owner
    title: apt.title,
    description: apt.description ?? undefined,
    location: apt.location,
    district: apt.district,
    cost: apt.cost,
    rooms: apt.rooms,
    square: apt.square,
    floor: apt.floor,
    floorInHouse: apt.floor_in_house,
    rentType: mapRentType(apt.rent_type),
    ownerType: mapUserType(apt.owner_type), // ← було "Owner" hardcoded
    details: (apt.details as ApartmentCardProps["details"]) ?? undefined,
    photos,
  };
}

export function mapBackendUser(user: BackendUser): MockUser {
  const displayName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : (user.username ?? user.email);

  return {
    id: user.id_,
    username: displayName,
    email: user.email,
    type: mapUserType(user.type_),
    phoneNumber: user.phone_number ?? "",
    isVerified: user.is_verified,
  };
}
