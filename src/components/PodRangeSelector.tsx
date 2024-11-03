import { Dispatch, HTMLAttributes, SetStateAction, useEffect, useState } from "react";
import { Input } from "./ui/Input";
import { Slider } from "./ui/Slider";
import { Plot } from "@/utils/types";
import { Label } from "./ui/Label";

interface PodRangeSelectorProps extends HTMLAttributes<HTMLDivElement> {
    plot: Plot;
    range: number[];
    handleRangeChange: (newRange: number[]) => void
}

export default function PodRangeSelector({
    plot,
    range,
    handleRangeChange
}: PodRangeSelectorProps) {
    const min = Number(plot.index.toHuman());
    const max = Number(plot.index.add(plot.pods).toHuman());
    const [_values, setInternalValues] = useState<(number | undefined)[]>([min, max]);

    useEffect(() => {
        setInternalValues(range);
    }, [range]);

    const setMin = (value: string) => {
        const newMin = value ? Number(value) : undefined;
        setInternalValues([newMin, range[1]]);
        
        if (!newMin || newMin < min) {
            handleRangeChange([min, range[1]]);
        } else if (newMin > range[1]) {
            handleRangeChange([range[1], range[1]]);
        } else {
            handleRangeChange([newMin, range[1]]);
        }
    };

    const setMax = (value: string) => {
        const newMax = value ? Number(value) : undefined;
        setInternalValues([range[0], newMax]);
        
        if (!newMax || newMax > max) {
            handleRangeChange([range[0], max]);
        } else if (newMax < range[0]) {
            handleRangeChange([range[0], range[0]]);
        } else {
            handleRangeChange([range[0], newMax]);
        }
    };

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col flex-grow gap-4">
                <div className="flex flex-row justify-between items-center">
                    <Label>What range of Pods in your Plot do you want to send?</Label>
                    <Label className="text-[1rem] leading-[110%] text-black">{min} - {max}</Label>
                </div>
                <Slider 
                    min={min}
                    max={max}
                    value={range}
                    onValueChange={handleRangeChange}
                    step={1}
                />
            </div>
            <div className="flex flex-row items-center gap-4 w-full">
                <div className="flex flex-col flex-grow gap-2">
                    <Label>Starting at:</Label>
                    <Input 
                        className="h-[4.25rem] px-6 py-4 font-[340] text-[2rem] leading-[110%] -tracking-[0.02em]"
                        placeholder={_values[0]?.toString()}
                        min={min}
                        max={max}
                        onInput={(e) => setMin(e.currentTarget.value)}
                    />
                </div>
                <div className="flex flex-col flex-grow gap-2">
                    <Label>Ending at:</Label>
                    <Input 
                        className="h-[4.25rem] px-6 py-4 font-[340] text-[2rem] leading-[110%] -tracking-[0.02em]"
                        placeholder={_values[1]?.toString()}
                        min={min}
                        max={max}
                        onInput={(e) => setMax(e.currentTarget.value)}
                    />
                </div>
            </div>
        </div>
    );
}