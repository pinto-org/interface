import { diamondABI } from "@/constants/abi/diamondABI";

import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import { Form } from "@/components/Form";
import TooltipSimple from "@/components/TooltipSimple";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Separator } from "@/components/ui/Separator";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useGetTractorTokenStrategyWithBlueprint } from "@/hooks/tractor/useGetTractorTokenStrategy";
import useSignTractorBlueprint from "@/hooks/tractor/useSignTractorBlueprint";
import useSowOrderV0Calculations from "@/hooks/tractor/useSowOrderV0Calculations";
import useTransaction from "@/hooks/useTransaction";
import { RequisitionEvent, SowBlueprintData, prepareRequisitionForTxn } from "@/lib/Tractor";
import { useGetBlueprintHash } from "@/lib/Tractor/blueprint";
import { Blueprint, ExtendedTractorTokenStrategy, Requisition, TractorTokenStrategy } from "@/lib/Tractor/types";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { formatter } from "@/utils/format";
import { postSanitizedSanitizedValue } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { cn } from "@/utils/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { SowOrderV0TokenStrategyDialog } from "../SowOrderDialog";
import { SowOrderEstimatedTipPaid } from "./Sow/SowOrderEstimatedTipPaid";
import {
  SowOrderEntryFormParametersSummary,
  SowOrderFormAdvancedParametersSummary,
  SowOrderFormButtonRow,
} from "./Sow/SowOrderSharedComponents";
import SowOrderTractorAdvancedForm from "./Sow/SowOrderTractorAdvancedForm";
import SowOrderV0Fields from "./form/SowOrderV0Fields";
import { useSowOrderV0Form, useSowOrderV0State } from "./form/SowOrderV0Schema";
import { OperatorTipFormField, TractorOperatorTipStrategy } from "./form/fields/sharedFields";

interface ModifyTractorOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderModified?: () => void;
  existingOrder: RequisitionEvent<SowBlueprintData>;
  // pass in as a prop to ensure data is loaded before the dialog is opened
  getStrategyProps: ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>;
}

