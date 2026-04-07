type ApiErrorPayload = {
  detail?: string | Array<{ msg?: string }>;
  message?: string;
};

export const AUTH_ERRORS_UA: Record<string, string> = {
  "No authentication token provided": "Будь ласка, увійдіть в акаунт.",
  "Invalid authentication token": "Ваша сесія застаріла. Увійдіть знову.",
  "Authentication failed": "Помилка авторизації. Спробуйте пізніше.",
  "Firebase service not available":
    "Сервіс авторизації тимчасово недоступний. Спробуйте пізніше.",
  "Invalid token: missing UID":
    "Помилка даних профілю. Зверніться в підтримку.",
  "User not found and creation failed":
    "Не вдалося створити профіль користувача. Спробуйте пізніше.",
  "Invalid credentials": "Невірна пошта або пароль.",
  "User with duplicate fields": "Користувач з такими даними вже існує.",
};

export const HTTP_STATUS_ERRORS_UA: Record<number, string> = {
  400: "Некоректний запит. Перевірте введені дані.",
  401: "Потрібно увійти в акаунт.",
  403: "У вас немає доступу до цієї дії.",
  404: "Нічого не знайдено.",
  409: "Такий запис уже існує.",
  422: "Перевірте правильність заповнених полів.",
  429: "Забагато спроб. Спробуйте трохи пізніше.",
  500: "Помилка сервера. Спробуйте пізніше.",
  502: "Сервер тимчасово недоступний.",
  503: "Сервіс тимчасово недоступний. Спробуйте пізніше.",
};

function extractErrorText(data: ApiErrorPayload | null | undefined): string {
  if (!data) return "";

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item) => item?.msg)
      .filter(Boolean)
      .join(", ");
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  return "";
}

export function mapApiErrorToUaMessage(
  status?: number,
  data?: ApiErrorPayload | null,
  fallback = "Сталася помилка. Спробуйте пізніше.",
) {
  const rawText = extractErrorText(data);

  if (rawText && AUTH_ERRORS_UA[rawText]) {
    return AUTH_ERRORS_UA[rawText];
  }

  if (status && HTTP_STATUS_ERRORS_UA[status]) {
    return HTTP_STATUS_ERRORS_UA[status];
  }

  if (rawText) {
    return rawText;
  }

  return fallback;
}
