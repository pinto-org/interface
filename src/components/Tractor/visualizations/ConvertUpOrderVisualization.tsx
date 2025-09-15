import { OrderVisualization } from "@/components/OrderVisualization";
import IconImage from "@/components/ui/IconImage";
import { STALK } from "@/constants/internalTokens";
import { useMainToken } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { timeScaleToDisplay } from "@/utils/time";
import { TractorOrderVisualizationProps } from "../types";

export default function ConvertUpOrderVisualization({ orderData, className }: TractorOrderVisualizationProps) {
  const mainToken = useMainToken();

  // Type guard to ensure we have convert up order data
  if (orderData.type !== "convertUp") {
    throw new Error("ConvertUpOrderVisualization requires convertUp order data");
  }

  console.log("orderData", orderData);

  const convertData = orderData;

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
                {
                  text: (
                    <>
                      {formatter.number(convertData.minConvertBdvPerExecution)}-
                      {formatter.number(convertData.maxConvertBdvPerExecution)} PDV per execution
                    </>
                  ),
                },
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
                { type: "context", content: "When conditions are met" },
              ]}
              size="sm"
            />
            <OrderVisualization.ConditionsList
              conditions={[
                {
                  text: (
                    <>
                      Price between{" "}
                      <span className="text-pinto-green-4">{formatter.usd(convertData.minPriceToConvertUp)}</span>
                      {" - "}
                      <span className="text-pinto-green-4">{formatter.usd(convertData.maxPriceToConvertUp)}</span>
                    </>
                  ),
                },
                {
                  text: (
                    <>
                      Min Grown Stalk bonus{" "}
                      <span className="inline-flex gap-1 items-baseline">
                        <IconImage src={STALK.logoURI} size={3} alt={STALK.symbol} nudge={-1} />
                        <span className="text-pinto-green-4">{convertData.minGrownStalkPerBdvBonus}</span>
                      </span>
                      {" per PDV"}
                    </>
                  ),
                  operator: "AND",
                },
                {
                  text: (
                    <>
                      Min Grown Stalk bonus{" "}
                      <span className="inline-flex gap-1 items-baseline">
                        <IconImage src={STALK.logoURI} size={3} alt={STALK.symbol} nudge={-1} />
                        <span className="text-pinto-green-4">{convertData.minGrownStalkPerBdvBonus}</span>
                      </span>
                      {" per PDV"}
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
            {/* <OrderVisualization.TipDisplay amount={convertData.operatorTip} token="PINTO" icon={pintoIcon} /> */}
          </OrderVisualization.Container>
        </div>
      </div>
    </div>
  );
}
