import pintoIcon from "@/assets/tokens/PINTO.png";
import { Row } from "@/components/Container";
import IconImage from "@/components/ui/IconImage";
import { STALK } from "@/constants/internalTokens";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { tractorTokenStrategyUtil as StrategyUtil } from "@/lib/Tractor";
import { formatter } from "@/utils/format";
import { getTokenIndex } from "@/utils/token";
import { CornerBottomLeftIcon } from "@radix-ui/react-icons";
import { ConvertUpOrderData, OrderVisualizationProps } from "../types";

export default function ConvertUpOrderVisualization({ orderData, className }: OrderVisualizationProps) {
  // Type guard to ensure we have convert up order data
  if (orderData.type !== "convertUp") {
    throw new Error("ConvertUpOrderVisualization requires convertUp order data");
  }

  const convertData = orderData as ConvertUpOrderData;
  const tokenMap = useTokenMap();

  const getTimeScaleDisplay = () => {
    const timeScale = convertData.timeScale;
    switch (timeScale) {
      case "SECONDS":
        return "seconds";
      case "MINUTES":
        return "minutes";
      case "HOURS":
        return "hours";
      default:
        return "days";
    }
  };

  const renderTokenStrategy = () => {
    // For ConvertUp, we don't have tokenStrategy in the data currently, so we'll default to a generic display
    const strategy = { type: "LOWEST_SEEDS" as const }; // Default strategy
    const summary = StrategyUtil.getSummary(strategy);

    if (summary.isLowestPrice) return "Token with Best Price";
    if (summary.isLowestSeeds) return "Token with Least Seeds";

    const addresses = summary.addresses ?? [];

    if ((summary.isMulti || summary.isSingle) && !!addresses.length) {
      return (
        <Row className="gap-1 items-center">
          {addresses.slice(0, 3).map((adr, index) => {
            const tk = tokenMap[getTokenIndex(adr)];
            return (
              <Row key={`${adr}-selected-token-strategy`} className="gap-1 items-center">
                <IconImage src={tk.logoURI} size={4} alt={tk.symbol} />
                <div className="pinto-sm font-normal">{tk.symbol}</div>
                {index < Math.min(addresses.length - 1, 2) && <span>,</span>}
              </Row>
            );
          })}
          {addresses.length > 3 && <span className="text-sm text-gray-500">+{addresses.length - 3} more</span>}
        </Row>
      );
    }

    return "Selected Tokens";
  };

  return (
    <div className={`bg-gray-50 p-6 rounded-lg relative ${className || ""}`}>
      {/* Add the dot grid as a background element */}
      <div className="absolute inset-0 opacity-50">
        <div className="w-full h-full bg-dot-grid bg-[size:24px_24px] bg-[position:center]" />
      </div>

      <div className="z-10 relative">
        {/* Source Section */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white rounded-xl px-2 py-2 shadow-sm flex flex-col gap-2 border border-gray-200">
            <div className="flex items-center gap-0">
              <div className="bg-pinto-green-4 text-white px-3 py-0.5 rounded-full">Source</div>
              <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />
              <span className="text-box rounded-full">{renderTokenStrategy()}</span>
            </div>
            <div className="text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                <span className="font-light text-pinto-gray-4">
                  Convert up to <span className="text-pinto-green-4">{convertData.totalConvertBdv} PDV</span> of
                  deposited tokens
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Convert Conditions Section */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="bg-white rounded-xl px-2 py-2 shadow-sm border border-gray-200">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-0">
                <div className="bg-pinto-green-4 text-white px-3 py-0.5 rounded-full">Convert</div>
                <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />
                <span className="text-box rounded-full inline-flex items-center">
                  <span>when conditions are met</span>
                </span>
              </div>
              <ul className="list-none space-y-1">
                <li className="flex items-center gap-2">
                  <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                  <span className="font-light text-pinto-gray-4">
                    Price between <span className="text-pinto-green-4">${convertData.minPriceToConvertUp}</span>
                    {" - "}
                    <span className="text-pinto-green-4">${convertData.maxPriceToConvertUp}</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                  <span className="font-light text-[#9C9C9C]">
                    Execute{" "}
                    <span className="text-pinto-green-4">
                      {formatter.twoDec(convertData.minConvertBdvPerExecution)}
                    </span>
                    {" - "}
                    <span className="text-pinto-green-4">
                      {formatter.twoDec(convertData.maxConvertBdvPerExecution)} PDV
                    </span>
                    {" per execution"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                  <span className="font-light text-[#9C9C9C]">
                    Min grown stalk bonus{" "}
                    <Row className="gap-1 items-center inline-flex">
                      <IconImage src={STALK.logoURI} size={3} alt={STALK.symbol} />
                      <span className="text-pinto-green-4">{convertData.minGrownStalkPerBdvBonus}</span>
                    </Row>
                    {" per PDV"}
                  </span>
                </li>
                {convertData.minTimeBetweenConverts !== "0" && (
                  <li className="flex items-center gap-2">
                    <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                    <span className="font-light text-[#9C9C9C]">
                      Wait at least{" "}
                      <span className="text-pinto-green-4">
                        {formatter.noDec(convertData.minTimeBetweenConverts)} {getTimeScaleDisplay()}
                      </span>
                      {" between executions"}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Tip Section */}
        <div className="flex items-center justify-center mt-8">
          <div className="bg-white rounded-xl px-2 py-2 shadow-sm flex items-center gap-0 border border-gray-200">
            <div className="bg-pinto-green-4 text-white px-3 py-0.5 rounded-full">Tip</div>
            <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />
            <span className="text-box rounded-full">
              <span className="text-pinto-green-4 inline-flex items-center">
                {convertData.operatorTip} <img src={pintoIcon} alt="PINTO" className="w-4 h-4 mx-1" />
                PINTO
              </span>
            </span>
            <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />
            <span className="text-box rounded-full">to Operator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
