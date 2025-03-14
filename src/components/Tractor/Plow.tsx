import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { usePublicClient } from "wagmi";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import { RequisitionEvent, loadPublishedRequisitions, decodeSowTractorData } from "@/lib/Tractor/utils";
import { Button } from "@/components/ui/Button";
import { PlowDetails } from "./PlowDetails";
import { useQuery } from "@tanstack/react-query";
import { useLatestBlock } from "@/hooks/useLatestBlock";

const BASESCAN_URL = "https://basescan.org/address/";

export function Plow() {
  const [selectedRequisition, setSelectedRequisition] = useState<RequisitionEvent | null>(null);
  const protocolAddress = useProtocolAddress();
  const publicClient = usePublicClient();
  const { data: latestBlock } = useLatestBlock();

  const { data: requisitions = [], isLoading } = useQuery({
    queryKey: ["requisitions", protocolAddress],
    queryFn: async () => {
      console.log("Loading requisitions...");
      if (!publicClient || !protocolAddress) return [];

      const events = await loadPublishedRequisitions(undefined, protocolAddress, publicClient);
      console.log("Loaded requisitions:", events.length);

      // Add timestamps
      if (latestBlock) {
        return events.map((event) => ({
          ...event,
          timestamp: Number(latestBlock.timestamp) * 1000 - (Number(latestBlock.number) - event.blockNumber) * 2000, // Approximate 2s per block
        }));
      }

      return events;
    },
    enabled: !!protocolAddress && !!publicClient && !!latestBlock,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  const handlePlow = useCallback((requisition: RequisitionEvent) => {
    setSelectedRequisition(requisition);
  }, []);

  if (isLoading) {
    return <div>Loading requisitions...</div>;
  }

  // Rest of the component is identical to SoilOrderbook
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Created At</TableHead>
            <TableHead>Publisher</TableHead>
            <TableHead>Blueprint Hash</TableHead>
            <TableHead>Max Nonce</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Operator Tip</TableHead>
            <TableHead>Plow</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:first-child]:border-t [&_tr:last-child]:border-b">
          {/* Rest of the JSX is identical to SoilOrderbook */}
          {requisitions.map((req, index) => {
            let decodedData: {
              pintoAmount: string;
              temperature: string;
              minPintoAmount: string;
              operatorTip: string;
            } | null = null;
            try {
              decodedData = decodeSowTractorData(req.requisition.blueprint.data);
            } catch (error) {
              console.error("Failed to decode data for requisition:", error);
            }

            const dateOptions: Intl.DateTimeFormatOptions = {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h24",
            };

            return (
              <TableRow key={index} className="h-[4.5rem] bg-transparent items-center hover:bg-pinto-green-1/50">
                <TableCell className="p-2">
                  {req.timestamp ? new Date(req.timestamp).toLocaleString(undefined, dateOptions) : "Unknown"}
                </TableCell>
                <TableCell className="p-2 font-mono text-sm">
                  <a
                    href={`${BASESCAN_URL}${req.requisition.blueprint.publisher}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pinto-green-4 hover:text-pinto-green-5 hover:underline"
                  >
                    {`${req.requisition.blueprint.publisher.slice(0, 6)}...${req.requisition.blueprint.publisher.slice(-4)}`}
                  </a>
                </TableCell>
                <TableCell className="p-2 font-mono text-sm">
                  {`${req.requisition.blueprintHash.slice(0, 6)}...${req.requisition.blueprintHash.slice(-4)}`}
                </TableCell>
                <TableCell className="p-2">{req.requisition.blueprint.maxNonce.toString()}</TableCell>
                <TableCell className="p-2 font-mono text-sm">{req.requisitionType}</TableCell>
                <TableCell className="p-2 font-mono text-sm">
                  {decodedData ? `${decodedData.operatorTip} PINTO` : "Failed to decode"}
                </TableCell>
                <TableCell className="p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePlow(req)}
                    className="text-pinto-gray-4 hover:text-pinto-gray-5"
                  >
                    Plow
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {requisitions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="p-4 text-center text-gray-500">
                No active requisitions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PlowDetails
        requisition={selectedRequisition}
        isOpen={selectedRequisition !== null}
        onClose={() => setSelectedRequisition(null)}
      />
    </div>
  );
}
