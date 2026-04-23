export type UserType = "Rieltor" | "Owner";
export type RentType = "Daily" | "Default";

export interface ApartmentPhoto {
  url: string;
  metadata?: Record<string, unknown>;
}

export type ApartmentDetailsMap = {
  wifi?: 0 | 1;
  parking?: 0 | 1;
  furniture?: 0 | 1;
  elevator?: 0 | 1;
  washing_machine?: 0 | 1;
  conditioner?: 0 | 1;
  balcony?: 0 | 1;
  animals?: 0 | 1;
};

export interface ApartmentCardProps {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  location: string;
  district?: string;
  cost: number;
  rooms: number;
  square: number;
  floor: number;
  floorInHouse: number;
  photos: ApartmentPhoto[];
  ownerType: UserType;
  rentType: RentType;
  details?: ApartmentDetailsMap;
  isLiked?: boolean;
  onLike?: (id: string) => void;
}
