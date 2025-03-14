import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { usePublicClient } from "wagmi";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import { RequisitionEvent, loadPublishedRequisitions, decodeSowTractorData } from "@/lib/Tractor/utils";

const BASESCAN_URL = "https://basescan.org/address/";

export function SoilOrderbook() {
  const [requisitions, setRequisitions] = useState<RequisitionEvent[]>([]);
  const [latestBlockInfo, setLatestBlockInfo] = useState<{ number: number; timestamp: number } | null>(null);
  const protocolAddress = useProtocolAddress();
  const publicClient = usePublicClient();

  // Get latest block info once when component loads
  useEffect(() => {
    const fetchLatestBlock = async () => {
      if (!publicClient) return;
      try {
        const latestBlock = await publicClient.getBlock();
        const blockInfo = {
          number: Number(latestBlock.number),
          timestamp: Number(latestBlock.timestamp) * 1000,
        };
        setLatestBlockInfo(blockInfo);
      } catch (error) {
        console.error("Failed to fetch latest block:", error);
      }
    };
    fetchLatestBlock();
  }, [publicClient]);

  const getApproximateTimestamps = useCallback(
    (events: RequisitionEvent[]) => {
      if (!latestBlockInfo || events.length === 0) return events;

      return events.map((event) => {
        const blockDiff = latestBlockInfo.number - event.blockNumber;
        const timestamp = latestBlockInfo.timestamp - blockDiff * 2000;
        return {
          ...event,
          timestamp,
        };
      });
    },
    [latestBlockInfo],
  );

  const loadAllRequisitions = useCallback(async () => {
    try {
      if (!publicClient) return;
      const events = await loadPublishedRequisitions(undefined, protocolAddress, publicClient);
      const activeEvents = events.filter((req) => !req.isCancelled);

      // Get approximate timestamps
      const eventsWithTimestamps = getApproximateTimestamps(activeEvents);

      const sortedEvents = eventsWithTimestamps.sort((a, b) => {
        try {
          const dataA = decodeSowTractorData(a.requisition.blueprint.data);
          const dataB = decodeSowTractorData(b.requisition.blueprint.data);
          if (!dataA || !dataB) return 0;
          return parseFloat(dataA.temperature) - parseFloat(dataB.temperature);
        } catch (error) {
          console.error("Failed to decode data for requisition:", error);
          return 0;
        }
      });
      setRequisitions(sortedEvents);
    } catch (error) {
      console.error("Failed to load soil orderbook:", error);
      toast.error("Failed to load soil orderbook");
    }
  }, [protocolAddress, publicClient, getApproximateTimestamps]);

  useEffect(() => {
    loadAllRequisitions();
  }, [loadAllRequisitions]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Created At</TableHead>
            <TableHead>Publisher</TableHead>
            <TableHead>Blueprint Hash</TableHead>
            <TableHead>Max Nonce</TableHead>
            <TableHead>Max Pinto</TableHead>
            <TableHead>Min Pinto</TableHead>
            <TableHead>Temperature</TableHead>
            <TableHead>Operator Tip</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:first-child]:border-t [&_tr:last-child]:border-b">
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
                <TableCell className="p-2 font-mono text-sm">
                  {decodedData ? `${decodedData.pintoAmount} PINTO` : "Failed to decode"}
                </TableCell>
                <TableCell className="p-2 font-mono text-sm">
                  {decodedData ? `${decodedData.minPintoAmount} PINTO` : "Failed to decode"}
                </TableCell>
                <TableCell className="p-2 font-mono text-sm">
                  {decodedData ? `${decodedData.temperature}%` : "Failed to decode"}
                </TableCell>
                <TableCell className="p-2 font-mono text-sm">
                  {decodedData ? `${decodedData.operatorTip} PINTO` : "Failed to decode"}
                </TableCell>
              </TableRow>
            );
          })}
          {requisitions.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="p-4 text-center text-gray-500">
                No active requisitions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
