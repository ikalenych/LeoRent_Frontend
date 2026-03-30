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

type CreateListingStepOneProps = {
  onNext: () => void;
};

export function CreateListingStepOne({ onNext }: CreateListingStepOneProps) {
  const [address, setAddress] = useState("");
  const [selectedRooms, setSelectedRooms] = useState("");
  const [selectedBuildingType, setSelectedBuildingType] = useState("");
  const [selectedRepair, setSelectedRepair] = useState("");
  const [selectedRentType, setSelectedRentType] = useState(rentTypeOptions[0]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMinTerm, setSelectedMinTerm] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [floor, setFloor] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState<ListingStepOneErrors>({});

  function toggleAmenity(value: string) {
    setSelectedAmenities((prev: string[]) =>
      prev.includes(value)
        ? prev.filter((item: string) => item !== value)
        : [...prev, value],
    );
  }

  function handleNext() {
    const validationErrors = validateListingStepOne({
      address,
      district: selectedDistrict,
      title,
      description,
      rentType: selectedRentType,
      rooms: selectedRooms,
      area,
      floor,
      totalFloors,
      buildingType: selectedBuildingType,
      repair: selectedRepair,
      price,
      minTerm: selectedMinTerm,
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
            address={address}
            setAddress={setAddress}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            districtOptions={districtOptions}
            errors={errors}
          />

          <ListingDescriptionSection
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            errors={errors}
          />

          <ListingRentTypeSwitch
            selectedRentType={selectedRentType}
            setSelectedRentType={setSelectedRentType}
            rentTypeOptions={rentTypeOptions}
            error={errors.rentType}
          />
        </div>

        <div className="space-y-6">
          <ListingPropertyDetailsSection
            selectedRooms={selectedRooms}
            setSelectedRooms={setSelectedRooms}
            selectedBuildingType={selectedBuildingType}
            setSelectedBuildingType={setSelectedBuildingType}
            selectedRepair={selectedRepair}
            setSelectedRepair={setSelectedRepair}
            roomOptions={roomOptions}
            buildingTypeOptions={buildingTypeOptions}
            repairOptions={repairOptions}
            area={area}
            setArea={setArea}
            floor={floor}
            setFloor={setFloor}
            totalFloors={totalFloors}
            setTotalFloors={setTotalFloors}
            errors={errors}
          />

          <ListingAmenitiesSection
            selectedAmenities={selectedAmenities}
            toggleAmenity={toggleAmenity}
            amenitiesOptions={amenitiesOptions}
          />

          <ListingPricingSection
            selectedMinTerm={selectedMinTerm}
            setSelectedMinTerm={setSelectedMinTerm}
            minTermOptions={minTermOptions}
            price={price}
            setPrice={setPrice}
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
