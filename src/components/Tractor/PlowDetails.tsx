import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { RequisitionEvent } from "@/lib/Tractor/utils";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient } from "wagmi";

const UINT256_MAX = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");

interface PlowDetailsProps {
  requisition: RequisitionEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PlowDetails({ requisition, isOpen, onClose, onSuccess }: PlowDetailsProps) {
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const [isSimulating, setIsSimulating] = useState(false);
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();

  // Handle success callback for refreshing data
  const handleSuccess = useCallback(() => {
    // Close the dialog
    onClose();

    // Call any additional success handling passed from parent
    if (onSuccess) onSuccess();

    // Invalidate queries to refresh data
    // Add specific query invalidation as needed
    // queryClient.invalidateQueries({ queryKey: ['tractorRequisitions'] });
  }, [onClose, onSuccess, queryClient]);

  // Setup transaction handler with useTransaction hook
  const { writeWithEstimateGas, submitting, setSubmitting } = useTransaction({
    successMessage: "Plow successful",
    errorMessage: "Plow failed",
    successCallback: handleSuccess,
  });

  const handlePlow = useCallback(async () => {
    if (!requisition || !protocolAddress) return;
    setSubmitting(true);

    try {
      await writeWithEstimateGas({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "tractor",
        args: [
          {
            blueprint: requisition.requisition.blueprint,
            blueprintHash: requisition.requisition.blueprintHash,
            signature: requisition.requisition.signature,
          },
          "0x",
        ] as const,
      });
    } catch (error) {
      console.error("Failed to execute plow:", error);
    } finally {
      setSubmitting(false);
    }
  }, [requisition, protocolAddress, writeWithEstimateGas, setSubmitting]);

  const handleSimulate = useCallback(async () => {
    if (!requisition || !protocolAddress || !publicClient) return;
    setIsSimulating(true);

    try {
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
          "0x",
        ] as const,
      });

      toast.success("Simulation successful");
      console.debug("Simulation result:", simulation);
    } catch (error) {
      // console.error("Simulation failed:", error);
      toast.error(`Simulation failed: ${(error as Error).message}`);
    } finally {
      setIsSimulating(false);
    }
  }, [requisition, protocolAddress, publicClient]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plow Details</DialogTitle>
          <DialogDescription>Review and confirm the plow operation details</DialogDescription>
        </DialogHeader>
        {requisition?.decodedData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-gray-500">Type</div>
              <div className="font-mono">{requisition.requisitionType}</div>

              <div className="text-sm text-gray-500">Total Amount to Sow</div>
              <div>{`${requisition.decodedData.sowAmounts.totalAmountToSowAsString} PINTO`}</div>

              <div className="text-sm text-gray-500">Min Amount per Season</div>
              <div>{`${requisition.decodedData.sowAmounts.minAmountToSowPerSeasonAsString} PINTO`}</div>

              <div className="text-sm text-gray-500">Max Amount per Season</div>
              <div>{`${requisition.decodedData.sowAmounts.maxAmountToSowPerSeasonAsString} PINTO`}</div>

              <div className="text-sm text-gray-500">Temperature</div>
              <div>{`${requisition.decodedData.minTempAsString}%`}</div>

              <div className="text-sm text-gray-500">Max Pod Line Length</div>
              <div>{requisition.decodedData.maxPodlineLengthAsString}</div>

              <div className="text-sm text-gray-500">Max Grown Stalk per BDV</div>
              <div>{requisition.decodedData.maxGrownStalkPerBdvAsString}</div>

              <div className="text-sm text-gray-500">Run Blocks After Sunrise</div>
              <div>{requisition.decodedData.runBlocksAfterSunriseAsString}</div>

              <div className="text-sm text-gray-500">Operator Tip</div>
              <div>{`${requisition.decodedData.operatorParams.operatorTipAmountAsString} PINTO`}</div>

              <div className="text-sm text-gray-500">Max Nonce</div>
              <div>
                {requisition.requisition.blueprint.maxNonce === UINT256_MAX
                  ? "Max uint256"
                  : requisition.requisition.blueprint.maxNonce.toString()}
              </div>
            </div>

            {/* <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="outline" onClick={handleSimulate} disabled={isSimulating || submitting}>
                {isSimulating ? "Simulating..." : "Simulate"}
              </Button>
              <Button onClick={handlePlow} disabled={submitting}>
                {submitting ? "Plowing..." : "Plow"}
              </Button>
            </div> */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
