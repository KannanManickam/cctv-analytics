
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { timePresets } from "@/utils/mockData";

interface DateTimeFilterProps {
  onChange?: (range: DateRange) => void;
  className?: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
  preset?: string;
  change?: string;
}

const DateTimeFilter: React.FC<DateTimeFilterProps> = ({ onChange, className }) => {
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
    preset: "today",
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("today");

  const handlePresetSelect = (presetId: string) => {
    const today = new Date();
    let newRange: DateRange = { from: undefined, to: undefined, preset: presetId };

    switch (presetId) {
      case "today":
        newRange = { from: today, to: new Date(), preset: presetId, change: "Yesterday" };
        break;
      case "7days":
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        newRange = { from: sevenDaysAgo, to: new Date(), preset: presetId, change: "prev 7 days" };
        break;
      case "30days":
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        newRange = { from: thirtyDaysAgo, to: new Date(), preset: presetId, change: "prev 30 days" };
        break;
      case "90days":
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        newRange = { from: ninetyDaysAgo, to: new Date(), preset: presetId, change: "prev 90 days" };
        break;
      case "ytd":
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        newRange = { from: startOfYear, to: new Date(), preset: presetId, change: "prev YTD" };
        break;
      case "custom":
        // Don't change the date range, just switch to custom mode
        newRange = { ...date, preset: "custom", change: "prev range" };
        setIsCalendarOpen(true);
        break;
    }

    setDate(newRange);
    setSelectedPreset(presetId);

    if (onChange) {
      onChange(newRange);
    }

    if (presetId !== "custom") {
      setIsCalendarOpen(false);
    }
  };

  const displayDate = () => {
    if (!date.from) return "Select date range";
    if (!date.to) return format(date.from, "MMM d, yyyy");

    if (date.preset && date.preset !== "custom") {
      const preset = timePresets.find(p => p.id === date.preset);
      return preset?.name || "Custom Range";
    }

    if (format(date.from, "MMM d, yyyy") === format(date.to, "MMM d, yyyy")) {
      return format(date.from, "MMM d, yyyy");
    }

    return `${format(date.from, "MMM d")} - ${format(date.to, "MMM d, yyyy")}`;
  };

  const toStartOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const toEndOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  return (
    <div className={cn("flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2", className)}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-between w-full sm:w-auto bg-white/90 dark:bg-black/50 border-gray-200 dark:border-gray-800 backdrop-blur-sm",
              "dark:hover:bg-black/60"
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 opacity-70" />
              <span className="font-normal">{displayDate()}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-70 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto flex flex-col p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-xl"
          align="start"
        >
          <div className="grid grid-cols-2 gap-2 p-3 border-b border-gray-100 dark:border-gray-800">
            {timePresets.map((preset) => (
              <Button
                key={preset.id}
                variant={selectedPreset === preset.id ? "default" : "ghost"}
                className={cn(
                  "h-8 text-xs justify-start px-2",
                  selectedPreset === preset.id
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "dark:hover:bg-gray-800/80"
                )}
                onClick={() => handlePresetSelect(preset.id)}
              >
                {preset.name}
              </Button>
            ))}
          </div>

          <Calendar
            mode="range"
            selected={{ from: date.from, to: date.to }}
            onSelect={(newDate) => {
              if (newDate && newDate.from) {
                const updatedDate: DateRange = {
                  from: toStartOfDay(newDate.from),
                  to: toEndOfDay(newDate.to || newDate.from),
                  preset: "custom"
                };
                setDate(updatedDate);
                setSelectedPreset("custom");
                if (onChange) onChange(updatedDate);
              }
            }}
            className="p-3 pointer-events-auto"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateTimeFilter;
