import { createContext, useContext, useState } from "react";

interface LikedContextType {
  liked: Set<string>;
  toggleLike: (id: string) => void;
}

const LikedContext = createContext<LikedContextType | null>(null);

export function LikedProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <LikedContext.Provider value={{ liked, toggleLike }}>
      {children}
    </LikedContext.Provider>
  );
}

export function useLiked() {
  const ctx = useContext(LikedContext);
  if (!ctx) throw new Error("useLiked must be used within LikedProvider");
  return ctx;
}
