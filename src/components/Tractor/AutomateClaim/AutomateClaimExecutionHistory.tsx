import { TV } from "@/classes/TokenValue";
import { formatter } from "@/utils/format";
import { truncateAddress } from "@/utils/string";
import { useMemo } from "react";
import { AutomateClaimOrderData, ExecutionHistoryProps } from "../types";

export function AutomateClaimExecutionHistory({ executionHistory, orderData }: ExecutionHistoryProps) {
  if (orderData.type !== "automateClaim") {
    throw new Error("AutomateClaimExecutionHistory requires automateClaim order data");
  }

  const claimData = orderData as AutomateClaimOrderData;

  const enabledOps = useMemo(() => {
    const ops: string[] = [];
    if (claimData.mowEnabled) ops.push("Mow");
    if (claimData.plantEnabled) ops.push("Plant");
    if (claimData.harvestEnabled) ops.push("Harvest");
    return ops;
  }, [claimData.mowEnabled, claimData.plantEnabled, claimData.harvestEnabled]);

  const totalTipsPaid = useMemo(() => {
    const tipAmount = claimData.operatorTip ? TV.fromHuman(claimData.operatorTip, 6) : TV.ZERO;
    return tipAmount.mul(executionHistory.length);
  }, [claimData.operatorTip, executionHistory.length]);

  const sortedExecutions = useMemo(
    () =>
      [...executionHistory].sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return b.timestamp - a.timestamp;
        }
        return b.blockNumber - a.blockNumber;
      }),
    [executionHistory],
  );

  if (executionHistory.length === 0) {
    return <div className="text-center text-gray-500 py-8">No executions yet</div>;
  }

  return (
    <div>
      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-6">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Total Executions</span>
          <span className="text-xl font-medium mt-3">{executionHistory.length}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Enabled Operations</span>
          <span className="text-xl font-medium mt-3">{enabledOps.join(", ") || "None"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Total Tips Paid</span>
          <span className="text-xl font-medium mt-3">{formatter.number(totalTipsPaid)} PINTO</span>
        </div>
      </div>

      {/* Execution Table */}
      <div className="overflow-x-auto max-h-[39rem] overflow-y-auto">
        <table className="relative w-full border-collapse">
          <thead className="sticky top-0">
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-gray-600 border-b">Execution</th>
              <th className="px-4 py-3 text-right text-gray-600 border-b">Operator</th>
              <th className="px-4 py-3 text-right text-gray-600 border-b min-w-[150px]">Date & Time</th>
              <th className="px-4 py-3 text-right text-gray-600 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExecutions.map((execution, index) => (
              <tr key={index} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-3 font-medium">#{executionHistory.length - index}</td>
                <td className="px-4 py-3 text-right text-gray-500">
                  {truncateAddress(execution.operator, { suffix: true })}
                </td>
                <td className="px-4 py-3 text-right text-gray-500">
                  {execution.timestamp ? formatter.dateFromTS(execution.timestamp) : `Block ${execution.blockNumber}`}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
