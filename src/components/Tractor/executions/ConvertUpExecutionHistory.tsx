import { TV } from "@/classes/TokenValue";
import { Progress } from "@/components/ui/Progress";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { PublisherTractorExecution } from "@/lib/Tractor";
import { formatter } from "@/utils/format";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { format } from "date-fns";
import { useMemo } from "react";
import { ConvertUpOrderData, ExecutionHistoryProps } from "../types";

// Helper function to shorten addresses
function shortenAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

const cast = (executions: PublisherTractorExecution<TV, Token>[]) => {
  if (executions?.[0].type === "convertUp") {
    return executions as PublisherTractorExecution<TV, Token, "convertUp">[];
  }
  return [];
};

// Helper function to format dates with time
const formatDate = (timestamp?: number) => {
  if (!timestamp) return "Unknown";
  return format(new Date(timestamp), "MM/dd/yyyy h:mm a");
};

// Simple extracted components
const SummaryCard = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-xl font-medium mt-3">{value}</span>
  </div>
);

const ProgressSection = ({
  totalBdvConverted,
  convertData,
}: { totalBdvConverted: TV; convertData: ConvertUpOrderData }) => {
  const totalBdv = TV.fromHuman(convertData.totalBeanAmountToConvert, 6);
  const percentComplete = totalBdv.gt(0) ? totalBdvConverted.div(totalBdv).mul(100) : TV.ZERO;

  const percentCompleteNumber = Math.min(
    percentComplete.toNumber
      ? percentComplete.toNumber()
      : percentComplete.toHuman
        ? Number(percentComplete.toHuman())
        : 0,
    100,
  );

  const isComplete = percentCompleteNumber >= 100;

  return (
    <div className="px-6 mb-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm text-gray-500">
            {formatter.number(totalBdvConverted)} / {convertData.totalBeanAmountToConvert} PDV converted (
            {Math.round(percentCompleteNumber)}%)
          </span>
        </div>
        <Progress className="h-3 w-full" value={percentCompleteNumber} />
        {isComplete && (
          <div className="mt-3 py-2 bg-pinto-green-1 rounded-lg border border-pinto-green-4 text-pinto-green-4 text-center font-medium">
            Order Completed!
          </div>
        )}
      </div>
    </div>
  );
};

const ExecutionTableRow = ({
  convertEvent,
  index,
  totalExecutions,
  tokenMap,
}: {
  convertEvent: PublisherTractorExecution<TV, Token, "convertUp">;
  index: number;
  totalExecutions: number;
  tokenMap: ReturnType<typeof useTokenMap>;
}) => (
  <tr className="hover:bg-gray-50 border-b">
    <td className="px-4 py-3 font-medium">#{totalExecutions - index}</td>
    <td className="px-4 py-3 text-right">{formatter.number(convertEvent.event?.beansConverted)}</td>
    <td className="px-4 py-3 text-right text-gray-500">
      {convertEvent.event.fromTokens.map((token) => tokenMap[getTokenIndex(token)]?.symbol).join(", ")}
    </td>
    <td className="px-4 py-3 text-right text-gray-500">
      {tokenMap[getTokenIndex(convertEvent.event.toToken)]?.symbol}
    </td>
    <td className="px-4 py-3 text-right text-gray-500">{shortenAddress(convertEvent.operator)}</td>
    <td className="px-4 py-3 text-right text-gray-500">
      {convertEvent.timestamp ? formatDate(convertEvent.timestamp) : `Block ${convertEvent.blockNumber}`}
    </td>
    <td className="px-4 py-3 text-right">
      <a
        href={`https://basescan.org/tx/${convertEvent.transactionHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-pinto-green-4 hover:underline text-sm"
      >
        View Transaction
      </a>
    </td>
  </tr>
);

export default function ConvertUpExecutionHistory({
  executionHistory: _executionHistory,
  orderData,
}: ExecutionHistoryProps) {
  const tokenMap = useTokenMap();

  // Type guard to ensure we have convert up order data
  if (orderData.type !== "convertUp") {
    throw new Error("ConvertUpExecutionHistory requires convertUp order data");
  }

  const convertData = orderData as ConvertUpOrderData;
  const executionEvents = cast(_executionHistory);

  // Memoize only the expensive calculations
  const totalBdvConverted = useMemo(
    () => executionEvents.reduce((acc, exec) => acc.add(exec.event.beansConverted), TV.ZERO),
    [executionEvents],
  );

  const totalExecutions = executionEvents.length;

  const averagePdvPerExecution = useMemo(
    () => (totalExecutions > 0 ? totalBdvConverted.div(totalExecutions) : TV.ZERO),
    [totalBdvConverted, totalExecutions],
  );

  const totalTipsPaid = useMemo(() => {
    const tipAmount = convertData.operatorTip ? TV.fromHuman(convertData.operatorTip, 6) : TV.ZERO;
    return tipAmount.mul(executionEvents.length);
  }, [convertData.operatorTip, executionEvents.length]);

  const sortedExecutionEvents = useMemo(
    () =>
      [...executionEvents].sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return b.timestamp - a.timestamp;
        }
        return b.blockNumber - a.blockNumber;
      }),
    [executionEvents],
  );

  if (executionEvents.length === 0) {
    return <div className="text-center text-gray-500 py-8">No executions</div>;
  }

  return (
    <div>
      {/* Enhanced Summary Section for ConvertUp */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-6">
        <SummaryCard label="Total PDV Converted" value={formatter.number(totalBdvConverted)} />
        <SummaryCard label="Total Executions" value={totalExecutions} />
        <SummaryCard label="Average PDV/Execution" value={formatter.number(averagePdvPerExecution)} />
        <SummaryCard label="Total Tips Paid" value={`${formatter.number(totalTipsPaid)} PINTO`} />
      </div>

      {/* Progress indicator */}
      <ProgressSection totalBdvConverted={totalBdvConverted} convertData={convertData} />

      {/* Execution Table */}
      <div className="overflow-x-auto max-h-[39rem] overflow-y-auto">
        <table className="relative w-full border-collapse">
          <thead className="sticky top-0">
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-gray-600 border-b">Execution</th>
              <th className="px-4 py-3 text-right text-gray-600 border-b">PDV Converted</th>
              <th className="px-4 py-3 text-right text-gray-600 border-b">From Token(s)</th>
              <th className="px-4 py-3 text-right text-gray-600 border-b">To Token</th>
              <th className="px-4 py-3 text-right text-gray-600 border-b">Operator</th>
              <th className="px-4 py-3 text-right text-gray-600 border-b min-w-[150px]">Date & Time</th>
              <th className="px-4 py-3 text-right text-gray-600 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExecutionEvents.map((convertEvent, index) => (
              <ExecutionTableRow
                key={index}
                convertEvent={convertEvent}
                index={index}
                totalExecutions={totalExecutions}
                tokenMap={tokenMap}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
