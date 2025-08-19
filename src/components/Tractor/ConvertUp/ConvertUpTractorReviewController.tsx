import { TV } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { Form } from "@/components/Form";
import TooltipSimple from "@/components/TooltipSimple";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { STALK } from "@/constants/internalTokens";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { LowStalkDepositsMode, tractorTokenStrategyUtil as StrategyUtil } from "@/lib/Tractor";
import { TractorTokenStrategy } from "@/lib/Tractor/types";
import { formatter } from "@/utils/format";
import { getTokenIndex } from "@/utils/token";
import { MayPromise } from "@/utils/types.generic";
import React, { useState } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { CONVERT_UP_TOOLTIP_COPY } from "../form/fields/ConvertUpOrderV0Fields";
import { OperatorTipFormField, TractorFormButtonsRow, TractorOperatorTipStrategy } from "../form/fields/sharedFields";
import { ConvertUpV0FormSchema, TractorConvertUpFormKeys } from "../form/schema/convertUp.schema";
import ConvertUpCustomOperatorTipForm, { ConvertUpEstimatedTipPaid } from "./ConvertUpOperatorTipForm";
import ConvertUpTractorAdvancedForm from "./ConvertUpTractorAdvancedForm";
import { ConvertUpTractorOrderFormStep, useConvertUpOrderFormContext } from "./ConvertUpTractorContext";

/**
 * The Review form for the Convert Up Order
 */

