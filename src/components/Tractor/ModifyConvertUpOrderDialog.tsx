import { diamondABI } from "@/constants/abi/diamondABI";

import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { Form } from "@/components/Form";
import TooltipSimple from "@/components/TooltipSimple";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { STALK } from "@/constants/internalTokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useGetTractorTokenStrategyWithBlueprint } from "@/hooks/tractor/useGetTractorTokenStrategy";
import useSignTractorBlueprint from "@/hooks/tractor/useSignTractorBlueprint";
import useSowOrderV0Calculations from "@/hooks/tractor/useSowOrderV0Calculations";
import useTransaction from "@/hooks/useTransaction";
import { LowStalkDepositsMode, tractorTokenStrategyUtil as StrategyUtil } from "@/lib/Tractor";
import { useGetBlueprintHash } from "@/lib/Tractor/blueprint";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import {
  Blueprint,
  ExtendedTractorTokenStrategy,
  Requisition,
  TractorTokenStrategy,
  TractorTokenStrategyUnion,
} from "@/lib/Tractor/types";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useSiloData } from "@/state/useSiloData";
import { formatter } from "@/utils/format";
import { postSanitizedSanitizedValue, stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { tokensEqual } from "@/utils/token";
import { MayPromise } from "@/utils/types.generic";
import { exists } from "@/utils/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, useChainId } from "wagmi";
import { ConvertUpTractorEntryForm, ConvertUpTractorOrderFormStep } from "./ConvertUp";
import ConvertUpCustomOperatorTipForm, { ConvertUpEstimatedTipPaid } from "./ConvertUp/ConvertUpOperatorTipForm";
import ConvertUpTractorAdvancedForm from "./ConvertUp/ConvertUpTractorAdvancedForm";
import {
  ConvertUpOrderFormContext,
  ConvertUpV0FormDraftState,
  IConvertUpOrderFormContext,
} from "./ConvertUp/ConvertUpTractorContext";
import { CONVERT_UP_TOOLTIP_COPY } from "./form/fields/ConvertUpOrderV0Fields";
import { OperatorTipFormField, TractorFormButtonsRow, TractorOperatorTipStrategy } from "./form/fields/sharedFields";
import {
  ConvertUpV0FormSchema,
  TractorConvertUpFormKeys,
  transformConvertUpFormValues,
  useConvertUpV0Form,
  useConvertUpV0State,
} from "./form/schema/convertUp.schema";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface ModifyConvertUpOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderModified?: () => void;
  existingOrder: ConvertUpOrderbookEntry;
}

interface IModifyConvertUpOrderFormContext extends IConvertUpOrderFormContext {
  onOrderModified?: () => void;
  existingOrder: ConvertUpOrderbookEntry;
  getStrategyProps: ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>;
}

interface ModifyConvertUpOrderReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  existingOrder: ConvertUpOrderbookEntry;
  orderData: NonNullable<ReturnType<typeof useConvertUpV0State>["orderData"]>;
  encodedData: `0x${string}`;
  operatorPasteInstrs: `0x${string}`[];
  blueprint: Blueprint;
  getStrategyProps: ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>;
}

type ValueDiff<T = unknown> = {
  label: string;
  prev: T;
  curr: T;
};

type RenderDiffProps<T> = Omit<ValueDiff<T>, "label">;

// ============================================================================
// Context & Provider
// ============================================================================

const useModifyConvertUpOrderFormContext = () => {
  const context = useContext(ConvertUpOrderFormContext);

  if (!context) {
    throw new Error("useConvertUpOrderFormContext must be used within a ConvertUpOrderForm");
  }
  return context as IModifyConvertUpOrderFormContext;
};

