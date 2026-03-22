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

export function CreateListingStepOne() {
  const [selectedRooms, setSelectedRooms] = useState("");
  const [selectedBuildingType, setSelectedBuildingType] = useState("");
  const [selectedRepair, setSelectedRepair] = useState("");
  const [selectedRentType, setSelectedRentType] = useState(rentTypeOptions[0]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMinTerm, setSelectedMinTerm] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function toggleAmenity(value: string) {
    setSelectedAmenities((prev: string[]) =>
      prev.includes(value)
        ? prev.filter((item: string) => item !== value)
        : [...prev, value],
    );
  }

  return (
    <section className="bg-page pb-8 font-display">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-6">
          <ListingLocationSection
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            districtOptions={districtOptions}
          />

          <ListingDescriptionSection
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />

          <ListingRentTypeSwitch
            selectedRentType={selectedRentType}
            setSelectedRentType={setSelectedRentType}
            rentTypeOptions={rentTypeOptions}
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
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="min-w-40 font-display"
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
