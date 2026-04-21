import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin } from "lucide-react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const greenDot = L.divIcon({
  className: "",
  html: `<div style="
    width: 14px; height: 14px;
    background: #10b981;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const LVIV_BOUNDS = L.latLngBounds(
  L.latLng(49.77, 23.9),
  L.latLng(49.92, 24.18),
);

const LVIV_CENTER: [number, number] = [49.8397, 24.0297];

function BoundsEnforcer() {
  const map = useMap();
  useEffect(() => {
    map.setMaxBounds(LVIV_BOUNDS);
    map.on("drag", () => map.panInsideBounds(LVIV_BOUNDS, { animate: false }));
  }, [map]);
  return null;
}

function FlyToCoords({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 16, { duration: 1 });
  }, [coords, map]);
  return null;
}

interface Props {
  location: string;
}

export function ApartmentMap({ location }: Props) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setCoords(null);

    const query = encodeURIComponent(`${location}, Україна`);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=ua&bounded=1&viewbox=23.90,49.92,24.18,49.77`;

    fetch(url, {
      headers: { "Accept-Language": "uk" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [location]);

  return (
    <div className="flex flex-col gap-3 font-display mt-6">
      <h2 className="text-text-title font-semibold text-base">
        Приблизна локація
      </h2>

      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-[240px] relative">
        <MapContainer
          center={coords ?? LVIV_CENTER}
          zoom={15}
          minZoom={12}
          maxZoom={17}
          maxBounds={LVIV_BOUNDS}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {coords && (
            <>
              <Marker position={coords} icon={greenDot} />
              <FlyToCoords coords={coords} />
            </>
          )}
          <BoundsEnforcer />
        </MapContainer>

        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[1]">
            <span className="text-text-description text-sm">
              Завантаження карти...
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-[1] gap-2">
            <MapPin className="w-6 h-6 text-gray-300" />
            <p className="text-text-description text-sm font-medium">
              Локацію не вдалось знайти
            </p>
            <p className="text-gray-400 text-xs">
              Можливо, адреса некоректна або сервіс геокодування тимчасово
              недоступний.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
