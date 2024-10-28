import { Dispatch, InputHTMLAttributes, SetStateAction, useEffect } from "react";
import { TokenValue } from "@/classes/TokenValue";
import PlotSelect from "./PlotSelect";
import { Input } from "./ui/Input";

export interface ComboPlotInputProps extends InputHTMLAttributes<HTMLInputElement> {
  selectedPlots: any[];
  setPlots: Dispatch<SetStateAction<any>>;
  amount: any;
  setAmount: Dispatch<SetStateAction<any>>;
  type: "single" | "multiple";
}

export default function ComboPlotInputField({ selectedPlots, setPlots, amount, setAmount, type }: ComboPlotInputProps) {
  const multiPlotAmount = selectedPlots.reduce((total, plot) => total.add(plot.pods), TokenValue.ZERO);

  useEffect(() => {
    setAmount(multiPlotAmount.toHuman());
  }, [selectedPlots]);

  return (
    <div>
      <div className="flex flex-row gap-2">
        <Input
          type="number"
          inputMode="numeric"
          disabled={selectedPlots.length > 1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <PlotSelect type={type} setPlots={setPlots} />
      </div>
      {selectedPlots.length && (
        <div className="flex shrink">
          <div
            className="flex cursor-pointer text-[0.8rem] text-muted-foreground hover:text-primary transition-colors"
            onClick={() => {
              selectedPlots?.[0]?.pods?.gt(0) && setAmount(selectedPlots[0].pods.toHuman());
            }}
          >
            {
              /* ${maxAmount > 0 ? Number(maxAmount.toHuman()).toFixed(4) : 0}` */
              `Plot Size:  ${selectedPlots[0] ? selectedPlots[0].pods.toHuman() : 0}`
            }
          </div>
        </div>
      )}
    </div>
  );
}
