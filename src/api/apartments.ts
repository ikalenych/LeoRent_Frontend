const API_URL = import.meta.env.VITE_API_URL as string;

function getToken() {
  return localStorage.getItem("token");
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface BackendApartmentPreview {
  id_: string;
  title: string;
  cost: number;
  rent_type: "DEFAULT" | "DAILY";
  rooms: number;
  square: number;
  floor: number;
  floor_in_house: number;
  type_: string;
  renovation_type: string;
  location: string;
  district: string;
  is_liked_by_current_user: boolean;
  owner_type: string;
  pictures: { id_: string; url: string }[];
  picture: string | null;
}

export interface BackendApartmentListResponse {
  apartments: BackendApartmentPreview[];
  total: number;
  page: number;
  page_size: number;
}

export interface BackendApartmentFull {
  id_: string;
  title: string;
  description: string | null;
  location: string;
  district: string;
  cost: number;
  rent_type: string;
  rooms: number;
  square: number;
  floor: number;
  floor_in_house: number;
  details: Record<string, unknown> | null;
  type_: string;
  renovation_type: string;
  pictures: { id_: string; url: string; metadata_: unknown }[];
  owner_type: string;
  owner_info: {
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    email: string;
    is_verified: boolean;
  };
}

export interface BackendUser {
  id_: string;
  username: string | null;
  email: string;
  type_: "AGENT" | "OWNER" | "DEFAULT";
  phone_number: string | null;
  is_verified: boolean;
  first_name: string | null;
  last_name: string | null;
}

/* -------------------- NORMAL APARTMENTS -------------------- */

export async function fetchApartments(): Promise<BackendApartmentListResponse> {
  const res = await fetch(`${API_URL}/apartment/`, {
    headers: { ...authHeaders() },
  });

  if (!res.ok) throw new Error("Не вдалося завантажити оголошення");

  return res.json();
}

export async function fetchApartmentById(
  id: string,
): Promise<BackendApartmentFull> {
  const res = await fetch(`${API_URL}/apartment/${id}`, {
    headers: { ...authHeaders() },
  });

  if (!res.ok) throw new Error("Квартиру не знайдено");

  return res.json();
}

export async function toggleApartmentLike(id: string): Promise<void> {
  await fetch(`${API_URL}/apartment/${id}/like`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
}

/* -------------------- 🔥 AI GROQ SEARCH (UPDATED) -------------------- */

export async function aiSearchApartments(
  prompt: string,
  page = 1,
  size = 6,
  token?: string,
): Promise<BackendApartmentListResponse> {
  const params = new URLSearchParams({
    prompt,
    page: String(page),
    size: String(size),
  });

  const headers: Record<string, string> = {};

  const authToken = token ?? getToken();
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(
    `${API_URL}/filter/ai-prompt/groq?${params.toString()}`,
    {
      method: "GET",
      headers,
    },
  );

  if (res.status === 429) {
    const retryAfter = res.headers.get("retry-after") || "120";
    throw new Error(`AI недоступний (ліміт). Спробуй через ${retryAfter}с`);
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "AI Groq пошук не спрацював");
  }

  return res.json();
}