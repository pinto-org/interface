import { Col, Row } from "@/components/Container";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
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
import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { formatter } from "@/utils/format";
import { TimeScale, timeScaleToDisplay } from "@/utils/time";
import { getTokenIndex } from "@/utils/token";
import { MayPromise } from "@/utils/types.generic";
import { cn } from "@/utils/utils";
import React, { useRef, useState } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { CONVERT_UP_TOOLTIP_COPY } from "../form/fields/ConvertUpOrderV0Fields";
import { OperatorTipFormField, TractorFormButtonsRow, TractorOperatorTipStrategy } from "../form/fields/sharedFields";
import { ConvertUpV0FormSchema, TractorConvertUpFormKeys, useConvertUpV0State } from "../form/schema/convertUp.schema";
import ConvertUpCustomOperatorTipForm, { ConvertUpEstimatedTipPaid } from "./ConvertUpOperatorTipForm";
import ConvertUpTractorAdvancedForm from "./ConvertUpTractorAdvancedForm";
import { ConvertUpTractorOrderFormStep, useConvertUpOrderFormContext } from "./ConvertUpTractorContext";

/**
 * The Review form for the Convert Up Order
 */

const ConvertUpTractorReviewController = ({
  averageTipPaid,
  didInitAdv,
}: { averageTipPaid: number; didInitAdv: boolean }) => {
  const {
    form,
    draftState,
    formStep,
    operatorTipPreset,
    setFormStep,
    setOperatorTipPreset,
    setDraftState,
    onOpenChange,
  } = useConvertUpOrderFormContext();
  const { address } = useAccount();
  const { refetch: refetchOrders } = useTractorConvertUpOrderbook();
  const { refetch: refetchFarmerOrders } = useTractorConvertUpOrderbook({ address });

  // Blueprint creation state
  const farmerDeposits = useFarmerSilo();
  const { state, orderData, isLoading, handleCreateBlueprint } = useConvertUpV0State();
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // UI state management
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
  const [accordionOpen, setAccordionOpen] = useState(didInitAdv);

  // Ultra-lean operator tip state management
  const previousPresetRef = useRef<TractorOperatorTipStrategy | null>(null);
  const originalTipRef = useRef<string | null>(null);

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
    if (preset === "Custom") {
      if (operatorTipPreset !== "Custom") {
        // First time going to Custom: store original state
        previousPresetRef.current = operatorTipPreset;
        originalTipRef.current = form.getValues("customOperatorTip") ?? null;
      } else {
        // Re-entering Custom: reset tip to original + cache current state for cancel
        if (originalTipRef.current) {
          form.setValue("customOperatorTip", originalTipRef.current);
        }
      }
      setDraftState(true);
    } else {
      // Switching to non-Custom preset: clear refs
      previousPresetRef.current = null;
      originalTipRef.current = null;
    }

    setOperatorTipPreset(preset);

    if (preset === "Custom") {
      setFormStep(ConvertUpTractorOrderFormStep.OPERATOR_TIP);
    }
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setFormStep(ConvertUpTractorOrderFormStep.ENTRY);
  };

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      // Create the blueprint
      await handleCreateBlueprint(form, averageTipPaid, operatorTipPreset, farmerDeposits.deposits, {
        onSuccess: () => {
          // Open the review dialog
          setShowReviewDialog(true);
        },
        onFailure: () => {
          toast.error("Failed to create ConvertUp blueprint");
        },
      });
    } catch (error) {
      console.error("Error in handleNext:", error);
      toast.error("Failed to create ConvertUp blueprint");
    }
  };

  const handleSetAdvanced = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    // Store current form values as original before entering draft mode
    setDraftState(true);

    setFormStep(ConvertUpTractorOrderFormStep.ADVANCED);
  };

  const handleAdvancedSubmit = () => {
    // Commit the changes - clear draft state
    setDraftState(false);
    setFormStep(ConvertUpTractorOrderFormStep.REVIEW);
  };

  const handleAdvancedCancel = () => {
    // Revert changes - restore original values
    if (draftState.originalValues) {
      form.reset(draftState.originalValues);
    }

    setDraftState(false);
    setFormStep(ConvertUpTractorOrderFormStep.REVIEW);
  };

  const handleCustomTipSubmit = () => {
    setDraftState(false);
    setFormStep(ConvertUpTractorOrderFormStep.REVIEW);
  };

  const handleCustomTipCancel = () => {
    // Revert form values to state before entering custom
    if (draftState.originalValues) {
      form.reset(draftState.originalValues);
    }

    // Revert preset to previous preset
    if (previousPresetRef.current) {
      setOperatorTipPreset(previousPresetRef.current);
    }

    setDraftState(false);
    setFormStep(ConvertUpTractorOrderFormStep.REVIEW);
  };

  return (
    <>
      {formStep === ConvertUpTractorOrderFormStep.OPERATOR_TIP ? (
        <ConvertUpCustomOperatorTipForm
          averageTipPaid={averageTipPaid ?? 1}
          onSubmit={handleCustomTipSubmit}
          onCancel={handleCustomTipCancel}
        />
      ) : (
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
                  <AccordionItem
                    className={cn("AccordionItem", "border-[1px] px-2 border-pinto-gray-2 rounded-md bg-white")}
                    value="advanced-settings"
                  >
                    <AccordionTrigger
                      className="pinto-sm-light text-pinto-secondary"
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
              {formStep === ConvertUpTractorOrderFormStep.ADVANCED ? (
                <div className="py-3">
                  <ConvertUpTractorAdvancedForm onSubmit={handleAdvancedSubmit} onCancel={handleAdvancedCancel} />
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
            <ButtonRow handleBack={handleBack} handleNext={handleNext} isLoading={isLoading} />
          ) : null}
        </Col>
      )}

      {/* Review Dialog for ConvertUp Orders */}
      {showReviewDialog && state && orderData && (
        <ReviewTractorOrderDialog
          open={showReviewDialog}
          onOpenChange={setShowReviewDialog}
          onSuccess={() => {
            onOpenChange(false);
            refetchOrders();
            refetchFarmerOrders();
          }}
          orderData={{
            type: "convertUp" as const,
            ...orderData,
            timeScale: form.getValues("timeScale"),
            tokenStrategy: form.getValues("tokenStrategy"),
          }}
          encodedData={state.encodedData}
          operatorPasteInstrs={state.operatorPasteInstructions}
          blueprint={state.blueprint}
          depositOptimizationCalls={state.depositOptimizationCalls}
        />
      )}
    </>
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

  return (
    <Card className="flex flex-col gap-2 border-none">
      <ReviewRow
        label="Min Time Between Executions"
        tooltip={CONVERT_UP_TOOLTIP_COPY.minTimeBetweenConverts}
        value={minTimeBetweenConverts ? `${getTimeScaleDisplay()}` : "--"}
      />
      <ReviewRow
        label="Min Convert Capacity"
        tooltip={CONVERT_UP_TOOLTIP_COPY.minConvertBonusCapacity}
        value={minConvertBonusCapacity ? `${formatter.number(minConvertBonusCapacity)} PDV` : "--"}
      />
      <ReviewRow
        label="Max Grown Stalk per PDV Penalty"
        tooltip={CONVERT_UP_TOOLTIP_COPY.maxGrownStalkPerBdvPenalty}
        value={`${formatter.number(maxGrownStalkPerBdvPenalty)} Stalk/PDV`}
      />
      <ReviewRow
        label="Max Grown Stalk per PDV"
        tooltip={CONVERT_UP_TOOLTIP_COPY.maxGrownStalkPerBdv}
        value={`${formatter.number(maxGrownStalkPerBdv)} Stalk/PDV`}
      />
      <ReviewRow
        label="Execution Size"
        tooltip="The minimum and maximum execution size of the Convert Up Order"
        value={`${formatter.number(minConvertBdvPerExecution)} - ${formatter.number(maxConvertBdvPerExecution)} PDV`}
      />
      <ReviewRow
        label="Min Seed Difference"
        tooltip={CONVERT_UP_TOOLTIP_COPY.seedDifference}
        value={`${formatter.number(seedDifference)} Seeds`}
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
