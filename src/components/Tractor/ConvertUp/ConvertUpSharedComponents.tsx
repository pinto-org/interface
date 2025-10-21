import { Col, Row } from "@/components/Container";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { STALK } from "@/constants/internalTokens";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import {
  LOW_STALK_DEPOSIT_MODES_TO_LABELS,
  LowStalkDepositsMode,
  tractorTokenStrategyUtil as StrategyUtil,
} from "@/lib/Tractor";
import { TractorTokenStrategy } from "@/lib/Tractor/types";
import { formatter } from "@/utils/format";
import { TimeScale, timeScaleToDisplay } from "@/utils/time";
import { getTokenIndex } from "@/utils/token";
import { MayPromise } from "@/utils/types.generic";
import React from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { CONVERT_UP_TOOLTIP_COPY } from "../form/fields/ConvertUpOrderV0Fields";
import { TractorFormButtonsRow } from "../form/fields/sharedFields";
import { ConvertUpV0FormSchema, TractorConvertUpFormKeys } from "../form/schema/convertUp.schema";
import { useConvertUpOrderFormContext } from "./ConvertUpTractorContext";

// ============================================================================
// Constants
// ============================================================================

export const DEPOSIT_MODE_LABELS = {
  [LowStalkDepositsMode.USE]: "Yes",
  [LowStalkDepositsMode.OMIT]: "No",
  [LowStalkDepositsMode.USE_LAST]: "Use Last",
} as const;

// ============================================================================
// Shared Components
// ============================================================================

export const ConvertUpFormButtonRow = ({
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

export const ConvertUpEntryFormParametersSummary = () => {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const values = useWatch({ control: ctx.control });
  const tokenMap = useTokenMap();

  const totalValueToConvert = `${values.totalBeanAmountToConvert} PDV`;
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
        tooltip={CONVERT_UP_TOOLTIP_COPY.grownStalkPerBdvBonusBid}
        value={
          <Row className="gap-1 items-center">
            <IconImage src={STALK.logoURI} size={4} alt={STALK.symbol} />
            <div className="pinto-sm font-normal">{values.grownStalkPerBdvBonusBid}</div>
          </Row>
        }
      />
    </>
  );
};

export const ConvertUpFormAdvancedParametersSummary = ({
  toggleEdit,
}: {
  toggleEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const ctx = useFormContext<ConvertUpV0FormSchema>();
  const values = useWatch({ control: ctx.control });

  const getTimeScaleDisplay = () => {
    return timeScaleToDisplay(values.timeScale as TimeScale, values.minTimeBetweenConverts ?? 0, {
      exact: true,
      inputUnit: values.timeScale as TimeScale,
    });
  };

  const minTimeBetweenConverts = values.minTimeBetweenConverts;
  const minConvertBonusCapacity = values.minConvertBonusCapacity;
  const maxGrownStalkPerBdvPenalty = values.maxGrownStalkPerBdvPenalty;
  const maxGrownStalkPerBdv = values.maxGrownStalkPerBdv;
  const minConvertBdvPerExecution = values.minBeansConvertPerExecution;
  const maxConvertBdvPerExecution = values.maxBeansConvertPerExecution;
  const slippageRatio = values.slippageRatio;
  const lowStalkDeposits = values.lowStalkDeposits;
  const seedDifference = values.seedDifference;

  const seedDiffNum = Number(seedDifference);
  const seedDiffAbs = seedDiffNum >= 0 ? seedDiffNum : seedDiffNum * -1;
  const seedDiffLabel = seedDiffNum >= 0 ? "Minimum Seeds Gained Per PDV Converted" : "Maximum Seed Loss Per PDV";
  const seedDiffTooltip =
    seedDiffNum >= 0
      ? "The minimum Seed gain per PDV required between the token being Converted into Pinto and Pinto at the time of execution."
      : "The maximum Seed loss per PDV allowed between the token being Converted into Pinto and Pinto at the time of execution.";

  return (
    <Card className="flex flex-col gap-2 border-none">
      <ReviewRow
        label="Min Time Between Executions"
        tooltip={CONVERT_UP_TOOLTIP_COPY.minTimeBetweenConverts}
        value={minTimeBetweenConverts ? `${getTimeScaleDisplay()}` : "--"}
      />
      <ReviewRow
        label="Min Convert Bonus Capacity"
        tooltip={CONVERT_UP_TOOLTIP_COPY.minConvertBonusCapacity}
        value={minConvertBonusCapacity ? `${formatter.number(minConvertBonusCapacity)} PDV` : "--"}
      />
      <ReviewRow
        label="Max Grown Stalk per PDV Penalty"
        tooltip={CONVERT_UP_TOOLTIP_COPY.maxGrownStalkPerBdvPenalty}
        value={`${formatter.number(maxGrownStalkPerBdvPenalty)} %`}
      />
      <ReviewRow
        label="Max Grown Stalk per PDV"
        tooltip={CONVERT_UP_TOOLTIP_COPY.maxGrownStalkPerBdv}
        value={`${formatter.number(maxGrownStalkPerBdv)} Stalk/PDV`}
      />
      <ReviewRow
        label="Execution Size"
        tooltip="The range of PDV acceptable per execution of this Convert Up order. "
        value={`${formatter.number(minConvertBdvPerExecution)} - ${formatter.number(maxConvertBdvPerExecution)} PDV`}
      />
      <ReviewRow
        label="Cap Amount per Execution to Bonus Capacity"
        tooltip={CONVERT_UP_TOOLTIP_COPY.capAmountToBonusCapacity}
        value={values.capAmountToBonusCapacity ? "Yes" : "No"}
      />
      <ReviewRow
        label={seedDiffLabel}
        tooltip={seedDiffTooltip}
        value={`${formatter.number(seedDiffAbs, { minValue: 0.01 })} Seeds`}
      />
      <ReviewRow
        label="Slippage Tolerance"
        tooltip={CONVERT_UP_TOOLTIP_COPY.slippageRatio}
        value={`${formatter.pct(slippageRatio)}`}
      />
      <ReviewRow
        label="Low Stalk Deposit Utilization Priority"
        tooltip={CONVERT_UP_TOOLTIP_COPY.lowStalkDeposits}
        value={LOW_STALK_DEPOSIT_MODES_TO_LABELS[lowStalkDeposits as LowStalkDepositsMode]}
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
