import baseLogo from "@/assets/misc/base-logo-alt.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import SmartSubmitButton from "@/components/SmartSubmitButton";
import IconImage from "@/components/ui/IconImage";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { createRequisition, useSignRequisition } from "@/lib/Tractor";
import { useGetBlueprintHash } from "@/lib/Tractor/blueprint";
import { Blueprint } from "@/lib/Tractor/types";
import { formatter } from "@/utils/format";
import { CheckIcon, CornerBottomLeftIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { Col, Row } from "./Container";
import { HighlightedCallData } from "./Tractor/HighlightedCallData";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "./ui/Dialog";
import { Switch } from "./ui/Switch";

// Define the execution data type
export interface ExecutionData {
  blockNumber: number;
  operator: `0x${string}`;
  publisher: `0x${string}`;
  blueprintHash: `0x${string}`;
  transactionHash: `0x${string}`;
  timestamp?: number;
  sowEvent?: {
    account: `0x${string}`;
    fieldId: bigint;
    index: bigint;
    beans: bigint;
    pods: bigint;
  };
}

interface ReviewTractorOrderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onOrderPublished?: () => void;
  orderData: {
    totalAmount: string;
    temperature: string;
    podLineLength: string;
    minSoil: string;
    operatorTip: string;
    tokenStrategy?: "LOWEST_SEEDS" | "LOWEST_PRICE" | "SPECIFIC_TOKEN";
    tokenSymbol?: string;
    morningAuction?: boolean;
  };
  encodedData: `0x${string}`;
  operatorPasteInstrs: `0x${string}`[];
  blueprint: Blueprint;
  isViewOnly?: boolean;
  executionHistory?: ExecutionData[];
}

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
}: ReviewTractorOrderProps) {
  const { address } = useAccount();
  const signRequisition = useSignRequisition();
  const [signing, setSigning] = useState(false);
  const { data: blueprintHash } = useGetBlueprintHash(blueprint);
  const [activeTab, setActiveTab] = useState<"order" | "blueprint" | "executions">("order");
  const [decodeAbi, setDecodeAbi] = useState(false);
  const [signedRequisitionData, setSignedRequisitionData] = useState<any>(null);
  const protocolAddress = useProtocolAddress();
  const navigate = useNavigate();

  const { writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
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

    try {
      setSigning(true);
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
      setSigning(false);
    }
  };

  const handlePublishRequisition = async () => {
    if (!signedRequisitionData?.signature) {
      toast.error("Please sign the blueprint first");
      return;
    }

    try {
      // Call publish requisition
      await writeWithEstimateGas({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "publishRequisition",
        args: [signedRequisitionData],
      });

      // Success handling
      toast.success("Order published successfully");

      // Close the dialog
      onOpenChange(false);

      // Navigate to the Field page with tractor tab active
      navigate("/field?tab=tractor");

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
    }
  };

  // Calculate total results from execution history
  const totalBeansSpent = executionHistory.reduce((acc, exec) => {
    if (exec.sowEvent) {
      return acc.add(TokenValue.fromBlockchain(exec.sowEvent.beans, 6));
    }
    return acc;
  }, TokenValue.ZERO);

  const totalPodsReceived = executionHistory.reduce((acc, exec) => {
    if (exec.sowEvent) {
      return acc.add(TokenValue.fromBlockchain(exec.sowEvent.pods, 6));
    }
    return acc;
  }, TokenValue.ZERO);

  const averagePodsPerBean = totalBeansSpent.gt(0) ? totalPodsReceived.div(totalBeansSpent) : TokenValue.ZERO;

  // Helper function to format dates with time
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Unknown";
    return format(new Date(timestamp), "MM/dd/yyyy h:mm a"); // Include hours and minutes with AM/PM
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
        <DialogOverlay className="fixed inset-0 backdrop-blur-sm bg-black/30" />
        <DialogContent
          className="sm:max-w-[1400px]"
          style={{
            padding: 0, // no  other way to set padding as 0
          }}
        >
          <Col className="gap-3 pb-3">
            <div className="px-6 pt-6 pinto-body">
              {isViewOnly ? "View Tractor Order" : "Review and Publish Tractor Order"}
            </div>
            <DialogDescription className="px-6 pinto-sm-light text-pinto-light">
              {isViewOnly ? (
                <p>
                  This is your active Tractor Order. It allows an Operator to execute a transaction for you on the{" "}
                  <span className="whitespace-nowrap">
                    <IconImage
                      src={baseLogo}
                      nudge={-6}
                      mobileSize={4}
                      size={6}
                      className="inline align-baseline mx-[0.5px] rounded-full"
                    />{" "}
                    Base&nbsp;
                  </span>
                  network when the conditions are met.
                </p>
              ) : (
                <Col className="gap-3">
                  <p>
                    A Tractor Order allows you to pay an Operator to execute a transaction for you on the{" "}
                    <span className="whitespace-nowrap">
                      <IconImage
                        src={baseLogo}
                        nudge={-6}
                        mobileSize={4}
                        size={6}
                        className="inline align-baseline mx-[0.5px] rounded-full"
                      />{" "}
                      Base&nbsp;
                    </span>
                    network.
                  </p>
                  <p>
                    This allows you to interact with the Pinto protocol autonomously when the conditions of your Order
                    are met.
                  </p>
                </Col>
              )}
            </DialogDescription>
          </Col>
          <div className="flex flex-col">
            {/* Tabs */}
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
              {isViewOnly && executionHistory.length > 0 && (
                <button
                  type="button"
                  className={`pb-2 ${
                    activeTab === "executions"
                      ? "border-b-2 border-pinto-green-4 font-medium"
                      : "border-b-2 border-transparent text-pinto-gray-4"
                  }`}
                  onClick={() => setActiveTab("executions")}
                >
                  Execution History ({executionHistory.length})
                </button>
              )}
            </div>

            {/* Content */}
            {activeTab === "order" ? (
              /* Order Visualization */
              <div className="bg-gray-50 p-6 rounded-lg relative">
                {/* Add the dot grid as a background element */}
                <div className="absolute inset-0 opacity-50">
                  <div className="w-full h-full bg-dot-grid bg-[size:24px_24px] bg-[position:center]" />
                </div>

                <div className="z-10 relative">
                  {/* Withdraw Section */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white rounded-xl px-2 py-2 shadow-sm flex flex-col gap-2 border border-gray-200">
                      <div className="flex items-center gap-0">
                        <div className="bg-pinto-green-4 text-white px-3 py-0.5 rounded-full">Withdraw</div>
                        <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />

                        <span className="text-box rounded-full">
                          <span>Deposited Tokens</span>
                        </span>
                        <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />
                        <span className="text-box rounded-full flex items-center">
                          <span>as</span>
                          <img src={pintoIcon} alt="PINTO" className="w-5 h-5 mx-1" />
                          <span className="font-medium">PINTO</span>
                        </span>
                      </div>

                      <div className="text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                          <span className="font-light text-[#9C9C9C]">
                            Withdraw Deposited Tokens from the Silo with the{" "}
                            {orderData.tokenStrategy === "LOWEST_SEEDS"
                              ? "Lowest Seeds"
                              : orderData.tokenStrategy === "LOWEST_PRICE"
                                ? "Best Price"
                                : orderData.tokenSymbol || "Selected Token"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sow Section */}
                  <div className="flex flex-col items-center gap-4 mt-8">
                    <div className="bg-white rounded-xl px-2 py-2 shadow-sm border border-gray-200">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-0">
                          <div className="bg-pinto-green-4 text-white px-3 py-0.5 rounded-full">Sow</div>
                          <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />
                          <span className="text-box rounded-full inline-flex items-center">
                            <span>up to</span>&nbsp;<span className="text-pinto-green-4">{orderData.totalAmount}</span>
                            &nbsp;
                            <span className="text-pinto-green-4 inline-flex items-center">
                              <img src={pintoIcon} alt="PINTO" className="w-4 h-4 mx-1" />
                              PINTO
                            </span>
                          </span>
                        </div>
                        <ul className="list-none space-y-1">
                          <li className="flex items-center gap-2">
                            <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                            <span className="font-light text-[#9C9C9C]">
                              Execute when Temperature is at least{" "}
                              <span className="text-pinto-green-4">{orderData.temperature}</span>
                              <span className="text-pinto-green-4">%</span>
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                            <span className="font-light text-[#9C9C9C]">
                              AND when Pod Line Length is at most{" "}
                              <span className="text-pinto-green-4">
                                {typeof orderData.podLineLength === "string" && orderData.podLineLength.includes(".")
                                  ? formatter.number(parseFloat(orderData.podLineLength.replace(/,/g, "")), {
                                      maxDecimals: 0,
                                    })
                                  : formatter.number(orderData.podLineLength, { maxDecimals: 0 })}
                              </span>
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                            <span className="font-light text-[#9C9C9C]">
                              AND when Available Soil is at least{" "}
                              <span className="text-pinto-green-4">{orderData.minSoil}</span>
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                            <span className="font-light text-[#9C9C9C]">
                              AND {orderData.morningAuction ? "during" : "after"} the Morning Auction
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Tip Section */}
                  <div className="flex items-center justify-center mt-8">
                    <div className="bg-white rounded-xl px-2 py-2 shadow-sm flex items-center gap-0 border border-gray-200">
                      <div className="bg-pinto-green-4 text-white px-3 py-0.5 rounded-full">Tip</div>
                      <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />
                      <span className="text-box rounded-full">
                        <span className="text-pinto-green-4 flex items-center inline-flex">
                          {orderData.operatorTip} <img src={pintoIcon} alt="PINTO" className="w-4 h-4 mx-1" />
                          PINTO
                        </span>
                      </span>
                      <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />
                      <span className="text-box rounded-full">to Operator</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === "blueprint" ? (
              /* Blueprint View */
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-6">
                  {/* Decoded SowBlueprintv0 Call */}
                  <div>
                    <h3 className="pinto-sm font-medium mb-2">SowBlueprintv0 Call</h3>
                    <div className="bg-white p-4 rounded border border-gray-200 font-mono text-sm overflow-x-auto">
                      <HighlightedCallData
                        blueprintData={encodedData}
                        targetData={encodedData}
                        showSowBlueprintParams={true}
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

                  {/* Operator Instructions */}
                  {/* <div>
                    <h3 className="text-lg font-medium mb-2">Operator Instructions</h3>
                    <div className="bg-white p-4 rounded border border-gray-200 font-mono text-sm overflow-x-auto">
                      {operatorPasteInstrs.map((instr, i) => (
                        <div key={i} className="mb-2">
                          <div className="text-gray-500 text-xs mb-1">Instruction {i + 1}:</div>
                          <HighlightedCallData blueprintData={encodedData} targetData={instr} decodeAbi={decodeAbi} />
                        </div>
                      ))}
                    </div>
                  </div> */}

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
              /* Table-Based Execution History View with Date & Time and Progress Bar */
              <div>
                {executionHistory.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No executions yet</div>
                ) : (
                  <>
                    {/* Enhanced Summary Section with Progress Bar and Tips Paid */}
                    {/* Metrics Grid - Now with Total Tips Paid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Total PINTO Sown</span>
                        <span className="text-xl font-medium mt-3">{formatter.number(totalBeansSpent)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Total Pods Received</span>
                        <span className="text-xl font-medium mt-3">{formatter.number(totalPodsReceived)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Average Temperature</span>
                        <span className="text-xl font-medium mt-3">
                          {formatter.number(averagePodsPerBean.mul(100))}%
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Total Tips Paid</span>
                        <span className="text-xl font-medium mt-3">
                          {(() => {
                            // Get tip amount from order data
                            const tipAmount = orderData.operatorTip
                              ? TokenValue.fromHuman(orderData.operatorTip, 6)
                              : TokenValue.ZERO;
                            // Calculate total tips paid
                            const totalTipsPaid = tipAmount.mul(executionHistory.length);
                            return formatter.number(totalTipsPaid);
                          })()} PINTO
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Section - remains the same */}
                    {/* {orderData.totalAmount && (
                        <>

                          {(() => {
                            const totalAmount = TokenValue.fromHuman(orderData.totalAmount, 6);
                            const percentComplete = totalAmount.gt(0) 
                              ? totalBeansSpent.div(totalAmount).mul(100)
                              : TokenValue.ZERO;
                            
                            // Convert to number safely
                            const percentCompleteNumber = Math.min(
                              percentComplete.toNumber ? percentComplete.toNumber() : 
                              (percentComplete.toHuman ? Number(percentComplete.toHuman()) : 0), 
                              100
                            );
                            
                            const isComplete = percentCompleteNumber >= 100;
                            
                            return (
                              <div className="mt-5">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-500">Progress</span>
                                  <span className="text-sm text-gray-500">
                                    {formatter.number(totalBeansSpent)} / {orderData.totalAmount} PINTO sown 
                                    ({Math.round(percentCompleteNumber)}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div 
                                    className={`h-3 rounded-full ${isComplete ? 'bg-pinto-green-4' : 'bg-pinto-green-4'}`}
                                    style={{ width: `${percentCompleteNumber}%` }}
                                  ></div>
                                </div>
                                

                                {isComplete && (
                                  <div className="mt-3 py-2 bg-pinto-green-1 rounded-lg border border-pinto-green-4 text-pinto-green-4 text-center font-medium">
                                    Order Completed!
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </>
                      )} */}

                    {/* Existing Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-gray-600 border-b">Execution</th>
                            <th className="px-4 py-3 text-right text-gray-600 border-b">PINTO Sown</th>
                            <th className="px-4 py-3 text-right text-gray-600 border-b">Pods Received</th>
                            <th className="px-4 py-3 text-right text-gray-600 border-b">Temperature</th>
                            <th className="px-4 py-3 text-right text-gray-600 border-b">Operator</th>
                            <th className="px-4 py-3 text-right text-gray-600 border-b min-w-[150px]">Date & Time</th>
                            <th className="px-4 py-3 text-right text-gray-600 border-b">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Table rows - remain the same */}
                          {[...executionHistory]
                            .sort((a, b) => {
                              // If timestamps are available, use those for sorting
                              if (a.timestamp && b.timestamp) {
                                return b.timestamp - a.timestamp;
                              }
                              // Otherwise fall back to block numbers
                              return b.blockNumber - a.blockNumber;
                            })
                            .map((execution, index) => {
                              // Calculate temperature for this execution
                              const temperature =
                                execution.sowEvent && execution.sowEvent.beans > 0n
                                  ? TokenValue.fromBlockchain(execution.sowEvent.pods, 6)
                                      .div(TokenValue.fromBlockchain(execution.sowEvent.beans, 6))
                                      .mul(100) // Convert to percentage
                                  : TokenValue.ZERO;

                              return (
                                <tr key={index} className="hover:bg-gray-50 border-b">
                                  <td className="px-4 py-3 font-medium">#{executionHistory.length - index}</td>
                                  <td className="px-4 py-3 text-right">
                                    {execution.sowEvent
                                      ? formatter.number(TokenValue.fromBlockchain(execution.sowEvent.beans, 6))
                                      : "-"}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    {execution.sowEvent
                                      ? formatter.number(TokenValue.fromBlockchain(execution.sowEvent.pods, 6))
                                      : "-"}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    {execution.sowEvent && execution.sowEvent.beans > 0n
                                      ? `${formatter.number(temperature)}%`
                                      : "-"}
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-500">
                                    {shortenAddress(execution.operator)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-500">
                                    {execution.timestamp
                                      ? formatDate(execution.timestamp)
                                      : `Block ${execution.blockNumber}`}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <a
                                      href={`https://basescan.org/tx/${execution.transactionHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-pinto-green-4 hover:underline text-sm"
                                    >
                                      View Transaction
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Footer */}
            {!isViewOnly ? (
              <Row className="justify-between items-center border-t p-6">
                <p className="pinto-sm-light text-pinto-light">
                  Your Order will remain active until you've Sown {orderData.totalAmount} Pinto under the specified
                  conditions or until Order cancellation
                </p>
                <Row className="flex flex-row gap-2 shrink-0 smaller-button-text">
                  {signedRequisitionData ? (
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
                    disabled={submitting || !signedRequisitionData}
                    submitFunction={handlePublishRequisition}
                    submitButtonText={submitting ? "Publishing..." : "Publish Order"}
                    className="w-min"
                    style={!signedRequisitionData ? { opacity: 0.15 } : undefined}
                  />
                </Row>
              </Row>
            ) : null}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

// Helper function to shorten addresses
function shortenAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
