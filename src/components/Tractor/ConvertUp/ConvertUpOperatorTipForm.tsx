import { Col } from "@/components/Container";
import { Row } from "@/components/Container";
import TooltipSimple from "@/components/TooltipSimple";
import IconImage from "@/components/ui/IconImage";
import { Separator } from "@/components/ui/Separator";
import useSafeTokenValue from "@/hooks/useSafeTokenValue";
import { useMainToken } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { postSanitizedSanitizedValue } from "@/utils/string";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { CustomOperatorTipFormField, TractorFormButtonsRow } from "../form/fields/sharedFields";
import { ConvertUpTractorOrderFormStep, useConvertUpOrderFormContext } from "./ConvertUpTractorContext";

const ConvertUpCustomOperatorTipForm = ({ averageTipPaid }: { averageTipPaid: number }) => {
  return (
    <Col className="w-full gap-6">
      <div className="flex flex-col gap-2">
        <div className="pinto-body font-medium text-pinto-secondary mb-4">{"🚜 Custom Operator Tip"}</div>
        <Separator className="h-[1px] w-full bg-pinto-gray-2" />
      </div>
      <Col className="w-full justify-between min-h-[21rem] h-full">
        <CustomOperatorTipFormField averageTipPaid={averageTipPaid} />
        <ConvertUpEstimatedTipPaid />
      </Col>
      <ButtonRow />
    </Col>
  );
};

export default ConvertUpCustomOperatorTipForm;

const ButtonRow = () => {
  const { form, formStep, setFormStep } = useConvertUpOrderFormContext();

  const customOperatorTipAmount = useWatch({ control: form.control, name: "customOperatorAmount" });
  const tipAmountTV = useSafeTokenValue(customOperatorTipAmount ?? "", 6);

  const handleBack = () => {
    setFormStep(ConvertUpTractorOrderFormStep.REVIEW);
  };

  const handleNext = () => {
    if (!customOperatorTipAmount) {
      return;
    }

    form.setValue("operatorTip", customOperatorTipAmount);
    setFormStep(ConvertUpTractorOrderFormStep.REVIEW);
  };

  return (
    <TractorFormButtonsRow
      handleLeft={handleBack}
      handleRight={handleNext}
      left={{
        content: "← Back",
      }}
      right={{
        content: "Submit",
        disabled: tipAmountTV.lte(0),
      }}
    />
  );
};

export const ConvertUpEstimatedTipPaid = () => {
  const { form, operatorTipPreset: preset } = useConvertUpOrderFormContext();
  const mainToken = useMainToken();

  const values = useWatch({ control: form.control });
  const customAmount = values.customOperatorAmount;
  const operatorTip = values.operatorTip;
  const maxPerExecution = values.maxConvertBdvPerExecution;
  const minPerExecution = values.minConvertBdvPerExecution;
  const totalAmount = values.totalConvertBdv;

  const tipPerExecution = preset === "Custom" && customAmount ? customAmount : operatorTip;

  const tipEstimations = useMemo(() => {
    const total = postSanitizedSanitizedValue(totalAmount ?? "", mainToken.decimals).tv;
    const max = postSanitizedSanitizedValue(maxPerExecution ?? "", mainToken.decimals).tv;
    const min = postSanitizedSanitizedValue(minPerExecution ?? "", mainToken.decimals).tv;

    const tip = postSanitizedSanitizedValue(tipPerExecution ?? "", mainToken.decimals).tv;

    const minTimes = total.div(max);
    const maxTimes = total.div(min);

    return {
      min: minTimes.mul(tip),
      max: maxTimes.mul(tip),
    };
  }, [tipPerExecution, maxPerExecution, minPerExecution, totalAmount, mainToken]);

  return (
    <Row className="w-full justify-between">
      <Row className="gap-1 items-center">
        <div className="pinto-sm-light text-pinto-secondary">Estimated Total Tip Paid</div>
        <TooltipSimple
          variant="outlined"
          content={`The minimum and maximum ${mainToken.symbol} you will have paid to the Operator to complete this Order`}
        />
      </Row>
      <Row className="gap-1 pinto-sm font-normal">
        <IconImage src={mainToken.logoURI} alt="PINTO" size={4} className="rounded-full" />
        {formatter.token(tipEstimations.min, mainToken)} - {formatter.token(tipEstimations.max, mainToken)}
      </Row>
    </Row>
  );
};
