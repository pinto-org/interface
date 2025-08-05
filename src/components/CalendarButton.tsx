import useLocalStorage from "@/hooks/useLocalStorage";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { truncSeconds } from "@/utils/utils";
import { format, isValid, parse, set, startOfYear, subHours, subMonths, subWeeks, subYears } from "date-fns";
import { IRange, Time, UTCTimestamp } from "lightweight-charts";
import { useCallback, useEffect, useState } from "react";
import { ClassNames, DayPicker, DateRange as DayPickerDateRange, DeprecatedUI } from "react-day-picker";
import { CalendarIcon, ClockIcon } from "./Icons";
import { Input } from "./ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Separator } from "./ui/Separator";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface DatePresetConfig {
  from: () => Date | undefined;
  to: () => Date | undefined;
}

// Predefined date ranges
const DATE_PRESETS: Record<Exclude<string, "CUSTOM">, DatePresetConfig> = {
  "1D": { from: () => truncSeconds(subHours(new Date(), 24)), to: () => truncSeconds(new Date()) },
  "1W": { from: () => truncSeconds(subWeeks(new Date(), 1)), to: () => truncSeconds(new Date()) },
  "1M": { from: () => truncSeconds(subMonths(new Date(), 1)), to: () => truncSeconds(new Date()) },
  "3M": { from: () => truncSeconds(subMonths(new Date(), 3)), to: () => truncSeconds(new Date()) },
  "6M": { from: () => truncSeconds(subMonths(new Date(), 6)), to: () => truncSeconds(new Date()) },
  YTD: { from: () => truncSeconds(startOfYear(new Date())), to: () => truncSeconds(new Date()) },
  "1Y": { from: () => truncSeconds(subYears(new Date(), 1)), to: () => truncSeconds(new Date()) },
  "2Y": { from: () => truncSeconds(subYears(new Date(), 2)), to: () => truncSeconds(new Date()) },
  ALL: { from: () => truncSeconds(new Date("2024-11-01")), to: () => truncSeconds(new Date()) },
};

// Calendar styling classes
const CALENDAR_STYLES: Partial<ClassNames> & Partial<DeprecatedUI<string>> = {
  root: "p-0 pinto-sm-light",
  caption: "flex relative justify-center items-center mb-2.5",
  nav: "flex items-center place-self-end gap-2",
  button_next: "absolute right-2 rounded w-8 h-8 hover:bg-pinto-green-1 transition-colors duration-150 ease-in-out",
  button_previous: "absolute left-3 rounded w-8 h-8 hover:bg-pinto-green-1 transition-colors duration-150 ease-in-out",
  month: "-mt-3 justify-items-center",
  month_grid: "mt-4",
  head_row: "hidden",
  table: "flex justify-center",
  tbody: "ml-0.5",
  day: "rounded h-8 w-8",
  day_button: "rounded h-8 w-8 transition-colors duration-150 ease-in-out",
  today: "font-normal",
  selected: "font-bold bg-pinto-green text-white",
  range_start: "rounded-l rounded-r-none font-bold bg-pinto-green text-white hover:bg-pinto-green/80",
  range_middle: "rounded-none font-bold bg-pinto-green text-white hover:bg-pinto-green/80",
  range_end: "rounded-r rounded-l-none font-bold bg-pinto-green text-white hover:bg-pinto-green/80",
};

// Helper functions
const formatDate = (date: Date | undefined): string => (date ? format(date, "MM/dd/yyyy") : "");
const formatTime = (date: Date | undefined): string => (date ? format(date, "HH:mm") : "");
const parseDate = (dateStr: string, timeStr?: string): Date | undefined => {
  if (!dateStr) return undefined;
  try {
    const parsedDate = parse(dateStr, "MM/dd/yyyy", new Date());
    if (!isValid(parsedDate)) return undefined;

    if (timeStr) {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return set(parsedDate, { hours: Number.isNaN(hours) ? 0 : hours, minutes: Number.isNaN(minutes) ? 0 : minutes });
    }
    return parsedDate;
  } catch (_e) {
    return undefined;
  }
};

