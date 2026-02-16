import AddressInputField from "@/components/AddressInputField";
import PintoAssetTransferNotice from "@/components/PintoAssetTransferNotice";
import PodLineGraph from "@/components/PodLineGraph";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { MultiSlider } from "@/components/ui/Slider";
import { useFarmerBeanstalkRepayment } from "@/state/useFarmerBeanstalkRepayment";
import { formatter } from "@/utils/format";
import { computeTransferData, offsetToAbsoluteIndex } from "@/utils/podTransferUtils";
import { Plot } from "@/utils/types";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PodTransferData } from "../TransferBeanstalkPods";

interface StepOneProps {
  transferData: PodTransferData[];
  setTransferData: Dispatch<SetStateAction<PodTransferData[]>>;
  destination: string | undefined;
  setDestination: Dispatch<SetStateAction<string | undefined>>;
  transferNotice: boolean;
  setTransferNotice: Dispatch<SetStateAction<boolean>>;
}

function sortPlotsByIndex(plots: Plot[]): Plot[] {
  return [...plots].sort((a, b) => a.index.sub(b.index).toNumber());
}

export default function StepOne({
  transferData,
  setTransferData,
  destination,
  setDestination,
  transferNotice,
  setTransferNotice,
}: StepOneProps) {
  const repaymentPods = useFarmerBeanstalkRepayment().pods;
  const { plots, harvestableIndex, podIndex } = repaymentPods;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Total pods across selected plots
  const totalPods = useMemo(() => {
    return selectedPlots.reduce((sum, p) => sum + p.pods.toNumber(), 0);
  }, [selectedPlots]);

  const amount = podRange[1] - podRange[0];

  const selectedPlotIndices = useMemo(() => selectedPlots.map((p) => p.index.toHuman()), [selectedPlots]);

  const positionInfo = useMemo(() => {
    if (selectedPlots.length === 0) return null;
    const first = selectedPlots[0];
    const last = selectedPlots[selectedPlots.length - 1];
    return {
      start: first.index.sub(harvestableIndex),
      end: last.index.add(last.pods).sub(harvestableIndex),
    };
  }, [selectedPlots, harvestableIndex]);

  const selectedPodRange = useMemo(() => {
    if (selectedPlots.length === 0) return undefined;
    return {
      start: offsetToAbsoluteIndex(podRange[0], selectedPlots),
      end: offsetToAbsoluteIndex(podRange[1], selectedPlots),
    };
  }, [selectedPlots, podRange]);

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

  const handlePodRangeChange = useCallback(
    (value: number[]) => {
      const newRange: [number, number] = [value[0], value[1]];
      setPodRange(newRange);
      setTransferData(computeTransferData(selectedPlots, newRange));
    },
    [selectedPlots, setTransferData],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link to="/market/pods/buy/fill?beanstalk=true">Buy on Market</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/market/pods/sell/create?beanstalk=true">Sell on Market</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <Label>My Pods In Line</Label>
        <PodLineGraph
          plots={plots}
          customHarvestableIndex={harvestableIndex}
          customPodIndex={podIndex}
          selectedPlotIndices={selectedPlotIndices}
          selectedPodRange={selectedPodRange}
          label=""
          onPlotGroupSelect={handlePlotGroupSelect}
          className="h-24"
        />

        {positionInfo && (
          <div className="flex justify-center">
            <p className="pinto-body text-pinto-light">
              {positionInfo.start.toHuman("short")} - {positionInfo.end.toHuman("short")}
            </p>
          </div>
        )}
      </div>

      {totalPods > 0 && (
        <div className="flex justify-between items-center p-4 bg-pinto-gray-1 rounded-lg">
          <p className="pinto-body text-pinto-light">Total Pods to send:</p>
          <p className="pinto-body font-semibold">{formatter.noDec(amount)} Pods</p>
        </div>
      )}

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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-2"
      >
        <Label>Send to</Label>
        <AddressInputField value={destination} setValue={setDestination} />
        <AnimatePresence>
          {destination && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PintoAssetTransferNotice
                transferNotice={transferNotice}
                setTransferNotice={setTransferNotice}
                customDestinationText="Pods"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