function ModifyConvertUpOrderProvider({
  children,
  existingOrder,
  onOpenChange,
  onOrderModified,
}: {
  existingOrder: ConvertUpOrderbookEntry;
  onOpenChange: (open: boolean) => void;
  onOrderModified?: () => void;
  children: React.ReactNode;
}) {
  const [formStep, setFormStep] = useState(ConvertUpTractorOrderFormStep.ENTRY);
  const chainId = useChainId();

  // Simplified operator tip state management
  const [operatorTipPreset, setOperatorTipPresetState] = useState<TractorOperatorTipStrategy>("Normal");
  const [draftState, setDraftState] = useState<ConvertUpV0FormDraftState>({
    isActive: false,
    originalValues: null,
  });

  const form = useConvertUpV0Form();
  const getStrategyProps = useGetTractorTokenStrategyWithBlueprint();

  const toggleDraftState = useCallback(
    (val: boolean) => {
      const values = form.form.getValues();

      const transformed = transformConvertUpFormValues(values, chainId);

      const newDraftState = val
        ? {
            ...transformed,
            totalBeanAmountToConvert: transformed.totalBeanAmountToConvert.tv.toHuman(),
            minBeansConvertPerExecution: transformed.minBeansConvertPerExecution.tv.toHuman(),
            maxBeansConvertPerExecution: transformed.maxBeansConvertPerExecution.tv.toHuman(),
            minTimeBetweenConverts: transformed.minTimeBetweenConverts.tv.toHuman(),
            minConvertBonusCapacity: transformed.minConvertBonusCapacity.tv.toHuman(),
            maxGrownStalkPerBdv: transformed.maxGrownStalkPerBdv.tv.toHuman(),
            grownStalkPerBdvBonusBid: transformed.grownStalkPerBdvBonusBid.tv.toHuman(),
            seedDifference: transformed.seedDifference.tv.toHuman(),
            maxPriceToConvertUp: transformed.maxPriceToConvertUp.tv.toHuman(),
            minPriceToConvertUp: transformed.minPriceToConvertUp.tv.toHuman(),
            maxGrownStalkPerBdvPenalty: transformed.maxGrownStalkPerBdvPenalty.tv.toHuman(),
            slippageRatio: transformed.slippageRatio.tv.toHuman(),
            operatorTip: transformed.operatorTip.tv.toHuman(),
            customOperatorTip: transformed.customOperatorTip?.nonAmount
              ? ""
              : transformed.customOperatorTip?.tv.toHuman() ?? "",
          }
        : null;

      setDraftState({ isActive: val, originalValues: newDraftState });
    },
    [form.form, chainId],
  );

  // External hooks
  const { data: averageTipPaid } = useTractorOperatorAverageTipPaid();

  // Pre-fill form with existing order data
  const [didPrefill, setDidPrefill] = useState(false);

  useEffect(() => {
    if (didPrefill || getStrategyProps.isLoading || !existingOrder.decodedData) {
      return;
    }

    try {
      const data = existingOrder.decodedData;

      // Check if we have the expected structure
      if (!data.convertUpParams || !data.opParams) {
        console.error("Invalid decoded data structure - missing convertUpParams or opParams:", {
          hasConvertUpParams: !!data.convertUpParams,
          hasOpParams: !!data.opParams,
          data,
        });
        return;
      }
      // Check if sourceTokenIndices exists and is an array
      if (!data.convertUpParams.sourceTokenIndices || !Array.isArray(data.convertUpParams.sourceTokenIndices)) {
        console.error("Invalid sourceTokenIndices:", {
          sourceTokenIndices: data.convertUpParams.sourceTokenIndices,
          isArray: Array.isArray(data.convertUpParams.sourceTokenIndices),
          convertUpParams: data.convertUpParams,
        });
        return;
      }

      let tokenStrategy: ExtendedTractorTokenStrategy | undefined;
      try {
        tokenStrategy = getStrategyProps.getTokenStrategy({
          sourceTokenIndices: existingOrder.decodedData.convertUpParams.sourceTokenIndices,
        });
      } catch (strategyError) {
        console.error("Error getting token strategy:", strategyError);
        tokenStrategy = { type: "LOWEST_SEEDS" as const };
      }

      // Prepare the prefill values - handle TokenValue objects properly
      const prefillValues = {
        tokenStrategy: tokenStrategy ?? { type: "LOWEST_SEEDS" as const },
        totalBeanAmountToConvert: data.convertUpParams.totalBeanAmountToConvert.toHuman(),
        minBeansConvertPerExecution: data.convertUpParams.minBeansConvertPerExecution.toHuman(),
        maxBeansConvertPerExecution: data.convertUpParams.maxBeansConvertPerExecution.toHuman(),
        minTimeBetweenConverts: data.convertUpParams.minTimeBetweenConverts.toHuman(),
        timeScale: "SECONDS" as const, // Default to seconds, might need to derive this
        minConvertBonusCapacity: data.convertUpParams.minConvertBonusCapacity.toHuman(),
        maxGrownStalkPerBdv: data.convertUpParams.maxGrownStalkPerBdv.toHuman(),
        grownStalkPerBdvBonusBid: data.convertUpParams.grownStalkPerBdvBonusBid.toHuman(),
        maxPriceToConvertUp: data.convertUpParams.maxPriceToConvertUp.toHuman(),
        minPriceToConvertUp: data.convertUpParams.minPriceToConvertUp.toHuman(),
        maxGrownStalkPerBdvPenalty: data.convertUpParams.maxGrownStalkPerBdvPenalty.toHuman(),
        seedDifference: data.convertUpParams.seedDifference.toHuman(),
        slippageRatio: data.convertUpParams.slippageRatio.toHuman(),
        operatorTip: data.opParams.operatorTipAmount.toHuman(),
        lowStalkDeposits: data.convertUpParams.lowStalkDeposits,
      };

      // Map the decoded data to form schema
      form.prefillValues(prefillValues);
      console.debug("Form prefilled successfully");
      setDidPrefill(true);
    } catch (error) {
      console.error("Failed to pre-fill form with existing order data:", error);
    }
  }, [existingOrder, didPrefill, form.prefillValues, getStrategyProps]);

  // Initialize operator tip
  const [didInitOperatorTip, setDidInitOperatorTip] = useState(false);
  useEffect(() => {
    if (!didInitOperatorTip && exists(averageTipPaid) && didPrefill) {
      setDidInitOperatorTip(true);
      // Only set if not already pre-filled from existing order
      const currentTip = form.form.getValues("operatorTip");
      if (!currentTip) {
        form.form.setValue("operatorTip", averageTipPaid.toFixed(2));
      }
    }
  }, [averageTipPaid, form.form, didInitOperatorTip, didPrefill]);

  const handleSetOperatorTipPreset = useCallback(
    (preset: TractorOperatorTipStrategy) => {
      setOperatorTipPresetState(preset);
    },
    [operatorTipPreset],
  );

  // Create the context value with modify-specific data
  const contextValue: IModifyConvertUpOrderFormContext = {
    ...form,
    formStep,
    operatorTipPreset,
    disallowCloseForm: false,
    draftState,
    setDraftState: toggleDraftState,
    setFormStep,
    onOpenChange,
    onOrderModified,
    existingOrder,
    getStrategyProps,
    setOperatorTipPreset: handleSetOperatorTipPreset,
  };

  return (
    <ConvertUpOrderFormContext.Provider value={contextValue}>
      <Form {...form.form}>{children}</Form>
    </ConvertUpOrderFormContext.Provider>
  );
}

