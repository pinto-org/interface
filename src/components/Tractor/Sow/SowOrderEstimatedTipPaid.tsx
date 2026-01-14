import { TV } from "@/classes/TokenValue";
import { Row } from "@/components/Container";
import TooltipSimple from "@/components/TooltipSimple";
import IconImage from "@/components/ui/IconImage";
import { DEFAULT_DELTA, INITIAL_CULTIVATION_FACTOR } from "@/constants/calculations";
import { useCultivationFactor } from "@/hooks/pinto/useCultivationFactor";
import { useInitialSoil } from "@/state/useFieldData";
import { usePriceData } from "@/state/usePriceData";
import { useMainToken } from "@/state/useTokenData";
import { NUMBER_ABBR_THRESHOLDS, formatter } from "@/utils/format";
import { solveArithmeticSeriesForN } from "@/utils/math";
import { postSanitizedSanitizedValue } from "@/utils/string";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { SowOrderV0FormSchema } from "../form/SowOrderV0Schema";
import { TractorOperatorTipStrategy, getTractorOperatorTipAmountFromPreset } from "../form/fields/sharedFields";

interface SowOrderEstimatedTipPaidProps {
  averageTipPaid: number;
  operatorTipPreset: TractorOperatorTipStrategy;
}

export const SowOrderEstimatedTipPaid = ({ averageTipPaid, operatorTipPreset }: SowOrderEstimatedTipPaidProps) => {
  const mainToken = useMainToken();
  const form = useFormContext<SowOrderV0FormSchema>();

  // Fetch data for accurate arithmetic series calculation
  const { data: cultivationFactor, isLoading: isCultivationLoading } = useCultivationFactor();
  const { initialSoil, isLoading: isInitialSoilLoading } = useInitialSoil();
  const { price: pintoPrice } = usePriceData();

  const [operatorTip, customOperatorTip, maxPerSeason, minSoil, totalAmount] = useWatch({
    control: form.control,
    name: ["operatorTip", "customOperatorTip", "maxPerSeason", "minSoil", "totalAmount"],
  }) as [string | undefined, string | undefined, string, string, string];

  const tipEstimations = useMemo(() => {
    const total = postSanitizedSanitizedValue(totalAmount ?? "", mainToken.decimals).tv;
    const max = postSanitizedSanitizedValue(maxPerSeason ?? "", mainToken.decimals).tv;
    const min = postSanitizedSanitizedValue(minSoil ?? "", mainToken.decimals).tv;

    // Calculate tip from preset (same as OperatorTipPresetDropdown does)
    // Use customOperatorTip when preset is Custom, otherwise use operatorTip
    const tipAmount = operatorTipPreset === "Custom" ? customOperatorTip : operatorTip;
    const tip =
      getTractorOperatorTipAmountFromPreset(operatorTipPreset, averageTipPaid, tipAmount, mainToken.decimals) ??
      TV.ZERO;

    if (total.eq(0) || tip.eq(0)) {
      return {
        min: TV.ZERO,
        max: TV.ZERO,
      };
    }

    // Min executions = total / maxPerSeason (fewer executions = lower tip)
    const minTimes = max.gt(0) ? total.div(max) : TV.ZERO;

    // Max executions using accurate arithmetic series calculation
    let maxTimes: TV;

    // Check if we have all required data for accurate calculation
    if (!cultivationFactor || !initialSoil || isCultivationLoading || isInitialSoilLoading || !pintoPrice) {
      // Fallback to simple division while loading or if data unavailable
      maxTimes = min.gt(0) ? total.div(min) : TV.ZERO;
    } else {
      // Calculate initial value: initialSoil * INITIAL_CULTIVATION_FACTOR / cultivationFactor
      const initialValue = initialSoil.mul(INITIAL_CULTIVATION_FACTOR).div(cultivationFactor);

      // Calculate delta: (DEFAULT_DELTA * initialValue / 1e6) * pintoPrice / 1e6
      // Note: pintoPrice is TokenValue with 6 decimals, so divide by 1e6 to normalize
      const delta = initialValue.mul(DEFAULT_DELTA).div(1e6).mul(pintoPrice).div(1e6);

      // Solve for number of executions using arithmetic series
      const maxExecutions = solveArithmeticSeriesForN(total, initialValue, delta);

      // Convert number to TokenValue
      maxTimes = TV.fromHuman(maxExecutions, mainToken.decimals);
    }

    return {
      min: minTimes.mul(tip),
      max: maxTimes.mul(tip),
    };
  }, [
    operatorTip,
    customOperatorTip,
    maxPerSeason,
    minSoil,
    totalAmount,
    operatorTipPreset,
    averageTipPaid,
    mainToken.decimals,
    cultivationFactor,
    initialSoil,
    pintoPrice,
    isCultivationLoading,
    isInitialSoilLoading,
  ]);

  return (
    <Row className="w-full justify-between">
      <Row className="gap-1 items-center">
        <div className="pinto-sm-light text-pinto-secondary">Estimated Total Tip</div>
        <TooltipSimple
          variant="outlined"
          content={
            <span>
              The total tip paid depends on the number of executions needed to fill your order, based on the Soil supply
              and Cultivation Factor.{" "}
              <a
                href="https://docs.pinto.money/pinto-mechanics/field-the-most-innovative-lending-facility-in-crypto/the-cultivation-system-optimal-soil-issuance"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-pinto-green-4"
              >
                Learn more
              </a>
            </span>
          }
        />
      </Row>
      <Row className="gap-1 pinto-sm font-normal">
        <IconImage src={mainToken.logoURI} alt="PINTO" size={4} className="rounded-full" />
        {formatter.number(tipEstimations.min, {
          maxDecimals: 2,
          compact: tipEstimations.min.toNumber() >= NUMBER_ABBR_THRESHOLDS.BILLION,
        })}{" "}
        -{" "}
        {formatter.number(tipEstimations.max, {
          maxDecimals: 2,
          compact: tipEstimations.max.toNumber() >= NUMBER_ABBR_THRESHOLDS.BILLION,
        })}
      </Row>
    </Row>
  );
};
