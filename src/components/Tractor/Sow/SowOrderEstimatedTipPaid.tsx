import { TV } from "@/classes/TokenValue";
import { Row } from "@/components/Container";
import TooltipSimple from "@/components/TooltipSimple";
import IconImage from "@/components/ui/IconImage";
import { useMainToken } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
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

  const [customOperatorTip, maxPerSeason, minSoil, totalAmount] = useWatch({
    control: form.control,
    name: ["customOperatorTip", "maxPerSeason", "minSoil", "totalAmount"],
  }) as [string | undefined, string, string, string];

  const tipEstimations = useMemo(() => {
    const total = postSanitizedSanitizedValue(totalAmount ?? "", mainToken.decimals).tv;
    const max = postSanitizedSanitizedValue(maxPerSeason ?? "", mainToken.decimals).tv;
    const min = postSanitizedSanitizedValue(minSoil ?? "", mainToken.decimals).tv;

    // Calculate tip from preset (same as OperatorTipPresetDropdown does)
    const tip =
      getTractorOperatorTipAmountFromPreset(operatorTipPreset, averageTipPaid, customOperatorTip, mainToken.decimals) ??
      TV.ZERO;

    if (total.eq(0) || tip.eq(0)) {
      return {
        min: TV.ZERO,
        max: TV.ZERO,
      };
    }

    // Min executions = total / maxPerSeason (fewer executions = lower tip)
    // Max executions = total / minSoil (more executions = higher tip)
    const minTimes = max.gt(0) ? total.div(max) : TV.ZERO;
    const maxTimes = min.gt(0) ? total.div(min) : TV.ZERO;

    return {
      min: minTimes.mul(tip),
      max: maxTimes.mul(tip),
    };
  }, [customOperatorTip, maxPerSeason, minSoil, totalAmount, operatorTipPreset, averageTipPaid, mainToken.decimals]);

  return (
    <Row className="w-full justify-between">
      <Row className="gap-1 items-center">
        <div className="pinto-sm-light text-pinto-secondary">Estimated Total Tip Paid</div>
        <TooltipSimple
          variant="outlined"
          content={`The minimum and maximum Pinto you will have paid to the Operator to complete this Order, depending on the number of fills it takes to fill your entire order.`}
        />
      </Row>
      <Row className="gap-1 pinto-sm font-normal">
        <IconImage src={mainToken.logoURI} alt="PINTO" size={4} className="rounded-full" />
        {formatter.token(tipEstimations.min, mainToken)} - {formatter.token(tipEstimations.max, mainToken)}
      </Row>
    </Row>
  );
};
