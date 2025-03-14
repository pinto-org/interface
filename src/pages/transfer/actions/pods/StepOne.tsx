import { TokenValue } from "@/classes/TokenValue";
import PlotsTable from "@/components/PlotsTable";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import useFarmerField from "@/state/useFarmerField";
import { Plot } from "@/utils/types";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { PodTransferData } from "../TransferPods";

interface StepOneProps {
  transferData: PodTransferData[];
  setTransferData: Dispatch<SetStateAction<PodTransferData[]>>;
}

export default function StepOne({ transferData, setTransferData }: StepOneProps) {
  const [selected, setSelected] = useState<string[]>();
  const { plots } = useFarmerField();

  useEffect(() => {
    const _newPlots: string[] = [];
    for (const data of transferData) {
      const _plot = plots.find((plot) => plot.index.eq(data.id));
      if (_plot) {
        _newPlots.push(_plot.index.toHuman());
      }
    }
    setSelected(_newPlots);
  }, []);

  const handlePlotSelection = useCallback(
    (value: string[]) => {
      // Update selected plots
      setSelected(value);

      // Get selected plots data
      const selectedPlots = value
        .map((plotIndex) => {
          const plot = plots.find((p) => p.index.toHuman() === plotIndex);
          return plot;
        })
        .filter((plot): plot is Plot => plot !== undefined && !plot.fullyHarvested);

      // If no valid plots selected, clear transfer data
      if (selectedPlots.length === 0) {
        setTransferData([]);
        return;
      }

      // Create plot transfer data
      const transferData = selectedPlots.map((plot) => {
        return {
          id: plot.index,
          start: TokenValue.ZERO,
          end: plot.pods,
        };
      });

      // Update transfer data
      setTransferData(transferData);
    },
    [plots, setTransferData],
  );

  const selectAllPlots = useCallback(() => {
    const plotIndexes = plots.map((plot) => plot.index.toHuman());
    handlePlotSelection(plotIndexes);
  }, [plots, handlePlotSelection]);

  return (
    <>
      <div className="flex flex-row justify-end -mt-[3.5rem] sm:-mt-[5rem]">
        <Button
          className={`font-[340] sm:pr-0 text-[1rem] sm:text-[1.25rem] text-pinto-green-4 bg-transparent hover:underline hover:bg-transparent`}
          onClick={() => selectAllPlots()}
        >
          Select all Plots
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <Label>Which Plots do you want to send?</Label>
        <ToggleGroup
          type="multiple"
          value={selected}
          onValueChange={handlePlotSelection}
          className="flex flex-col w-auto h-auto justify-between gap-2"
        >
          <PlotsTable selected={selected} useToggle />
        </ToggleGroup>
      </div>
    </>
  );
}
