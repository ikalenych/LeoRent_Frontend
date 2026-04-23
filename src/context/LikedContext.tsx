import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

type LikedApiPicture = {
  url?: string;
};

type LikedApiApartment = {
  id_: string;
  title?: string;
  description?: string;
  location?: string;
  district?: string | null;
  cost?: number;
  rooms?: number;
  square?: number;
  floor?: number;
  floor_in_house?: number;
  pictures?: LikedApiPicture[];
  owner_type?: "Rieltor" | "Owner";
  rent_type?: "Daily" | "Default";
  owner_id?: string;
};

type LikedApiResponse = {
  apartments: LikedApiApartment[];
};

interface LikedContextType {
  liked: Set<string>;
  likedApartmentsRaw: LikedApiApartment[];
  toggleLike: (id: string) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isLikedLoading: boolean;
}

const LikedContext = createContext<LikedContextType | null>(null);

export function LikedProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useState<Set<string>>(new Set<string>());
  const [likedApartmentsRaw, setLikedApartmentsRaw] = useState<
    LikedApiApartment[]
  >([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLikedLoading, setIsLikedLoading] = useState(false);

  const { token, isAuthenticated } = useAuth();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  useEffect(() => {
    const fetchLikedApartments = async () => {
      if (!isAuthenticated || !token) {
        setLiked(new Set<string>());
        setLikedApartmentsRaw([]);
        return;
      }

      try {
        setIsLikedLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/apartment/liked/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch liked apartments");
        }

        const data: LikedApiResponse = await res.json();
        const apartments = Array.isArray(data.apartments)
          ? data.apartments
          : [];

        setLiked(new Set<string>(apartments.map((item) => String(item.id_))));
        setLikedApartmentsRaw(apartments);
      } catch (error) {
        console.error("Failed to load liked apartments:", error);
        setLiked(new Set<string>());
        setLikedApartmentsRaw([]);
      } finally {
        setIsLikedLoading(false);
      }
    };

    void fetchLikedApartments();
  }, [token, isAuthenticated]);

  const toggleLike = async (id: string) => {
    if (!isAuthenticated || !token) {
      openAuthModal();
      return;
    }

    const prevLiked = new Set<string>(liked);
    const prevRaw = [...likedApartmentsRaw];

    setLiked((prev) => {
      const next = new Set<string>(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

    setLikedApartmentsRaw((prev) =>
      prev.filter((apartment) => String(apartment.id_) !== id),
    );

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/apartment/${id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to toggle like");
      }

      const refreshRes = await fetch(
        `${import.meta.env.VITE_API_URL}/apartment/liked/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!refreshRes.ok) {
        throw new Error("Failed to refresh liked apartments");
      }

      const refreshData: LikedApiResponse = await refreshRes.json();
      const apartments = Array.isArray(refreshData.apartments)
        ? refreshData.apartments
        : [];

      setLiked(new Set<string>(apartments.map((item) => String(item.id_))));
      setLikedApartmentsRaw(apartments);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setLiked(prevLiked);
      setLikedApartmentsRaw(prevRaw);
    }
  };

  return (
    <LikedContext.Provider
      value={{
        liked,
        likedApartmentsRaw,
        toggleLike,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isLikedLoading,
      }}
    >
      {children}
    </LikedContext.Provider>
  );
}

export function useLiked() {
  const ctx = useContext(LikedContext);

  if (!ctx) {
    throw new Error("useLiked must be used within LikedProvider");
  }

  return ctx;
}
