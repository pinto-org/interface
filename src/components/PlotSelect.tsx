import arrowDown from "@/assets/misc/ChevronDown.svg";
import podIcon from "@/assets/protocol/Pod.png";
import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { Plot } from "@/utils/types";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import CheckmarkCircle from "./CheckmarkCircle";
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
import { ScrollArea } from "./ui/ScrollArea";
import { Separator } from "./ui/Separator";
import Text from "./ui/Text";
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";
import { Description } from "@radix-ui/react-dialog";

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
        <CheckmarkCircle isSelected={isSelected} />
        <img src={podIcon} alt="Pod" className="w-12 h-12" />
        <div className="flex flex-col gap-1">
          <div className="flex justify-start font-[400] text-[1.25rem] text-pinto-gray-5">PODS</div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-end font-[340] text-[1.5rem] text-black">
          {plot.pods?.gt(0) ? formatter.number(plot.pods) : 0}
        </div>
        <div className="flex justify-end font-[340] text-[1rem] text-pinto-gray-4">
          {`@ ${plot.index.sub(harvestableIndex).toHuman("short")} in Line`}
        </div>
      </div>
    </ToggleGroupItem>
  );

  return type === "single" ? (
    <DialogClose asChild className="flex flex-row w-[105%]">
      {content}
    </DialogClose>
  ) : (
    content
  );
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
  const harvestableIndex = useHarvestableIndex();

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
        <span>{`${TokenValue.fromHuman(_plots[0], PODS.decimals).sub(harvestableIndex).toHuman("short")} in Line`}</span>
      </div>
    ) : (
      /* `${_plots.length} Plots` */ "Pods"
    );

  const plotItems = farmerField.plots.map((plot) => (
    <PlotSelectItem
      key={`selectPlot${plot.index.toHuman()}`}
      plot={plot}
      harvestableIndex={harvestableIndex}
      type={type}
      selectedPlots={_plots}
    />
  ));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={`${disabled ? "pointer-events-none" : "pointer-events-auto"} flex-none items-center ${size === "small" ? "" : "h-12"} gap-1.5 border border-pinto-gray-blue bg-white hover:bg-pinto-gray-1 drop-shadow-pinto-token-select rounded-full`}
        >
          <img src={podIcon} alt="Pods" className={`${size === "small" ? "w-5 h-5" : "w-6 h-6"}`} />
          <div className="hidden sm:block pinto-body-light">{displayText}</div>
          {!disabled && <img src={arrowDown} className="w-4 h-4" alt="open plot select dialog" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="font-pinto overflow-x-clip">
        <DialogHeader>
          <DialogTitle>
            <span className="font-[400] text-[1.25rem]">Select Plot{type === "multiple" ? "s" : ""}</span>
            <Separator className="w-[120%] -ml-6 mt-6" />
          </DialogTitle>
          <Description className="sr-only">Select plots to sell to order</Description>
          <ScrollArea className="h-[400px] -mx-3 px-3">
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
              <div className="flex justify-center mt-4">Connect your wallet to see your Plots</div>
            )}
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
