import SmartSubmitButton from "@/components/SmartSubmitButton";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useSignTractorBlueprint from "@/hooks/tractor/useSignTractorBlueprint";
import useTransaction from "@/hooks/useTransaction";
import { Blueprint, PublisherTractorExecution, Requisition, useGetBlueprintHash } from "@/lib/Tractor";
import { cn } from "@/utils/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { Col, Row } from "./Container";
import { HighlightedCallData } from "./Tractor/HighlightedCallData";
import { getOrderTypeConfig } from "./Tractor/farmer-orders/TractorFarmerOrderTypeRegistry";
import { ExecutionData, TractorOrderData } from "./Tractor/types";
import ConvertUpOrderVisualization from "./Tractor/visualizations/ConvertUpOrderVisualization";
import SowOrderVisualization from "./Tractor/visualizations/SowOrderVisualization";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "./ui/Dialog";

// Export ExecutionData from types for backward compatibility
export type { ExecutionData } from "./Tractor/types";

interface ReviewTractorOrderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onOrderPublished?: () => void;
  orderData: TractorOrderData;
  encodedData: `0x${string}`;
  operatorPasteInstrs: `0x${string}`[];
  blueprint: Blueprint;
  isViewOnly?: boolean;
  executionHistory?: ExecutionData[];
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
  const { address } = useAccount();
  const { data: blueprintHash } = useGetBlueprintHash(blueprint);
  const [activeTab, setActiveTab] = useState<Tab>("order");
  const [decodeAbi, setDecodeAbi] = useState(false);
  const protocolAddress = useProtocolAddress();
  const navigate = useNavigate();

  // Get order type configuration from registry

  const orderConfig = getOrderTypeConfig(orderData.type);
  const OrderVisualization = orderConfig.visualization;
  const ExecutionHistory = orderConfig.executionHistory;

  const { signBlueprint, signedRequisition, isSigning: signing } = useSignTractorBlueprint();

  const { writeWithEstimateGas, submitting, isConfirming, setSubmitting } = useTransaction({
    successMessage: "Order published successfully",
    errorMessage: "Failed to publish order",
    successCallback: () => {
      // Close the dialog after successful submission
      onOpenChange(false);
    },
  });

  const handleSignBlueprint = async () => {
    if (!address) return;

    if (!blueprintHash) {
      toast.error("Blueprint hash not ready yet, please try again in a moment");
      return;
    }

    await signBlueprint(blueprint, blueprintHash);
  };

  const handlePublishRequisition = async () => {
    if (!signedRequisition?.signature) {
      toast.error("Please sign the blueprint first");
      return;
    }

    const signedReq = signedRequisition as Required<Requisition>;

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

  // Create a style element for our custom button text size
  useEffect(() => {
    // Add a style tag to the document head
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .smaller-button-text {
        font-size: 1.125rem !important;
      }
      .smaller-button-text button {
        font-size: 1.125rem !important;
      }
    `;
    document.head.appendChild(styleEl);

    // Cleanup function to remove the style tag when component unmounts
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

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
          <div className="flex flex-col">
            {/* Tabs */}
            <DialogTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isViewOnly={isViewOnly}
              executions={executionHistory.length || 0}
            />

            {/* Content */}
            {activeTab === "order" ? (
              /* Order Visualization */
              <>
                {orderData.type === "sow" && <SowOrderVisualization orderData={orderData} />}
                {orderData.type === "convertUp" && <ConvertUpOrderVisualization orderData={orderData} />}
                {/* <OrderVisualization orderData={orderData} /> */}
              </>
            ) : activeTab === "blueprint" ? (
              /* Blueprint View */
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-6">
                  {/* Decoded Blueprint Call */}
                  <div>
                    <h3 className="pinto-sm font-medium mb-2">Blueprint Call</h3>
                    <div className="bg-white p-4 rounded border border-gray-200 font-mono text-sm overflow-x-auto">
                      <HighlightedCallData
                        blueprintData={encodedData}
                        targetData={encodedData}
                        blueprintType={
                          orderData.type === "sow" ? "sow" : orderData.type === "convertUp" ? "convertUp" : "auto"
                        }
                        decodeAbi={true}
                      />
                    </div>
                  </div>

                  {/* Encoded Farm Data */}
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

                  {/* Requisition Data */}
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
            ) : (
              /* Execution History View */
              <ExecutionHistory executionHistory={executionHistory} orderData={orderData} />
            )}

            {/* Footer */}
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
                <div className="flex flex-row gap-2 shrink-0 smaller-button-text">
                  {signedRequisition ? (
                    <div className="flex items-center gap-2 text-pinto-green-4 font-medium px-6">
                      <CheckIcon width={24} height={24} />
                      <span>Signed</span>
                    </div>
                  ) : (
                    <SmartSubmitButton
                      variant="gradient"
                      disabled={signing}
                      submitFunction={handleSignBlueprint}
                      submitButtonText={signing ? "Signing..." : "Sign Order"}
                      className="w-min"
                    />
                  )}
                  <SmartSubmitButton
                    variant="gradient"
                    disabled={submitting || isConfirming || !signedRequisition}
                    submitFunction={handlePublishRequisition}
                    submitButtonText={submitting || isConfirming ? "Publishing..." : "Publish Order"}
                    className={cn("w-min", !signedRequisition && "opacity-15")}
                  />
                </div>
              </Row>
            ) : null}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

const DialogTabs = ({
  activeTab,
  isViewOnly,
  executions,
  setActiveTab,
}: {
  activeTab: Tab;
  isViewOnly: boolean;
  executions: number;
  setActiveTab: (tab: Tab) => void;
}) => {
  return (
    <div className="flex gap-4 border-b px-6 pinto-sm">
      <button
        type="button"
        className={`pb-2 ${activeTab === "order" ? "border-b-2 border-pinto-green-4 font-medium" : "border-b-2 border-transparent text-pinto-gray-4"}`}
        onClick={() => setActiveTab("order")}
      >
        View Order
      </button>
      <button
        type="button"
        className={`pb-2 ${
          activeTab === "blueprint"
            ? "border-b-2 border-pinto-green-4 font-medium"
            : "border-b-2 border-transparent text-pinto-gray-4"
        }`}
        onClick={() => setActiveTab("blueprint")}
      >
        View Blueprint and Requisition
      </button>
      {isViewOnly && executions ? (
        <button
          type="button"
          className={`pb-2 ${
            activeTab === "executions"
              ? "border-b-2 border-pinto-green-4 font-medium"
              : "border-b-2 border-transparent text-pinto-gray-4"
          }`}
          onClick={() => setActiveTab("executions")}
        >
          Execution History ({executions})
        </button>
      ) : null}
    </div>
  );
};
