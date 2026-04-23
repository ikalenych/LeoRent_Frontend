import { useAuth } from "../context/AuthContext";
import UserProfileLayout from "../components/cabinet/UserProfileLayout";

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

  const savedListings = [
    {
      id: "1",
      title: "2-к квартира, Центр",
      location: "вул. Галицька",
      district: "Центр",
      cost: 22500,
      rooms: 2,
      square: 54,
      floor: 3,
      floorInHouse: 5,
      ownerType: "Owner" as const,
      rentType: "Monthly" as const,
      photos: [
        {
          url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    {
      id: "2",
      title: "1-к квартира",
      location: "пр. Чорновола",
      district: "Замарстинів",
      cost: 18000,
      rooms: 1,
      square: 38,
      floor: 8,
      floorInHouse: 12,
      ownerType: "Rieltor" as const,
      rentType: "Monthly" as const,
      photos: [
        {
          url: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
  ];

  const ownerListings = [
    {
      id: "101",
      title: "2-к Квартира, Центр",
      address: "вул. Галицька, 14",
      district: "Галицький",
      price: 22500,
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "102",
      title: "1-к Квартира, Стрийська",
      address: "вул. Стрийська, 45",
      district: "Сихівський",
      price: 14000,
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=400&auto=format&fit=crop",
    },
  ];

  const user = {
    fullName: getFullName(storedUser),
    email: storedUser?.email ?? "Немає email",
    role: mapUserTypeToProfileRole(storedUser?.user_type),
    roleLabel: mapUserTypeToRoleLabel(storedUser?.user_type),
  };

  return (
    <UserProfileLayout
      user={user}
      savedListings={savedListings}
      ownerListings={ownerListings}
    />
  );
}
