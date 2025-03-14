import React, { useRef, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import {
  RequisitionEvent,
  decodeSowTractorData,
  parsePasteInstructions,
  generateOperatorData,
} from "@/lib/Tractor/utils";
import { Button } from "@/components/ui/Button";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAccount, useContractWrite, usePublicClient } from "wagmi";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { useQueryClient } from "@tanstack/react-query";
import { simulateContract } from "viem/actions";

interface PlowDetailsProps {
  requisition: RequisitionEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PlowDetails({ requisition, isOpen, onClose }: PlowDetailsProps) {
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const qc = useQueryClient();
  const [isSimulating, setIsSimulating] = useState(false);
  const publicClient = usePublicClient();

  // Handle success callback
  const handleSuccess = useCallback(() => {
    // Invalidate relevant queries here if needed
    onClose();
  }, [onClose]);

  // Setup transaction handler
  const { writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Plow successful",
    errorMessage: "Plow failed",
    successCallback: handleSuccess,
  });

  const [operatorInputs, setOperatorInputs] = React.useState<string[]>([]);
  const decodedData = requisition ? decodeSowTractorData(requisition.requisition.blueprint.data) : null;
  const pasteInstructions = requisition ? parsePasteInstructions(requisition) : null;
  const firstOpen = useRef(true);

  useEffect(() => {
    if (isOpen && pasteInstructions && address && firstOpen.current) {
      const initialInputs = pasteInstructions.fields.map(() => address);
      setOperatorInputs(initialInputs);
      firstOpen.current = false;
    } else if (!isOpen) {
      setOperatorInputs([]);
      firstOpen.current = true;
    }
  }, [isOpen, pasteInstructions, address]);

  const handleInputChange = useCallback((index: number, value: string) => {
    setOperatorInputs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const handlePlow = useCallback(async () => {
    if (!requisition || !pasteInstructions || !protocolAddress) return;
    setSubmitting(true);

    try {
      const operatorData = generateOperatorData(pasteInstructions.fields, operatorInputs);
      console.log("Generated operator data:", operatorData);

      await writeWithEstimateGas({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "tractor",
        args: [requisition.requisition, operatorData],
      });
    } catch (error) {
      console.error("Failed to execute plow:", error);
    } finally {
      setSubmitting(false);
    }
  }, [requisition, pasteInstructions, operatorInputs, protocolAddress, writeWithEstimateGas, setSubmitting]);

  const handleSimulate = useCallback(async () => {
    if (!requisition || !pasteInstructions || !protocolAddress || !publicClient) return;
    setIsSimulating(true);

    try {
      const operatorData = generateOperatorData(pasteInstructions.fields, operatorInputs);

      console.log("Generated operator data:", operatorData);

      const simulation = await publicClient.simulateContract({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "tractor",
        args: [
          {
            blueprint: requisition.requisition.blueprint,
            blueprintHash: requisition.requisition.blueprintHash,
            signature: requisition.requisition.signature,
          },
          operatorData,
        ] as const,
      });

      toast.success("Simulation successful");
      console.log("Simulation result:", simulation);
    } catch (error) {
      console.error("Simulation failed:", error);
      toast.error(`Simulation failed: ${(error as Error).message}`);
    } finally {
      setIsSimulating(false);
    }
  }, [requisition, pasteInstructions, operatorInputs, protocolAddress, publicClient]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plow Details</DialogTitle>
          <DialogDescription>Review and confirm the plow operation details</DialogDescription>
        </DialogHeader>
        {requisition && decodedData && pasteInstructions && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-gray-500">Type</div>
              <div className="font-mono">{requisition.requisitionType}</div>
              <div className="text-sm text-gray-500">Max Pinto</div>
              <div>{`${decodedData.pintoAmount} PINTO`}</div>
              <div className="text-sm text-gray-500">Min Pinto</div>
              <div>{`${decodedData.minPintoAmount} PINTO`}</div>
              <div className="text-sm text-gray-500">Temperature</div>
              <div>{`${decodedData.temperature}%`}</div>
              <div className="text-sm text-gray-500">Operator Tip</div>
              <div>{`${decodedData.operatorTip} PINTO`}</div>
              <div className="col-span-2 border-t border-border my-2" />
              <div className="col-span-2 text-sm font-semibold mb-2">Operator Paste Instructions</div>
              {pasteInstructions.fields.map((field, index) => (
                <React.Fragment key={field.name}>
                  <div className="text-sm text-gray-500">{field.name}</div>
                  {field.type === "address" ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={operatorInputs[index] || ""}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={`w-full px-2 py-1 text-right rounded-lg bg-card font-mono text-sm border-2 ${
                          address?.toLowerCase() === operatorInputs[index]?.toLowerCase()
                            ? "border-pinto-green-4"
                            : operatorInputs[index]
                              ? "border-orange-500"
                              : "border-border"
                        } hover:border-foreground focus:border-foreground focus:outline-none`}
                        placeholder={`Enter ${field.name.toLowerCase()}`}
                        style={{ userSelect: "none" }}
                        tabIndex={-1}
                      />
                      {operatorInputs[index] && (
                        <span
                          className={
                            address?.toLowerCase() === operatorInputs[index]?.toLowerCase()
                              ? "text-pinto-green-4 text-sm"
                              : "text-orange-500 text-sm"
                          }
                        >
                          {address?.toLowerCase() === operatorInputs[index]?.toLowerCase()
                            ? "Your Address"
                            : "Not your address"}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>{/* Handle other field types here */}</div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="outline" onClick={handleSimulate} disabled={isSimulating || submitting}>
                {isSimulating ? "Simulating..." : "Simulate"}
              </Button>
              <Button onClick={handlePlow} disabled={submitting}>
                {submitting ? "Plowing..." : "Plow"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
