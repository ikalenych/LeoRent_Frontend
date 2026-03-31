import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import {
  amenitiesOptions,
  buildingTypeOptions,
  districtOptions,
  minTermOptions,
  rentTypeOptions,
  repairOptions,
  roomOptions,
} from "../../constants/listing";
import {
  ListingAmenitiesSection,
  ListingDescriptionSection,
  ListingLocationSection,
  ListingPricingSection,
  ListingPropertyDetailsSection,
  ListingRentTypeSwitch,
} from "./ListingStepSections";
import {
  validateListingStepOne,
  type ListingStepOneErrors,
} from "./listingStepOneValidation";

export type ListingStepOneData = {
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
  amenities: string[];
};

type CreateListingStepOneProps = {
  onNext: () => void;
  formData: ListingStepOneData;
  onChange: (data: Partial<ListingStepOneData>) => void;
};

export function CreateListingStepOne({
  onNext,
  formData,
  onChange,
}: CreateListingStepOneProps) {
  const [errors, setErrors] = useState<ListingStepOneErrors>({});

  function toggleAmenity(value: string) {
    const nextAmenities = formData.amenities.includes(value)
      ? formData.amenities.filter((item) => item !== value)
      : [...formData.amenities, value];

    onChange({ amenities: nextAmenities });
  }

  function handleNext() {
    const validationErrors = validateListingStepOne({
      address: formData.address,
      district: formData.district,
      title: formData.title,
      description: formData.description,
      rentType: formData.rentType,
      rooms: formData.rooms,
      area: formData.area,
      floor: formData.floor,
      totalFloors: formData.totalFloors,
      buildingType: formData.buildingType,
      repair: formData.repair,
      price: formData.price,
      minTerm: formData.minTerm,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onNext?.();
  }

  return (
    <section className="bg-page pb-8 font-display">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-6">
          <ListingLocationSection
            address={formData.address}
            setAddress={(value) => onChange({ address: value })}
            selectedDistrict={formData.district}
            setSelectedDistrict={(value) => onChange({ district: value })}
            districtOptions={districtOptions}
            errors={errors}
          />

          <ListingDescriptionSection
            title={formData.title}
            setTitle={(value) => onChange({ title: value })}
            description={formData.description}
            setDescription={(value) => onChange({ description: value })}
            errors={errors}
          />

          <ListingRentTypeSwitch
            selectedRentType={formData.rentType}
            setSelectedRentType={(value) => onChange({ rentType: value })}
            rentTypeOptions={rentTypeOptions}
            error={errors.rentType}
          />
        </div>

        <div className="space-y-6">
          <ListingPropertyDetailsSection
            selectedRooms={formData.rooms}
            setSelectedRooms={(value) => onChange({ rooms: value })}
            selectedBuildingType={formData.buildingType}
            setSelectedBuildingType={(value) =>
              onChange({ buildingType: value })
            }
            selectedRepair={formData.repair}
            setSelectedRepair={(value) => onChange({ repair: value })}
            roomOptions={roomOptions}
            buildingTypeOptions={buildingTypeOptions}
            repairOptions={repairOptions}
            area={formData.area}
            setArea={(value) => onChange({ area: value })}
            floor={formData.floor}
            setFloor={(value) => onChange({ floor: value })}
            totalFloors={formData.totalFloors}
            setTotalFloors={(value) => onChange({ totalFloors: value })}
            errors={errors}
          />

          <ListingAmenitiesSection
            selectedAmenities={formData.amenities}
            toggleAmenity={toggleAmenity}
            amenitiesOptions={amenitiesOptions}
          />

          <ListingPricingSection
            selectedMinTerm={formData.minTerm}
            setSelectedMinTerm={(value) => onChange({ minTerm: value })}
            minTermOptions={minTermOptions}
            price={formData.price}
            setPrice={(value) => onChange({ price: value })}
            errors={errors}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="min-w-40 font-display"
              onClick={handleNext}
            >
              <span className="flex items-center gap-2">
                Далі
                <ArrowRight size={18} strokeWidth={2} />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
