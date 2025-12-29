"use client";
import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

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
}

export default function Maps() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [herbs, setHerbs] = React.useState<string[]>([]);
  const [selectedHerbLocations, setSelectedHerbLocations] = React.useState<HerbLocation[]>([]);
  const [loading, setLoading] = React.useState(true);
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

  // Fetch locations for selected herb
  React.useEffect(() => {
    if (!value) {
      setSelectedHerbLocations([]);
      return;
    }

    const fetchHerbLocations = async () => {
      try {
        const { data, error } = await supabase
          .from("herb_analyses")
          .select("id, common_name, latin_name, location, weather, confidence_level, image_url")
          .eq("common_name", value);

        if (error) throw error;

        // Filter out entries without valid location data
        const validLocations = data?.filter((item) => {
          if (!item.location) return false;
          const coords = item.location.split(",");
          return coords.length === 2 && !isNaN(parseFloat(coords[0])) && !isNaN(parseFloat(coords[1]));
        }) || [];

        setSelectedHerbLocations(validLocations);
      } catch (error) {
        console.error("Error fetching herb locations:", error);
      }
    };

    fetchHerbLocations();
  }, [value, supabase]);

  return (
    <div className="w-full min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-6 justify-center items-center">
          <h2 className="text-3xl md:text-5xl font-bold text-center">
            Herb Location Map
          </h2>
          <p className="text-gray-600 text-center max-w-2xl">
            Select an herb to view all recorded locations where it has been identified
          </p>
          
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
            <PopoverContent className="w-72 p-0">
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
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} />
              <span>
                Found {selectedHerbLocations.length} location{selectedHerbLocations.length > 1 ? "s" : ""} for {value}
              </span>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="w-full h-150 rounded-lg overflow-hidden shadow-lg border">
          {value && selectedHerbLocations.length > 0 ? (
            <MapView locations={selectedHerbLocations} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
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
