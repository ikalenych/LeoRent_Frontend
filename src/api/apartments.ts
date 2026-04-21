const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders(): HeadersInit {
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
  owner: string;
  main_picture: string | null;
}

export interface BackendApartmentFull {
  id_: string;
  title: string;
  description: string | null;
  location: string;
  district: string;
  cost: number;
  rent_type: string;
  is_deleted: boolean;
  rooms: number;
  square: number;
  floor: number;
  floor_in_house: number;
  details: Record<string, number> | null;
  type_: string;
  renovation_type: string;
  main_picture: string[];
  pictures: { id_: string; url: string; metadata_: unknown }[];
  owner: string;
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

export async function fetchApartments(): Promise<BackendApartmentPreview[]> {
  const res = await fetch(`${API_URL}/apartment/`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Не вдалося завантажити оголошення");
  const data = await res.json();
  return data.apartments ?? [];
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

export async function fetchUserById(id: string): Promise<BackendUser> {
  const res = await fetch(`${API_URL}/users/${id}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Користувача не знайдено");
  return res.json();
}

export async function toggleApartmentLike(id: string): Promise<void> {
  await fetch(`${API_URL}/apartment/${id}/like`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
}