export default function ModifyTractorOrderDialog({
  open,
  onOpenChange,
  onOrderModified,
  existingOrder,
  getStrategyProps,
}: ModifyTractorOrderDialogProps) {
  // Data Hooks
  const farmerSilo = useFarmerSilo();
  const { data: averageTipValue = 1 } = useTractorOperatorAverageTipPaid();
  const { form, getMissingFields, getAreAllFieldsValid, prefillValues } = useSowOrderV0Form();
  const { state, orderData, isLoading, handleCreateBlueprint } = useSowOrderV0State();
  const calculations = useSowOrderV0Calculations();

  // Local State
  const [showReview, setShowReview] = useState(false);
  const [showTokenSelectionDialog, setShowTokenSelectionDialog] = useState(false);
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1); // MAIN_FORM = 1, REVIEW = 2, ADVANCED = 3
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
  const [operatorTipPreset, setOperatorTipPreset] = useState<TractorOperatorTipStrategy>("Normal");

  // Draft state management for advanced editing
  const [draftState, setDraftState] = useState<{
    isActive: boolean;
    originalValues: Partial<ReturnType<typeof useSowOrderV0Form>["form"]["getValues"]> | null;
  }>({
    isActive: false,
    originalValues: null,
  });

  // Refs for operator tip state management
  const previousPresetRef = useRef<TractorOperatorTipStrategy | null>(null);
  const originalTipRef = useRef<string | null>(null);

  // Effects. Pre-fill form with existing order data
  const [didPrefill, setDidPrefill] = useState(false);

  useEffect(() => {
    if (didPrefill || getStrategyProps.isLoading || !existingOrder.decodedData) return;

    if (open) {
      const data = existingOrder.decodedData;
      const tokenStrategy = getStrategyProps.getTokenStrategy(data);

      prefillValues({
        totalAmount: formatter.noDecTrunc(data.sowAmounts.totalAmountToSowAsString),
        minSoil: formatter.noDecTrunc(data.sowAmounts.minAmountToSowPerSeasonAsString),
        maxPerSeason: formatter.noDecTrunc(data.sowAmounts.maxAmountToSowPerSeasonAsString),
        temperature: formatter.noDecTrunc(data.minTempAsString),
        podLineLength: formatter.noDecTrunc(data.maxPodlineLengthAsString),
        operatorTip: formatter.noDecTrunc(data.operatorParams.operatorTipAmountAsString),
        morningAuction: data.runBlocksAfterSunrise === 0n,
        selectedTokenStrategy: tokenStrategy ?? { type: "LOWEST_SEEDS" as const },
      });
      setDidPrefill(true);
    }
  }, [open, existingOrder, didPrefill, prefillValues, getStrategyProps]);

  // Handlers for advanced form
  const handleSetAdvanced = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    // Store current form values as original before entering draft mode
    setDraftState({
      isActive: true,
      originalValues: form.getValues(),
    });

    setFormStep(3); // ADVANCED
  };

  const handleAdvancedSubmit = () => {
    // Commit the changes - clear draft state
    setDraftState({
      isActive: false,
      originalValues: null,
    });
    setFormStep(2); // REVIEW
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
    setFormStep(2); // REVIEW
  };

  const handleSetAccordionValue = (value: string) => {
    if (accordionValue === "advanced-settings" && formStep === 3) {
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
      // Switching to non-Custom preset: clear refs
      previousPresetRef.current = null;
      originalTipRef.current = null;
    }

    setOperatorTipPreset(preset);
  };

  // Callbacks
  // Handle creating the modified order
  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (formStep === 1) {
      // MAIN_FORM -> REVIEW
      const isValid = await form.trigger();
      if (isValid) {
        setFormStep(2);
      }
      return;
    }

    if (formStep === 2) {
      // REVIEW -> Create blueprint and show review dialog
      await handleCreateBlueprint(form, undefined, {
        onSuccess: () => {
          setShowReview(true);
        },
        onFailure: () => {
          toast.error("Failed to create order");
        },
      });
    }
  };

  // Handle back button
  const handleBack = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (formStep === 2) {
      // REVIEW -> MAIN_FORM
      setFormStep(1);
    } else if (formStep === 3) {
      // ADVANCED -> REVIEW
      handleAdvancedCancel();
    } else {
      // MAIN_FORM -> Close dialog
      onOpenChange(false);
    }
  };

  if (!open) return null;

  const farmerDeposits = farmerSilo.deposits;

  const missingFields = getMissingFields();

  const allFieldsValid = getAreAllFieldsValid();

  const isMissingFields = missingFields.length > 0;

  const nextDisabled = isLoading || isMissingFields || !allFieldsValid;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 backdrop-blur-[2px] bg-white/50" />
          <DialogContent className="max-w-[35rem] p-6 max-h-[80vh] overflow-y-auto">
            <Col className="gap-6">
              <DialogHeader>
                <DialogTitle>
                  <div className="pinto-body font-medium text-pinto-secondary">
                    🚜 Update Conditions for automated Sowing
                  </div>
                </DialogTitle>
                <DialogDescription className="pinto-sm-light text-pinto-light pt-2">
                  Update your existing Tractor Order. The current order will be cancelled and a new one will be created
                  with your updated conditions.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <div className="h-[1px] w-full bg-pinto-gray-2" />
                <div className="flex flex-col gap-6">
                  {formStep === 1 ? (
                    // Step 1 - Main Form
                    <Col className="gap-6 pinto-sm-light text-pinto-light">
                      <SowOrderV0Fields>
                        {/* Sow Using */}
                        <SowOrderV0Fields.TokenStrategy openDialog={() => setShowTokenSelectionDialog(true)} />
                        {/* I want to Sow up to */}
                        <SowOrderV0Fields.TotalAmount farmerDeposits={farmerDeposits} />
                        {/* Execute when Temperature is at least */}
                        <SowOrderV0Fields.Temperature />
                        {/* Pods Display */}
                        <SowOrderV0Fields.PodDisplay />
                      </SowOrderV0Fields>
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
                            isMissingFields ? (
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
                          disabled={!isMissingFields}
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
                    </Col>
                  ) : formStep === 2 ? (
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
                              className={cn(
                                "AccordionItem",
                                "border-[1px] px-2 border-pinto-gray-2 rounded-md bg-white",
                              )}
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
                              averageTipPaid={averageTipValue}
                              preset={operatorTipPreset}
                              setPreset={handleSetOperatorTipPreset}
                            />
                            <SowOrderEstimatedTipPaid />
                          </Col>
                        </Col>
                      </Col>
                      <SowOrderFormButtonRow handleBack={handleBack} handleNext={handleNext} isLoading={isLoading} />
                    </Col>
                  ) : formStep === 3 ? (
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
                </div>
                {/* Token Selection Dialog */}
                <SowOrderV0TokenStrategyDialog
                  open={showTokenSelectionDialog}
                  onOpenChange={setShowTokenSelectionDialog}
                  farmerDeposits={farmerDeposits}
                  calculations={calculations}
                />
              </Form>
            </Col>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      {showReview && state && orderData && (
        <ModifyTractorOrderReviewDialog
          open={showReview}
          onOpenChange={setShowReview}
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

type OrderData = NonNullable<NonNullable<ReturnType<typeof useSowOrderV0State>>["orderData"]>;

// Create a specialized review dialog for modify operations
interface ModifyTractorOrderReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  existingOrder: RequisitionEvent<SowBlueprintData>;
  orderData: OrderData;
  encodedData: `0x${string}`;
  operatorPasteInstrs: `0x${string}`[];
  blueprint: Blueprint;
  getStrategyProps: ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>;
}

function ModifyTractorOrderReviewDialog({
  open,
  onOpenChange,
  onSuccess,
  existingOrder,
  orderData,
  getStrategyProps,
  blueprint,
}: ModifyTractorOrderReviewDialogProps) {
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const queryClient = useQueryClient();

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

      const prevRequisition = prepareRequisitionForTxn(existingOrder.requisition);
      const preparedRequisition = prepareRequisitionForTxn(signedRequisition);

      // Create the farm call data that cancels the old order and creates the new one
      const farmCalls = [
        // Cancel the existing order
        encodeFunctionData({
          abi: diamondABI,
          functionName: "cancelBlueprint",
          args: [prevRequisition],
        }),
        // Create the new order (publish requisition)
        encodeFunctionData({
          abi: diamondABI,
          functionName: "publishRequisition",
          args: [preparedRequisition],
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
                <div>Your existing Tractor Order will be cancelled and replaced with this new order.</div>
              </DialogDescription>
            </DialogHeader>
            <div>
              {/* Show a comparison of old vs new */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="space-y-4 text-sm">
                  {/* Show all order parameters in single New Order table */}
                  {valueDiffs.modifications.length || valueDiffs.constants.length ? (
                    <div>
                      <h4 className="pinto-body font-medium text-pinto-secondary mb-2">New Order</h4>
                      <Col className="gap-2 pinto-sm-light">
                        {/* Show modifications first */}
                        {valueDiffs.modifications.map(([key, value]) => {
                          return <RenderValueDiff key={`sow-v0-diff-${key}`} {...value} />;
                        })}
                        {/* Show constants after modifications */}
                        {valueDiffs.constants.map(([key, value]) => {
                          return <RenderConstantParam key={`sow-v0-constant-${key}`} {...value} />;
                        })}
                      </Col>
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
                    disabled={isSigning || !valueDiffs.modifications.length}
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
                    disabled={submitting || !valueDiffs.modifications.length}
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

const RenderValueDiff = (props: ValueDiff<unknown>) => {
  const { label, prev, curr } = props;

  return (
    <Row key={`diff-${label}`} className="justify-between items-center">
      <div className="text-pinto-secondary">{label}</div>
      {typeof prev === "string" ? (
        <RenderStringDiff prev={prev} curr={curr as string} />
      ) : prev instanceof TokenValue ? (
        <RenderDiffTokenValue prev={prev} curr={curr as TokenValue} />
      ) : prev && typeof prev === "object" && "type" in prev ? (
        <RenderTokenStrategyDiff
          prev={prev as ExtendedTractorTokenStrategy}
          curr={curr as ExtendedTractorTokenStrategy}
        />
      ) : null}
    </Row>
  );
};

const RenderConstantParam = (props: ValueDiff<unknown>) => {
  const { label, prev } = props;

  const getConstantParamValue = () => {
    try {
      if (typeof prev === "string") {
        return prev;
      } else if (typeof prev === "boolean") {
        return prev ? "Yes" : "No";
      } else if (prev instanceof TokenValue) {
        return formatter.number(prev);
      } else if (prev && typeof prev === "object" && "type" in prev) {
        const strategy = prev as ExtendedTractorTokenStrategy;
        switch (true) {
          case strategy.type === "SPECIFIC_TOKEN":
            return (
              (strategy as { type: "SPECIFIC_TOKEN"; token?: { symbol: string } }).token?.symbol ?? "Unknown Token"
            );
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
};

type RenderDiffProps<T> = Omit<ValueDiff<T>, "label">;

const RenderDiffTokenValue = ({ prev, curr }: RenderDiffProps<TokenValue>) => {
  return (
    <Row className="gap-2">
      <div className="text-pinto-light">{formatter.number(prev)}</div>
      <ArrowRightIcon className="w-3 h-3" />
      <div className="text-pinto-primary">{formatter.number(curr)}</div>
    </Row>
  );
};

const RenderStringDiff = ({ prev, curr }: RenderDiffProps<string>) => {
  return (
    <Row className="gap-2">
      <div className="text-pinto-light">{prev}</div>
      <ArrowRightIcon className="w-3 h-3" />
      <div className="text-pinto-primary">{curr}</div>
    </Row>
  );
};

const RenderTokenStrategyDiff = ({ prev, curr }: RenderDiffProps<ExtendedTractorTokenStrategy>) => {
  const getName = (strategy: ExtendedTractorTokenStrategy) => {
    switch (true) {
      case strategy.type === "SPECIFIC_TOKEN":
        return (strategy as { type: "SPECIFIC_TOKEN"; token?: { symbol: string } }).token?.symbol ?? "Unknown Token";
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
};

const getMapping = (
  requisition: RequisitionEvent<SowBlueprintData>,
  orderData: OrderData,
  getStrategyProps: ReturnType<typeof useGetTractorTokenStrategyWithBlueprint>,
) => {
  const existing = requisition.decodedData;
  if (!existing) return undefined;

  return {
    totalAmount: {
      label: "Total Amount",
      prev: postSanitizedSanitizedValue(existing.sowAmounts.totalAmountToSowAsString, 6).tv,
      curr: postSanitizedSanitizedValue(orderData.totalAmount, 6).tv,
    },
    minSoil: {
      label: "Min Per Season",
      prev: postSanitizedSanitizedValue(existing.sowAmounts.minAmountToSowPerSeasonAsString, 6).tv,
      curr: postSanitizedSanitizedValue(orderData.minSoil, 6).tv,
    },
    maxPerSeason: {
      label: "Max Per Season",
      prev: postSanitizedSanitizedValue(existing.sowAmounts.maxAmountToSowPerSeasonAsString, 6).tv,
      curr: postSanitizedSanitizedValue(orderData.maxPerSeason, 6).tv,
    },
    temperature: {
      label: "Min Temperature",
      prev: postSanitizedSanitizedValue(existing.minTempAsString, 6).tv,
      curr: postSanitizedSanitizedValue(orderData.temperature, 6).tv,
    },
    podLineLength: {
      label: "Max PodLine Length",
      prev: postSanitizedSanitizedValue(existing.maxPodlineLengthAsString, 6).tv,
      curr: postSanitizedSanitizedValue(orderData.podLineLength, 6).tv,
    },
    morningAuction: {
      label: "Morning Auction",
      prev: existing.runBlocksAfterSunrise === 0n,
      curr: orderData.morningAuction,
    },
    strategy: {
      label: "Funding Source",
      prev: getStrategyProps.getTokenStrategy(existing),
      curr: {
        type: orderData.tokenStrategy,
        ...(orderData.tokenStrategy === "SPECIFIC_TOKEN"
          ? {
              address: orderData.token?.address,
              token: orderData.token,
            }
          : {}),
      } as TractorTokenStrategy,
    },
    operatorTip: {
      label: "Operator Tip",
      prev: postSanitizedSanitizedValue(existing.operatorParams.operatorTipAmountAsString, 6).tv,
      curr: postSanitizedSanitizedValue(orderData.operatorTip, 6).tv,
    },
  };
};

type ValueDiff<T = unknown> = {
  label: string;
  prev: T;
  curr: T;
};

const getDiffs = (mapping: ReturnType<typeof getMapping>) => {
  const modifications: Record<string, ValueDiff> = {};
  const constants: Record<string, ValueDiff> = {};

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
          prev: prev ? "Yes" : "No",
          curr: curr ? "Yes" : "No",
        };
      }
    } else if (typeof prev === "object" && "type" in prev) {
      const current = curr as ExtendedTractorTokenStrategy;
      if (
        prev.type !== current.type ||
        (prev.type === "SPECIFIC_TOKEN" && current.type === "SPECIFIC_TOKEN" && !tokensEqual(prev.token, current.token))
      ) {
        hasChanged = true;
        valueDiff = {
          label,
          prev: prev,
          curr: current,
        };
      }
    }

    if (hasChanged && valueDiff) {
      modifications[key] = valueDiff;
    } else {
      // Add to constants section to show unchanged values
      constants[key] = {
        label,
        prev: prev,
        curr: curr,
      };
    }
  }

  return {
    modifications: Object.entries(modifications),
    constants: Object.entries(constants),
  };
};
