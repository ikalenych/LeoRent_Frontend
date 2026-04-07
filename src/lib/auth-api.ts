const API_URL = "https://leorent-backend.onrender.com";

type ApiErrorDetailItem = {
  msg?: string;
  loc?: Array<string | number>;
};

export type FirebaseAuthPayload = {
  id_token: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: "AGENT" | "OWNER" | "DEFAULT";
};

function getErrorMessage(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "detail" in data &&
    typeof (data as { detail?: unknown }).detail === "string"
  ) {
    return (data as { detail: string }).detail;
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "detail" in data &&
    Array.isArray((data as { detail?: unknown[] }).detail)
  ) {
    return (
      ((data as { detail: ApiErrorDetailItem[] }).detail || [])
        .map((item) => {
          const field = Array.isArray(item?.loc)
            ? item.loc[item.loc.length - 1]
            : undefined;

          return field
            ? `${String(field)}: ${item?.msg || "Invalid"}`
            : item?.msg;
        })
        .filter(Boolean)
        .join(", ") || fallback
    );
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    return (data as { message: string }).message;
  }

  return fallback;
}

export async function firebaseAuthRequest(payload: FirebaseAuthPayload) {
  const response = await fetch(`${API_URL}/users/firebase-auth/v1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося увійти в акаунт"));
  }

  return data;
}

export async function firebaseSignupRequest(idToken: string) {
  const response = await fetch(`${API_URL}/firebase/signup`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити акаунт"));
  }

  return data;
}

export function persistAuth(data: unknown, fallbackIdToken?: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "access_token" in data &&
    typeof (data as { access_token?: unknown }).access_token === "string"
  ) {
    localStorage.setItem(
      "token",
      (data as { access_token: string }).access_token,
    );
  } else if (fallbackIdToken) {
    localStorage.setItem("token", fallbackIdToken);
  }

  if (typeof data === "object" && data !== null && "user" in data) {
    localStorage.setItem(
      "user",
      JSON.stringify((data as { user: unknown }).user),
    );
  }
}