interface DateTimeInputs {
  from: string;
  to: string;
}

// DateRangeInput component - handles the date/time inputs
interface DateRangeInputProps {
  label: string;
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

const DateRangeInput = ({ date, time, onDateChange, onTimeChange }: DateRangeInputProps) => {
  const [internalDate, setInternalDate] = useState(date);
  const [internalTime, setInternalTime] = useState(time);

  useEffect(() => {
    setInternalDate(date);
    setInternalTime(time);
  }, [date, time]);

  useDebouncedEffect(
    () => {
      onDateChange(internalDate);
    },
    [internalDate],
    500,
  );

  useDebouncedEffect(
    () => {
      onTimeChange(internalTime);
    },
    [internalTime],
    500,
  );

  return (
    <div className="flex flex-row gap-2">
      <Input
        value={internalDate}
        placeholder="MM/DD/YYYY"
        onChange={(e) => setInternalDate(e.target.value)}
        className="h-8 px-2 pinto-sm-light"
        containerClassName="flex flex-grow basis-7/12"
      />
      <Input
        value={internalTime}
        placeholder="00:00"
        onChange={(e) => setInternalTime(e.target.value)}
        className="h-8 px-2 pinto-sm-light"
        containerClassName="flex flex-grow basis-5/12"
        endIcon={
          <div>
            <ClockIcon className="mr-2 hidden sm:block 3xl:hidden" size={4} />
            <ClockIcon className="mr-2 sm:hidden 3xl:block" size={5} />
          </div>
        }
      />
    </div>
  );
};

// PresetButton component - handles individual preset buttons
interface PresetButtonProps {
  preset: string;
  isSelected: boolean;
  onClick: () => void;
}

const PresetButton = ({ preset, isSelected, onClick }: PresetButtonProps) => (
  <button
    type="button"
    className={`min-w-8 pinto-body-light ${isSelected ? "text-pinto-green" : "text-pinto-gray-4"}`}
    onClick={onClick}
  >
    {preset}
  </button>
);

// MobilePresets component - handles mobile preset buttons
interface MobilePresetsProps {
  datePresets: typeof DATE_PRESETS;
  selectedPreset: string;
  onChange: (range: DateRange, preset: string) => void;
}

const MobilePresets = ({ datePresets, selectedPreset, onChange }: MobilePresetsProps) => (
  <div className="flex flex-row justify-between mt-4 lg:hidden">
    {Object.keys(datePresets).map((preset) => (
      <button
        key={`mobile-preset-${preset}`}
        type="button"
        className={`rounded py-1 text-sm min-w-fit w-8 pinto-body-light ${
          selectedPreset === preset ? "bg-pinto-green text-white" : "border border-pinto-gray-2 text-pinto-gray-5"
        }`}
        onClick={() => {
          const newRange = {
            from: datePresets[preset].from(),
            to: datePresets[preset].to(),
          };
          onChange(newRange, preset);
        }}
      >
        {preset}
      </button>
    ))}
  </div>
);

// CalendarContent component - handles the popover content
interface CalendarContentProps {
  datePresets: typeof DATE_PRESETS;
  range: DateRange;
  selectedPreset: string;
  onChange: (range: DateRange, preset: string) => void;
}

const CalendarContent = ({ datePresets, range, selectedPreset, onChange }: CalendarContentProps) => {
  const [month, setMonth] = useState<Date>(new Date());
  const [dateInputs, setDateInputs] = useState<DateTimeInputs>({ from: "", to: "" });
  const [timeInputs, setTimeInputs] = useState<DateTimeInputs>({ from: "", to: "" });

  // Update inputs when range changes
  useEffect(() => {
    setDateInputs({
      from: formatDate(range.from),
      to: formatDate(range.to),
    });
    setTimeInputs({
      from: formatTime(range.from),
      to: formatTime(range.to),
    });
  }, [range]);

  // Handle date picker selection
  const handleDayPickerSelect = useCallback(
    (selectedRange: DayPickerDateRange | undefined) => {
      if (!selectedRange) {
        onChange({ from: DATE_PRESETS.ALL.from(), to: DATE_PRESETS.ALL.to() }, "ALL");
        return;
      }

      const { from, to } = selectedRange;
      const newRange: DateRange = {
        from: from ? parseDate(formatDate(from), timeInputs.from || "00:00") : undefined,
        to: to ? parseDate(formatDate(to), timeInputs.to || "23:59") : undefined,
      };

      onChange(newRange, "CUSTOM");
    },
    [onChange, timeInputs],
  );

  const handleDateChange = useCallback(
    (type: "from" | "to", value: string): void => {
      setDateInputs((prev) => ({ ...prev, [type]: value }));
      const newDate = parseDate(value, timeInputs[type]);
      if (newDate) {
        const newRange: DateRange = { ...range, [type]: newDate };
        onChange(newRange, "CUSTOM");
        setMonth(newDate);
      }
    },
    [onChange, range, timeInputs],
  );

  const handleTimeChange = useCallback(
    (type: "from" | "to", value: string): void => {
      setTimeInputs((prev) => ({ ...prev, [type]: value }));

      if (range[type] && value) {
        try {
          const [hours, minutes] = value.split(":").map(Number);
          const newDate = set(range[type] as Date, {
            hours: Number.isNaN(hours) ? 0 : hours,
            minutes: Number.isNaN(minutes) ? 0 : minutes,
          });
          const newRange: DateRange = { ...range, [type]: newDate };
          onChange(newRange, "CUSTOM");
        } catch (_e) {
          // Invalid time format
        }
      }
    },
    [onChange, range],
  );

  return (
    <div className="flex flex-col gap-4 p-0">
      <div className="pinto-body-light font-medium">Custom Date Range</div>
      <div className="flex flex-col gap-2">
        <DateRangeInput
          label="From"
          date={dateInputs.from}
          time={timeInputs.from}
          onDateChange={(val) => handleDateChange("from", val)}
          onTimeChange={(val) => handleTimeChange("from", val)}
        />
        <DateRangeInput
          label="To"
          date={dateInputs.to}
          time={timeInputs.to}
          onDateChange={(val) => handleDateChange("to", val)}
          onTimeChange={(val) => handleTimeChange("to", val)}
        />
      </div>
      <Separator />
      <div className="flex flex-col">
        <DayPicker
          mode="range"
          showOutsideDays
          selected={range}
          onSelect={handleDayPickerSelect}
          month={month}
          onMonthChange={setMonth}
          fixedWeeks
          classNames={CALENDAR_STYLES}
        />
        <MobilePresets datePresets={datePresets} selectedPreset={selectedPreset} onChange={onChange} />
      </div>
    </div>
  );
};

// Main CalendarButton component
interface CalendarButtonProps<T extends Record<string, DatePresetConfig> = typeof DATE_PRESETS> {
  setTimePeriod: (timePeriod: IRange<Time>) => void;
  storageKeyPrefix?: string;
  datePresets?: T;
  defaultPreset?: keyof T;
}

const isCalRangeDifferent = (range1: DateRange, range2: DateRange): boolean => {
  return (
    (range1.from?.getTime() ?? 0) !== (range2.from?.getTime() ?? 0) ||
    (range1.to?.getTime() ?? 0) !== (range2.to?.getTime() ?? 0)
  );
};

const CalendarButton = ({
  setTimePeriod,
  storageKeyPrefix = "advancedChart",
  datePresets = DATE_PRESETS,
  defaultPreset = "1W",
}: CalendarButtonProps) => {
  const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [selectedPreset, setSelectedPreset] = useState<string>(defaultPreset);

  const [storageRange, setStorageRange] = useLocalStorage<DateRange | undefined>(`${storageKeyPrefix}Range`, {
    from: undefined,
    to: undefined,
  });
  const [storagePreset, setStoragePreset] = useLocalStorage<string | undefined>(
    `${storageKeyPrefix}Preset`,
    defaultPreset,
  );

  // Save to localStorage and set period
  const saveRangeAndSetPeriod = useCallback(
    (rangeToSave: DateRange, presetToSave: string): void => {
      if (!rangeToSave.from && !rangeToSave.to) {
        return;
      }

      // Save to localStorage
      try {
        setStorageRange(rangeToSave);
        setStoragePreset(presetToSave);

        // Set time period
        const timePeriod: IRange<Time> = {
          from: (rangeToSave.from ? rangeToSave.from.valueOf() : 0) as UTCTimestamp,
          to: (rangeToSave.to ? rangeToSave.to.valueOf() : Date.now()) as UTCTimestamp,
        };

        setTimePeriod(timePeriod);
      } catch (error) {
        console.error("Error saving date range to localStorage", error);
      }
    },
    [setTimePeriod, setStorageRange, setStoragePreset],
  );

  // Apply preset range
  const applyPreset = useCallback(
    (preset: Exclude<string, "CUSTOM">): void => {
      const presetConfig = datePresets[preset];
      if (!presetConfig) return;

      const newRange: DateRange = {
        from: presetConfig.from(),
        to: presetConfig.to(),
      };

      if (isCalRangeDifferent(newRange, range)) {
        setRange(newRange);
        setSelectedPreset(preset);
        saveRangeAndSetPeriod(newRange, preset);
      } else {
        setStoragePreset(preset);
      }
    },
    [datePresets, range, saveRangeAndSetPeriod, setStoragePreset],
  );

  // Initialize from localStorage if available
  // biome-ignore lint/correctness/useExhaustiveDependencies: One time initialization
  useEffect(() => {
    try {
      if (storagePreset && storagePreset !== "CUSTOM") {
        applyPreset(storagePreset);
      } else if (storageRange?.from && storageRange?.to) {
        // Convert stored timestamp strings back to Date objects
        setRange({ from: new Date(storageRange.from), to: new Date(storageRange.to) });
        const timePeriod = {
          from: storageRange.from.valueOf() as UTCTimestamp,
          to: storageRange.to.valueOf() as UTCTimestamp,
        };
        setTimePeriod(timePeriod);
      } else {
        applyPreset(defaultPreset);
      }

      if (storagePreset) {
        setSelectedPreset(storagePreset);
      }
    } catch (e) {
      console.error("Error loading saved date range", e);
      applyPreset(defaultPreset);
    }
  }, []);

  const handleCalendarInteraction = (newRange: DateRange, preset: string): void => {
    if (isCalRangeDifferent(newRange, range)) {
      setRange(newRange);
      setSelectedPreset(preset);
      saveRangeAndSetPeriod(newRange, preset);
    } else {
      setStoragePreset(preset);
    }
  };

  return (
    <div className="relative flex flex-row items-center">
      <div className="hidden lg:flex">
        <div className="flex flex-row items-center gap-6">
          {Object.keys(datePresets).map((preset) => (
            <PresetButton
              key={`preset-${preset}`}
              preset={preset}
              isSelected={selectedPreset === preset}
              onClick={() => applyPreset(preset as Exclude<string, "CUSTOM">)}
            />
          ))}
        </div>
        <Separator orientation="vertical" className="h-6 mx-4" />
      </div>
      <Popover>
        <PopoverTrigger>
          <div
            className={`text-pinto-gray-4 ${selectedPreset === "CUSTOM" ? "lg:text-pinto-green" : "text-pinto-gray-4"}`}
          >
            <CalendarIcon color={"currentColor"} />
          </div>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[22rem] lg:w-[17.5rem]">
          <CalendarContent
            datePresets={datePresets}
            range={range}
            selectedPreset={selectedPreset}
            onChange={handleCalendarInteraction}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CalendarButton;
