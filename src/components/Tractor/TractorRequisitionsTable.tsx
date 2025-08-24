import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { diamondABI } from "@/constants/abi/diamondABI";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import useTransaction from "@/hooks/useTransaction";
import { TractorRequisitionEvent as RequisitionEvent, SowBlueprintData, decodeSowTractorData } from "@/lib/Tractor";
import useTractorPublishedRequisitions from "@/state/tractor/useTractorPublishedRequisitions";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

interface TractorRequisitionsTableProps {
  refreshTrigger?: number;
}

export function TractorRequisitionsTable({ refreshTrigger = 0 }: TractorRequisitionsTableProps) {
  const { address } = useAccount();
  const protocolAddress = useProtocolAddress();

  const { writeWithEstimateGas, submitting, isConfirming, setSubmitting } = useTransaction({
    successMessage: "Blueprint cancelled successfully",
    errorMessage: "Failed to cancel blueprint",
  });

  const { data: requisitions, ...requisitionsQuery } = useTractorPublishedRequisitions(address);

  const handleCancelBlueprint = async (requisitionData: RequisitionEvent<SowBlueprintData>) => {
    if (!address) {
      throw new Error("Signer required");
    }

    if (!protocolAddress) {
      throw new Error("Protocol address not found");
    }

    console.debug("=== REQUISITIONS TABLE CANCEL DEBUG ===");
    console.debug({
      "Full requisitionData object": requisitionData,
      "requisitionData.requisition": requisitionData.requisition,
      blueprintHash: requisitionData.requisition.blueprintHash,
      "blueprintHash type": typeof requisitionData.requisition.blueprintHash,
      "blueprintHash length": requisitionData.requisition.blueprintHash?.length,
      signature: requisitionData.requisition.signature,
      "signature type": typeof requisitionData.requisition.signature,
      "signature length": requisitionData.requisition.signature?.length,
      blueprint: requisitionData.requisition.blueprint,
      "blueprint.publisher": requisitionData.requisition.blueprint?.publisher,
      "blueprint.data": requisitionData.requisition.blueprint?.data,
      "blueprint.operatorPasteInstrs": requisitionData.requisition.blueprint?.operatorPasteInstrs,
      "blueprint.maxNonce": requisitionData.requisition.blueprint?.maxNonce,
      "blueprint.startTime": requisitionData.requisition.blueprint?.startTime,
      "blueprint.endTime": requisitionData.requisition.blueprint?.endTime,
    });
    console.debug("=== END REQUISITIONS TABLE DEBUG ===");
    setSubmitting(true);

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
      requisitionsQuery.refetch();
    } catch (error) {
      console.error("Error cancelling blueprint:", error);
      toast.error("Failed to cancel blueprint");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (refreshTrigger > 0) {
      requisitionsQuery.refetch();
    }
  }, [refreshTrigger, requisitionsQuery.refetch]);

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
          {requisitions?.sowBlueprintV0.map((req, index) => {
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
                      disabled={submitting || isConfirming}
                      className="text-pinto-gray-4 hover:text-pinto-gray-5"
                    >
                      Cancel
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
          {requisitions?.sowBlueprintV0.length === 0 && (
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
