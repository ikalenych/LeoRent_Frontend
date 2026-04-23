import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAuth } from "firebase/auth";
import { clearAuth, persistAuth } from "../lib/auth-api";

type AuthUser = {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  user_type?: "OWNER" | "AGENT" | "DEFAULT";
  [key: string]: unknown;
};

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: unknown, fallbackIdToken?: string) => void;
  logout: () => void;
  getFreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function parseStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => parseStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const isAuthenticated = Boolean(user && token);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === "token" || event.key === "user") {
        setUser(parseStoredUser());
        setToken(getStoredToken());
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function login(data: unknown, fallbackIdToken?: string) {
    persistAuth(data, fallbackIdToken);
    setUser(parseStoredUser());
    setToken(getStoredToken());
  }

  function logout() {
    clearAuth();
    setUser(null);
    setToken(null);
  }

  async function getFreshToken(): Promise<string | null> {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const freshToken = await currentUser.getIdToken(true);

      localStorage.setItem("token", freshToken);
      setToken(freshToken);

      return freshToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated, login, logout, getFreshToken }),
    [user, token, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
