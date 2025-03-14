import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/Dialog";
import { Button } from "./ui/Button";
import { CornerBottomLeftIcon } from "@radix-ui/react-icons";
import { useAccount } from "wagmi";
import {
  createSowTractorData,
  createBlueprint,
  createRequisition,
  useSignRequisition,
} from "@/lib/Tractor";
import { useGetBlueprintHash } from "@/lib/Tractor/blueprint";
import { toast } from "sonner";
import { useState } from "react";
import { Blueprint } from "@/lib/Tractor/types";
import { HighlightedCallData } from "./Tractor/HighlightedCallData";
import { Switch } from "./ui/Switch";

interface ReviewTractorOrderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderData: {
    totalAmount: string;
    temperature: string;
    podLineLength: string;
    minSoil: string;
    operatorTip: string;
  };
  encodedData: `0x${string}`;
  operatorPasteInstrs: `0x${string}`[];
  blueprint: Blueprint;
}

export default function ReviewTractorOrderDialog({
  open,
  onOpenChange,
  orderData,
  encodedData,
  operatorPasteInstrs,
  blueprint,
}: ReviewTractorOrderProps) {
  const { address } = useAccount();
  const signRequisition = useSignRequisition();
  const [submitting, setSubmitting] = useState(false);
  const { data: blueprintHash } = useGetBlueprintHash(blueprint);
  const [activeTab, setActiveTab] = useState<"order" | "blueprint">("order");
  const [decodeAbi, setDecodeAbi] = useState(false);

  const handleSubmitOrder = async () => {
    if (!address) return;

    if (!blueprintHash) {
      toast.error("Blueprint hash not ready yet, please try again in a moment");
      return;
    }

    try {
      setSubmitting(true);
      // Create and sign the requisition using the hash
      const requisition = createRequisition(blueprint, blueprintHash);
      const signedRequisition = await signRequisition(requisition);

      toast.success("Blueprint signed successfully");
      // TODO: Handle the signed requisition
    } catch (error) {
      console.error("Error signing blueprint:", error);
      toast.error("Failed to sign blueprint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] backdrop-blur-sm">
        <DialogTitle>Review and Publish Tractor Order</DialogTitle>
        <DialogDescription>
          A Tractor Order allows you to pay an Operator to execute a transaction
          for you on the Base network. This allows you to interact with the
          Pinto protocol autonomously when the conditions of your Order are met.
        </DialogDescription>
        <div className="flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b">
            <button
              className={`pb-2 ${
                activeTab === "order"
                  ? "border-b-2 border-green-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("order")}
            >
              View Order
            </button>
            <button
              className={`pb-2 ${
                activeTab === "blueprint"
                  ? "border-b-2 border-green-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("blueprint")}
            >
              View Blueprint and Requisition
            </button>
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
                  <div className="bg-white rounded-xl px-8 py-3 shadow-sm flex flex-col gap-2 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="bg-pinto-green-4 text-white px-4 py-1 rounded-full">
                        Withdraw
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-box">Deposited Tokens</span>
                      <span className="text-gray-300">—</span>
                      <span className="text-box">
                        with <span className="text-black">Best PINTO</span>{" "}
                        Price
                      </span>
                      <span className="text-gray-300">—</span>
                      <span className="text-box">
                        as <span className="text-black">PINTO</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sow Section */}
                <div className="flex flex-col items-center gap-4 mt-8">
                  <div className="bg-white rounded-xl px-8 py-3 shadow-sm border border-gray-200">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-pinto-green-4 text-white px-4 py-1 rounded-full">
                          Sow
                        </div>
                        <span className="text-gray-300">—</span>
                        <span className="text-box">
                          up to{" "}
                          <span className="text-pinto-green-4">
                            {orderData.totalAmount}
                          </span>{" "}
                          <span className="text-pinto-green-4">PINTO</span>
                        </span>
                      </div>
                      <ul className="list-none space-y-2">
                        <li className="flex items-center gap-2">
                          <CornerBottomLeftIcon className="text-gray-300" />
                          <span className="font-menlo text-gray-400">
                            Execute when Temperature is at least{" "}
                            <span className="text-pinto-green-4">
                              {orderData.temperature}
                            </span>
                            <span className="text-pinto-green-4">%</span>
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CornerBottomLeftIcon className="text-gray-300" />
                          <span className="font-menlo text-gray-400">
                            AND when Pod Line Length is at most{" "}
                            <span className="text-pinto-green-4">
                              {orderData.podLineLength}
                            </span>
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CornerBottomLeftIcon className="text-gray-300" />
                          <span className="font-menlo text-gray-400">
                            AND when Available Soil is at least{" "}
                            <span className="text-pinto-green-4">
                              {orderData.minSoil}
                            </span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tip Section */}
                <div className="flex items-center justify-center mt-8">
                  <div className="bg-white rounded-xl px-8 py-3 shadow-sm flex items-center gap-2 border border-gray-200">
                    <div className="bg-pinto-green-4 text-white px-4 py-1 rounded-full">
                      Tip
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-box">
                        <span className="text-pinto-green-4">
                          {orderData.operatorTip} PINTO
                        </span>
                      </span>
                      <span className="text-gray-300">—</span>
                      <span className="text-box">to Operator</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Blueprint View */
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-6">
                {/* Decoded SowBlueprintv0 Call */}
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    SowBlueprintv0 Call
                  </h3>
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
                  <h3 className="text-lg font-medium mb-2">
                    Encoded Farm Data
                  </h3>
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
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Operator Instructions
                  </h3>
                  <div className="bg-white p-4 rounded border border-gray-200 font-mono text-sm overflow-x-auto">
                    {operatorPasteInstrs.map((instr, i) => (
                      <div key={i} className="mb-2">
                        <div className="text-gray-500 text-xs mb-1">
                          Instruction {i + 1}:
                        </div>
                        <HighlightedCallData
                          blueprintData={encodedData}
                          targetData={instr}
                          decodeAbi={decodeAbi}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requisition Data */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Requisition Data</h3>
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
          )}

          {/* Footer */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-600">
              Your Order will remain active until you've Sown{" "}
              {orderData.totalAmount} Pods under the specified conditions or
              until Order cancellation
            </p>
            <Button
              onClick={handleSubmitOrder}
              disabled={submitting}
              className="bg-pinto-green-4 hover:bg-pinto-green-5 text-white px-6 py-2 rounded-full"
            >
              {submitting ? "Signing..." : "Submit Order"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
