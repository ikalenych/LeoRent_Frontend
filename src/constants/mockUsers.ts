import type { MockUser } from "../types/user";

export const MOCK_USERS: MockUser[] = [
  {
    id: "u1",
    username: "Олександр",
    email: "oleksandr@example.com",
    type: "Owner",
    phoneNumber: "+380 95 123 45 67",
    isVerified: true,
    avatarUrl: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "u2",
    username: "Марія",
    email: "maria@example.com",
    type: "Rieltor",
    phoneNumber: "+380 67 234 56 78",
    isVerified: true,
    avatarUrl: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: "u3",
    username: "Василь",
    email: "vasyl@example.com",
    type: "Owner",
    phoneNumber: "+380 50 345 67 89",
    isVerified: false,
    avatarUrl: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "u4",
    username: "Оксана",
    email: "oksana@example.com",
    type: "Rieltor",
    phoneNumber: "+380 73 456 78 90",
    isVerified: true,
    avatarUrl: "https://i.pravatar.cc/40?img=9",
  },
  {
    id: "u5",
    username: "Тарас",
    email: "taras@example.com",
    type: "Owner",
    phoneNumber: "+380 99 567 89 01",
    isVerified: true,
    avatarUrl: "https://i.pravatar.cc/40?img=7",
  },
];
