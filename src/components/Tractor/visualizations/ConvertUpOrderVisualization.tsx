import { OrderVisualization } from "@/components/OrderVisualization";
import { useMainToken } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { timeScaleToDisplay } from "@/utils/time";
import { TractorOrderVisualizationProps } from "../types";

export default function ConvertUpOrderVisualization({
  orderData: convertData,
  className,
}: TractorOrderVisualizationProps) {
  const mainToken = useMainToken();

  // Type guard to ensure we have convert up order data
  if (convertData.type !== "convertUp") {
    throw new Error("ConvertUpOrderVisualization requires convertUp order data");
  }

  return (
    <div className={`bg-gray-50 p-6 rounded-lg relative ${className || ""}`}>
      {/* Add the dot grid as a background element */}
      <div className="absolute inset-0 opacity-50">
        <div className="w-full h-full bg-dot-grid bg-[size:24px_24px] bg-[position:center]" />
      </div>

      <div className="z-10 relative">
        {/* Source Section */}
        <div className="flex items-center justify-center mb-4">
          <OrderVisualization.Container>
            <OrderVisualization.FlowVisualization
              steps={[
                { type: "action", content: "Withdraw Tokens" },
                {
                  type: "context",
                  content: <OrderVisualization.TractorTokenStrategyDisplay strategy={convertData.tokenStrategy} />,
                },
              ]}
              size="sm"
            />
            <OrderVisualization.ConditionsList
              conditions={[
                { text: <>Convert up to {formatter.number(convertData.totalConvertBdv)} PDV of deposited tokens</> },
              ]}
              size="sm"
            />
          </OrderVisualization.Container>
        </div>

        {/* Convert Conditions Section */}
        <div className="flex flex-col items-center mt-8">
          <OrderVisualization.Container>
            <OrderVisualization.FlowVisualization
              steps={[
                { type: "action", content: "Convert" },
                {
                  type: "context",
                  content: (
                    <span className="text-pinto-green-4">
                      {formatter.number(convertData.minConvertBdvPerExecution)}
                      {" - "}
                      {formatter.number(convertData.maxConvertBdvPerExecution)} PDV
                    </span>
                  ),
                },
              ]}
              size="sm"
            />
            <OrderVisualization.ConditionsList
              conditions={[
                {
                  text: (
                    <>
                      Execute when Price is between{" "}
                      <span className="text-pinto-green-4">{formatter.usd(convertData.minPriceToConvertUp)}</span>
                      {" - "}
                      <span className="text-pinto-green-4">{formatter.usd(convertData.maxPriceToConvertUp)}</span>
                    </>
                  ),
                },
                {
                  text: (
                    <>
                      Min Grown Stalk Bonus Per PDV exceeds{" "}
                      <span className="inline-flex gap-1 items-baseline">
                        <span className="text-pinto-green-4">{convertData.minGrownStalkPerBdvBonus}</span>
                      </span>
                    </>
                  ),
                  operator: "AND",
                },
                {
                  text: (
                    <>
                      Min Convert Bonus Capacity exceeds{" "}
                      <span className="text-pinto-green-4">{convertData.minConvertBonusCapacity} PDV</span>
                    </>
                  ),
                  operator: "AND",
                },
                {
                  text: (
                    <span className="font-light text-pinto-light">
                      Wait at least{" "}
                      <span className="text-pinto-green-4">
                        {timeScaleToDisplay(convertData.timeScale, convertData.minTimeBetweenConverts, { exact: true })}
                      </span>
                      {" between executions"}
                    </span>
                  ),
                  operator: "AND",
                },
              ]}
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
                    <div className="text-pinto-green-4 inline-flex items-center">
                      {convertData.operatorTip} <img src={mainToken.logoURI} alt="PINTO" className="w-4 h-4 mx-1" />
                      PINTO
                    </div>
                  ),
                },
                { type: "context", content: "to Operator" },
              ]}
              size="sm"
            />
          </OrderVisualization.Container>
        </div>
      </div>
    </div>
  );
}
