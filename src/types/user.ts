export type UserType = "Rieltor" | "Owner" | "Default";

export interface MockUser {
  id: string;
  username: string;
  email: string;
  type: UserType;
  phoneNumber: string;
  isVerified: boolean;
  avatarUrl?: string;
}
