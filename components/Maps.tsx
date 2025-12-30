"use client";
import * as React from "react";
import { Check, ChevronsUpDown, MapPin, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

// Dynamically import the map component to avoid SSR issues
const MapView = dynamic(() => import("./map-view"), { ssr: false });

interface HerbLocation {
  id: string;
  common_name: string;
  latin_name: string;
  location: string;
  weather: string;
  confidence_level: string;
  image_url: string;
  type: "user" | "ai"; // Distinguish between user-captured and AI-generated
}

export default function Maps() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [herbs, setHerbs] = React.useState<string[]>([]);
  const [selectedHerbLocations, setSelectedHerbLocations] = React.useState<HerbLocation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [generatingAI, setGeneratingAI] = React.useState(false);
  const [hasAILocations, setHasAILocations] = React.useState(false);
  const [selectedHerbInfo, setSelectedHerbInfo] = React.useState<{ commonName: string; latinName: string } | null>(null);
  const supabase = createClient();

  // Fetch unique herb names on component mount
  React.useEffect(() => {
    const fetchUniqueHerbs = async () => {
      try {
        const { data, error } = await supabase
          .from("herb_analyses")
          .select("common_name")
          .order("common_name");

        if (error) throw error;

        // Get unique herb names (filter out duplicates and empty values)
        const uniqueHerbs = Array.from(
          new Set(
            data
              ?.map((item) => item.common_name?.trim())
              .filter((name) => name && name.length > 0) || []
          )
        );
        setHerbs(uniqueHerbs);
      } catch (error) {
        console.error("Error fetching herbs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniqueHerbs();
  }, [supabase]);

  // Function to fetch current weather data
  const fetchWeatherData = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m`
      );
      const data = await response.json();
      return {
        temperature: data.current?.temperature_2m || 25,
        humidity: data.current?.relative_humidity_2m || 60,
        location: `${lat.toFixed(2)}, ${lng.toFixed(2)}`,
      };
    } catch (error) {
      console.error("Error fetching weather:", error);
      // Return default values if weather fetch fails
      return {
        temperature: 25,
        humidity: 60,
        location: `${lat.toFixed(2)}, ${lng.toFixed(2)}`,
      };
    }
  };

  // Function to handle AI location generation
  const handleGenerateAILocations = async () => {
    if (!selectedHerbInfo || hasAILocations || generatingAI) return;

    setGeneratingAI(true);
    toast.info("Generating AI location predictions...");

    try {
      // Get user's current location (or use a default Indian location)
      let currentLocation = { lat: 20.5937, lng: 78.9629 }; // Center of India as default
      
      // Try to get user's actual location
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } catch (geoError) {
          console.log("Using default location:", geoError);
        }
      }

      // Fetch current weather
      const weatherData = await fetchWeatherData(currentLocation.lat, currentLocation.lng);

      // Call API to generate locations
      const response = await fetch("/api/generate-locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commonName: selectedHerbInfo.commonName,
          latinName: selectedHerbInfo.latinName,
          currentWeather: weatherData,
          currentLocation,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate locations");
      }

      const result = await response.json();

      if (!result.success || !result.locations) {
        throw new Error("Invalid response from server");
      }

      // Save generated locations to Supabase
      const locationsToInsert = result.locations.map((loc: {
        latitude: number;
        longitude: number;
        regionName: string;
        climateType: string;
        elevationRange: string;
        suitableConditions: string;
        confidenceScore: number;
      }) => ({
        common_name: selectedHerbInfo.commonName,
        latin_name: selectedHerbInfo.latinName,
        location: `${loc.latitude},${loc.longitude}`,
        region_name: loc.regionName,
        climate_type: loc.climateType,
        elevation_range: loc.elevationRange,
        suitable_conditions: loc.suitableConditions,
        confidence_score: loc.confidenceScore,
      }));

      const { error: insertError } = await supabase
        .from("ai_herb_locations")
        .insert(locationsToInsert);

      if (insertError) throw insertError;

      toast.success(`Generated ${result.locations.length} AI location predictions!`);

      // Refresh locations to show new AI predictions
      setValue(""); // Reset to trigger useEffect
      setTimeout(() => setValue(selectedHerbInfo.commonName), 100);

    } catch (error) {
      console.error("Error generating AI locations:", error);
      toast.error("Failed to generate AI locations. Please try again.");
    } finally {
      setGeneratingAI(false);
    }
  };

  // Fetch locations for selected herb
  React.useEffect(() => {
    if (!value) {
      setSelectedHerbLocations([]);
      setHasAILocations(false);
      setSelectedHerbInfo(null);
      return;
    }

    const fetchHerbLocations = async () => {
      try {
        // Fetch user-captured locations
        const { data: userLocations, error: userError } = await supabase
          .from("herb_analyses")
          .select("id, common_name, latin_name, location, weather, confidence_level, image_url")
          .eq("common_name", value);

        if (userError) throw userError;

        // Filter out entries without valid location data and add type
        const validUserLocations = (userLocations?.filter((item) => {
          if (!item.location) return false;
          const coords = item.location.split(",");
          return coords.length === 2 && !isNaN(parseFloat(coords[0])) && !isNaN(parseFloat(coords[1]));
        }) || []).map(loc => ({ ...loc, type: "user" as const }));

        // Store herb info for AI generation
        if (validUserLocations.length > 0) {
          setSelectedHerbInfo({
            commonName: validUserLocations[0].common_name,
            latinName: validUserLocations[0].latin_name || "",
          });
        }

        // Fetch AI-generated locations
        const { data: aiLocations, error: aiError } = await supabase
          .from("ai_herb_locations")
          .select("id, common_name, latin_name, location, climate_type, elevation_range, suitable_conditions, confidence_score")
          .eq("common_name", value);

        if (aiError) {
          console.error("Error fetching AI locations:", aiError);
        }

        // Transform AI locations to match HerbLocation interface
        const validAILocations = (aiLocations?.filter((item) => {
          if (!item.location) return false;
          const coords = item.location.split(",");
          return coords.length === 2 && !isNaN(parseFloat(coords[0])) && !isNaN(parseFloat(coords[1]));
        }) || []).map(loc => ({
          id: loc.id,
          common_name: loc.common_name,
          latin_name: loc.latin_name || "",
          location: loc.location,
          weather: `${loc.climate_type} climate, ${loc.elevation_range}`,
          confidence_level: `${Math.round((loc.confidence_score || 0) * 100)}%`,
          image_url: "", // AI locations don't have images
          type: "ai" as const,
        }));

        // Set states
        setHasAILocations(validAILocations.length > 0);
        setSelectedHerbLocations([...validUserLocations, ...validAILocations]);

        // If no user locations, still store herb info from first entry for potential AI generation
        if (validUserLocations.length === 0 && userLocations && userLocations.length > 0) {
          setSelectedHerbInfo({
            commonName: userLocations[0].common_name,
            latinName: userLocations[0].latin_name || "",
          });
        }

      } catch (error) {
        console.error("Error fetching herb locations:", error);
      }
    };

    fetchHerbLocations();
  }, [value, supabase]);

  return (
    <div className="w-full min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex-col justify-center gap-6 items-center ">
        
        {/* Herb Selector */}
        <div className=" mb-8 z-50 flex flex-col gap-6 justify-center items-center">
          
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className="inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-72"
              role="combobox"
              aria-expanded={open}
              disabled={loading}
            >
              {value || (loading ? "Loading herbs..." : "Select herb...")}
              <ChevronsUpDown className="opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" side="top" align="center">
              <Command>
                <CommandInput placeholder="Search herb..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No herb found.</CommandEmpty>
                  <CommandGroup>
                    {herbs.map((herb) => (
                      <CommandItem
                        key={herb}
                        value={herb}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {herb}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === herb ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {value && selectedHerbLocations.length > 0 && (
            <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-blue-600">
                  <MapPin size={16} />
                  <span>
                    {selectedHerbLocations.filter(loc => loc.type === "user").length} User Location{selectedHerbLocations.filter(loc => loc.type === "user").length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  <Sparkles size={16} />
                  <span>
                    {selectedHerbLocations.filter(loc => loc.type === "ai").length} AI Prediction{selectedHerbLocations.filter(loc => loc.type === "ai").length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              
              {/* Show AI generation button only if no AI locations exist */}
              {!hasAILocations && selectedHerbInfo && (
                <Button
                  onClick={handleGenerateAILocations}
                  disabled={generatingAI}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {generatingAI ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate AI Location Predictions
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
        {/* Map Container */}
        <div className="z-0 h-150 rounded-lg overflow-hidden shadow-lg border">
          {value && selectedHerbLocations.length > 0 ? (
            <MapView locations={selectedHerbLocations} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <div className="text-center">
                <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-500">
                  {value
                    ? "No locations found for this herb"
                    : "Select an herb to view its locations on the map"}
                </p>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