// ============================================================================
// Main Dialog Component
// ============================================================================

export default function ModifyConvertUpOrderDialog({
  open,
  onOpenChange,
  onOrderModified,
  existingOrder,
}: ModifyConvertUpOrderDialogProps) {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 backdrop-blur-[2px] bg-white/50" />
        <DialogContent className="max-w-[35rem] p-6 max-h-[80vh] flex flex-col">
          <DialogHeader className="hidden">
            <DialogTitle>Convert Up Order Modification</DialogTitle>
            <DialogDescription className="pinto-sm-light text-pinto-light pt-2">
              Update your existing Convert Up order. The current order will be cancelled and a new one will be created
              with your updated conditions.
            </DialogDescription>
          </DialogHeader>
          <ModifyConvertUpOrderProvider
            existingOrder={existingOrder}
            onOpenChange={onOpenChange}
            onOrderModified={onOrderModified}
          >
            <ModifyConvertUpOrderFormController />
          </ModifyConvertUpOrderProvider>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

// ============================================================================
// Form Controller Components
// ============================================================================

const REVIEW_STEPS = new Set([
  ConvertUpTractorOrderFormStep.REVIEW,
  ConvertUpTractorOrderFormStep.ADVANCED,
  ConvertUpTractorOrderFormStep.OPERATOR_TIP,
]);

function ModifyConvertUpOrderFormController() {
  // External hooks
  const { formStep } = useModifyConvertUpOrderFormContext();
  const calculations = useSowOrderV0Calculations();
  const farmerSilo = useFarmerSilo();
  const siloData = useSiloData();
  const { data: averageTipPaid } = useTractorOperatorAverageTipPaid();

  // Local State
  // Whether the advanced fields have been initialized
  const [didInitRestFields, setDidInitRestFields] = useState(true);

  return (
    <Col className="w-full h-full">
      {formStep === ConvertUpTractorOrderFormStep.ENTRY && (
        <ConvertUpTractorEntryForm
          farmerSilo={farmerSilo}
          siloData={siloData}
          calculations={calculations}
          didSetAdvancedFormFields={didInitRestFields}
          setDidSetAdvancedFormFields={setDidInitRestFields}
        />
      )}
      {REVIEW_STEPS.has(formStep) && (
        <ModifyConvertUpTractorReviewController didInitAdv={didInitRestFields} averageTipPaid={averageTipPaid ?? 1} />
      )}
    </Col>
  );
}

// ============================================================================
// Review Controller Component
// ============================================================================

function ModifyConvertUpTractorReviewController({
  averageTipPaid,
  didInitAdv,
}: {
  averageTipPaid: number;
  didInitAdv: boolean;
}) {
  const {
    form,
    draftState,
    formStep,
    operatorTipPreset,
    setFormStep,
    setOperatorTipPreset,
    setDraftState,
    onOpenChange,
  } = useModifyConvertUpOrderFormContext();

  const { onOrderModified, existingOrder, getStrategyProps } = useModifyConvertUpOrderFormContext();

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
              {"🚜 Review Modified Convert Parameters"}
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

      {/* Review Dialog for Modified ConvertUp Orders */}
      {showReviewDialog && state && orderData && (
        <ModifyConvertUpOrderReviewDialog
          open={showReviewDialog}
          onOpenChange={setShowReviewDialog}
          onSuccess={() => {
            onOpenChange(false);
            onOrderModified?.();
          }}
          existingOrder={existingOrder}
          orderData={orderData}
          encodedData={state.encodedData}
          operatorPasteInstrs={state.operatorPasteInstructions}
          blueprint={state.blueprint}
          getStrategyProps={getStrategyProps}
        />
      )}
    </>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function ButtonRow({
  handleBack,
  handleNext,
  isLoading,
}: {
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => MayPromise<void>;
  isLoading: boolean;
}) {
  const { getMissingFields } = useModifyConvertUpOrderFormContext();
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
        content: "Review Changes",
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
}

function EntryFormParametersSummary() {
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
}

const DEPOSIT_MODE_LABELS = {
  [LowStalkDepositsMode.USE]: "Yes",
  [LowStalkDepositsMode.OMIT]: "No",
  [LowStalkDepositsMode.USE_LAST]: "Use Last",
} as const;

function AdvancedParametersSummary({
  toggleEdit,
}: {
  toggleEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
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
  const minConvertBdvPerExecution = values.minBeansConvertPerExecution;
  const maxConvertBdvPerExecution = values.maxBeansConvertPerExecution;
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
        label="Max Stalk per PDV Penalty"
        tooltip={CONVERT_UP_TOOLTIP_COPY.maxGrownStalkPerBdvPenalty}
        value={`${formatter.twoDec(maxGrownStalkPerBdvPenalty)} PDV`}
      />
      <ReviewRow
        label="Max Stalk per PDV"
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
}

function ReviewRow({
  label,
  tooltip,
  value,
}: {
  label: string;
  tooltip?: string;
  value: string | JSX.Element;
}) {
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
}

// ============================================================================
// Review Dialog for Modify Operations
// ============================================================================

function ModifyConvertUpOrderReviewDialog({
  open,
  onOpenChange,
  onSuccess,
  existingOrder,
  orderData,
  getStrategyProps,
  blueprint,
}: ModifyConvertUpOrderReviewDialogProps) {
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const queryClient = useQueryClient();

  // Accordion state for advanced fields
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

  const valueDiffs = useMemo(
    () => getDiffs(getMapping(existingOrder, orderData, getStrategyProps)),
    [existingOrder, orderData, getStrategyProps],
  );

  // Use the imported Tractor utilities
  const { data: blueprintHash } = useGetBlueprintHash(blueprint);

  // Transaction handling for the cancel + create flow
  const { writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Order modified successfully",
    errorMessage: "Failed to modify order",
    successCallback: () => {
      queryClient.invalidateQueries();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const { signBlueprint, signedRequisition, isSigning } = useSignTractorBlueprint();

  const handleSignBlueprint = async () => {
    if (!blueprintHash) {
      toast.error("Blueprint hash not ready yet, please try again in a moment");
      return;
    }

    await signBlueprint(blueprint, blueprintHash);
  };

  const handleModifyOrder = async () => {
    if (!address || !protocolAddress) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!signedRequisition?.signature) {
      toast.error("Please sign the blueprint first");
      return;
    }

    try {
      setSubmitting(true);
      toast.loading("Modifying order...");

      // Create the farm call data that cancels the old order and creates the new one
      const farmCalls = [
        // Cancel the existing order
        encodeFunctionData({
          abi: diamondABI,
          functionName: "cancelBlueprint",
          args: [existingOrder.requisition],
        }),
        // Create the new order (publish requisition)
        encodeFunctionData({
          abi: diamondABI,
          functionName: "publishRequisition",
          args: [
            // Type cast is okay here since we check signature above
            signedRequisition as Required<Requisition>,
          ],
        }),
      ];

      // Execute the farm transaction
      await writeWithEstimateGas({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "farm",
        args: [farmCalls],
      });

      toast.success("Order modified successfully");
    } catch (error) {
      console.error("Error modifying order:", error);
      toast.error("Failed to modify order");
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 backdrop-blur-[2px] bg-white/50" />
        <DialogContent className="max-w-[40rem]">
          <Col className="gap-3">
            <DialogHeader className="">
              <DialogTitle>
                <div className="pinto-body font-medium text-pinto-secondary">Review Order Modification</div>
              </DialogTitle>
              <DialogDescription className="pinto-sm-light text-pinto-light pt-2">
                <div>Your existing Convert Up order will be cancelled and replaced with this new order.</div>
              </DialogDescription>
            </DialogHeader>
            <div>
              {/* Show a comparison of old vs new */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="space-y-4 text-sm">
                  {/* Check if there are any changes */}
                  {valueDiffs.nonAdvanced.modifications.length || valueDiffs.advanced.modifications.length ? (
                    <div>
                      <h4 className="pinto-body font-medium text-pinto-secondary mb-3">New Order</h4>

                      {/* Non-advanced parameters */}
                      <Col className="gap-2 pinto-sm-light mb-3">
                        {/* Show non-advanced modifications first */}
                        {valueDiffs.nonAdvanced.modifications.map(([key, value]) => {
                          return <RenderValueDiff key={`convertup-v0-diff-${key}`} {...value} />;
                        })}
                        {/* Show non-advanced constants after modifications */}
                        {valueDiffs.nonAdvanced.constants.map(([key, value]) => {
                          return <RenderConstantParam key={`convertup-v0-constant-${key}`} {...value} />;
                        })}
                      </Col>

                      {/* Advanced parameters accordion - only show if there are advanced changes */}
                      {valueDiffs.advanced.modifications.length > 0 && (
                        <Accordion
                          className="AccordionRoot"
                          type="single"
                          collapsible
                          value={accordionValue}
                          onValueChange={setAccordionValue}
                        >
                          <AccordionItem className="AccordionItem" value="advanced-changes">
                            <AccordionTrigger
                              className="pinto-sm-light text-pinto-secondary pt-3"
                              iconClassName="text-pinto-secondary"
                            >
                              <span className="font-medium">Advanced Parameters</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <Col className="gap-2 pinto-sm-light pt-2">
                                {/* Show advanced modifications first */}
                                {valueDiffs.advanced.modifications.map(([key, value]) => {
                                  return <RenderValueDiff key={`convertup-v0-adv-diff-${key}`} {...value} />;
                                })}
                                {/* Show advanced constants after modifications */}
                                {valueDiffs.advanced.constants.map(([key, value]) => {
                                  return <RenderConstantParam key={`convertup-v0-adv-constant-${key}`} {...value} />;
                                })}
                              </Col>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </div>
                  ) : (
                    <div className="pinto-body text-pinto-light text-center h-[2rem] flex items-center justify-center">
                      No changes
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <Row className="justify-between items-center">
                <Button
                  variant="outline"
                  size="xl"
                  rounded="full"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 mr-2"
                >
                  Cancel
                </Button>
                {!signedRequisition ? (
                  <Button
                    variant="gradient"
                    size="xl"
                    rounded="full"
                    onClick={handleSignBlueprint}
                    disabled={
                      isSigning ||
                      (!valueDiffs.nonAdvanced.modifications.length && !valueDiffs.advanced.modifications.length)
                    }
                    className="flex-1 ml-2"
                  >
                    {isSigning ? "Signing..." : "Sign New Order"}
                  </Button>
                ) : (
                  <Button
                    variant="gradient"
                    size="xl"
                    rounded="full"
                    onClick={handleModifyOrder}
                    disabled={
                      submitting ||
                      (!valueDiffs.nonAdvanced.modifications.length && !valueDiffs.advanced.modifications.length)
                    }
                    className="flex-1 ml-2"
                  >
                    {submitting ? "Modifying..." : "Modify Order"}
                  </Button>
                )}
              </Row>
            </div>
          </Col>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

// ============================================================================
// Diff Rendering Components
// ============================================================================

function RenderValueDiff(props: ValueDiff<unknown>) {
  const { label, prev, curr } = props;

  return (
    <Row key={`diff-${label}`} className="justify-between items-center">
      <div className="text-pinto-secondary">{label}</div>
      {typeof prev === "string" ? (
        <RenderStringDiff prev={prev} curr={curr as string} />
      ) : prev instanceof TokenValue ? (
        <RenderDiffTokenValue prev={prev} curr={curr as TokenValue} />
      ) : typeof prev === "boolean" ? (
        <RenderBooleanDiff prev={prev} curr={curr as boolean} />
      ) : prev && typeof prev === "object" && "type" in prev ? (
        <RenderTokenStrategyDiff
          prev={prev as ExtendedTractorTokenStrategy}
          curr={curr as ExtendedTractorTokenStrategy}
        />
      ) : null}
    </Row>
  );
}

function RenderConstantParam(props: ValueDiff<unknown>) {
  const { label, prev } = props;

  const getConstantParamValue = () => {
    try {
      if (typeof prev === "string") {
        return prev;
      } else if (typeof prev === "boolean") {
        return prev ? "Yes" : "No";
      } else if (typeof prev === "number") {
        return DEPOSIT_MODE_LABELS[prev as LowStalkDepositsMode] || prev.toString();
      } else if (prev instanceof TokenValue) {
        return formatter.number(prev);
      } else if (prev && typeof prev === "object" && "type" in prev) {
        const strategy = prev as ExtendedTractorTokenStrategy;
        switch (true) {
          // case strategy.type === "MULTI_TOKENS": {
          // const di = props.curr.
          // }
          case strategy.type === "SPECIFIC_TOKEN":
            return strategy.token?.symbol ?? "Unknown Token";
          case strategy.type === "LOWEST_PRICE":
            return "Token with lowest price";
          default:
            return "Token with lowest Seeds";
        }
      }
    } catch (e) {
      console.debug("Error getting render constant param", e);
    }

    return null;
  };

  return (
    <Row key={`constant-${label}`} className="justify-between items-center">
      <div className="text-pinto-secondary">{label}</div>
      <div className="text-pinto-light">{getConstantParamValue()}</div>
    </Row>
  );
}

function RenderDiffTokenValue({ prev, curr }: RenderDiffProps<TokenValue>) {
  return (
    <Row className="gap-2">
      <div className="text-pinto-light">{formatter.number(prev)}</div>
      <ArrowRightIcon className="w-3 h-3" />
      <div className="text-pinto-primary">{formatter.number(curr)}</div>
    </Row>
  );
}

function RenderStringDiff({ prev, curr }: RenderDiffProps<string>) {
  return (
    <Row className="gap-2">
      <div className="text-pinto-light">{prev}</div>
      <ArrowRightIcon className="w-3 h-3" />
      <div className="text-pinto-primary">{curr}</div>
    </Row>
  );
}

function RenderBooleanDiff({ prev, curr }: RenderDiffProps<boolean>) {
  return (
    <Row className="gap-2">
      <div className="text-pinto-light">{prev ? "Yes" : "No"}</div>
      <ArrowRightIcon className="w-3 h-3" />
      <div className="text-pinto-primary">{curr ? "Yes" : "No"}</div>
    </Row>
  );
}

function RenderTokenStrategyDiff({ prev, curr }: RenderDiffProps<ExtendedTractorTokenStrategy>) {
  const tokenMap = useTokenMap();

  const getName = (strategy: ExtendedTractorTokenStrategy) => {
    switch (true) {
      case strategy.type === "SPECIFIC_TOKEN":
        return strategy.token?.symbol ?? "Unknown Token";
      case strategy.type === "MULTI_TOKENS":
        return strategy.addresses.map((adr) => tokenMap[getTokenIndex(adr)].symbol).join(", ");
      case strategy.type === "LOWEST_PRICE":
        return "Token with lowest price";
      default:
        return "Token with lowest Seeds";
    }
  };

  return (
    <Row className="gap-2">
      <div className="text-pinto-light">{getName(prev)}</div>
      <ArrowRightIcon className="w-3 h-3" />
      <div className="text-pinto-primary">{getName(curr)}</div>
    </Row>
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

// Define which fields are considered advanced
const ADVANCED_FIELDS = new Set([
  "minBeansConvertPerExecution",
  "maxBeansConvertPerExecution",
  "minTimeBetweenConverts",
  "minConvertBonusCapacity",
  "maxGrownStalkPerBdv",
  "maxGrownStalkPerBdvPenalty",
  "seedDifference",
  "slippageRatio",
  "lowStalkDeposits",
]);

function isAdvancedField(key: string): boolean {
  return ADVANCED_FIELDS.has(key);
}

function getMapping(
  existingOrder: ConvertUpOrderbookEntry,
  orderData: NonNullable<ReturnType<typeof useConvertUpV0State>["orderData"]>,
  getStrategyProps: ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>,
) {
  const existing = existingOrder.decodedData;
  if (!existing) return undefined;

  return {
    totalBeanAmountToConvert: {
      label: "Total Convert PDV",
      prev: postSanitizedSanitizedValue(existing.convertUpParams.totalBeanAmountToConvert.toHuman(), 6).tv,
      curr: postSanitizedSanitizedValue(orderData.totalBeanAmountToConvert, 6).tv,
    },
    minBeansConvertPerExecution: {
      label: "Min PDV per Execution",
      prev: postSanitizedSanitizedValue(existing.convertUpParams.minBeansConvertPerExecution.toHuman(), 6).tv,
      curr: postSanitizedSanitizedValue(orderData.minBeansConvertPerExecution, 6).tv,
    },
    maxBeansConvertPerExecution: {
      label: "Max PDV per Execution",
      prev: postSanitizedSanitizedValue(existing.convertUpParams.maxBeansConvertPerExecution.toHuman(), 6).tv,
      curr: postSanitizedSanitizedValue(orderData.maxBeansConvertPerExecution, 6).tv,
    },
    minTimeBetweenConverts: {
      label: "Min Time Between Executions",
      prev: postSanitizedSanitizedValue(existing.convertUpParams.minTimeBetweenConverts.toHuman(), 0).tv,
      curr: postSanitizedSanitizedValue(orderData.minTimeBetweenConverts, 0).tv,
    },
    minConvertBonusCapacity: {
      label: "Min Convert Capacity",
      prev: postSanitizedSanitizedValue(existing.convertUpParams.minConvertBonusCapacity.toHuman(), 6).tv,
      curr: postSanitizedSanitizedValue(orderData.minConvertBonusCapacity, 6).tv,
    },
    maxGrownStalkPerBdv: {
      label: "Max Grown Stalk per BDV",
      prev: postSanitizedSanitizedValue(existing.convertUpParams.maxGrownStalkPerBdv.toHuman(), 6).tv,
      curr: postSanitizedSanitizedValue(orderData.maxGrownStalkPerBdv, 6).tv,
    },
    grownStalkPerBdvBonusBid: {
      label: "Min Grown Stalk Bonus per PDV",
      prev: postSanitizedSanitizedValue(existing.convertUpParams.grownStalkPerBdvBonusBid.toHuman(), 6).tv,
      curr: postSanitizedSanitizedValue(orderData.grownStalkPerBdvBonusBid, 6).tv,
    },
    maxPriceToConvertUp: {
      label: "Max Price",
      prev: postSanitizedSanitizedValue(existing.convertUpParams.maxPriceToConvertUp.toHuman(), 6).tv,
      curr: postSanitizedSanitizedValue(orderData.maxPriceToConvertUp, 6).tv,
    },
    minPriceToConvertUp: {
      label: "Min Price",
      prev: postSanitizedSanitizedValue(existing.convertUpParams.minPriceToConvertUp.toHuman(), 6).tv,
      curr: postSanitizedSanitizedValue(orderData.minPriceToConvertUp, 6).tv,
    },
    maxGrownStalkPerBdvPenalty: {
      label: "Max Grown Stalk Penalty",
      prev: postSanitizedSanitizedValue(existing.convertUpParams.maxGrownStalkPerBdvPenalty.toHuman(), 6).tv,
      curr: postSanitizedSanitizedValue(orderData.maxGrownStalkPerBdvPenalty, 6).tv,
    },
    slippageRatio: {
      label: "Slippage Tolerance",
      prev: postSanitizedSanitizedValue(existing.convertUpParams.slippageRatio.toHuman(), 6).tv,
      curr: postSanitizedSanitizedValue(orderData.slippageRatio, 6).tv,
    },
    lowStalkDeposits: {
      label: "Use Low Stalk Deposits",
      prev: existing.convertUpParams.lowStalkDeposits,
      curr: orderData.lowStalkDeposits,
    },
    strategy: {
      label: "Funding Source",
      prev: getStrategyProps.getTokenStrategy(existing.convertUpParams),
      curr: getStrategyProps.getTokenStrategy({ sourceTokenIndices: orderData.sourceTokenIndices }),
    },
    operatorTip: {
      label: "Operator Tip",
      prev: postSanitizedSanitizedValue(existing.opParams.operatorTipAmount.toHuman(), 6).tv,
      curr: postSanitizedSanitizedValue(orderData.operatorTip, 6).tv,
    },
  };
}

function getDiffs(mapping: ReturnType<typeof getMapping>) {
  const nonAdvancedModifications: Record<string, ValueDiff> = {};
  const nonAdvancedConstants: Record<string, ValueDiff> = {};
  const advancedModifications: Record<string, ValueDiff> = {};
  const advancedConstants: Record<string, ValueDiff> = {};

  for (const [key, { label, prev, curr }] of Object.entries(mapping ?? {})) {
    let hasChanged = false;
    let valueDiff: ValueDiff | null = null;

    if (prev instanceof TokenValue && curr instanceof TokenValue) {
      if (!prev.eq(curr)) {
        hasChanged = true;
        valueDiff = {
          label,
          prev: prev,
          curr: curr,
        };
      }
    } else if (typeof prev === "boolean" && typeof curr === "boolean") {
      if (prev !== curr) {
        hasChanged = true;
        valueDiff = {
          label,
          prev: prev,
          curr: curr,
        };
      }
    } else if (typeof prev === "number" && typeof curr === "number") {
      if (prev !== curr) {
        hasChanged = true;
        valueDiff = {
          label,
          prev: prev,
          curr: curr,
        };
      }
    } else if (typeof prev === "object" && "type" in prev && typeof curr === "object" && "type" in curr) {
      if (prev.type !== curr.type) {
        hasChanged = true;
        valueDiff = { label, prev, curr };
      }

      if ("addresses" in prev && "addresses" in curr) {
        if (
          prev.addresses.length !== curr.addresses.length ||
          prev.addresses.some((adr, index) => stringEq(adr, curr.addresses[index]))
        ) {
          hasChanged = true;
          valueDiff = { label, prev, curr };
        }
      }
    }

    // Categorize into advanced/non-advanced
    const isAdvanced = isAdvancedField(key);

    if (hasChanged && valueDiff) {
      if (isAdvanced) {
        advancedModifications[key] = valueDiff;
      } else {
        nonAdvancedModifications[key] = valueDiff;
      }
    } else {
      // Add to constants section to show unchanged values
      const constantDiff = {
        label,
        prev: prev,
        curr: curr,
      };

      if (isAdvanced) {
        advancedConstants[key] = constantDiff;
      } else {
        nonAdvancedConstants[key] = constantDiff;
      }
    }
  }

  return {
    nonAdvanced: {
      modifications: Object.entries(nonAdvancedModifications),
      constants: Object.entries(nonAdvancedConstants),
    },
    advanced: {
      modifications: Object.entries(advancedModifications),
      constants: Object.entries(advancedConstants),
    },
  };
}
