import { TokenValue } from "@/classes/TokenValue";
import AddressInputField from "@/components/AddressInputField";
import { ComboInputField } from "@/components/ComboInputField";
import PodRangeSelector from "@/components/PodRangeSelector";
import { Label } from "@/components/ui/Label";
import { PODS } from "@/constants/internalTokens";
import { useFarmerField } from "@/state/useFarmerField";
import { Plot } from "@/utils/types";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { PodTransferData } from "../TransferPods";

interface StepTwoProps {
  transferData: PodTransferData[];
  setTransferData: Dispatch<SetStateAction<PodTransferData[]>>;
  destination: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
}

export default function StepTwo({ transferData, setTransferData, destination, setDestination }: StepTwoProps) {
  const { plots } = useFarmerField();
  const [selectedPlots, setSelectedPlots] = useState<Plot[]>([]);
  const [amount, setAmount] = useState<string>("0");
  const [range, setRange] = useState<[TokenValue, TokenValue]>([TokenValue.ZERO, TokenValue.ZERO]);

  useEffect(() => {
    const _newPlots: Plot[] = [];
    for (const data of transferData) {
      const _plot = plots.find((plot) => plot.index.eq(data.id));
      if (_plot) {
        _newPlots.push(_plot);
      }
    }
    setSelectedPlots(_newPlots);
  }, []);

  useEffect(() => {
    if (selectedPlots.length === 1) {
      const plot = selectedPlots[0];
      setRange([plot.index, plot.index.add(plot.pods)]);
    }
  }, [selectedPlots]);

  const handleRangeChange = useCallback(
    (newRange: TokenValue[]) => {
      if (selectedPlots.length === 0 || selectedPlots.length > 1) return;
      const plot = selectedPlots[0];
      const newStart = newRange[0];
      const newEnd = newRange[1];

      const relativeStart = newStart.sub(plot.index);
      const relativeEnd = newEnd.sub(plot.index);

      const newData = [
        {
          id: plot.index,
          start: relativeStart,
          end: relativeEnd,
        },
      ];

      const newAmount = newEnd.sub(newStart).toHuman();

      const batchUpdate = () => {
        setRange([newStart, newEnd]);
        setTransferData(newData);
        setAmount(newAmount);
      };
      batchUpdate();
    },
    [selectedPlots, setTransferData],
  );

  const handleAmountChange = useCallback(
    (value: string) => {
      const newAmount = value;

      if (selectedPlots.length === 0) return;

      const plot = selectedPlots[0];
      const amountValue = TokenValue.fromHuman(newAmount || "0", PODS.decimals);
      const newEnd = plot.index.add(amountValue);

      const newStart = plot.index;
      const relativeStart = newStart.sub(plot.index);
      const relativeEnd = newEnd.sub(plot.index);

      const newData = [
        {
          id: plot.index,
          start: relativeStart,
          end: relativeEnd,
        },
      ];

      const batchUpdate = () => {
        setAmount(newAmount);
        if (selectedPlots.length === 1) {
          setRange([newStart, newEnd]);
          setTransferData(newData);
        }
      };
      batchUpdate();
    },
    [selectedPlots, setTransferData],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>Amount to send</Label>
        <ComboInputField
          mode="plots"
          selectedPlots={selectedPlots}
          setPlots={setSelectedPlots}
          plotSelectionType="multiple"
          amount={amount}
          setAmount={handleAmountChange}
          disableInput={selectedPlots.length > 1}
          altText={selectedPlots.length > 1 ? "Balance:" : "Plot Balance:"}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Send plots to</Label>
        <AddressInputField value={destination} setValue={setDestination} />
      </div>
      {selectedPlots.length === 1 && (
        <PodRangeSelector plot={selectedPlots[0]} range={range} handleRangeChange={handleRangeChange} />
      )}
    </div>
  );
}
