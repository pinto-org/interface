import { TV, TokenValue } from "@/classes/TokenValue";
import { useHarvestableIndex } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { Plot } from "@/utils/types";
import { Dispatch, InputHTMLAttributes, SetStateAction, useEffect, useMemo } from "react";
import PlotSelect from "./PlotSelect";
import SimpleInputField from "./SimpleInputField";
import Text from "./ui/Text";

export interface ComboPlotInputProps extends InputHTMLAttributes<HTMLInputElement> {
  selectedPlots: Plot[];
  setPlots: Dispatch<SetStateAction<any>>;
  amount: any;
  setAmount: Dispatch<SetStateAction<any>>;
  type: "single" | "multiple";
  minAmount?: TV;
  maxAmount?: TV;
  maxPlaceInLine?: TV;
}

export default function ComboPlotInputField({
  selectedPlots,
  setPlots,
  amount,
  setAmount,
  type,
  minAmount,
  maxAmount,
  maxPlaceInLine,
}: ComboPlotInputProps) {
  const harvestableIndex = useHarvestableIndex();
  const { multiPlotAmount, effectiveMax, isWithinRange } = useMemo(() => {
    // Total amount of pods across selected plots
    const multiPlotAmount = selectedPlots.reduce((total, plot) => total.add(plot.pods), TokenValue.ZERO);
    // The end place in line of the furthest selected plot
    const multiPlotEnd = selectedPlots
      .reduce((endIndex, plot) => {
        const plotEnd = plot.index.add(plot.pods);
        return plotEnd.gt(endIndex) ? plotEnd : endIndex;
      }, TokenValue.ZERO)
      .sub(harvestableIndex);

    return {
      multiPlotAmount,
      effectiveMax: maxAmount?.lt(multiPlotAmount) ? maxAmount : multiPlotAmount,
      isWithinRange: !maxPlaceInLine || maxPlaceInLine.gt(multiPlotEnd),
    };
  }, [selectedPlots, maxAmount, maxPlaceInLine, harvestableIndex]);

  const tooSmall = !minAmount || multiPlotAmount?.lt(minAmount);
  const valid = isWithinRange && !tooSmall;

  useEffect(() => {
    if (valid) {
      setAmount(effectiveMax.toNumber());
    } else {
      setAmount(0);
    }
  }, [setAmount, effectiveMax, valid]);

  const numInputValidation = useMemo(
    () => ({
      minValue: minAmount?.toNumber() ?? 0.000001,
      maxValue: effectiveMax.toNumber(),
      maxDecimals: 6,
    }),
    [effectiveMax, minAmount],
  );

  return (
    <div>
      <div className="flex flex-row gap-2">
        <SimpleInputField
          amount={amount}
          setAmount={setAmount}
          validation={numInputValidation}
          placeholder={effectiveMax.toNumber().toString()}
          disabled={selectedPlots.length > 1 || !isWithinRange}
        />
        <PlotSelect type={type} setPlots={setPlots} />
      </div>
      {selectedPlots.length > 0 && (
        <>
          {!valid && (
            <>
              {!isWithinRange && (
                <p className="pinto-sm text-pinto-error mt-1">The selected plot is outside of the order's range.</p>
              )}
              {isWithinRange && tooSmall && (
                <p className="pinto-sm text-pinto-error mt-1">The selected plot is too small.</p>
              )}
            </>
          )}
          {valid && (
            <div className="flex shrink">
              <div
                className="flex cursor-pointer text-[0.8rem] text-muted-foreground hover:text-primary transition-colors"
                onClick={() => {
                  multiPlotAmount.gt(0) && setAmount(effectiveMax.toNumber());
                }}
              >
                {type === "single" && (
                  <>
                    Plot Size: {formatter.number(multiPlotAmount.toNumber(), { minDecimals: 0, maxDecimals: 2 })}{" "}
                    {!effectiveMax.eq(multiPlotAmount) && `(Max ${effectiveMax.toHuman()})`}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
