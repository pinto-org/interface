import { OrderVisualization } from "@/components/OrderVisualization";
import { useMainToken } from "@/state/useTokenData";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { AutomateClaimOrderData, TractorOrderVisualizationProps } from "../types";

/**
 * Visualizes decoded AutomateClaim order data in the Tractor orders panel.
 * Displays enabled operations (Mow, Plant, Harvest) and operator tip configuration.
 */
export function AutomateClaimVisualization({ orderData, className }: TractorOrderVisualizationProps) {
  const mainToken = useMainToken();

  if (orderData.type !== "automateClaim") {
    return null;
  }

  const claimData = orderData as AutomateClaimOrderData;

  const operations = [
    { label: "Mow", enabled: claimData.mowEnabled },
    { label: "Plant", enabled: claimData.plantEnabled },
    { label: "Harvest", enabled: claimData.harvestEnabled },
  ];

  const enabledOps = operations.filter((op) => op.enabled);

  return (
    <div className={`bg-pinto-gray-1 p-6 relative ${className || ""}`}>
      <div className="absolute inset-0 opacity-50">
        <div className="w-full h-full bg-dot-grid bg-[size:24px_24px] bg-[position:center]" />
      </div>

      <div className="z-10 relative">
        {/* Automate Claim Section */}
        <div className="flex items-center justify-center mb-4">
          <OrderVisualization.Container>
            <OrderVisualization.FlowVisualization
              steps={[
                { type: "action", content: "Automate Claim" },
                {
                  type: "context",
                  content: (
                    <span>
                      {enabledOps.length} operation{enabledOps.length !== 1 ? "s" : ""} enabled
                    </span>
                  ),
                },
              ]}
              size="sm"
            />
            <OrderVisualization.ConditionsList
              conditions={operations.map((op) => ({
                text: (
                  <span className="inline-flex items-center gap-1">
                    {op.enabled ? (
                      <CheckCircledIcon className="text-pinto-green-4 w-3.5 h-3.5" />
                    ) : (
                      <CrossCircledIcon className="text-pinto-gray-3 w-3.5 h-3.5" />
                    )}
                    <span className={op.enabled ? "text-pinto-green-4" : "text-pinto-gray-3"}>{op.label}</span>
                    <span>{op.enabled ? "enabled" : "disabled"}</span>
                  </span>
                ),
              }))}
              size="sm"
            />
          </OrderVisualization.Container>
        </div>

        {/* Tip Section */}
        <div className="flex items-center justify-center mt-8">
          <OrderVisualization.Container>
            <OrderVisualization.FlowVisualization
              steps={[
                { type: "action", content: "Tip" },
                {
                  type: "context",
                  content: (
                    <span className="text-pinto-green-4 inline-flex items-center">
                      {claimData.operatorTip} <img src={mainToken.logoURI} alt="PINTO" className="w-4 h-4 mx-1" />
                      PINTO
                    </span>
                  ),
                },
                { type: "context", content: "per execution to Operator" },
              ]}
              size="sm"
            />
          </OrderVisualization.Container>
        </div>
      </div>
    </div>
  );
}
