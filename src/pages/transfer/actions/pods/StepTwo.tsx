import { ComboInputField } from "@/components/ComboInputField";
import { PodTransferData } from "../TransferPods";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import AddressInputField from "@/components/AddressInputField";
import { Plot } from "@/utils/types";
import { useFarmerField } from "@/state/useFarmerField";
import { TokenValue } from "@/classes/TokenValue";
import PodRangeSelector from "@/components/PodRangeSelector";
import { PODS } from "@/constants/internalTokens";
import { Label } from "@/components/ui/Label";

interface StepTwoProps {
    transferData: PodTransferData[];
    setTransferData: Dispatch<SetStateAction<PodTransferData[]>>;
    destination: string | undefined;
    setDestination: Dispatch<SetStateAction<string | undefined>>;
};

export default function StepTwo({
    transferData,
    setTransferData,
    destination,
    setDestination
}: StepTwoProps) {
    const { plots } = useFarmerField();
    const [selectedPlots, setSelectedPlots] = useState<Plot[]>([]);
    const [amount, setAmount] = useState<string>("0");
    const [range, setRange] = useState<number[]>([0, 0]);

    useEffect(() => {
        const _newPlots: Plot[] = [];
        for (const data of transferData) {
            const _plot = plots.find((plot) => plot.index.eq(data.id))
            if (_plot) {
                _newPlots.push(_plot)
            }
        }
        setSelectedPlots(_newPlots)
    }, []);

    useEffect(() => {
        if (selectedPlots.length === 1) {
            const plot = selectedPlots[0];
            const min = Number(plot.index.toHuman());
            const max = Number(plot.index.add(plot.pods).toHuman());
            setRange([min, max]);
        }
    }, [selectedPlots]);

    const handleRangeChange = useCallback((newRange: number[]) => {
        if (selectedPlots.length === 0) return;
        const plot = selectedPlots[0];
        const newStart = TokenValue.fromHuman(newRange[0], PODS.decimals);
        const newEnd = TokenValue.fromHuman(newRange[1], PODS.decimals);
        
        const relativeStart = newStart.sub(plot.index);
        const relativeEnd = newEnd.sub(plot.index);
        
        const newData = [{
            id: plot.index,
            start: relativeStart,
            end: relativeEnd
        }];

        const [start, end] = newRange;
        const startValue = TokenValue.fromHuman(start, PODS.decimals);
        const endValue = TokenValue.fromHuman(end, PODS.decimals);
        const newAmount = endValue.sub(startValue).toHuman();

        const batchUpdate = () => {
            setRange(newRange);
            setTransferData(newData);
            setAmount(newAmount);
        };
        batchUpdate();
    }, [selectedPlots, setTransferData]);

    const handleAmountChange = useCallback((value: string) => {
        const newAmount = value;
        
        if (selectedPlots.length === 0) return;
        
        const plot = selectedPlots[0];
        const startIndex = Number(plot.index.toHuman());
        const amountValue = TokenValue.fromHuman(newAmount || "0", PODS.decimals);
        const newEnd = startIndex + Number(amountValue.toHuman());
        
        const newRange = [startIndex, newEnd];

        const newStart = TokenValue.fromHuman(newRange[0], PODS.decimals);
        const newEndTV = TokenValue.fromHuman(newRange[1], PODS.decimals);
        
        const relativeStart = newStart.sub(plot.index);
        const relativeEnd = newEndTV.sub(plot.index);
        
        const newData = [{
            id: plot.index,
            start: relativeStart,
            end: relativeEnd
        }]

        const batchUpdate = () => {
            setRange(newRange);
            setTransferData(newData);
            setAmount(newAmount);
        };
        batchUpdate();
    }, [selectedPlots, setTransferData]);

    return (
        <div className="flex flex-col gap-6">
            <ComboInputField 
                mode="plots"
                selectedPlots={selectedPlots}
                setPlots={setSelectedPlots}
                plotSelectionType="multiple"
                amount={amount}
                handleAmountChange={handleAmountChange}
                disableInput={selectedPlots.length > 1}
                altText="Plot Size:"
            />
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                    Send plots to
                </label>
                <AddressInputField
                    value={destination}
                    setValue={setDestination}
                />
            </div>
            {selectedPlots.length === 1 && 
            <PodRangeSelector
                plot={selectedPlots[0]}
                range={range}
                handleRangeChange={handleRangeChange}
            />
            }
        </div>
    );
}