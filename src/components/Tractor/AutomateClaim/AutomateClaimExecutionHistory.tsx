import { TokenValue } from "@/classes/TokenValue";
import { formatter } from "@/utils/format";
import { truncateAddress } from "@/utils/string";
import { useMemo } from "react";
import { useChainId, useConfig } from "wagmi";
import { AutomateClaimOrderData, ExecutionHistoryProps } from "../types";

export function AutomateClaimExecutionHistory({ executionHistory, orderData }: ExecutionHistoryProps) {
  const config = useConfig();
  const chainId = useChainId();
  const blockExplorerUrl =
    config.chains.find((chain) => chain.id === chainId)?.blockExplorers?.default.url ?? "https://basescan.org";

  const enabledOps = useMemo(() => {
    if (orderData.type !== "automateClaim") return [];
    const claimData = orderData as AutomateClaimOrderData;
    const ops: string[] = [];
    if (claimData.mowEnabled) ops.push("Mow");
    if (claimData.plantEnabled) ops.push("Plant");
    if (claimData.harvestEnabled) ops.push("Harvest");
    return ops;
  }, [orderData]);

  const totalTipsPaid = useMemo(() => {
    if (orderData.type !== "automateClaim") return TokenValue.ZERO;
    const claimData = orderData as AutomateClaimOrderData;
    const tipAmount = claimData.operatorTip ? TokenValue.fromHuman(claimData.operatorTip, 6) : TokenValue.ZERO;
    return tipAmount.mul(executionHistory.length);
  }, [orderData, executionHistory.length]);

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

  if (orderData.type !== "automateClaim") {
    return null;
  }

  if (executionHistory.length === 0) {
    return <div className="text-center text-pinto-secondary py-8">No executions yet</div>;
  }

  return (
    <div>
      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-6">
        <div className="flex flex-col">
          <span className="text-sm text-pinto-secondary">Total Executions</span>
          <span className="text-xl font-medium mt-3">{executionHistory.length}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-pinto-secondary">Enabled Operations</span>
          <span className="text-xl font-medium mt-3">{enabledOps.join(", ") || "None"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-pinto-secondary">Total Tips Paid</span>
          <span className="text-xl font-medium mt-3">{formatter.number(totalTipsPaid)} PINTO</span>
        </div>
      </div>

      {/* Execution Table */}
      <div className="overflow-x-auto max-h-[39rem] overflow-y-auto">
        <table className="relative w-full border-collapse">
          <thead className="sticky top-0">
            <tr className="bg-pinto-gray-1">
              <th className="px-4 py-3 text-left text-pinto-secondary border-b">Execution</th>
              <th className="px-4 py-3 text-right text-pinto-secondary border-b">Operator</th>
              <th className="px-4 py-3 text-right text-pinto-secondary border-b min-w-[150px]">Date & Time</th>
              <th className="px-4 py-3 text-right text-pinto-secondary border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExecutions.map((execution, index) => (
              <tr key={execution.transactionHash} className="hover:bg-pinto-gray-1 border-b">
                <td className="px-4 py-3 font-medium">#{executionHistory.length - index}</td>
                <td className="px-4 py-3 text-right text-pinto-secondary">
                  {truncateAddress(execution.operator, { suffix: true })}
                </td>
                <td className="px-4 py-3 text-right text-pinto-secondary">
                  {execution.timestamp ? formatter.dateFromTS(execution.timestamp) : `Block ${execution.blockNumber}`}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`${blockExplorerUrl}/tx/${execution.transactionHash}`}
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
