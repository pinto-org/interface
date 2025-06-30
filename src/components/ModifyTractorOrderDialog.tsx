import { mockAddressAtom } from "@/Web3Provider";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { WarningIcon } from "@/components/Icons";
import ReviewTractorOrderDialog from "@/components/ReviewTractorOrderDialog";
import TractorOrderFormFields from "@/components/Tractor/TractorOrderFormFields";
import TokenSelectionDialog from "@/components/Tractor/TokenSelectionDialog";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useTractorOrderForm } from "@/hooks/useTractorOrderForm";
import { useTractorOrderCalculations } from "@/hooks/useTractorOrderCalculations";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { createBlueprint, createRequisition, useGetBlueprintHash, useSignRequisition } from "@/lib/Tractor/blueprint";
import { Blueprint } from "@/lib/Tractor/types";
import { createSowTractorData, getSowOrderTokenStrategy, RequisitionEvent } from "@/lib/Tractor/utils";
import useTractorOperatorAverageTipPaid from "@/state/tractor/useTractorOperatorAverageTipPaid";
import { usePodLine, useTemperature } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { isValidAddress } from "@/utils/string";
import { isLocalhost } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Col, Row } from "./Container";
import TooltipSimple from "./TooltipSimple";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "./ui/Dialog";

interface ModifyTractorOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderModified?: () => void;
  existingOrder: RequisitionEvent;
}


