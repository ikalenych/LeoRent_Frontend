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

function isPositiveNumber(value: string) {
  if (!value.trim()) return false;
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const number = Number(normalized);
  return !Number.isNaN(number) && number > 0;
}

function isPositiveInteger(value: string) {
  if (!value.trim()) return false;
  const normalized = value.replace(/\s/g, "");
  const number = Number(normalized);
  return Number.isInteger(number) && number > 0;
}

export function validateListingStepOne(
  formData: ListingStepOneFormData,
): ListingStepOneErrors {
  const errors: ListingStepOneErrors = {};

  if (!formData.address.trim()) {
    errors.address = "Введіть адресу об'єкта";
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
  }

  if (!isPositiveNumber(formData.area)) {
    errors.area = "Вкажіть коректну площу";
  }

  if (!isPositiveInteger(formData.floor)) {
    errors.floor = "Вкажіть коректний поверх";
  }

  if (!isPositiveInteger(formData.totalFloors)) {
    errors.totalFloors = "Вкажіть загальну кількість поверхів";
  }

  if (
    isPositiveInteger(formData.floor) &&
    isPositiveInteger(formData.totalFloors)
  ) {
    const floor = Number(formData.floor);
    const totalFloors = Number(formData.totalFloors);

    if (floor > totalFloors) {
      errors.floor = "Поверх не може бути більшим за кількість поверхів";
    }
  }

  if (!formData.buildingType.trim()) {
    errors.buildingType = "Оберіть тип будинку";
  }

  if (!formData.repair.trim()) {
    errors.repair = "Оберіть стан ремонту";
  }

  if (!isPositiveNumber(formData.price)) {
    errors.price = "Вкажіть коректну ціну";
  }

  if (formData.rentType !== "Подобова оренда" && !formData.minTerm.trim()) {
    errors.minTerm = "Оберіть мінімальний термін";
  }

  return errors;
}
