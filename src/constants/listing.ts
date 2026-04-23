export const roomOptions = ["1", "2", "3", "4+"];

export const buildingTypeOptions = ["Панельний", "Цегляний", "Монолітний"];

export const repairOptions = ["Євроремонт", "Косметичний", "Без ремонту"];

export const amenitiesOptions = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "parking", label: "Паркінг" },
  { value: "balcony", label: "Балкон" },
  { value: "elevator", label: "Ліфт" },
  { value: "furniture", label: "Меблі" },
  { value: "washing_machine", label: "Пральна машина" },
  { value: "conditioner", label: "Кондиціонер" },
  { value: "animals", label: "Тварини дозволені" },
] as const;

export const rentTypeOptions = ["Тривала оренда", "Подобова оренда"];

export const districtOptions = [
  "Галицький",
  "Залізничний",
  "Личаківський",
  "Сихівський",
  "Франківський",
  "Шевченківський",
];

export const minTermOptions = [
  "1 місяць",
  "3 місяці",
  "6 місяців",
  "12 місяців",
];
