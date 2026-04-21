import UserProfileLayout from "../components/cabinet/UserProfileLayout";

export default function Profile() {
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
    {
      id: "3",
      title: "1-к квартира",
      location: "вул. Коновальця",
      district: "Франківський",
      cost: 15500,
      rooms: 1,
      square: 42,
      floor: 2,
      floorInHouse: 4,
      ownerType: "Owner" as const,
      rentType: "Monthly" as const,
      photos: [
        {
          url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    {
      id: "4",
      title: "2-к квартира, Новобудова",
      location: "вул. Наукова",
      district: "Франківський",
      cost: 21000,
      rooms: 2,
      square: 61,
      floor: 6,
      floorInHouse: 10,
      ownerType: "Rieltor" as const,
      rentType: "Monthly" as const,
      photos: [
        {
          url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    {
      id: "5",
      title: "1-к квартира біля парку",
      location: "вул. Стрийська",
      district: "Сихівський",
      cost: 14000,
      rooms: 1,
      square: 35,
      floor: 4,
      floorInHouse: 9,
      ownerType: "Owner" as const,
      rentType: "Monthly" as const,
      photos: [
        {
          url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    {
      id: "6",
      title: "3-к квартира",
      location: "вул. Зелена",
      district: "Личаківський",
      cost: 26000,
      rooms: 3,
      square: 74,
      floor: 7,
      floorInHouse: 9,
      ownerType: "Rieltor" as const,
      rentType: "Monthly" as const,
      photos: [
        {
          url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    {
      id: "7",
      title: "3-к квартира",
      location: "вул. Зелена",
      district: "Личаківський",
      cost: 26000,
      rooms: 3,
      square: 74,
      floor: 7,
      floorInHouse: 9,
      ownerType: "Rieltor" as const,
      rentType: "Monthly" as const,
      photos: [
        {
          url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    {
      id: "8",
      title: "3-к квартира",
      location: "вул. Зелена",
      district: "Личаківський",
      cost: 26000,
      rooms: 3,
      square: 74,
      floor: 7,
      floorInHouse: 9,
      ownerType: "Rieltor" as const,
      rentType: "Monthly" as const,
      photos: [
        {
          url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
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
      status: "active" as const,
      views: 1248,
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "102",
      title: "1-к Квартира, Стрийська",
      address: "вул. Стрийська, 45",
      district: "Сихівський",
      price: 14000,
      status: "archived" as const,
      views: 452,
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "103",
      title: "1-к Квартира, Стрийська",
      address: "вул. Стрийська, 45",
      district: "Сихівський",
      price: 14500,
      status: "archived" as const,
      views: 452,
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=400&auto=format&fit=crop",
    },
  ];

  const user = {
    fullName: "Олександр Левченко",
    email: "o.levchenko@orendalviv.ua",
    role: "Rieltor" as const,
    roleLabel: "Ріелтор",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  };

  return (
    <UserProfileLayout
      user={user}
      savedListings={savedListings}
      ownerListings={ownerListings}
    />
  );
}