export default function ModifyTractorOrderDialog({
  open,
  onOpenChange,
  onOrderModified,
  existingOrder,
}: ModifyTractorOrderDialogProps) {
  const podLine = usePodLine();
  const currentTemperature = useTemperature();
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const { data: averageTipValue = 1 } = useTractorOperatorAverageTipPaid();

  // Use shared form hook
  const { formState, handlers, validation, temperatureInputRef, prefillForm } = useTractorOrderForm({
    averageTipValue,
  });

  // Use shared calculations hook
  const { calculations } = useTractorOrderCalculations({
    formState,
    podLine,
  });

  // Pre-fill form with existing order data
  useEffect(() => {
    if (open && existingOrder.decodedData) {
      const data = existingOrder.decodedData;
      
      // Set token strategy
      const strategy = getSowOrderTokenStrategy(data.sourceTokenIndices);
      let tokenStrategy = { type: "LOWEST_SEEDS" } as any;
      if (strategy === "LOWEST_SEEDS") {
        tokenStrategy = { type: "LOWEST_SEEDS" };
      } else if (strategy === "LOWEST_PRICE") {
        tokenStrategy = { type: "LOWEST_PRICE" };
      } else if (strategy === "SPECIFIC_TOKEN" && data.sourceTokenIndices.length > 0) {
        // For now, default to LOWEST_SEEDS since we need additional logic for mapping
        tokenStrategy = { type: "LOWEST_SEEDS" };
      }

      prefillForm({
        totalAmount: data.sowAmounts.totalAmountToSowAsString,
        minSoil: data.sowAmounts.minAmountToSowPerSeasonAsString,
        maxPerSeason: data.sowAmounts.maxAmountToSowPerSeasonAsString,
        temperature: data.minTempAsString,
        podLineLength: data.maxPodlineLengthAsString,
        operatorTip: data.operatorParams.operatorTipAmountAsString,
        morningAuction: data.runBlocksAfterSunrise === 0n,
        selectedTokenStrategy: tokenStrategy,
      });
    }
  }, [open, existingOrder, prefillForm]);





  // State for dialog management
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [encodedData, setEncodedData] = useState<`0x${string}` | null>(null);
  const [operatorPasteInstructions, setOperatorPasteInstructions] = useState<`0x${string}`[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const publicClient = usePublicClient();
  const queryClient = useQueryClient();
  const { data: walletClient } = useWalletClient();
  const [mockAddress] = useAtom(mockAddressAtom);
  const isLocal = isLocalhost();






  // Transaction handling for the cancel + create flow
  const { writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Order modified successfully",
    errorMessage: "Failed to modify order",
    successCallback: () => {
      queryClient.invalidateQueries();
      onOpenChange(false);
      if (onOrderModified) {
        onOrderModified();
      }
    },
  });

  // Handle creating the modified order
  const handleNext = async () => {
    try {
      console.time("handleNext total");
      setIsLoading(true);

      if (!publicClient) {
        toast.error("No public client available");
        setIsLoading(false);
        return;
      }

      const { data, operatorPasteInstrs, rawCall } = await createSowTractorData({
        totalAmountToSow: formState.totalAmount || "0",
        temperature: formState.temperature || "0",
        minAmountPerSeason: formState.minSoil || "0",
        maxAmountToSowPerSeason: formState.maxPerSeason || "0",
        maxPodlineLength: formState.podLineLength || formatter.number(podLine).replace(/,/g, ""),
        maxGrownStalkPerBdv: "10000000000000000",
        runBlocksAfterSunrise: formState.morningAuction ? "0" : "300",
        operatorTip: formState.operatorTip || "0",
        whitelistedOperators: [],
        tokenStrategy: formState.selectedTokenStrategy,
        publicClient,
      });

      if (!address) {
        toast.error("Please connect your wallet");
        setIsLoading(false);
        return;
      }

      const UINT256_MAX = BigInt(2) ** BigInt(256) - BigInt(1);
      const newBlueprint = createBlueprint({
        publisher: address,
        data,
        operatorPasteInstrs,
        maxNonce: UINT256_MAX,
      });

      setBlueprint(newBlueprint);
      setEncodedData(rawCall);
      setOperatorPasteInstructions(operatorPasteInstrs);
      setShowReview(true);
      setIsLoading(false);
      console.timeEnd("handleNext total");
    } catch (e) {
      console.error("Error creating sow tractor data:", e);
      toast.error("Failed to create order");
      setIsLoading(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    onOpenChange(false);
  };





  if (!open) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 backdrop-blur-[2px] bg-white/50" />
          <DialogContent className="max-w-[98rem] w-[95vw] sm:max-w-[600px] p-6">
            <Col className="gap-6">
              <DialogHeader>
                <DialogTitle className="font-normal text-[1.25rem] tracking-normal">Modify Tractor Order</DialogTitle>
                <DialogDescription className="pinto-sm-light text-pinto-light">
                  <p>
                    Update your existing Tractor Order. The current order will be cancelled and a new one will be
                    created with your updated conditions.
                  </p>
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-6">
                {/* Main Form */}
                <div className="flex flex-col gap-2">
                  <div className="pinto-body font-medium text-pinto-secondary mb-4">
                    🚜 Update Conditions for automated Sowing
                  </div>
                  <div className="h-[1px] w-full bg-pinto-gray-2" />
                </div>

                <TractorOrderFormFields
                  formState={formState}
                  handlers={handlers}
                  validation={validation}
                  calculations={calculations}
                  currentTemperature={currentTemperature.scaled || currentTemperature}
                  podLine={podLine}
                  temperatureInputRef={temperatureInputRef}
                />

                {/* Operator Tip Section */}
                <Col className="gap-6">
                  <div className="pinto-sm-light text-pinto-light gap-2 mb-4">I'm willing to pay someone</div>
                  <div className="flex rounded-lg border border-pinto-gray-2 gap-2 mb-2">
                    <input
                      className="h-12 px-3 py-1.5 flex-1 rounded-l-lg focus:outline-none text-base font-light"
                      placeholder="0.00"
                      value={formState.operatorTip}
                      onChange={handlers.handleOperatorTipChange}
                      type="text"
                    />
                    <div className="flex items-center gap-2 px-4 rounded-r-lg font-semibold bg-white">
                      <img src={pintoIcon} alt="PINTO" className="w-6 h-6" />
                      <span className="text-base font-normal">PINTO</span>
                    </div>
                  </div>

                  <div className="flex justify-between gap-2 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap flex-1 ${
                        formState.activeTipButton === "low"
                          ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C]"
                          : "bg-white border-pinto-gray-2 text-pinto-gray-4"
                      }`}
                      onClick={() => handlers.handleTipButtonClick("low")}
                    >
                      Low
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap flex-1 ${
                        formState.activeTipButton === "average"
                          ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C]"
                          : "bg-white border-pinto-gray-2 text-pinto-gray-4"
                      }`}
                      onClick={() => handlers.handleTipButtonClick("average")}
                    >
                      Average
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-full px-4 py-2 flex items-center justify-center transition-colors h-[2rem] sm:h-[2.25rem] pinto-sm whitespace-nowrap flex-1 ${
                        formState.activeTipButton === "high"
                          ? "bg-[#D8F1E2] border border-[#387F5C] text-[#387F5C]"
                          : "bg-white border-pinto-gray-2 text-pinto-gray-4"
                      }`}
                      onClick={() => handlers.handleTipButtonClick("high")}
                    >
                      High
                    </Button>
                  </div>

                  <div className="text-[#9C9C9C] text-base font-light mb-4">
                    each time they Sow part of my Tractor Order.
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <div className="text-[#9C9C9C] text-base font-light">Estimated total number of executions</div>
                      <div className="text-black text-base font-light">{calculations.calculateEstimatedExecutions()}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-[#9C9C9C] text-base font-light">Estimated total tip</div>
                      <div className="flex items-center text-black text-base font-light">
                        {calculations.calculateEstimatedTotalTip()}
                        <img src={pintoIcon} alt="PINTO" className="w-5 h-5 mx-1" />
                        PINTO
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Error message box */}
                {formState.error && (
                  <div className="w-full p-3 bg-red-50 rounded-lg mb-1 flex items-center gap-3">
                    <WarningIcon color="#DC2626" width={24} height={24} />
                    <span className="text-red-600 font-medium">
                      {formState.error === "Min per Season must be less than or equal to Max per Season"
                        ? "Minimum per Season must be less than Maximum per Season"
                        : formState.error}
                    </span>
                  </div>
                )}

                <Row className="gap-6">
                  <Button
                    variant="outline"
                    size="xlargest"
                    rounded="full"
                    className="flex-1 text-[#404040] bg-[#F8F8F8]"
                    onClick={handleBack}
                  >
                    ← Cancel
                  </Button>
                  <TooltipSimple
                    content={
                      !validation.areRequiredFieldsFilled() || !!formState.error ? (
                        <div className="p-1">
                          <div className="font-medium mb-1">Please fill in the following fields:</div>
                          <ul className="list-disc pl-4 text-sm">
                            {validation.getMissingFields().map((field) => (
                              <li key={field}>{field}</li>
                            ))}
                            {formState.error && <li className="text-red-500 mt-1">{formState.error}</li>}
                          </ul>
                        </div>
                      ) : null
                    }
                    side="top"
                    align="center"
                    disabled={!(!validation.areRequiredFieldsFilled() || !!formState.error)}
                  >
                    <div className="flex-1">
                      <Button
                        size="xlargest"
                        rounded="full"
                        className={`w-full ${
                          !validation.areRequiredFieldsFilled() || !!formState.error || isLoading
                            ? "bg-pinto-gray-2 text-[#9C9C9C]"
                            : "bg-[#387F5C] text-white"
                        }`}
                        disabled={!validation.areRequiredFieldsFilled() || !!formState.error || isLoading}
                        onClick={handleNext}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                          </div>
                        ) : (
                          "Review & Modify"
                        )}
                      </Button>
                    </div>
                  </TooltipSimple>
                </Row>
              </div>
            </Col>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Token Selection Dialog */}
      <TokenSelectionDialog
        open={formState.showTokenSelectionDialog}
        onOpenChange={handlers.setShowTokenSelectionDialog}
        selectedTokenStrategy={formState.selectedTokenStrategy}
        onTokenStrategyChange={handlers.setSelectedTokenStrategy}
      />

      {showReview && encodedData && operatorPasteInstructions && blueprint && (
        <ModifyTractorOrderReviewDialog
          open={showReview}
          onOpenChange={setShowReview}
          onSuccess={() => {
            onOpenChange(false);
            if (onOrderModified) {
              onOrderModified();
            }
          }}
          existingOrder={existingOrder}
          orderData={{
            totalAmount: formState.totalAmount,
            temperature: formState.temperature,
            podLineLength: formState.podLineLength,
            minSoil: formState.minSoil,
            maxPerSeason: formState.maxPerSeason,
            operatorTip: formState.operatorTip,
            tokenStrategy: formState.selectedTokenStrategy.type,
            morningAuction: formState.morningAuction,
          }}
          encodedData={encodedData}
          operatorPasteInstrs={operatorPasteInstructions}
          blueprint={blueprint}
        />
      )}
    </>
  );
}

// Create a specialized review dialog for modify operations
interface ModifyTractorOrderReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  existingOrder: RequisitionEvent;
  orderData: {
    totalAmount: string;
    temperature: string;
    podLineLength: string;
    minSoil: string;
    maxPerSeason: string;
    operatorTip: string;
    tokenStrategy?: "LOWEST_SEEDS" | "LOWEST_PRICE" | "SPECIFIC_TOKEN";
    tokenSymbol?: string;
    morningAuction?: boolean;
  };
  encodedData: `0x${string}`;
  operatorPasteInstrs: `0x${string}`[];
  blueprint: Blueprint;
}

function ModifyTractorOrderReviewDialog({
  open,
  onOpenChange,
  onSuccess,
  existingOrder,
  orderData,
  encodedData,
  operatorPasteInstrs,
  blueprint,
}: ModifyTractorOrderReviewDialogProps) {
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const queryClient = useQueryClient();
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [signedRequisitionData, setSignedRequisitionData] = useState<any>(null);

  // Use the imported Tractor utilities
  const { data: blueprintHash } = useGetBlueprintHash(blueprint);
  const signRequisition = useSignRequisition();

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

  const handleSignBlueprint = async () => {
    if (!address) return;

    if (!blueprintHash) {
      toast.error("Blueprint hash not ready yet, please try again in a moment");
      return;
    }

    try {
      setIsLoading(true);
      // Create and sign the requisition using the hash
      const requisition = createRequisition(blueprint, blueprintHash);
      const signedRequisition = await signRequisition(requisition);

      // Store the signed requisition data
      setSignedRequisitionData(signedRequisition);
      toast.success("Blueprint signed successfully");
    } catch (error) {
      console.error("Error signing blueprint:", error);
      toast.error("Failed to sign blueprint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifyOrder = async () => {
    if (!address || !protocolAddress) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!signedRequisitionData?.signature) {
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
          args: [signedRequisitionData],
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
        <DialogContent className="max-w-[98rem] w-[95vw] sm:max-w-[600px] p-0 sm:p-0">
          <Col className="gap-3 pb-3">
            <DialogHeader>
              <DialogTitle className="font-normal text-[1.25rem] tracking-normal px-6 pt-6">
                Review Order Modification
              </DialogTitle>
              <DialogDescription className="px-6 pinto-sm-light text-pinto-light">
                <p>
                  Your existing Tractor Order will be cancelled and replaced with this new order. This happens in a
                  single transaction to ensure atomicity.
                </p>
              </DialogDescription>
            </DialogHeader>

            <div className="px-6">
              {/* Show a comparison of old vs new */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Order Changes</h3>
                <div className="space-y-2 text-sm">
                  {/* Show differences between old and new order */}
                  <div className="space-y-2 text-sm">
                    <div>
                      Total Amount: {existingOrder.decodedData?.sowAmounts.totalAmountToSowAsString} {(existingOrder.decodedData?.sowAmounts.totalAmountToSowAsString?.replace(/,/g, "") || "") !== (orderData.totalAmount?.replace(/,/g, "") || "") && "→"} {(existingOrder.decodedData?.sowAmounts.totalAmountToSowAsString?.replace(/,/g, "") || "") !== (orderData.totalAmount?.replace(/,/g, "") || "") && `${orderData.totalAmount} Pinto`}
                    </div>
                    <div>
                      Pod Line Length: {existingOrder.decodedData?.maxPodlineLengthAsString} {(existingOrder.decodedData?.maxPodlineLengthAsString?.replace(/,/g, "") || "") !== (orderData.podLineLength?.replace(/,/g, "") || "") && "→"} {(existingOrder.decodedData?.maxPodlineLengthAsString?.replace(/,/g, "") || "") !== (orderData.podLineLength?.replace(/,/g, "") || "") && `${orderData.podLineLength} Pods`}
                    </div>
                    <div>
                      Temperature: {existingOrder.decodedData?.minTempAsString}% {(existingOrder.decodedData?.minTempAsString?.replace(/,/g, "") || "") !== (orderData.temperature?.replace(/,/g, "") || "") && "→"} {(existingOrder.decodedData?.minTempAsString?.replace(/,/g, "") || "") !== (orderData.temperature?.replace(/,/g, "") || "") && `${orderData.temperature}%`}
                    </div>
                    <div>
                      Operator Tip: {existingOrder.decodedData?.operatorParams.operatorTipAmountAsString} {(existingOrder.decodedData?.operatorParams.operatorTipAmountAsString?.replace(/,/g, "") || "") !== (orderData.operatorTip?.replace(/,/g, "") || "") && "→"} {(existingOrder.decodedData?.operatorParams.operatorTipAmountAsString?.replace(/,/g, "") || "") !== (orderData.operatorTip?.replace(/,/g, "") || "") && `${orderData.operatorTip} Pinto`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <Row className="justify-between items-center">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 mr-2">
                  Cancel
                </Button>

                {!signedRequisitionData ? (
                  <Button variant="gradient" onClick={handleSignBlueprint} disabled={isLoading} className="flex-1 ml-2">
                    {isLoading ? "Signing..." : "Sign New Order"}
                  </Button>
                ) : (
                  <Button variant="gradient" onClick={handleModifyOrder} disabled={submitting} className="flex-1 ml-2">
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

