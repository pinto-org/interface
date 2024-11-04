import arrowDown from "@/assets/misc/ChevronDown.svg";
import plotIcon from "@/assets/protocol/Plot.svg";
import podIcon from "@/assets/protocol/Pod.png";
import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { useFarmerField } from "@/state/useFarmerField";
import { useFieldData } from "@/state/useFieldData";
import { Plot } from "@/utils/types";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { CheckmarkIcon } from "./Icons";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { Separator } from "./ui/Separator";
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";

function PlotSelectItem({
  plot,
  harvestableIndex,
  type,
  selectedPlots,
}: {
  plot: Plot;
  harvestableIndex: TokenValue;
  type: "single" | "multiple";
  selectedPlots: string[];
}) {
  const isSelected = selectedPlots.includes(plot.index.toHuman());

  const content = (
    <ToggleGroupItem
      value={plot.index.toHuman()}
      aria-label={`Select Plot at ${plot.index.sub(harvestableIndex).toHuman("short")}`}
      className="flex flex-row w-[105%] py-4 h-auto justify-between data-[state=on]:bg-transparent hover:bg-pinto-gray-1 data-[state=on]:hover:bg-pinto-gray-1"
    >
      <div className="flex flex-row items-center gap-4">
        <div
          className={`w-6 h-6 border rounded-full flex items-center justify-center ${isSelected ? "border-pinto-green-4 bg-pinto-green-1 text-pinto-green-4" : "border-black bg-transparent"}`}
        >
          {isSelected && <CheckmarkIcon color="currentColor" width={16} height={16} />}
        </div>
        <img src={podIcon} alt="Pod" className="w-12 h-12" />
        <div className="flex flex-col gap-1">
          <div className="flex justify-start font-[400] text-[1.25rem] text-pinto-gray-5">PODS</div>
          <div className="flex justify-start font-[340] text-[1rem] text-pinto-gray-4">
            {`Index: ${plot.index.toHuman()}`}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-end font-[340] text-[1.5rem] text-black">
          {plot.pods?.gt(0) ? Number(plot.pods.toHuman()).toFixed(4) : 0}
        </div>
        <div className="flex justify-end font-[340] text-[1rem] text-pinto-gray-4">
          {`@ ${plot.index.sub(harvestableIndex).toHuman("short")} in Line`}
        </div>
      </div>
    </ToggleGroupItem>
  );

  return type === "single" ? <DialogClose className="flex flex-row w-[105%]">{content}</DialogClose> : content;
}

export default function PlotSelect({
  setPlots,
  type = "multiple",
  size,
  disabled,
  selectedPlots,
}: {
  setPlots: React.Dispatch<React.SetStateAction<Plot[]>>;
  type?: "single" | "multiple";
  size?: "small" | undefined;
  disabled?: boolean | undefined;
  selectedPlots?: Plot[] | undefined;
}) {
  const account = useAccount();
  const farmerField = useFarmerField();
  const fieldData = useFieldData();

  const [_plots, setInternalPlots] = useState<string[]>([]);

  useEffect(() => {
    if (selectedPlots) {
      const defaultPlots = selectedPlots?.map((plot) => plot.index.toHuman()) || [];
      setInternalPlots(defaultPlots);
    }
  }, [selectedPlots]);

  function selectPlot(value: string | string[]) {
    const plotOutput: Plot[] = [];
    const valueArray = Array.isArray(value) ? value : [value];

    valueArray.forEach((index) => {
      const plotIndex = farmerField.plots.findIndex((plot) => plot.index.toHuman() === index);
      if (plotIndex !== -1) {
        plotOutput.push(farmerField.plots[plotIndex]);
      }
    });

    setInternalPlots(valueArray);
    setPlots(plotOutput);
  }

  const displayText =
    _plots.length === 0 ? (
      "Select Plots"
    ) : _plots.length === 1 ? (
      <div className="flex flex-row gap-1">
        <span>Pods</span>
        <span className="text-pinto-gray-4">@</span>
        <span>{`${TokenValue.fromHuman(_plots[0], PODS.decimals).sub(fieldData.harvestableIndex).toHuman("short")} in Line`}</span>
      </div>
    ) : (
      /* `${_plots.length} Plots` */ "Pods"
    );

  const plotItems = farmerField.plots.map((plot) => (
    <PlotSelectItem
      key={`selectPlot${plot.index.toHuman()}`}
      plot={plot}
      harvestableIndex={fieldData.harvestableIndex}
      type={type}
      selectedPlots={_plots}
    />
  ));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={`${disabled ? "pointer-events-none" : "pointer-events-auto"} flex-none items-center ${size === "small" ? "" : "h-12"} gap-1.5 border border-pinto-gray-blue bg-white hover:bg-pinto-gray-1 drop-shadow-pinto-token-select rounded-full text-black text-[1.25rem] font-[300] leading-[1.3875rem] tracking-[1px]`}
        >
          <img src={podIcon} alt="Pods" className={`${size === "small" ? "w-5 h-5" : "w-6 h-6"}`} />
          {displayText}
          {!disabled && <img src={arrowDown} className="w-4 h-4" alt="open plot select dialog" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="font-pinto overflow-x-clip">
        <DialogHeader>
          <DialogTitle>
            <span className="font-[400] text-[1.25rem]">Select Plot{type === "multiple" ? "s" : ""}</span>
            <Separator className="w-[120%] -ml-6 mt-6" />
          </DialogTitle>
          <DialogDescription>
            {account.address ? (
              <div className="mt-2">
                {type === "multiple" ? (
                  <ToggleGroup
                    type="multiple"
                    value={_plots}
                    onValueChange={(value) => {
                      if (value) selectPlot(value);
                    }}
                    className="flex flex-col w-full h-auto justify-between gap-2"
                  >
                    {plotItems}
                  </ToggleGroup>
                ) : (
                  <ToggleGroup
                    type="single"
                    value={_plots[0]}
                    onValueChange={(value) => {
                      if (value) selectPlot(value);
                    }}
                    className="flex flex-col w-full h-auto justify-between gap-2"
                  >
                    {plotItems}
                  </ToggleGroup>
                )}
              </div>
            ) : (
              "Connect your wallet to see your Plots"
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
