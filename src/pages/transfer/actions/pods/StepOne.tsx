import PodLineGraph from "@/components/PodLineGraph";
import { MultiSlider } from "@/components/ui/Slider";
import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { computeTransferData, offsetToAbsoluteIndex } from "@/utils/podTransferUtils";
import { Plot } from "@/utils/types";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PodTransferData } from "../TransferPods";

interface StepOneProps {
  transferData: PodTransferData[];
  setTransferData: Dispatch<SetStateAction<PodTransferData[]>>;
}

function sortPlotsByIndex(plots: Plot[]): Plot[] {
  return [...plots].sort((a, b) => a.index.sub(b.index).toNumber());
}

export default function StepOne({ transferData, setTransferData }: StepOneProps) {
  const { plots } = useFarmerField();
  const harvestableIndex = useHarvestableIndex();

  const [selectedPlots, setSelectedPlots] = useState<Plot[]>([]);
  const [podRange, setPodRange] = useState<[number, number]>([0, 0]);

  const mountedRef = useRef(false);

  // Restore selection from existing transferData on mount
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    if (transferData.length === 0) return;
    const restoredPlots = transferData
      .map((data) => plots.find((p) => p.index.eq(data.id)))
      .filter((p): p is Plot => p !== undefined);
    if (restoredPlots.length > 0) {
      const sorted = sortPlotsByIndex(restoredPlots);
      setSelectedPlots(sorted);
      const total = sorted.reduce((sum, p) => sum + p.pods.toNumber(), 0);
      setPodRange([0, total]);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Total pods across selected plots
  const totalPods = useMemo(() => {
    return selectedPlots.reduce((sum, p) => sum + p.pods.toNumber(), 0);
  }, [selectedPlots]);

  // Derived amount from slider range — no separate state needed
  const amount = podRange[1] - podRange[0];

  // Memoize selectedPlotIndices to avoid new array ref each render
  const selectedPlotIndices = useMemo(() => selectedPlots.map((p) => p.index.toHuman()), [selectedPlots]);

  // Position info — plots are already sorted, use first/last directly
  const positionInfo = useMemo(() => {
    if (selectedPlots.length === 0) return null;
    const first = selectedPlots[0];
    const last = selectedPlots[selectedPlots.length - 1];
    return {
      start: first.index.sub(harvestableIndex),
      end: last.index.add(last.pods).sub(harvestableIndex),
    };
  }, [selectedPlots, harvestableIndex]);

  // Compute selectedPodRange for PodLineGraph (absolute indices)
  const selectedPodRange = useMemo(() => {
    if (selectedPlots.length === 0) return undefined;
    return {
      start: offsetToAbsoluteIndex(podRange[0], selectedPlots),
      end: offsetToAbsoluteIndex(podRange[1], selectedPlots),
    };
  }, [selectedPlots, podRange]);

  // Handle plot selection changes: sort, reset slider, update transferData
  const handlePlotSelection = useCallback(
    (newPlots: Plot[]) => {
      const sorted = sortPlotsByIndex(newPlots);
      setSelectedPlots(sorted);

      if (sorted.length > 0) {
        const newTotal = sorted.reduce((sum, p) => sum + p.pods.toNumber(), 0);
        setPodRange([0, newTotal]);
        setTransferData(computeTransferData(sorted, [0, newTotal]));
      } else {
        setPodRange([0, 0]);
        setTransferData([]);
      }
    },
    [setTransferData],
  );

  // Toggle logic: if all in group selected → deselect, else add
  const handlePlotGroupSelect = useCallback(
    (plotIndices: string[]) => {
      const groupSet = new Set(plotIndices);
      const plotsInGroup = plots.filter((p) => groupSet.has(p.index.toHuman()));
      if (plotsInGroup.length === 0) return;

      const selectedSet = new Set(selectedPlots.map((p) => p.index.toHuman()));
      const allSelected = plotIndices.every((idx) => selectedSet.has(idx));

      if (allSelected) {
        handlePlotSelection(selectedPlots.filter((p) => !groupSet.has(p.index.toHuman())));
        return;
      }

      const newPlots = [...selectedPlots];
      for (const plotToAdd of plotsInGroup) {
        if (!selectedSet.has(plotToAdd.index.toHuman())) {
          newPlots.push(plotToAdd);
        }
      }
      handlePlotSelection(newPlots);
    },
    [plots, selectedPlots, handlePlotSelection],
  );

  // Slider change handler
  const handlePodRangeChange = useCallback(
    (value: number[]) => {
      const newRange: [number, number] = [value[0], value[1]];
      setPodRange(newRange);
      setTransferData(computeTransferData(selectedPlots, newRange));
    },
    [selectedPlots, setTransferData],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Pod Line Graph Visualization */}
      <div className="flex flex-col gap-3">
        <PodLineGraph
          selectedPlotIndices={selectedPlotIndices}
          selectedPodRange={selectedPodRange}
          label="My Pods In Line"
          onPlotGroupSelect={handlePlotGroupSelect}
          className="h-24"
        />

        {/* Position in Line Display */}
        {positionInfo && (
          <div className="flex justify-center">
            <p className="pinto-body text-pinto-light">
              {positionInfo.start.toHuman("short")} - {positionInfo.end.toHuman("short")}
            </p>
          </div>
        )}
      </div>

      {/* Total Pods Summary */}
      {totalPods > 0 && (
        <div className="flex justify-between items-center p-4 bg-pinto-gray-1 rounded-lg">
          <p className="pinto-body text-pinto-light">Total Pods to send:</p>
          <p className="pinto-body font-semibold">{formatter.noDec(amount)} Pods</p>
        </div>
      )}

      {/* MultiSlider for pod range selection */}
      {selectedPlots.length > 0 && (
        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center gap-4 w-full">
            <p className="pinto-body text-pinto-light whitespace-nowrap">Select Pods</p>
            <div className="flex items-center gap-3 flex-1 p-4">
              <p className="pinto-body text-pinto-light w-[60px] text-right">{formatter.noDec(podRange[0])}</p>
              <div className="flex-1">
                {totalPods > 0 && (
                  <MultiSlider
                    value={podRange}
                    onValueChange={handlePodRangeChange}
                    step={1}
                    min={0}
                    max={totalPods}
                    className="w-full"
                  />
                )}
              </div>
              <p className="pinto-body text-pinto-light w-[60px] text-right">{formatter.noDec(podRange[1])}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
