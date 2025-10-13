import SmartSubmitButton from "@/components/SmartSubmitButton";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useSignTractorBlueprint from "@/hooks/tractor/useSignTractorBlueprint";
import useTransaction from "@/hooks/useTransaction";
import { Blueprint, PublisherTractorExecution, Requisition, useGetBlueprintHash } from "@/lib/Tractor";
import { cn } from "@/utils/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { Col, Row } from "./Container";
import LoadingSpinner from "./LoadingSpinner";
import { HighlightedCallData } from "./Tractor/HighlightedCallData";
import { getOrderTypeConfig } from "./Tractor/farmer-orders/TractorFarmerOrderTypeRegistry";
import { ExecutionData, TractorOrderData } from "./Tractor/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "./ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

interface ReviewTractorOrderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onOrderPublished?: () => void;
  orderData: TractorOrderData;
  encodedData: `0x${string}`;
  operatorPasteInstrs: `0x${string}`[] | readonly `0x${string}`[];
  blueprint: Blueprint;
  isViewOnly?: boolean;
  executionHistory?: PublisherTractorExecution[];
  includesDepositOptimization?: boolean;
  depositOptimizationCalls?: `0x${string}`[];
}

type Tab = "order" | "blueprint" | "executions";

export default function ReviewTractorOrderDialog({
  open,
  onOpenChange,
  onSuccess,
  onOrderPublished,
  orderData,
  encodedData,
  operatorPasteInstrs,
  blueprint,
  isViewOnly = false,
  executionHistory = [], // Default to empty array
  includesDepositOptimization = false,
  depositOptimizationCalls,
}: ReviewTractorOrderProps) {
  // ---------- STATE / CONTEXT ----------
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("order");
  const [decodeAbi, setDecodeAbi] = useState(false);
  const protocolAddress = useProtocolAddress();
  const navigate = useNavigate();

  // Get order type configuration from registry
  // Memoize the order config to avoid re-rendering the component on every render
  const orderConfig = useMemo(() => getOrderTypeConfig(orderData.type), [orderData.type]);
  // b/c orderConfig is memoized, ExecutionHistory and Visualization also have stable references.
  const ExecutionHistory = orderConfig.executionHistory;
  const Visualization = orderConfig.visualization;

  // ---------- HOOKS ----------
  const { data: blueprintHash, isLoading: isBlueprintHashLoading } = useGetBlueprintHash(blueprint);

  const { signBlueprint, signedRequisition, isSigning: signing } = useSignTractorBlueprint();

  const { writeWithEstimateGas, submitting, isConfirming, setSubmitting } = useTransaction({
    successMessage: "Order published successfully",
    errorMessage: "Failed to publish order",
    successCallback: () => {
      // Close the dialog after successful submission
      onOpenChange(false);
    },
  });

  // ---------- CALLBACKS ----------
  // Handles Signing the blueprint
  const handleSignBlueprint = async () => {
    if (!address) return;

    if (!blueprintHash) {
      toast.error("Blueprint hash not ready yet, please try again in a moment");
      return;
    }

    await signBlueprint(blueprint, blueprintHash);
  };

  // Handles Publishing the requisition
  const handlePublishRequisition = async () => {
    let signedReq: Required<Requisition>;
    if (signedRequisition && signedRequisition.signature) {
      signedReq = {
        ...signedRequisition,
        signature: signedRequisition.signature,
      };
    } else {
      toast.error("Please sign the blueprint first");
      return;
    }

    try {
      setSubmitting(true);
      // Check if we need to include deposit optimization calls
      if (depositOptimizationCalls && depositOptimizationCalls.length > 0) {
        console.debug(`Publishing requisition with ${depositOptimizationCalls.length} deposit optimization calls`);

        // Create publish requisition call
        const publishRequisitionCall = encodeFunctionData({
          abi: diamondABI,
          functionName: "publishRequisition",
          // Type cast is okay here since we check signature above
          args: [signedReq],
        });

        // Combine optimization calls with publish requisition call
        const farmCalls = [...depositOptimizationCalls, publishRequisitionCall];

        // Execute as farm call
        await writeWithEstimateGas({
          address: protocolAddress,
          abi: diamondABI,
          functionName: "farm",
          args: [farmCalls],
        });
      } else {
        console.debug("Publishing requisition without deposit optimization");

        // Call publish requisition directly (like before)
        await writeWithEstimateGas({
          address: protocolAddress,
          abi: diamondABI,
          functionName: "publishRequisition",
          args: [signedRequisition],
        });
      }

      // Success handling
      toast.success("Order published successfully");

      // Close the dialog
      onOpenChange(false);

      // Navigate to the Field page with tractor tab active
      if (orderData.type === "sow") {
        navigate("/field?tab=tractor");
      }

      // Call the parent success callback to refresh data
      if (onSuccess) {
        onSuccess();
      }

      // Call the onOrderPublished callback if provided
      if (onOrderPublished) {
        onOrderPublished();
      }
    } catch (error) {
      console.error("Error publishing requisition:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 backdrop-blur-[2px] bg-white/50" />
        <DialogContent className="max-w-[98rem] w-[95vw] sm:max-w-[1400px] p-0 sm:p-0">
          <DialogHeader>
            <DialogTitle className="font-normal text-[1.25rem] tracking-normal px-6 pt-6">
              {isViewOnly ? `View ${orderConfig.title.replace("Review and Publish ", "")}` : orderConfig.title}
            </DialogTitle>
            <DialogDescription className="px-6 pinto-sm-light text-pinto-light">
              {orderConfig.description(isViewOnly)}
            </DialogDescription>
          </DialogHeader>
          <Col>
            {/**
             * Tabs
             */}
            <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void}>
              <TabsList variant="textSecondary" className="px-6" borderBottom>
                <TabsTrigger value="order">View Order</TabsTrigger>
                <TabsTrigger value="blueprint">View Blueprint and Requisition</TabsTrigger>
                {isViewOnly && executionHistory?.length ? (
                  <TabsTrigger value="executions">Execution History ({executionHistory.length})</TabsTrigger>
                ) : null}
              </TabsList>
              <TabsContent value="order" className="mt-0">
                <Visualization orderData={orderData} className="rounded-b-xl" />
              </TabsContent>
              <TabsContent value="blueprint" className="mt-0">
                <div className="bg-gray-50 p-6 rounded-b-xl">
                  <div className="space-y-6">
                    {/**
                     * Decoded Blueprint Call
                     */}
                    <div>
                      <h3 className="pinto-sm font-medium mb-2">Blueprint Call</h3>
                      <div className="bg-white p-4 rounded border border-gray-200 font-mono text-sm overflow-x-auto">
                        <HighlightedCallData
                          blueprintData={encodedData}
                          targetData={encodedData}
                          blueprintType={orderData.type}
                          decodeAbi={true}
                        />
                      </div>
                    </div>
                    {/**
                     * Encoded Farm Data
                     */}
                    <div>
                      <h3 className="pinto-sm font-medium mb-2">Encoded Farm Data</h3>
                      <div className="bg-white p-4 rounded border border-gray-200 font-mono text-sm overflow-x-auto">
                        <HighlightedCallData
                          blueprintData={encodedData}
                          targetData={encodedData}
                          decodeAbi={decodeAbi}
                          encodedData={encodedData}
                        />
                      </div>
                    </div>
                    {/**
                     * Requisition Data
                     */}
                    <div>
                      <h3 className="pinto-sm font-medium mb-2">Requisition Data</h3>
                      <div className="bg-white p-4 rounded border border-gray-200 font-mono text-sm overflow-x-auto">
                        <HighlightedCallData
                          blueprintData={encodedData}
                          targetData={JSON.stringify(blueprint, null, 2)}
                          decodeAbi={decodeAbi}
                          isRequisitionData={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="executions" className="mt-0">
                <ExecutionHistory executionHistory={executionHistory} orderData={orderData} />
              </TabsContent>
            </Tabs>
            {/**
             * Footer
             */}
            {!isViewOnly ? (
              <Row className="justify-between items-center border-t p-6">
                <div className="flex flex-col gap-2">
                  <p className="pinto-sm-light text-pinto-light">
                    Your Order will remain active until completion or until Order cancellation
                  </p>
                  {includesDepositOptimization && (
                    <p className="text-xs text-gray-500">Your Deposits will be optimized to be usable with Tractor</p>
                  )}
                </div>
                <div className="flex flex-row gap-2 shrink-0">
                  {/**
                   * Render Loading Spinner if blueprint hash is loading
                   */}
                  {isBlueprintHashLoading ? (
                    <Col className="justify-center place-self-center">
                      <LoadingSpinner size={36} />
                    </Col>
                  ) : null}
                  {/**
                   * Signing Requisition
                   */}
                  {signedRequisition ? (
                    <div className="flex items-center gap-1 text-pinto-green-4 pinto-body font-medium px-6">
                      <CheckIcon width={24} height={24} />
                      <span>Signed</span>
                    </div>
                  ) : (
                    <SmartSubmitButton
                      disabled={signing || isBlueprintHashLoading}
                      submitFunction={handleSignBlueprint}
                      submitButtonText={signing ? "Signing..." : "Sign Order"}
                      className="w-min !text-body"
                    />
                  )}
                  {/**
                   * Publishing Requisition
                   */}
                  <SmartSubmitButton
                    disabled={submitting || isConfirming || !signedRequisition || signing || isBlueprintHashLoading}
                    submitFunction={handlePublishRequisition}
                    submitButtonText={submitting || isConfirming ? "Publishing..." : "Publish Order"}
                    className={cn("w-min !text-body", !signedRequisition && "opacity-15")}
                  />
                </div>
              </Row>
            ) : null}
          </Col>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

const styles = {
  smallerButtonText: {
    fontSize: "1.125rem !important",
  },
  smallerButtonTextButton: {
    fontSize: "1.125rem !important",
  },
};
