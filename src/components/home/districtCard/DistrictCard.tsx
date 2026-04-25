import React from "react";

interface DistrictCardProps {
  name: string;
  count: number;
  imageUrl: string;
  srcSet?: string;
  sizes?: string;
}

const DistrictCard: React.FC<DistrictCardProps> = ({
  name,
  count,
  imageUrl,
  srcSet,
  sizes,
}) => {
  return (
    <div className="relative w-[280px] h-[192px] rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 group">
      <img
        src={imageUrl}
        srcSet={srcSet}
        sizes={
          sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
        }
        alt={name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-white font-semibold text-lg leading-tight">
          {name}
        </h3>
        <p className="text-white/80 text-sm mt-0.5">{count} оголошень</p>
      </div>
    </div>
  );
};

export default DistrictCard;
