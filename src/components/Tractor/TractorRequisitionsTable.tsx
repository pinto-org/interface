import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { RequisitionEvent, loadPublishedRequisitions } from "@/lib/Tractor/utils";
import { decodeSowTractorData } from "@/lib/Tractor/utils";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient } from "wagmi";

interface TractorRequisitionsTableProps {
  refreshTrigger?: number;
}

export function TractorRequisitionsTable({ refreshTrigger = 0 }: TractorRequisitionsTableProps) {
  const [requisitions, setRequisitions] = useState<RequisitionEvent[]>([]);
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();
  const publicClient = usePublicClient();

  const { writeWithEstimateGas, submitting } = useTransaction({
    successMessage: "Blueprint cancelled successfully",
    errorMessage: "Failed to cancel blueprint",
  });

  const handleCancelBlueprint = async (requisitionData: RequisitionEvent) => {
    if (!address || !protocolAddress) return;

    try {
      toast.loading("Cancelling blueprint...");
      await writeWithEstimateGas({
        address: protocolAddress,
        abi: diamondABI,
        functionName: "cancelBlueprint",
        args: [requisitionData.requisition],
      });
      toast.success("Blueprint cancelled successfully");
      // Refresh the list
      loadRequisitions();
    } catch (error) {
      console.error("Error cancelling blueprint:", error);
      toast.error("Failed to cancel blueprint");
    }
  };

  const loadRequisitions = useCallback(async () => {
    try {
      if (!publicClient) return;
      const events = await loadPublishedRequisitions(address, protocolAddress, publicClient);
      setRequisitions(events);
    } catch (error) {
      console.error("Failed to load published requisitions:", error);
      toast.error("Failed to load published requisitions");
    }
  }, [address, protocolAddress, publicClient]);

  useEffect(() => {
    loadRequisitions();
  }, [loadRequisitions]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      loadRequisitions();
    }
  }, [refreshTrigger, loadRequisitions]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Block Number</TableHead>
            <TableHead>Blueprint Hash</TableHead>
            <TableHead>Max Nonce</TableHead>
            <TableHead>Max Pinto</TableHead>
            <TableHead>Min Pinto</TableHead>
            <TableHead>Temperature</TableHead>
            <TableHead>Operator Tip</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:first-child]:border-t [&_tr:last-child]:border-b">
          {requisitions.map((req, index) => {
            let decodedData: {
              minTempAsString: string;
              sowAmounts: {
                totalAmountToSowAsString: string;
                minAmountToSowPerSeasonAsString: string;
              };
              operatorParams: {
                operatorTipAmountAsString: string;
              };
            } | null = null;

            try {
              const decoded = decodeSowTractorData(req.requisition.blueprint.data);
              if (decoded) {
                decodedData = {
                  minTempAsString: decoded.minTempAsString,
                  sowAmounts: {
                    totalAmountToSowAsString: decoded.sowAmounts.totalAmountToSowAsString,
                    minAmountToSowPerSeasonAsString: decoded.sowAmounts.minAmountToSowPerSeasonAsString,
                  },
                  operatorParams: {
                    operatorTipAmountAsString: decoded.operatorParams.operatorTipAmountAsString,
                  },
                };
              }
            } catch (error) {
              console.error("Failed to decode data for requisition:", error);
            }

            return (
              <TableRow key={index} className="h-[4.5rem] bg-transparent items-center hover:bg-pinto-green-1/50">
                <TableCell className="p-2">{req.blockNumber}</TableCell>
                <TableCell className="p-2 font-mono text-sm">
                  {`${req.requisition.blueprintHash.slice(0, 6)}...${req.requisition.blueprintHash.slice(-4)}`}
                </TableCell>
                <TableCell className="p-2">{req.requisition.blueprint.maxNonce.toString()}</TableCell>
                <TableCell className="p-2 font-mono text-sm">
                  {decodedData ? `${decodedData.sowAmounts.totalAmountToSowAsString} PINTO` : "Failed to decode"}
                </TableCell>
                <TableCell className="p-2 font-mono text-sm">
                  {decodedData ? `${decodedData.sowAmounts.minAmountToSowPerSeasonAsString} PINTO` : "Failed to decode"}
                </TableCell>
                <TableCell className="p-2 font-mono text-sm">
                  {decodedData ? `${decodedData.minTempAsString}%` : "Failed to decode"}
                </TableCell>
                <TableCell className="p-2 font-mono text-sm">
                  {decodedData ? `${decodedData.operatorParams.operatorTipAmountAsString} PINTO` : "Failed to decode"}
                </TableCell>
                <TableCell className="p-2">
                  {req.isCancelled ? (
                    <span className="text-gray-500">Cancelled</span>
                  ) : address?.toLowerCase() === req.requisition.blueprint.publisher.toLowerCase() ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelBlueprint(req)}
                      disabled={submitting}
                      className="text-pinto-gray-4 hover:text-pinto-gray-5"
                    >
                      Cancel
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
          {requisitions.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="p-4 text-center text-gray-500">
                No requisitions published yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
