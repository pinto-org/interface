import { Col, Row } from "@/components/Container";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { tractorTokenStrategyUtil as StrategyUtil } from "@/lib/Tractor";
import { TractorTokenStrategy } from "@/lib/Tractor/types";
import { formatter } from "@/utils/format";
import { getTokenIndex } from "@/utils/token";
import { MayPromise } from "@/utils/types.generic";
import React from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { TOOLTIP_COPY } from "../form/SowOrderV0Fields";
import { SowOrderV0FormSchema } from "../form/SowOrderV0Schema";
import { TractorFormButtonsRow } from "../form/fields/sharedFields";

// ============================================================================
// Shared Components
// ============================================================================

export const SowOrderFormButtonRow = ({
  handleBack,
  handleNext,
  isLoading,
}: {
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => MayPromise<void>;
  isLoading: boolean;
}) => {
  const { errors } = useFormState<SowOrderV0FormSchema>();

  const hasErrors = Boolean(Object.keys(errors).length);

  return (
    <TractorFormButtonsRow
      handleLeft={handleBack}
      handleRight={handleNext}
      isLoading={isLoading}
      right={{
        content: "Submit",
        disabled: Boolean(hasErrors),
      }}
      left={{
        content: "← Back",
      }}
    />
  );
};

export const SowOrderEntryFormParametersSummary = () => {
  const ctx = useFormContext<SowOrderV0FormSchema>();
  const values = useWatch({ control: ctx.control });
  const tokenMap = useTokenMap();

  const totalPintosToSow = `${values.totalAmount} PINTO`;
  const minimumTemperature = `${values.temperature}%`;

  const summary = StrategyUtil.getSummary(
    (values.selectedTokenStrategy ?? { type: "LOWEST_SEEDS" }) as TractorTokenStrategy,
  );

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
      <ReviewRow label="Total Pintos to Sow" tooltip={TOOLTIP_COPY.totalAmount} value={totalPintosToSow} />
      <ReviewRow label="Token Sources" tooltip={TOOLTIP_COPY.tokenStrategy} value={renderTokenStrategy()} />
      <ReviewRow label="Minimum Temperature" tooltip={TOOLTIP_COPY.temperature} value={minimumTemperature} />
    </>
  );
};

export const SowOrderFormAdvancedParametersSummary = ({
  toggleEdit,
}: {
  toggleEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const ctx = useFormContext<SowOrderV0FormSchema>();
  const values = useWatch({ control: ctx.control });

  const minSoil = values.minSoil;
  const maxPerSeason = values.maxPerSeason;
  const podLineLength = values.podLineLength;
  const morningAuction = values.morningAuction;

  return (
    <Card className="flex flex-col gap-2 border-none">
      <ReviewRow
        label="Min per Season"
        tooltip="The minimum amount of PINTO to Sow per season."
        value={minSoil ? `${formatter.number(minSoil)} PINTO` : "--"}
      />
      <ReviewRow
        label="Max per Season"
        tooltip="The maximum amount of PINTO to Sow per season."
        value={maxPerSeason ? `${formatter.number(maxPerSeason)} PINTO` : "--"}
      />
      <ReviewRow
        label="Pod Line Length"
        tooltip="The maximum pod line length at which this order can be executed."
        value={podLineLength ? `${formatter.number(podLineLength)} PODS` : "--"}
      />
      <ReviewRow label="Morning Auction" tooltip={TOOLTIP_COPY.morningAuction} value={morningAuction ? "Yes" : "No"} />
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
