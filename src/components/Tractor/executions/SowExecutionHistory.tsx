import { TokenValue } from "@/classes/TokenValue";
import { formatter } from "@/utils/format";
import { format } from "date-fns";
import { ExecutionHistoryProps, SowOrderData } from "../types";

// Helper function to shorten addresses
function shortenAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export default function SowExecutionHistory({ executionHistory, orderData }: ExecutionHistoryProps) {
  // Type guard to ensure we have sow order data
  if (orderData.type !== "sow") {
    throw new Error("SowExecutionHistory requires sow order data");
  }

  const sowData = orderData as SowOrderData;

  // Helper function to format dates with time
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Unknown";
    return format(new Date(timestamp), "MM/dd/yyyy h:mm a");
  };

  // Calculate total results from execution history
  const totalBeansSpent = executionHistory.reduce((acc, exec) => {
    if (exec.sowEvent) {
      return acc.add(exec.sowEvent.beans);
    }
    return acc;
  }, TokenValue.ZERO);

  const totalPodsReceived = executionHistory.reduce((acc, exec) => {
    if (exec.sowEvent) {
      return acc.add(exec.sowEvent.pods);
    }
    return acc;
  }, TokenValue.ZERO);

  const averagePodsPerBean = totalBeansSpent.gt(0) ? totalPodsReceived.div(totalBeansSpent) : TokenValue.ZERO;

  if (executionHistory.length === 0) {
    return <div className="text-center text-gray-500 py-8">No executions yet</div>;
  }

  return (
    <div>
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
          <span className="text-xl font-medium mt-3">{formatter.number(averagePodsPerBean.mul(100))}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Total Tips Paid</span>
          <span className="text-xl font-medium mt-3">
            {(() => {
              // Get tip amount from order data
              const tipAmount = sowData.operatorTip ? TokenValue.fromHuman(sowData.operatorTip, 6) : TokenValue.ZERO;
              // Calculate total tips paid
              const totalTipsPaid = tipAmount.mul(executionHistory.length);
              return formatter.number(totalTipsPaid);
            })()} PINTO
          </span>
        </div>
      </div>

      {/* Existing Table */}
      <div className="overflow-x-auto max-h-[39rem] overflow-y-auto">
        <table className="relative w-full border-collapse">
          <thead className="sticky top-0">
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
                  execution.sowEvent && execution.sowEvent.beans.gt(0)
                    ? execution.sowEvent.pods
                        .div(execution.sowEvent.beans)
                        .mul(100) // Convert to percentage
                    : TokenValue.ZERO;

                return (
                  <tr key={index} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-3 font-medium">#{executionHistory.length - index}</td>
                    <td className="px-4 py-3 text-right">
                      {execution.sowEvent ? formatter.number(execution.sowEvent.beans) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {execution.sowEvent ? formatter.number(execution.sowEvent.pods) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {execution.sowEvent && execution.sowEvent.beans.gt(0) ? `${formatter.number(temperature)}%` : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">{shortenAddress(execution.operator)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {execution.timestamp ? formatDate(execution.timestamp) : `Block ${execution.blockNumber}`}
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
    </div>
  );
}
