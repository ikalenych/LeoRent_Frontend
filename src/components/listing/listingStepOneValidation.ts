import { districtOptions } from "../../constants/listing";

export type ListingStepOneFormData = {
  address: string;
  district: string;
  title: string;
  description: string;
  rentType: string;
  rooms: string;
  area: string;
  floor: string;
  totalFloors: string;
  buildingType: string;
  repair: string;
  price: string;
  minTerm: string;
};

export type ListingStepOneErrors = Partial<
  Record<keyof ListingStepOneFormData, string>
>;

function hasInvalidAddressPart(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  if (normalized.includes("львів")) return true;
  return districtOptions.some((district) =>
    normalized.includes(district.toLowerCase()),
  );
}

function isValidStreetAddress(value: string) {
  const normalized = value.trim();
  if (!normalized) return false;

  if (hasInvalidAddressPart(normalized)) {
    return false;
  }

  const houseMatch = normalized.match(/\b(\d{1,4}[\p{L}\-\/\d]*)\b/u);
  if (!houseMatch) return false;

  if (/\b\d{5,}\b/.test(normalized)) {
    return false;
  }

  const streetPart = normalized
    .replace(houseMatch[0], "")
    .replace(
      /\bвул\.?\b|\bвулиця\b|\bпросп\.?\b|\bпроспект\b|\bпл\.?\b|\bплоща\b|\bбульв\.?\b|\bбульвар\b|\bшосе\b|\bпров\.?\b|\bпровулок\b/giu,
      "",
    )
    .trim();

  return streetPart.length >= 3;
}

export async function validateLvivStreetAddress(
  address: string,
): Promise<boolean> {
  const normalized = address.trim();
  if (!normalized) return false;

  const query = encodeURIComponent(`${normalized}, Львів, Україна`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=ua&bounded=1&viewbox=23.90,49.92,24.18,49.77`;

  try {
    const response = await fetch(url, {
      headers: { "Accept-Language": "uk" },
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return false;

    const item = data[0];
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) return false;

    return lat >= 49.77 && lat <= 49.92 && lon >= 23.9 && lon <= 24.18;
  } catch {
    return false;
  }
}

export function validateListingStepOne(
  formData: ListingStepOneFormData,
): ListingStepOneErrors {
  const errors: ListingStepOneErrors = {};

  if (!formData.address.trim()) {
    errors.address = "Введіть адресу об'єкта";
  } else if (!isValidStreetAddress(formData.address)) {
    errors.address =
      "Введіть правильну адресу у форматі: вулиця (без слова Львів) та номер будинку";
  }

  if (!formData.district.trim()) {
    errors.district = "Оберіть район";
  }

  if (!formData.title.trim()) {
    errors.title = "Введіть назву оголошення";
  } else if (formData.title.trim().length < 10) {
    errors.title = "Назва має містити щонайменше 10 символів";
  }

  if (!formData.description.trim()) {
    errors.description = "Додайте опис житла";
  } else if (formData.description.trim().length < 30) {
    errors.description = "Опис має містити щонайменше 30 символів";
  }

  if (!formData.rentType.trim()) {
    errors.rentType = "Оберіть тип оренди";
  }

  if (!formData.rooms.trim()) {
    errors.rooms = "Оберіть кількість кімнат";
  } else if (/^[0-9]+$/.test(formData.rooms.trim())) {
    const rooms = Number(formData.rooms);
    if (rooms > 12) {
      errors.rooms = "Максимальна кількість кімнат 12";
    }
  }

  if (!formData.area.trim()) {
    errors.area = "Вкажіть площу";
  } else if (!/^[0-9]+$/.test(formData.area.trim())) {
    errors.area = "Площа має містити лише цифри";
  } else if (Number(formData.area) <= 0) {
    errors.area = "Площа має бути більшою за 0";
  } else if (Number(formData.area) > 750) {
    errors.area = "Максимальна площа 750 м²";
  }

  if (!formData.floor.trim()) {
    errors.floor = "Вкажіть поверх";
  } else if (!/^[0-9]+$/.test(formData.floor.trim())) {
    errors.floor = "Поверх має містити лише цифри";
  } else if (Number(formData.floor) <= 0) {
    errors.floor = "Поверх має бути більшим за 0";
  } else if (Number(formData.floor) > 100) {
    errors.floor = "Максимальний поверх 100";
  }

  if (!formData.totalFloors.trim()) {
    errors.totalFloors = "Вкажіть загальну кількість поверхів";
  } else if (!/^[0-9]+$/.test(formData.totalFloors.trim())) {
    errors.totalFloors = "Кількість поверхів має містити лише цифри";
  } else if (Number(formData.totalFloors) <= 0) {
    errors.totalFloors = "Кількість поверхів має бути більшою за 0";
  } else if (Number(formData.totalFloors) > 100) {
    errors.totalFloors = "Максимальна кількість поверхів 100";
  }

  if (
    /^[0-9]+$/.test(formData.floor.trim()) &&
    /^[0-9]+$/.test(formData.totalFloors.trim())
  ) {
    const floor = Number(formData.floor);
    const totalFloors = Number(formData.totalFloors);

    if (floor > totalFloors) {
      errors.floor =
        "Поверх не може бути більшим за загальну кількість поверхів";
    }
  }

  if (!formData.buildingType.trim()) {
    errors.buildingType = "Оберіть тип будинку";
  }

  if (!formData.repair.trim()) {
    errors.repair = "Оберіть стан ремонту";
  }

  if (!formData.price.trim()) {
    errors.price = "Вкажіть ціну";
  } else if (!/^[0-9]+$/.test(formData.price.trim())) {
    errors.price = "Ціна має містити лише цифри";
  } else if (Number(formData.price) <= 0) {
    errors.price = "Ціна має бути більшою за 0";
  }

  if (formData.rentType !== "Подобова оренда" && !formData.minTerm.trim()) {
    errors.minTerm = "Оберіть мінімальний термін";
  }

  return errors;
}
