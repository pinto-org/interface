import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/utils/utils";

export interface ISliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  numThumbs?: number;
  markers?: number[];
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, ISliderProps>(
  ({ className, numThumbs = 1, markers = [], ...props }, ref) => {
    const thumbs = React.useMemo(() => Array.from({ length: numThumbs }, (_, i) => i), [numThumbs]);

    // Calculate marker position as percentage
    const calculateMarkerPosition = React.useCallback(
      (markerValue: number): number => {
        const min = props.min ?? 0;
        const max = props.max ?? 100;
        if (max === min) return 0;
        return ((markerValue - min) / (max - min)) * 100;
      },
      [props.min, props.max],
    );

    // Filter markers to only include values within min-max range
    const validMarkers = React.useMemo(() => {
      const min = props.min ?? 0;
      const max = props.max ?? 100;
      return markers.filter((marker) => marker >= min && marker <= max);
    }, [markers, props.min, props.max]);

    // Get current slider value
    const currentValue = React.useMemo(() => {
      const values = props.value ?? props.defaultValue;
      if (Array.isArray(values)) {
        return values[0] ?? props.min ?? 0;
      }
      return values ?? props.min ?? 0;
    }, [props.value, props.defaultValue, props.min]);

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center hover:cursor-pointer", className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-visible rounded-full bg-pinto-gray-2">
          <SliderPrimitive.Range className="absolute h-full bg-pinto-green-4 rounded-lg" />
          {validMarkers.map((marker, index) => {
            const position = calculateMarkerPosition(marker);
            const isAboveValue = marker > currentValue;
            return (
              <div
                key={`marker-${index}`}
                className={cn("absolute pointer-events-none", isAboveValue ? "bg-pinto-gray-2" : "bg-pinto-green-4")}
                style={{
                  left: `${position}%`,
                  top: "50%",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </SliderPrimitive.Track>
        {thumbs.map((idx) => (
          <SliderPrimitive.Thumb
            key={`slider-thumb-${idx.toString()}`}
            className="block h-5 w-5 rounded-full border-2 border-pinto-green-4 bg-pinto-green-4 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

interface MultiSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  showThumbValue?: boolean;
  formatThumbValue?: (value: number) => string;
}

function MultiSlider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  showThumbValue = false,
  formatThumbValue,
  ...props
}: MultiSliderProps) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max],
  );

  return (
    <div className="relative w-full">
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          showThumbValue && "mb-4",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              "bg-pinto-green-4 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="cursor-pointer border-pinto-green-4 bg-pinto-green-4 ring-offset-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
      {showThumbValue && (
        <div className="relative mt-2">
          {_values.map((thumbValue, index) => {
            const position = ((thumbValue - min) / (max - min)) * 100;
            // Calculate dynamic padding to prevent overflow
            const leftPadding = Math.max(0, (50 - position) * 0.5);
            const rightPadding = Math.max(0, (position - 50) * 0.5);

            return (
              <div
                key={`thumb-value-${index}`}
                className="absolute text-xs text-pinto-gray-4 font-medium transform -translate-x-1/2"
                style={{
                  left: `${position}%`,
                  paddingLeft: `${leftPadding}px`,
                  paddingRight: `${rightPadding}px`,
                }}
              >
                {formatThumbValue ? formatThumbValue(thumbValue) : thumbValue}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { Slider, MultiSlider };
