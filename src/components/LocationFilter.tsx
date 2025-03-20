
import React, { useState } from "react";
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
  CommandList
} from "@/components/ui/command";
import { storeLocations } from "@/utils/mockData";

interface LocationFilterProps {
  onChange?: (location: string, type: 'store' | 'city' | 'region' | 'global') => void;
  className?: string;
}

const locationTypes = [
  { id: "store", name: "Store" },
  { id: "city", name: "City" },
  { id: "region", name: "Region" },
  { id: "global", name: "Global" }
];

const LocationFilter: React.FC<LocationFilterProps> = ({ onChange, className }) => {
  const [selectedType, setSelectedType] = useState<'store' | 'city' | 'region' | 'global'>('store');
  const [selectedLocation, setSelectedLocation] = useState(storeLocations[0].name);
  const [open, setOpen] = useState(false);

  const getUniqueLocations = () => {
    if (selectedType === 'store') {
      return storeLocations.map(loc => loc.name);
    } else if (selectedType === 'city') {
      return [...new Set(storeLocations.map(loc => loc.city))];
    } else if (selectedType === 'region') {
      return [...new Set(storeLocations.map(loc => loc.region))];
    } else {
      return [...new Set(storeLocations.map(loc => loc.global))];
    }
  };

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location);
    setOpen(false);
    if (onChange) {
      onChange(location, selectedType);
    }
  };

  const handleChangeType = (type: 'store' | 'city' | 'region' | 'global') => {
    setSelectedType(type);
    // Reset selected location to first one in new category
    const locations = type === 'store' 
      ? storeLocations.map(loc => loc.name)
      : type === 'city'
        ? [...new Set(storeLocations.map(loc => loc.city))]
        : type === 'region'
          ? [...new Set(storeLocations.map(loc => loc.region))]
          : [...new Set(storeLocations.map(loc => loc.global))];
    
    setSelectedLocation(locations[0]);
    if (onChange) {
      onChange(locations[0], type);
    }
  };

  const renderTypeIndicator = () => {
    const typeName = locationTypes.find(t => t.id === selectedType)?.name || 'Location';
    
    return (
      <div className="flex items-center gap-1 mr-2">
        <div className="text-xs bg-primary/10 text-primary/90 px-1.5 py-0.5 rounded-full font-medium">
          {typeName}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 sm:items-center", className)}>
      <div className="flex space-x-1">
        {locationTypes.map(type => (
          <Button
            key={type.id}
            variant={selectedType === type.id ? "default" : "ghost"}
            className={cn(
              "px-2.5 h-9",
              selectedType === type.id ? "bg-primary" : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            onClick={() => handleChangeType(type.id as 'store' | 'city' | 'region' | 'global')}
          >
            <span className="text-xs">{type.name}</span>
          </Button>
        ))}
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-between w-full sm:w-[220px] bg-white/90 dark:bg-black/50 border-gray-200 dark:border-gray-800 backdrop-blur-sm hover:bg-white dark:hover:bg-black/60"
          >
            <div className="flex items-center truncate">
              {renderTypeIndicator()}
              <MapPin className="h-3.5 w-3.5 opacity-70 mr-2" />
              <span className="truncate font-normal">{selectedLocation}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-70 ml-2 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[220px] p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-xl"
          align="start"
        >
          <Command>
            <CommandInput placeholder={`Search ${selectedType}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {getUniqueLocations().map(location => (
                  <CommandItem
                    key={location}
                    value={location}
                    onSelect={handleSelectLocation}
                    className="flex items-center justify-between"
                  >
                    <span>{location}</span>
                    {location === selectedLocation && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
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
