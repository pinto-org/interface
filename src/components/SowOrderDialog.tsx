import { Form } from "@/components/Form";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import {
  SowOrderV0FormSchema,
  sowOrderSchemaErrors,
  useSowOrderV0Form,
  useSowOrderV0State,
} from "@/components/Tractor/form/SowOrderV0Schema";
import useSowOrderV0Calculations from "@/hooks/tractor/useSowOrderV0Calculations";
import { TractorTokenStrategy, TractorTokenStrategyUnion, isTractorTokenStrategy } from "@/lib/Tractor";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Col, Row } from "./Container";
import TooltipSimple from "./TooltipSimple";
import TractorTokenStrategyDialog from "./Tractor/TractorTokenStrategyDialog";
import SowOrderV0Fields from "./Tractor/form/SowOrderV0Fields";
import { Button } from "./ui/Button";
import Warning from "./ui/Warning";

interface SowOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderPublished?: () => void;
}

// Types
enum FormStep {
  MAIN_FORM = 1,
  OPERATOR_TIP = 2,
}

export default function SowOrderDialog({ open, onOpenChange, onOrderPublished }: SowOrderDialogProps) {
  // External hooks
  const farmerSilo = useFarmerSilo();
  const { data: averageTipPaid = 1 } = useTractorOperatorAverageTipPaid();

  // Local state
  const [formStep, setFormStep] = useState(FormStep.MAIN_FORM);
  const [showTokenSelectionDialog, setShowTokenSelectionDialog] = useState(false);
  const [showReview, setShowReview] = useState(false);

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

  const handleOpenTokenSelectionDialog = () => {
    setShowTokenSelectionDialog(true);
  };

  // Main handlers
  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevent default to avoid form submission
    e.preventDefault();

    if (formStep === FormStep.MAIN_FORM) {
      const isValid = await form.trigger();
      if (isValid) {
        setFormStep(FormStep.OPERATOR_TIP);
      }
      return;
    }

    await handleCreateBlueprint(form, farmerDeposits, {
      onSuccess: () => {
        setShowReview(true);
      },
      onFailure: () => {
        toast.error(e instanceof Error ? e.message : "Failed to create order");
      },
    });
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevent default to avoid form submission
    e.preventDefault();
    if (formStep === FormStep.OPERATOR_TIP) {
      setFormStep(FormStep.MAIN_FORM);
    } else {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  const missingFields = getMissingFields();

  const allFieldsValid = getAreAllFieldsValid();

  const isMissingFields = missingFields.length > 0;

  const isStep1 = formStep === FormStep.MAIN_FORM;

  const nextDisabled = (isLoading || isMissingFields || !allFieldsValid) && isStep1;

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
                      {/* I want to Sow up to */}
                      <SowOrderV0Fields.TotalAmount />
                      {/* Min and Max per Season - combined in a single row */}
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-4">
                          <SowOrderV0Fields.MinSoil />
                          <SowOrderV0Fields.MaxPerSeason />
                        </div>
                      </div>
                      {/* Fund order using */}
                      <SowOrderV0Fields.TokenStrategy openDialog={handleOpenTokenSelectionDialog} />
                      {/* Execute when Temperature is at least */}
                      <SowOrderV0Fields.Temperature />
                      {/* Execute when the length of the Pod Line is at most */}
                      <SowOrderV0Fields.PodLineLength />
                      {/* Execute during the Morning Auction */}
                      <SowOrderV0Fields.MorningAuction />
                    </SowOrderV0Fields>
                  </Col>
                ) : (
                  // Step 2 - Operator Tip
                  <Col className="gap-6">
                    <Col>
                      {/* Title and separator for Step 2 */}
                      <div className="flex flex-col gap-2">
                        <div className="pinto-body font-medium text-pinto-secondary mb-4">🚜 Tip per Execution</div>
                        <div className="h-[1px] w-full bg-pinto-gray-2 mb-6" />
                      </div>
                      <SowOrderV0Fields>
                        <SowOrderV0Fields.OperatorTip averageTipPaid={averageTipPaid} />
                        <SowOrderV0Fields.ExecutionsAndTip className="mt-32" />
                      </SowOrderV0Fields>
                    </Col>
                  </Col>
                )}
                <SowOrderV0FormErrors errors={form.formState.errors} />
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
                    // Only show tooltip when there are missing fields or errors
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
                        ) : formStep === FormStep.MAIN_FORM ? (
                          "Next"
                        ) : (
                          "Review"
                        )}
                      </Button>
                    </div>
                  </TooltipSimple>
                </Row>
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

  if (!isTractorTokenStrategy(selectedTokenStrategy)) {
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
}: { errors: ReturnType<typeof useSowOrderV0Form>["form"]["formState"]["errors"] }) => {
  const deduplicate = () => {
    const set = new Set<string>();
    for (const err of Object.values(errors)) {
      if (err?.message && errorsToShow.has(err.message)) {
        set.add(err.message);
      }
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
