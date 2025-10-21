import { Col } from "@/components/Container";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Separator } from "@/components/ui/Separator";
import { useTractorConvertUpOrderbook } from "@/state/tractor/useTractorConvertUpOrders";
import useConvertStalkPerBdvBonusAndMaximumCapacity from "@/state/useConvertStalkPerBdvBonusData";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { cn } from "@/utils/utils";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { OperatorTipFormField, TractorOperatorTipStrategy } from "../form/fields/sharedFields";
import { defaultConvertOrderUpValues, useConvertUpV0State } from "../form/schema/convertUp.schema";
import { ConvertUpEstimatedTipPaid } from "./ConvertUpOperatorTipForm";
import {
  ConvertUpEntryFormParametersSummary,
  ConvertUpFormAdvancedParametersSummary,
  ConvertUpFormButtonRow,
} from "./ConvertUpSharedComponents";
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
  const { data: bonusData } = useConvertStalkPerBdvBonusAndMaximumCapacity();

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

    // if (preset === "Custom") {
    //   setFormStep(ConvertUpTractorOrderFormStep.OPERATOR_TIP);
    // }
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
      {/* {formStep === ConvertUpTractorOrderFormStep.OPERATOR_TIP ? (
        <ConvertUpCustomOperatorTipForm
          averageTipPaid={averageTipPaid ?? 1}
          onSubmit={handleCustomTipSubmit}
          onCancel={handleCustomTipCancel}
        />
      ) : ( */}
      <Col className="gap-6 w-full">
        <div className="flex flex-col gap-2">
          <div className="pinto-body font-medium text-pinto-secondary mb-4">{"🚜 Review your Convert Up Order"}</div>
          <Separator className="h-[1px] w-full bg-pinto-gray-2" />
        </div>
        <Col className="w-full gap-5">
          <Col className="w-full gap-3">
            <ConvertUpEntryFormParametersSummary />
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
                    <ConvertUpFormAdvancedParametersSummary toggleEdit={handleSetAdvanced} />
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
          <ConvertUpFormButtonRow handleBack={handleBack} handleNext={handleNext} isLoading={isLoading} />
        ) : null}
      </Col>
      {/* Review Dialog for ConvertUp Orders */}
      {showReviewDialog && state && orderData && (
        <ReviewTractorOrderDialog
          open={showReviewDialog}
          onOpenChange={setShowReviewDialog}
          onSuccess={() => {
            setFormStep(ConvertUpTractorOrderFormStep.ENTRY);
            form.reset({
              ...defaultConvertOrderUpValues,
              grownStalkPerBdvBonusBid: bonusData?.bonus?.toHuman() ?? "",
            });
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
