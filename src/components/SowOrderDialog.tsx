import { TV } from "@/classes/TokenValue";
import { Form } from "@/components/Form";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import {
  SowOrderV0FormSchema,
  sowOrderSchemaErrors,
  useSowOrderV0Form,
  useSowOrderV0State,
} from "@/components/Tractor/form/SowOrderV0Schema";
import { MAIN_TOKEN } from "@/constants/tokens";
import useSowOrderV0Calculations from "@/hooks/tractor/useSowOrderV0Calculations";
import { tractorTokenStrategyUtil as StrategyUtil, TractorTokenStrategy } from "@/lib/Tractor";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePodLine } from "@/state/useFieldData";
import { useChainConstant } from "@/utils/chain";
import { formatter } from "@/utils/format";
import { sanitizeNumericInputValue } from "@/utils/string";
import { cn } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Col, Row } from "./Container";
import TooltipSimple from "./TooltipSimple";
import { SowOrderEstimatedTipPaid } from "./Tractor/Sow/SowOrderEstimatedTipPaid";
import {
  SowOrderEntryFormParametersSummary,
  SowOrderFormAdvancedParametersSummary,
  SowOrderFormButtonRow,
} from "./Tractor/Sow/SowOrderSharedComponents";
import SowOrderTractorAdvancedForm from "./Tractor/Sow/SowOrderTractorAdvancedForm";
import TractorTokenStrategyDialog from "./Tractor/TractorTokenStrategyDialog";
import SowOrderV0Fields from "./Tractor/form/SowOrderV0Fields";
import {
  OperatorTipFormField,
  TractorOperatorTipStrategy,
  getTractorOperatorTipAmountFromPreset,
} from "./Tractor/form/fields/sharedFields";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/Accordion";
import { Button } from "./ui/Button";
import { Separator } from "./ui/Separator";
import Warning from "./ui/Warning";

interface SowOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderPublished?: () => void;
}

// Types
enum FormStep {
  MAIN_FORM = 1,
  REVIEW = 2,
  ADVANCED = 3,
}

