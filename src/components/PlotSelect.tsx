import { useState } from "react";
import { useAccount } from "wagmi";
import { useFarmerField } from "@/state/useFarmerField";
import { TokenValue } from "@/classes/TokenValue";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog";
import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup";
import { useFieldData } from "@/state/useFieldData";
import { PODS } from "@/constants/internalTokens";
import { Plot } from "@/utils/types";

export default function PlotSelect({
  setPlots,
  type = "multiple",
}: {
  setPlots: React.Dispatch<React.SetStateAction<any>>,
  type?: "single" | "multiple"
}) {
  const account = useAccount();
  const farmerField = useFarmerField();
  const fieldData = useFieldData();
  const [_plots, setInternalPlots] = useState<any[]>([]);

  function selectPlot(value: any) {
    const plotOutput: Plot[] = [];
    if (type === "multiple") {
      value.forEach((index: string) => {
        const plotIndex = farmerField.plots.findIndex((plot) => plot.index.toHuman() === index);
        plotOutput.push(farmerField.plots[plotIndex]);
      });
      setInternalPlots(value);
    } else if (type === "single") {
      const plotIndex = farmerField.plots.findIndex((plot) => plot.index.toHuman() === value);
      plotOutput.push(farmerField.plots[plotIndex]);
      setInternalPlots([value]);
    };
    setPlots(plotOutput);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          {_plots.length === 0
            ? "Select Plots"
            : _plots.length === 1
              ? `@${TokenValue.fromHuman(_plots[0], PODS.decimals).sub(fieldData.harvestableIndex).toHuman("short")}`
              : `${_plots.length} PLOTS`}
        </Button>
      </DialogTrigger>
      <DialogContent className="font-pinto">
        <DialogHeader>
          <DialogTitle>Select Plots</DialogTitle>
          <DialogDescription>
            {account.address ? (
              <>
                <ToggleGroup
                  type={type}
                  value={type === "single" ? _plots[0] : _plots as any}
                  onValueChange={(value) => {
                    if (value) selectPlot(value);
                  }}
                  className="flex flex-col w-full h-auto justify-between"
                >
                  {farmerField.plots.map((plot) => {
                    return (
                      <ToggleGroupItem
                        key={`selectPlot${plot.index.toHuman()}`}
                        value={plot.index.toHuman()}
                        aria-label={`Select Plot at ${plot.index.sub(fieldData.harvestableIndex).toHuman("short")}`}
                        className="flex flex-row w-full py-2 h-auto justify-between"
                      >
                        <div className="flex flex-col">
                          <div className="flex justify-start text-xl">PODS</div>
                          <div className="flex justify-start text-xs">{`Place In Line: ${plot.index.sub(fieldData.harvestableIndex).toHuman("short")}`}</div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex justify-end text-xl">
                            {plot.pods?.gt(0) ? Number(plot.pods.toHuman()).toFixed(4) : 0}
                          </div>
                        </div>
                      </ToggleGroupItem>
                    );
                  })}
                </ToggleGroup>
              </>
            ) : (
              "Connect your wallet to see your Plots"
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
