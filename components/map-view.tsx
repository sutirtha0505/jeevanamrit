"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface HerbLocation {
  id: string;
  common_name: string;
  latin_name: string;
  location: string;
  weather: string;
  confidence_level: string;
  image_url: string;
}

interface MapViewProps {
  locations: HerbLocation[];
}

export default function MapView({ locations }: MapViewProps) {
  // Calculate center position from all locations
  const getCenter = (): [number, number] => {
    if (locations.length === 0) return [20.5937, 78.9629]; // India center
    
    const firstLocation = locations[0].location.split(",");
    return [parseFloat(firstLocation[0]), parseFloat(firstLocation[1])];
  };

  return (
    <MapContainer
      center={getCenter()}
      zoom={locations.length > 1 ? 5 : 12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => {
        const coords = location.location.split(",");
        const lat = parseFloat(coords[0]);
        const lng = parseFloat(coords[1]);

        return (
          <Marker key={location.id} position={[lat, lng]}>
            <Popup>
              <div className="p-2 min-w-50">
                <h3 className="font-bold text-lg">{location.common_name}</h3>
                <p className="text-sm italic text-gray-600 mb-2">
                  {location.latin_name}
                </p>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Confidence:</strong> {location.confidence_level}
                  </p>
                  <p>
                    <strong>Location:</strong> {location.location}
                  </p>
                  <p>
                    <strong>Weather:</strong> {location.weather}
                  </p>
                </div>
                {location.image_url && (
                  <Image
                    src={location.image_url}
                    alt={location.common_name}
                    width={200}
                    height={128}
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
