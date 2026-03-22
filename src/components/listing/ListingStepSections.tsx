import { Building2, CheckCheck, FileText, MapPin, Wallet } from "lucide-react";
import {
  BaseInput,
  CheckboxItem,
  ChipButton,
  CustomSelect,
  FieldLabel,
  SectionCard,
  SectionTitle,
  ToggleButton,
} from "../ui/listing-form/FormControls";

type LocationSectionProps = {
  selectedDistrict: string;
  setSelectedDistrict: (value: string) => void;
  districtOptions: string[];
};

export function ListingLocationSection({
  selectedDistrict,
  setSelectedDistrict,
  districtOptions,
}: LocationSectionProps) {
  return (
    <SectionCard>
      <SectionTitle
        icon={<MapPin size={22} strokeWidth={2} />}
        title="Розташування"
      />

      <div className="space-y-5">
        <div>
          <FieldLabel htmlFor="address">Адреса об'єкта</FieldLabel>
          <BaseInput id="address" placeholder="Наприклад: вул. Шевченка, 12" />
        </div>

        <div>
          <FieldLabel htmlFor="district">Район</FieldLabel>
          <CustomSelect
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            options={districtOptions}
            placeholder="Оберіть район"
          />
        </div>
      </div>
    </SectionCard>
  );
}

type DescriptionSectionProps = {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
};

export function ListingDescriptionSection({
  title,
  setTitle,
  description,
  setDescription,
}: DescriptionSectionProps) {
  return (
    <SectionCard>
      <SectionTitle
        icon={<FileText size={22} strokeWidth={2} />}
        title="Опис"
      />

      <div className="space-y-4">
        <div>
          <FieldLabel htmlFor="title">Назва оголошення</FieldLabel>
          <BaseInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="3-кімнатна квартира на Сихові"
          />
        </div>

        <div>
          <FieldLabel htmlFor="description">Опис житла</FieldLabel>

          <textarea
            id="description"
            rows={5}
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Розкажіть про особливості житла, ремонт, меблі, розташування та умови проживання..."
            className="min-h-33 w-full resize-none rounded-2xl border border-black/10 bg-surface px-4 py-4 text-[16px] font-display text-text-title outline-none transition placeholder:text-[14px] placeholder:text-text-description/60 hover:border-black/20 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:placeholder:text-[16px]"
          />

          <div className="mt-2 text-[13px] text-text-description/60">
            {description.length}/2000
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

type RentTypeSwitchProps = {
  selectedRentType: string;
  setSelectedRentType: (value: string) => void;
  rentTypeOptions: string[];
};

export function ListingRentTypeSwitch({
  selectedRentType,
  setSelectedRentType,
  rentTypeOptions,
}: RentTypeSwitchProps) {
  return (
    <div className="rounded-3xl bg-surface p-2 shadow-[0_8px_24px_rgba(15,23,41,0.06)]">
      <div className="grid grid-cols-2 gap-2">
        {rentTypeOptions.map((option: string) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelectedRentType(option)}
            className={`h-14 rounded-[18px] text-[15px] font-semibold transition ${
              selectedRentType === option
                ? "bg-text-title text-surface"
                : "bg-surface text-text-description hover:text-text-title"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

type PropertyDetailsSectionProps = {
  selectedRooms: string;
  setSelectedRooms: (value: string) => void;
  selectedBuildingType: string;
  setSelectedBuildingType: (value: string) => void;
  selectedRepair: string;
  setSelectedRepair: (value: string) => void;
  roomOptions: string[];
  buildingTypeOptions: string[];
  repairOptions: string[];
};

export function ListingPropertyDetailsSection({
  selectedRooms,
  setSelectedRooms,
  selectedBuildingType,
  setSelectedBuildingType,
  selectedRepair,
  setSelectedRepair,
  roomOptions,
  buildingTypeOptions,
  repairOptions,
}: PropertyDetailsSectionProps) {
  return (
    <SectionCard>
      <SectionTitle
        icon={<Building2 size={22} strokeWidth={2} />}
        title="Параметри нерухомості"
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="mb-3 text-[14px] font-medium text-text-description">
              Кількість кімнат
            </p>

            <div className="flex flex-wrap gap-3">
              {roomOptions.map((option: string) => (
                <ChipButton
                  key={option}
                  label={option}
                  active={selectedRooms === option}
                  onClick={() => setSelectedRooms(option)}
                />
              ))}
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="area">Загальна площа (м²)</FieldLabel>
            <BaseInput id="area" placeholder="Наприклад: 65" />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="floor">Поверх / Усього поверхів</FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            <BaseInput id="floor" placeholder="Поверх" />
            <BaseInput id="total-floors" placeholder="Всього" />
          </div>
        </div>

        <div>
          <p className="mb-3 text-[14px] font-medium text-text-description">
            Тип будинку
          </p>

          <div className="flex flex-wrap gap-3">
            {buildingTypeOptions.map((option: string) => (
              <ToggleButton
                key={option}
                label={option}
                active={selectedBuildingType === option}
                dark
                onClick={() => setSelectedBuildingType(option)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[14px] font-medium text-text-description">
            Стан ремонту
          </p>

          <div className="flex flex-wrap gap-3">
            {repairOptions.map((option: string) => (
              <ToggleButton
                key={option}
                label={option}
                active={selectedRepair === option}
                onClick={() => setSelectedRepair(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

type AmenitiesSectionProps = {
  selectedAmenities: string[];
  toggleAmenity: (value: string) => void;
  amenitiesOptions: string[];
};

export function ListingAmenitiesSection({
  selectedAmenities,
  toggleAmenity,
  amenitiesOptions,
}: AmenitiesSectionProps) {
  return (
    <SectionCard>
      <SectionTitle
        icon={<CheckCheck size={22} strokeWidth={2} />}
        title="Зручності та умови"
      />

      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
        {amenitiesOptions.map((item: string) => (
          <CheckboxItem
            key={item}
            label={item}
            checked={selectedAmenities.includes(item)}
            onChange={() => toggleAmenity(item)}
          />
        ))}
      </div>
    </SectionCard>
  );
}

type PricingSectionProps = {
  selectedMinTerm: string;
  setSelectedMinTerm: (value: string) => void;
  minTermOptions: string[];
};

export function ListingPricingSection({
  selectedMinTerm,
  setSelectedMinTerm,
  minTermOptions,
}: PricingSectionProps) {
  return (
    <SectionCard dark>
      <SectionTitle
        icon={<Wallet size={22} strokeWidth={2} />}
        title="Ціна та умови"
        light
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FieldLabel htmlFor="price" light>
            Ціна / місяць
          </FieldLabel>

          <div className="relative">
            <BaseInput id="price" placeholder="Введіть суму" dark />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-white/45">
              грн
            </span>
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="min-term" light>
            Мін. термін
          </FieldLabel>

          <CustomSelect
            value={selectedMinTerm}
            onChange={setSelectedMinTerm}
            options={minTermOptions}
            placeholder="Оберіть термін"
            dark
          />
        </div>
      </div>
    </SectionCard>
  );
}
