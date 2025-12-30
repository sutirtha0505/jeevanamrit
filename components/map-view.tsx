"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";

// Custom green icon for user locations
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom purple icon for AI predictions
const purpleIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface HerbLocation {
  id: string;
  common_name: string;
  latin_name: string;
  location: string;
  weather: string;
  confidence_level: string;
  image_url: string;
  type?: "user" | "ai";
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
        
        // Choose icon based on location type
        const markerIcon = location.type === "ai" ? purpleIcon : greenIcon;

        return (
          <Marker key={location.id} position={[lat, lng]} icon={markerIcon}>
            <Popup>
              <div className="p-2 min-w-50">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{location.common_name}</h3>
                  {location.type === "ai" && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      AI Prediction
                    </span>
                  )}
                </div>
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
