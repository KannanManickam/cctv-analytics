import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, MapPin } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import axios from "axios";

interface LocationFilterProps {
  onChange?: (locationId: string, type: LocationType) => void;
  className?: string;
}

type LocationType = "store" | "city" | "region" | "global";

type LocationOption = {
  id: string;
  name: string;
};

const locationTypes = [
  { id: "global", name: "Global" },
  { id: "region", name: "Region" },
  { id: "city", name: "City" },
  { id: "store", name: "Store" },
];

const apiMap: Record<LocationType, string> = {
  store: "https://sfs-dashboard-api-production.up.railway.app/store",
  city: "https://sfs-dashboard-api-production.up.railway.app/city",
  region: "https://sfs-dashboard-api-production.up.railway.app/region",
  global: "https://sfs-dashboard-api-production.up.railway.app/global",
};

const LocationFilter: React.FC<LocationFilterProps> = ({ onChange, className }) => {
  const [selectedType, setSelectedType] = useState<LocationType>("store");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [allLocations, setAllLocations] = useState<Record<LocationType, LocationOption[]>>({
    store: [],
    city: [],
    region: [],
    global: [],
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const newLocations: Record<LocationType, LocationOption[]> = {
        store: [],
        city: [],
        region: [],
        global: [],
      };

      await Promise.all(
        (Object.keys(apiMap) as LocationType[]).map(async (type) => {
          try {
            const res = await axios.get(apiMap[type]);
            newLocations[type] = res.data.map((item: { id: string; name: string }) => ({
              id: String(item.id),
              name: item.name,
            }));
          } catch (error) {
            console.error(`Error fetching ${type}:`, error);
          }
        })
      );

      setAllLocations(newLocations);
      const first = newLocations["store"][0];
      if (first) {
        setSelectedLocationId(first.id);
        onChange?.(first.id, "store");
      }
    };

    fetchAll();
  }, []);

  const handleChangeType = (type: LocationType) => {
    setSelectedType(type);
    const first = allLocations[type][0];
    if (first) {
      setSelectedLocationId(first.id);
      onChange?.(first.id, type);
    }
  };

  const handleSelectLocation = (locationId: string) => {
    setSelectedLocationId(locationId);
    setOpen(false);
    onChange?.(locationId, selectedType);
  };

  const currentOptions = allLocations[selectedType] || [];
  const selectedOption = currentOptions.find((opt) => opt.id === selectedLocationId);

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2", className)}>
      <div className="flex space-x-1">
        {locationTypes.map((type) => (
          <Button
            key={type.id}
            variant={selectedType === type.id ? "default" : "ghost"}
            className="px-3 h-9 text-xs hover:background-color-[#DD3E62]"
            onClick={() => handleChangeType(type.id as LocationType)}
          >
            {type.name}
          </Button>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[220px] justify-between bg-white/90 dark:bg-black/60 backdrop-blur-sm border border-gray-300 dark:border-gray-700"
          >
            <div className="flex items-center truncate">
              {/* <span className="text-xs bg-primary/10 text-primary/90 px-2 py-0.5 rounded-full mr-2 hover:text-white">
                {selectedType}
              </span> */}
              <MapPin className="h-4 w-4 opacity-70 mr-2" />
              <span className="truncate font-normal">
                {selectedOption?.name || "Select location"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-70 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[220px] p-0 bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-800 shadow-xl"
          align="start"
        >
          <Command>
            <CommandInput placeholder={`Search ${selectedType}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {currentOptions.map((location) => (
                  <CommandItem
                    key={location.id}
                    value={location.id}
                    onSelect={() => handleSelectLocation(location.id)}
                    className="flex justify-between items-center bg-white"
                    style={{ backgroundColor: "white" }}
                  >
                    <span className="">{location.name}...</span>
                    {location.id === selectedLocationId && <Check className="h-4 w-4 text-primary" />}
                  </CommandItem>
                ))}

              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationFilter;