export default function SowOrderDialog({ open, onOpenChange, onOrderPublished }: SowOrderDialogProps) {
  // External hooks
  const farmerSilo = useFarmerSilo();
  const { data: averageTipPaid = 1 } = useTractorOperatorAverageTipPaid();

  // Local state
  const [formStep, setFormStep] = useState(FormStep.MAIN_FORM);
  const [showTokenSelectionDialog, setShowTokenSelectionDialog] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
  const [operatorTipPreset, setOperatorTipPreset] = useState<TractorOperatorTipStrategy>("Normal");

  // Draft state management for advanced editing
  const [draftState, setDraftState] = useState<{
    isActive: boolean;
    originalValues: Partial<SowOrderV0FormSchema> | null;
  }>({
    isActive: false,
    originalValues: null,
  });

  // Refs for operator tip state management
  const previousPresetRef = useRef<TractorOperatorTipStrategy | null>(null);
  const originalTipRef = useRef<string | null>(null);

  const farmerDeposits = farmerSilo.deposits;

  // Form state
  const { form, getMissingFields, getAreAllFieldsValid } = useSowOrderV0Form();
  const { state, orderData, isLoading, handleCreateBlueprint } = useSowOrderV0State();
  const calculations = useSowOrderV0Calculations();

  // Initialize operator tip
  const [didInitOperatorTip, setDidInitOperatorTip] = useState(false);
  useEffect(() => {
    if (didInitOperatorTip || averageTipPaid === 1) return;
    form.setValue("operatorTip", averageTipPaid.toFixed(2));
    setDidInitOperatorTip(true);
  }, [averageTipPaid, didInitOperatorTip, form.setValue]);

  // Initialize token strategy only once when dialog opens
  const [didInitTokenStrategy, setDidInitTokenStrategy] = useState(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Form will be rendered more often than calculations
  useEffect(() => {
    if (didInitTokenStrategy || calculations.isLoading) return;
    // Only auto-set if user hasn't made a selection and it's still the default
    const currentStrategy = form.getValues("selectedTokenStrategy");
    if (!currentStrategy) {
      form.setValue("selectedTokenStrategy", calculations.tokenWithHighestValue);
    }
    setDidInitTokenStrategy(true);
  }, [calculations.tokenWithHighestValue, calculations.isLoading, didInitTokenStrategy]);

  // Set default values for minSoil, maxPerSeason, and podLineLength
  const mainToken = useChainConstant(MAIN_TOKEN);
  const podLine = usePodLine();
  const [totalAmount, tokenStrategy, temperature] = useWatch({
    control: form.control,
    name: ["totalAmount", "selectedTokenStrategy", "temperature"],
  });

  // Calculate max amount based on farmer deposits and token strategy
  const maxDepositAmount = useMemo(() => {
    if (!farmerDeposits) return undefined;

    const summary = StrategyUtil.getSummary(tokenStrategy);
    let total = TV.ZERO;

    if (summary.type === "SPECIFIC_TOKEN" && summary.addresses) {
      summary.addresses.forEach((address) => {
        farmerDeposits.forEach((deposit, token) => {
          if (token.address.toLowerCase() === address.toLowerCase() && deposit.amount) {
            if (token.isLP) {
              const price = calculations.priceData.tokenPrices.get(token)?.instant;
              if (price) {
                total = total.add(deposit.amount.mul(price));
              }
            } else {
              total = total.add(deposit.amount);
            }
          }
        });
      });
    } else {
      farmerDeposits.forEach((deposit, token) => {
        if (deposit.amount) {
          if (token.isLP) {
            const price = calculations.priceData.tokenPrices.get(token)?.instant;
            if (price) {
              total = total.add(deposit.amount.mul(price));
            }
          } else {
            total = total.add(deposit.amount);
          }
        }
      });
    }

    return total.gt(0) ? total : undefined;
  }, [farmerDeposits, tokenStrategy, calculations.priceData]);

  // Check if total amount exceeds max deposits
  const exceedsDeposits = useMemo(() => {
    if (!maxDepositAmount || !totalAmount) return false;
    const cleaned = sanitizeNumericInputValue(totalAmount, mainToken.decimals);
    if (cleaned.nonAmount) return false;
    return cleaned.tv.toNumber() > maxDepositAmount.toNumber();
  }, [maxDepositAmount, totalAmount, mainToken.decimals]);

  // Check if temperature is zero or empty
  const temperatureIsZero = useMemo(() => {
    if (!temperature) return false;
    const cleaned = sanitizeNumericInputValue(temperature, 6);
    if (cleaned.nonAmount) return false;
    return cleaned.tv.toNumber() === 0;
  }, [temperature]);

  // Set default values for minSoil and maxPerSeason based on totalAmount
  useEffect(() => {
    if (!totalAmount || totalAmount === "") return;

    const totalAmountTV = sanitizeNumericInputValue(totalAmount, mainToken.decimals).tv;
    if (totalAmountTV.eq(0)) return;

    // minSoil: min(TotalValueToSow, 25 PINTO)
    const twentyFivePinto = TV.fromHuman(25, mainToken.decimals);
    const minSoilValue = TV.min(totalAmountTV, twentyFivePinto);
    const minSoilFormatted = formatter.number(minSoilValue);
    form.setValue("minSoil", minSoilFormatted, { shouldValidate: true });

    // maxPerSeason: TotalValueToSow
    const maxPerSeasonFormatted = formatter.number(totalAmountTV);
    form.setValue("maxPerSeason", maxPerSeasonFormatted, { shouldValidate: true });
  }, [totalAmount, mainToken.decimals, form]);

  // Set default value for podLineLength: current pod line * 2
  useEffect(() => {
    if (podLine.gt(0)) {
      const podLineLengthValue = podLine.mul(2);
      const podLineLengthFormatted = formatter.number(podLineLengthValue);
      const currentValue = form.getValues("podLineLength");
      if (!currentValue || currentValue === "") {
        form.setValue("podLineLength", podLineLengthFormatted, { shouldValidate: false });
      }
    }
  }, [podLine, form]);

  const handleOpenTokenSelectionDialog = () => {
    setShowTokenSelectionDialog(true);
  };

  // Handlers for advanced form
  const handleSetAdvanced = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    // Store current form values as original before entering draft mode
    setDraftState({
      isActive: true,
      originalValues: form.getValues(),
    });

    setFormStep(FormStep.ADVANCED);
  };

  const handleAdvancedSubmit = () => {
    // Commit the changes - clear draft state
    setDraftState({
      isActive: false,
      originalValues: null,
    });
    setFormStep(FormStep.REVIEW);
  };

  const handleAdvancedCancel = () => {
    // Revert changes - restore original values
    if (draftState.originalValues) {
      form.reset(draftState.originalValues);
    }

    setDraftState({
      isActive: false,
      originalValues: null,
    });
    setFormStep(FormStep.REVIEW);
  };

  const handleSetAccordionValue = (value: string) => {
    if (accordionValue === "advanced-settings" && formStep === FormStep.ADVANCED) {
      return;
    }
    setAccordionValue(value);
  };

  const handleSetOperatorTipPreset = (preset: TractorOperatorTipStrategy) => {
    if (preset === "Custom") {
      if (operatorTipPreset !== "Custom") {
        // First time going to Custom: store original state
        previousPresetRef.current = operatorTipPreset;
        originalTipRef.current = form.getValues("operatorTip") ?? null;
      } else {
        // Re-entering Custom: reset tip to original + cache current state for cancel
        if (originalTipRef.current) {
          form.setValue("operatorTip", originalTipRef.current);
        }
      }
    } else {
      // Switching to non-Custom preset: clear refs and update operatorTip value
      previousPresetRef.current = null;
      originalTipRef.current = null;

      // Calculate and set the new tip value based on preset
      const tipAmount = getTractorOperatorTipAmountFromPreset(
        preset,
        averageTipPaid,
        form.getValues("customOperatorTip"),
        mainToken.decimals,
      );
      if (tipAmount) {
        form.setValue("operatorTip", tipAmount.toHuman());
      }
    }

    // For Custom preset, update operatorTip from customOperatorTip
    if (preset === "Custom") {
      const customTip = form.getValues("customOperatorTip");
      if (customTip) {
        form.setValue("operatorTip", customTip);
      }
    }

    setOperatorTipPreset(preset);
  };

  // Main handlers
  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevent default to avoid form submission
    e.preventDefault();
    e.stopPropagation();

    if (formStep === FormStep.MAIN_FORM) {
      const isValid = await form.trigger();
      if (isValid) {
        setFormStep(FormStep.REVIEW);
      }
      return;
    }

    if (formStep === FormStep.REVIEW) {
      await handleCreateBlueprint(form, farmerDeposits, {
        onSuccess: () => {
          setShowReview(true);
        },
        onFailure: () => {
          toast.error("Failed to create order");
        },
      });
    }
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevent default to avoid form submission
    e.preventDefault();
    e.stopPropagation();

    if (formStep === FormStep.REVIEW) {
      setFormStep(FormStep.MAIN_FORM);
    } else if (formStep === FormStep.ADVANCED) {
      handleAdvancedCancel();
    } else {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  const missingFields = getMissingFields();

  const allFieldsValid = getAreAllFieldsValid();

  const isMissingFields = missingFields.length > 0;

  const isStep1 = formStep === FormStep.MAIN_FORM;

  const nextDisabled =
    (isLoading || isMissingFields || !allFieldsValid || exceedsDeposits || temperatureIsZero) && isStep1;

  return (
    <>
      <Form {...form}>
        <Col className="h-auto w-full">
          <div>
            <div className="flex flex-col gap-6">
              {/* Form Fields */}
              <div className="flex flex-col gap-6">
                {formStep === FormStep.MAIN_FORM ? (
                  // Step 1 - Main Form
                  <Col className="gap-6 pinto-sm-light text-pinto-light">
                    {/* Title and separator */}
                    <div className="flex flex-col gap-2">
                      <div className="pinto-body font-medium text-pinto-secondary mb-4">
                        🚜 Specify Conditions for automated Sowing
                      </div>
                      <div className="h-[1px] w-full bg-pinto-gray-2" />
                    </div>
                    <SowOrderV0Fields>
                      {/* Sow Using */}
                      <SowOrderV0Fields.TokenStrategy openDialog={handleOpenTokenSelectionDialog} />
                      {/* I want to Sow up to */}
                      <SowOrderV0Fields.TotalAmount farmerDeposits={farmerDeposits} />
                      {/* Execute when Temperature is at least */}
                      <SowOrderV0Fields.Temperature />
                      {/* Execute during the Morning Auction */}
                      <SowOrderV0Fields.MorningAuction />
                      {/* Pods Display */}
                      <SowOrderV0Fields.PodDisplay />
                    </SowOrderV0Fields>
                  </Col>
                ) : formStep === FormStep.REVIEW ? (
                  // Step 2 - Review
                  <Col className="gap-6 w-full">
                    <div className="flex flex-col gap-2">
                      <div className="pinto-body font-medium text-pinto-secondary mb-4">🚜 Review Sow Parameters</div>
                      <Separator className="h-[1px] w-full bg-pinto-gray-2" />
                    </div>
                    <Col className="w-full gap-5">
                      <Col className="w-full gap-3">
                        <SowOrderEntryFormParametersSummary />
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
                              <SowOrderFormAdvancedParametersSummary toggleEdit={handleSetAdvanced} />
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                        <Col className="gap-2">
                          <OperatorTipFormField
                            averageTipPaid={averageTipPaid}
                            preset={operatorTipPreset}
                            setPreset={handleSetOperatorTipPreset}
                          />
                          <SowOrderEstimatedTipPaid
                            averageTipPaid={averageTipPaid}
                            operatorTipPreset={operatorTipPreset}
                          />
                        </Col>
                      </Col>
                    </Col>
                    <SowOrderFormButtonRow handleBack={handleBack} handleNext={handleNext} isLoading={isLoading} />
                  </Col>
                ) : formStep === FormStep.ADVANCED ? (
                  // Step 3 - Advanced Form
                  <Col className="gap-6 w-full">
                    <div className="flex flex-col gap-2">
                      <div className="pinto-body font-medium text-pinto-secondary mb-4">🚜 Advanced Parameters</div>
                      <Separator className="h-[1px] w-full bg-pinto-gray-2" />
                    </div>
                    <div className="py-3">
                      <SowOrderTractorAdvancedForm onSubmit={handleAdvancedSubmit} onCancel={handleAdvancedCancel} />
                    </div>
                  </Col>
                ) : null}
                {formStep === FormStep.MAIN_FORM ? (
                  <>
                    <SowOrderV0FormErrors errors={form.formState.errors} exceedsDeposits={exceedsDeposits} />
                    <Row className="gap-6">
                      <Button
                        variant="outline"
                        size="xlargest"
                        rounded="full"
                        className="flex-1 text-pinto-light bg-pinto-gray-1"
                        onClick={handleBack}
                        type="button"
                      >
                        ← Back
                      </Button>
                      <TooltipSimple
                        content={
                          isStep1 && isMissingFields ? (
                            <div className="p-1">
                              <div className="font-medium mb-1">Please fill in the following fields:</div>
                              <ul className="list-disc pl-4 text-sm">
                                {missingFields.map((field) => (
                                  <li key={field}>{field}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null
                        }
                        side="top"
                        align="center"
                        // Only show tooltip when there are missing fields
                        disabled={!(isMissingFields && isStep1)}
                      >
                        <div className="flex-1">
                          <Button
                            size="xlargest"
                            rounded="full"
                            className={`w-full ${
                              isLoading ? "bg-pinto-gray-2 text-pinto-light" : "bg-pinto-green-4 text-white"
                            }`}
                            disabled={nextDisabled}
                            onClick={handleNext}
                            type="button"
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                              </div>
                            ) : (
                              "Next"
                            )}
                          </Button>
                        </div>
                      </TooltipSimple>
                    </Row>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </Col>
        {/*
         * Token Selection Dialog
         */}
        {showTokenSelectionDialog && (
          <SowOrderV0TokenStrategyDialog
            open={showTokenSelectionDialog}
            onOpenChange={setShowTokenSelectionDialog}
            farmerDeposits={farmerDeposits}
            calculations={calculations}
          />
        )}
      </Form>
      {showReview && state && orderData && (
        <ReviewTractorOrderDialog
          open={showReview}
          onOpenChange={(open) => setShowReview(open)}
          onSuccess={() => onOpenChange(false)}
          onOrderPublished={onOrderPublished}
          orderData={{
            type: "sow",
            ...orderData,
            tokenStrategy: form.getValues("selectedTokenStrategy"),
            tokenSymbol: orderData.token?.symbol,
          }}
          encodedData={state.encodedData}
          operatorPasteInstrs={state.operatorPasteInstructions}
          blueprint={state.blueprint}
          includesDepositOptimization={calculations.needsOptimization}
          depositOptimizationCalls={state.depositOptimizationCalls}
        />
      )}
    </>
  );
}

const errorsToShow = new Set<string>(Object.values(sowOrderSchemaErrors));

export const SowOrderV0TokenStrategyDialog = ({
  open,
  onOpenChange,
  farmerDeposits,
  calculations,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmerDeposits: ReturnType<typeof useFarmerSilo>["deposits"];
  calculations: ReturnType<typeof useSowOrderV0Calculations>;
}) => {
  const ctx = useFormContext<SowOrderV0FormSchema>();

  // Use useWatch instead of ctx.watch to only watch this specific field
  const selectedTokenStrategy = useWatch({
    control: ctx.control,
    name: "selectedTokenStrategy",
  });

  // Memoize the callback to prevent recreating on every render
  const handleTokenStrategySelected = useCallback(
    (tokenStrategy: TractorTokenStrategy) => {
      ctx.setValue("selectedTokenStrategy", tokenStrategy);
      onOpenChange(false);
    },
    [ctx, onOpenChange],
  );

  if (!StrategyUtil.isValidStrategy(selectedTokenStrategy)) {
    return null;
  }

  return (
    <TractorTokenStrategyDialog
      open={open}
      onOpenChange={onOpenChange}
      onTokenStrategySelected={handleTokenStrategySelected}
      selectedTokenStrategy={selectedTokenStrategy}
      farmerDeposits={farmerDeposits}
      {...calculations}
    />
  );
};

const SowOrderV0FormErrors = ({
  errors,
  exceedsDeposits,
}: {
  errors: ReturnType<typeof useSowOrderV0Form>["form"]["formState"]["errors"];
  exceedsDeposits?: boolean;
}) => {
  const deduplicate = () => {
    const set = new Set<string>();
    for (const err of Object.values(errors)) {
      if (err?.message && errorsToShow.has(err.message)) {
        set.add(err.message);
      }
    }
    // Add exceeds deposits error if applicable
    if (exceedsDeposits) {
      set.add(sowOrderSchemaErrors.totalExceedsDeposits);
    }

    return Array.from(set);
  };

  const errs = deduplicate();

  if (!errs.length) return null;

  return (
    <Col className="gap-1">
      {errs.map((err) => {
        return (
          <div key={`${err}-error`}>
            <Warning variant="warning">{err}</Warning>
          </div>
        );
      })}
    </Col>
  );
};

export const AnimateSowOrderDialog = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
          style={{ transformOrigin: "50% 70%" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
