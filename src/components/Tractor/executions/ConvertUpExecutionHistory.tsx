import { TV } from "@/classes/TokenValue";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { PublisherTractorExecution } from "@/lib/Tractor";
import { formatter } from "@/utils/format";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { format } from "date-fns";
import { useMemo } from "react";
import { ConvertUpExecutionEvent, ConvertUpOrderData, ExecutionData, ExecutionHistoryProps } from "../types";

// Helper function to shorten addresses
function shortenAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

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
  const executionEvents = _executionHistory as PublisherTractorExecution<TV, Token, "convertUp">[];

  // Helper function to format dates with time
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Unknown";
    return format(new Date(timestamp), "MM/dd/yyyy h:mm a");
  };

  // Calculate total results from execution history for convert up
  const totalBdvConverted = executionEvents.reduce((acc, exec) => acc.add(exec.event.beansConverted), TV.ZERO);

  const totalExecutions = executionEvents.length;

  if (executionEvents.length === 0) {
    return <div className="text-center text-gray-500 py-8">No executions yet</div>;
  }

  console.log("[ConvertUpExecutionHistory] executionEvents", executionEvents);

  return (
    <div>
      {/* Enhanced Summary Section for ConvertUp */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-6">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Total PDV Converted</span>
          <span className="text-xl font-medium mt-3">{formatter.number(totalBdvConverted)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Total Executions</span>
          <span className="text-xl font-medium mt-3">{totalExecutions}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Average PDV/Execution</span>
          <span className="text-xl font-medium mt-3">
            {totalExecutions > 0 ? formatter.number(totalBdvConverted.div(totalExecutions)) : "0"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Total Tips Paid</span>
          <span className="text-xl font-medium mt-3">
            {(() => {
              // Get tip amount from order data
              const tipAmount = convertData.operatorTip ? TV.fromHuman(convertData.operatorTip, 6) : TV.ZERO;
              // Calculate total tips paid
              const totalTipsPaid = tipAmount.mul(executionEvents.length);
              return formatter.number(totalTipsPaid);
            })()} PINTO
          </span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="px-6 mb-4">
        {(() => {
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
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Progress</span>
                <span className="text-sm text-gray-500">
                  {formatter.number(totalBdvConverted)} / {convertData.totalBeanAmountToConvert} PDV converted (
                  {Math.round(percentCompleteNumber)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${isComplete ? "bg-pinto-green-4" : "bg-pinto-green-4"}`}
                  style={{ width: `${percentCompleteNumber}%` }}
                />
              </div>

              {isComplete && (
                <div className="mt-3 py-2 bg-pinto-green-1 rounded-lg border border-pinto-green-4 text-pinto-green-4 text-center font-medium">
                  Order Completed!
                </div>
              )}
            </div>
          );
        })()}
      </div>

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
            {executionEvents
              .sort((a, b) => {
                // If timestamps are available, use those for sorting
                if (a.timestamp && b.timestamp) {
                  return b.timestamp - a.timestamp;
                }
                // Otherwise fall back to block numbers
                return b.blockNumber - a.blockNumber;
              })
              .map((_convertEvent, index) => {
                const convertEvent = _convertEvent;
                // For ConvertUp executions, we'd extract convert-specific data

                return (
                  <tr key={index} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-3 font-medium">#{executionEvents.length - index}</td>
                    <td className="px-4 py-3 text-right">
                      {convertEvent ? formatter.number(convertEvent.event?.beansConverted) : "0 PDV"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {convertEvent
                        ? convertEvent.event.fromTokens
                            .map((token) => tokenMap[getTokenIndex(token)]?.symbol)
                            .join(", ")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {convertEvent ? tokenMap[getTokenIndex(convertEvent.event.toToken)]?.symbol : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">{shortenAddress(convertEvent.operator)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {convertEvent.timestamp
                        ? formatDate(convertEvent.timestamp)
                        : `Block ${convertEvent.blockNumber}`}
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
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
