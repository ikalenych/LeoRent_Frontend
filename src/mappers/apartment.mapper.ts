import type {
  BackendApartmentPreview,
  BackendApartmentFull,
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
    ownerId: apt.id_,
    title: apt.title,
    location: apt.location,
    district: apt.district,
    cost: apt.cost,
    rooms: apt.rooms,
    square: apt.square,
    floor: apt.floor,
    floorInHouse: apt.floor_in_house,
    rentType: mapRentType(apt.rent_type),
    ownerType: mapUserType(apt.owner_type),
    renovationType: apt.renovation_type ?? undefined,
    buildingType: apt.type_ ?? undefined,
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
    ownerId: apt.owner_info.email,
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
    ownerType: mapUserType(apt.owner_type),
    details: (apt.details as ApartmentCardProps["details"]) ?? undefined,
    renovationType: apt.renovation_type ?? undefined,
    buildingType: apt.type_ ?? undefined,
    photos,
  };
}

export function mapOwnerInfo(apt: BackendApartmentFull): MockUser {
  const { owner_info, owner_type } = apt;
  const displayName =
    owner_info.first_name && owner_info.last_name
      ? `${owner_info.first_name} ${owner_info.last_name}`
      : owner_info.email;

  return {
    id: owner_info.email,
    username: displayName,
    email: owner_info.email,
    type: mapUserType(owner_type),
    phoneNumber: owner_info.phone_number ?? "",
    isVerified: owner_info.is_verified,
  };
}
