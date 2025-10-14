import { OrderVisualization } from "@/components/OrderVisualization";
import IconImage from "@/components/ui/IconImage";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useGetTractorTokenStrategyWithBlueprint } from "@/hooks/tractor/useGetTractorTokenStrategy";
import { useMainToken } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { timeScaleToDisplay } from "@/utils/time";
import { getTokenIndex } from "@/utils/token";
import { TractorOrderVisualizationProps } from "../types";

export default function ConvertUpOrderVisualization({
  orderData: convertData,
  className,
}: TractorOrderVisualizationProps) {
  const mainToken = useMainToken();
  const tokenMap = useTokenMap();

  const getStrategyProps = useGetTractorTokenStrategyWithBlueprint();

  // Type guard to ensure we have convert up order data
  if (convertData.type !== "convertUp") {
    throw new Error("ConvertUpOrderVisualization requires convertUp order data");
  }

  const getTokenStrategyText = () => {
    if (!convertData.sourceTokenIndices) return "Tokens";
    const ts = getStrategyProps.getTokenStrategy({ sourceTokenIndices: convertData.sourceTokenIndices });

    if (ts?.type === "LOWEST_PRICE") {
      return "Token with Best Price";
    }
    if (ts?.type === "LOWEST_SEEDS") {
      return "Token with Least Seeds";
    }

    const mapped = ts?.addresses?.map((adr) => tokenMap[getTokenIndex(adr)].symbol).join(", ");
    return mapped;
  };

  return (
    <div className={`bg-gray-50 p-6 relative ${className || ""}`}>
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
                { type: "action", content: "Convert" },
                {
                  type: "amount",
                  content: (
                    <>
                      {/* <span className="text-pinto-gray-4 text-sm font-thin whitespace-nowrap"></span> */}
                      <IconImage src={mainToken.logoURI} size={4} />
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                        <span className="text-pinto-green-4">
                          {formatter.number(convertData.totalBeanAmountToConvert)} PDV
                        </span>
                        <span className="text-box bg-transparent">
                          {" "}
                          ({formatter.number(convertData.minBeansConvertPerExecution)}
                          {" - "}
                          {formatter.number(convertData.maxBeansConvertPerExecution)} PDV per execution)
                        </span>
                      </span>
                    </>
                  ),
                },
                {
                  type: "context",
                  content: <>into {mainToken.symbol}</>,
                },
              ]}
              size="sm"
            />
            <OrderVisualization.ConditionsList
              conditions={[
                {
                  text: <>Using Deposited {getTokenStrategyText()}</>,
                },
                {
                  text: (
                    <>
                      Execute when Price is between{" "}
                      <span className="text-pinto-green-4">
                        ${formatter.number(convertData.minPriceToConvertUp, { maxDecimals: 3 })}
                      </span>
                      {" - "}
                      <span className="text-pinto-green-4">
                        ${formatter.number(convertData.maxPriceToConvertUp, { maxDecimals: 3 })}
                      </span>
                    </>
                  ),
                },
                {
                  text: (
                    <>
                      Min Grown Stalk Bonus Per PDV exceeds{" "}
                      <span className="inline-flex gap-1 items-baseline">
                        <span className="text-pinto-green-4">{convertData.grownStalkPerBdvBonusBid}</span>
                      </span>
                    </>
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
