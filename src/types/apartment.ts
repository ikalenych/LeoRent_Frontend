export type UserType = "Rieltor" | "Owner";

export interface ApartmentPhoto {
  url: string;
  metadata?: Record<string, unknown>;
}

export interface ApartmentCardProps {
  id: string;
  title: string;
  location: string;
  district?: string;
  cost: number;
  rooms: number;
  square: number;
  floor: number;
  floorInHouse: number;
  photos: ApartmentPhoto[];
  ownerType: UserType;
  isLiked?: boolean;
  onLike?: (id: string) => void;
}
