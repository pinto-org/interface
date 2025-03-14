import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { Plot } from "@/utils/types";
import { HTMLAttributes, useEffect, useState } from "react";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Slider } from "./ui/Slider";

interface PodRangeSelectorProps extends HTMLAttributes<HTMLDivElement> {
  plot: Plot;
  range: TokenValue[];
  handleRangeChange: (newRange: TokenValue[]) => void;
}

export default function PodRangeSelector({ plot, range, handleRangeChange }: PodRangeSelectorProps) {
  const min = plot.index;
  const max = plot.index.add(plot.pods);
  const [_values, setInternalValues] = useState<(TokenValue | undefined)[]>([min, max]);

  useEffect(() => {
    setInternalValues(range);
  }, [range]);

  const setMin = (value: string) => {
    const newMin = value ? TokenValue.fromHuman(value, PODS.decimals) : undefined;
    setInternalValues([newMin, range[1]]);

    if (!newMin || newMin.lt(min)) {
      handleRangeChange([min, range[1]]);
    } else if (newMin.gt(range[1])) {
      handleRangeChange([range[1], range[1]]);
    } else {
      handleRangeChange([newMin, range[1]]);
    }
  };

  const setMax = (value: string) => {
    const newMax = value ? TokenValue.fromHuman(value, PODS.decimals) : undefined;
    setInternalValues([range[0], newMax]);

    if (!newMax || newMax.gt(max)) {
      handleRangeChange([range[0], max]);
    } else if (newMax.lt(range[0])) {
      handleRangeChange([range[0], range[0]]);
    } else {
      handleRangeChange([range[0], newMax]);
    }
  };

  const minNumber = Number(min.toHuman());
  const maxNumber = Number(max.toHuman());
  const rangeNumbers = range.map((r) => (r ? Number(r.toHuman()) : minNumber));

  const handleSliderChange = (newRange: number[]) => {
    handleRangeChange([
      TokenValue.fromHuman(newRange[0], PODS.decimals),
      TokenValue.fromHuman(newRange[1], PODS.decimals),
    ]);
    setInternalValues([]);
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col flex-grow gap-6">
        <div className="flex flex-row justify-between items-center">
          <Label>What range of Pods in your Plot do you want to send?</Label>
          <Label className="text-[1rem] leading-[110%] text-black">
            {minNumber.toFixed(2)} - {maxNumber.toFixed(2)}
          </Label>
        </div>
        <Slider min={minNumber} max={maxNumber} value={rangeNumbers} onValueChange={handleSliderChange} step={1} />
      </div>
      <div className="flex flex-row items-center gap-4 w-full">
        <div className="flex flex-col flex-grow gap-2">
          <Label>Starting at:</Label>
          <Input
            className="h-[3.125rem] sm:h-[4.25rem] p-3 sm:px-6 sm:py-4 font-[340] text-[1.5rem] sm:text-[2rem] leading-[110%] -tracking-[0.02em]"
            placeholder={minNumber.toString()}
            value={rangeNumbers[0].toString()}
            min={minNumber}
            max={maxNumber}
            onInput={(e) => setMin(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col flex-grow gap-2">
          <Label>Ending at:</Label>
          <Input
            className="h-[3.125rem] sm:h-[4.25rem] p-3 sm:px-6 sm:py-4 font-[340] text-[1.5rem] sm:text-[2rem] leading-[110%] -tracking-[0.02em]"
            placeholder={maxNumber.toString()}
            value={rangeNumbers[1].toString()}
            min={minNumber}
            max={maxNumber}
            onInput={(e) => setMax(e.currentTarget.value)}
          />
        </div>
      </div>
    </div>
  );
}