const ConvertUpTractorReviewController = ({ averageTipPaid }: { averageTipPaid: number }) => {
  const { form, formStep, operatorTipPreset, setFormStep, setOperatorTipPreset } = useConvertUpOrderFormContext();

  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
  const [prevPreset, setPrevPreset] = useState<TractorOperatorTipStrategy | undefined>(undefined);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [advancedFormValues, setAdvancedFormValues] = useState<ConvertUpV0FormSchema | undefined>(undefined);

  const handleSetAccordionValue = (value: string) => {
    if (
      accordionOpen &&
      accordionValue === "advanced-settings" &&
      formStep === ConvertUpTractorOrderFormStep.ADVANCED
    ) {
      return;
    }

    setAccordionOpen(!!value);
    setAccordionValue(value);
  };

  const handleSetOperatorTipPreset = (preset: TractorOperatorTipStrategy) => {
    setOperatorTipPreset(preset);
    setFormStep(ConvertUpTractorOrderFormStep.OPERATOR_TIP);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setFormStep(ConvertUpTractorOrderFormStep.ENTRY);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSetAdvanced = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setAdvancedFormValues(form.getValues());
    setFormStep(ConvertUpTractorOrderFormStep.ADVANCED);
  };

  const handleSetAdvancedFormValues = (values: ConvertUpV0FormSchema) => {
    setAdvancedFormValues(undefined);
    form.reset(values);
  };

  if (formStep === ConvertUpTractorOrderFormStep.OPERATOR_TIP) {
    return <ConvertUpCustomOperatorTipForm averageTipPaid={averageTipPaid ?? 1} />;
  }

  return (
    <Col className="gap-6 w-full">
      <div className="flex flex-col gap-2">
        <div className="pinto-body font-medium text-pinto-secondary mb-4">
          {"🚜 Review Automated Convert Parameters"}
        </div>
        <Separator className="h-[1px] w-full bg-pinto-gray-2" />
      </div>
      <Col className="w-full gap-5">
        <Col className="w-full gap-3">
          <EntryFormParametersSummary />
          {formStep === ConvertUpTractorOrderFormStep.REVIEW ? (
            <Accordion
              className="AccordionRoot"
              type="single"
              collapsible
              value={accordionValue}
              onValueChange={handleSetAccordionValue}
            >
              <AccordionItem className="AccordionItem" value="advanced-settings">
                <AccordionTrigger
                  className="pinto-sm-light text-pinto-secondary pt-3"
                  iconClassName="text-pinto-secondary"
                >
                  <span>Advanced</span>
                </AccordionTrigger>
                <AccordionContent>
                  <AdvancedParametersSummary toggleEdit={handleSetAdvanced} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : null}
          {formStep === ConvertUpTractorOrderFormStep.ADVANCED && advancedFormValues ? (
            <div className="py-3">
              <ConvertUpTractorAdvancedForm
                outerFormValues={advancedFormValues}
                setOuterFormValues={handleSetAdvancedFormValues}
                setFormStep={setFormStep}
              />
            </div>
          ) : null}
          {formStep === ConvertUpTractorOrderFormStep.REVIEW ? (
            <Col className="gap-2">
              <OperatorTipFormField
                averageTipPaid={averageTipPaid}
                preset={operatorTipPreset}
                setPreset={handleSetOperatorTipPreset}
              />
              <ConvertUpEstimatedTipPaid />
            </Col>
          ) : null}
        </Col>
      </Col>
      {formStep === ConvertUpTractorOrderFormStep.REVIEW ? (
        <ButtonRow handleBack={handleBack} handleNext={handleNext} isLoading={false} />
      ) : null}
    </Col>
  );
};

export default ConvertUpTractorReviewController;

const ButtonRow = ({
  handleBack,
  handleNext,
  isLoading,
}: {
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => MayPromise<void>;
  isLoading: boolean;
}) => {
  const { getMissingFields } = useConvertUpOrderFormContext();
  const { errors } = useFormState<ConvertUpV0FormSchema>();

  const missingFields = getMissingFields(TractorConvertUpFormKeys.advanced);

  const hasErrors = Boolean(Object.keys(errors).length);

  const hasMissingFields = Boolean(missingFields.length);

  return (
    <TractorFormButtonsRow
      handleLeft={handleBack}
      handleRight={handleNext}
      isLoading={isLoading}
      right={{
        content: "Submit",
        disabled: Boolean(hasErrors || hasMissingFields),
        tooltip: hasMissingFields ? (
          <div className="p-1">
            <div className="font-medium mb-1">Please fill in the following fields:</div>
            <ul className="list-disc pl-4 text-sm">
              {missingFields.map((field) => (
                <li key={`missing-field${field}`}>{field}</li>
              ))}
            </ul>
          </div>
        ) : null,
      }}
      left={{
        content: "← Back",
      }}
    />
  );
};

const EntryFormParametersSummary = () => {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const values = useWatch({ control: ctx.control });
  const tokenMap = useTokenMap();

  const totalValueToConvert = `${values.totalConvertBdv} PDV`;
  const priceRange = `$${values.minPriceToConvertUp} - $${values.maxPriceToConvertUp}`;

  const summary = StrategyUtil.getSummary((values.tokenStrategy ?? { type: "LOWEST_SEEDS" }) as TractorTokenStrategy);

  const renderTokenStrategy = () => {
    if (summary.isLowestPrice) return "Token with Best Price";
    if (summary.isLowestSeeds) return "Token with Least Seeds";

    const addresses = summary.addresses ?? [];

    if ((summary.isMulti || summary.isSingle) && !!addresses.length) {
      return (
        <Col className="gap-1">
          {addresses.map((adr) => {
            const tk = tokenMap[getTokenIndex(adr)];
            return (
              <Row key={`${adr}-selected-token-strategy`} className="gap-1 items-center">
                <IconImage src={tk.logoURI} size={4} alt={tk.symbol} />
                <div className="pinto-sm font-normal">{tk.symbol}</div>
              </Row>
            );
          })}
        </Col>
      );
    }

    return <></>;
  };

  return (
    <>
      <ReviewRow
        label="Total Value to Convert"
        tooltip={CONVERT_UP_TOOLTIP_COPY.totalConvertBdv}
        value={totalValueToConvert}
      />
      <ReviewRow label="Execution Price Bounds" tooltip={CONVERT_UP_TOOLTIP_COPY.priceRange} value={priceRange} />
      <ReviewRow label="Token Sources" tooltip={CONVERT_UP_TOOLTIP_COPY.tokenStrategy} value={renderTokenStrategy()} />
      <ReviewRow
        label="Min Grown Stalk Bonus Per PDV"
        tooltip={CONVERT_UP_TOOLTIP_COPY.minGrownStalkPerBdvBonus}
        value={
          <Row className="gap-1 items-center">
            <IconImage src={STALK.logoURI} size={4} alt={STALK.symbol} />
            <div className="pinto-sm font-normal">{values.minGrownStalkPerBdvBonus}</div>
          </Row>
        }
      />
    </>
  );
};

const DEPOSIT_MODE_LABELS = {
  [LowStalkDepositsMode.USE]: "Yes",
  [LowStalkDepositsMode.OMIT]: "No",
  [LowStalkDepositsMode.USE_LAST]: "Use Last",
} as const;

const AdvancedParametersSummary = ({
  toggleEdit,
}: { toggleEdit: (e: React.MouseEvent<HTMLButtonElement>) => void }) => {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const values = useWatch({ control: ctx.control });

  const getTimeScaleDisplay = () => {
    const timeScale = values.timeScale;
    switch (timeScale) {
      case "SECONDS":
        return "seconds";
      case "MINUTES":
        return "minutes";
      case "HOURS":
        return "hours";
      default:
        return "days";
    }
  };

  const minTimeBetweenConverts = values.minTimeBetweenConverts;
  const minConvertBonusCapacity = values.minConvertBonusCapacity;
  const maxGrownStalkPerBdvPenalty = values.maxGrownStalkPerBdvPenalty;
  const maxGrownStalkPerBdv = values.maxGrownStalkPerBdv;
  const minConvertBdvPerExecution = values.minConvertBdvPerExecution;
  const maxConvertBdvPerExecution = values.maxConvertBdvPerExecution;
  const slippageRatio = values.slippageRatio;
  const lowStalkDeposits = values.lowStalkDeposits;

  return (
    <Card className="flex flex-col p-3 gap-2 rounded-sm border-pinto-gray-2 bg-white">
      <ReviewRow
        label="Min Time Between Executions"
        tooltip={CONVERT_UP_TOOLTIP_COPY.minTimeBetweenConverts}
        value={minTimeBetweenConverts ? `${formatter.noDec(minTimeBetweenConverts)} ${getTimeScaleDisplay()}` : "--"}
      />
      <ReviewRow
        label="Min Convert Capacity"
        tooltip={CONVERT_UP_TOOLTIP_COPY.minConvertBonusCapacity}
        value={minConvertBonusCapacity ? `${formatter.twoDec(minConvertBonusCapacity)} PDV` : "--"}
      />
      <ReviewRow
        label="Max Grown Stalk per PDV Penalty"
        tooltip={CONVERT_UP_TOOLTIP_COPY.maxGrownStalkPerBdvPenalty}
        value={`${formatter.twoDec(maxGrownStalkPerBdvPenalty)} PDV`}
      />
      <ReviewRow
        label="Max Grown Stalk per PDV"
        tooltip={CONVERT_UP_TOOLTIP_COPY.maxGrownStalkPerBdv}
        value={`${formatter.twoDec(maxGrownStalkPerBdv)} Grown Stalk`}
      />
      <ReviewRow
        label="Execution Size"
        tooltip="The minimum and maximum execution size of the Convert Up Order"
        value={`${formatter.twoDec(minConvertBdvPerExecution)} - ${formatter.twoDec(maxConvertBdvPerExecution)} PDV`}
      />
      <ReviewRow
        label="Slippage Tolerance"
        tooltip={CONVERT_UP_TOOLTIP_COPY.slippageRatio}
        value={`${formatter.pct(slippageRatio)}`}
      />
      <ReviewRow
        label="Use Low Stalk Deposits"
        tooltip={CONVERT_UP_TOOLTIP_COPY.lowStalkDeposits}
        value={DEPOSIT_MODE_LABELS[lowStalkDeposits as LowStalkDepositsMode]}
      />
      <Separator className="h-[0.5px] bg-pinto-gray-2 my-1" />
      <Button variant="outline-primary-2" size="md" className="w-full rounded-sm" onClick={toggleEdit}>
        <span>Edit Advanced Parameters</span>
      </Button>
    </Card>
  );
};

const ReviewRow = ({
  label,
  tooltip,
  value,
}: {
  label: string;
  tooltip?: string;
  value: string | JSX.Element;
}) => {
  return (
    <Row className="w-full justify-between items-start">
      <Row className="gap-1 items-center">
        {tooltip ? (
          <Row className="gap-1 items-center">
            <div className="pinto-sm-light text-pinto-secondary">{label}</div>
            <TooltipSimple content={tooltip} variant="outlined" triggerClassName="text-pinto-secondary" />
          </Row>
        ) : (
          <Label variant="form">{label}</Label>
        )}
      </Row>
      {typeof value === "string" ? <div className="pinto-sm font-normal">{value}</div> : value}
    </Row>
  );
};
