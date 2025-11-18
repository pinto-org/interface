import pintoIcon from "@/assets/tokens/PINTO.png";
import { formatter } from "@/utils/format";
import { CornerBottomLeftIcon } from "@radix-ui/react-icons";
import { SowOrderData, TractorOrderVisualizationProps } from "../types";

export default function SowOrderVisualization({ orderData, className }: TractorOrderVisualizationProps) {
  // Type guard to ensure we have sow order data
  if (orderData.type !== "sow") {
    throw new Error("SowOrderVisualization requires sow order data");
  }

  const sowData = orderData as SowOrderData;

  return (
    <div className={`bg-gray-50 p-6 rounded-lg relative ${className || ""}`}>
      {/* Add the dot grid as a background element */}
      <div className="absolute inset-0 opacity-50">
        <div className="w-full h-full bg-dot-grid bg-[size:24px_24px] bg-[position:center]" />
      </div>

      <div className="z-10 relative">
        {/* Withdraw Section */}

        <div className="flex items-center justify-center mb-4">
          <div className="bg-white rounded-xl px-2 py-2 shadow-sm flex flex-col gap-2 border border-gray-200">
            <div className="flex items-center gap-0">
              <div className="bg-pinto-green-4 text-white px-3 py-0.5 rounded-full">Withdraw</div>
              <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />

              <span className="text-box rounded-full">
                <span>Deposited Tokens</span>
              </span>
              <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />
              <span className="text-box rounded-full flex items-center">
                <span>as</span>
                <img src={pintoIcon} alt="PINTO" className="w-5 h-5 mx-1" />
                <span className="font-medium">PINTO</span>
              </span>
            </div>

            <div className="text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                <span className="font-light text-[#9C9C9C]">
                  Withdraw Deposited Tokens from the Silo with{" "}
                  {sowData.tokenStrategy?.type === "LOWEST_SEEDS"
                    ? "the Lowest Seeds"
                    : sowData.tokenStrategy?.type === "LOWEST_PRICE"
                      ? "the Best Price"
                      : sowData.tokenSymbol || "Selected Token"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sow Section */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="bg-white rounded-xl px-2 py-2 shadow-sm border border-gray-200">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-0">
                <div className="bg-pinto-green-4 text-white px-3 py-0.5 rounded-full">Sow</div>
                <div className="border-t-2 border-gray-300 w-3 flex-shrink-0" />
                <span className="text-box rounded-full inline-flex items-center">
                  <span>up to</span>&nbsp;<span className="text-pinto-green-4">{sowData.totalAmount}</span>
                  &nbsp;
                  <span className="text-pinto-green-4 inline-flex items-center">
                    <img src={pintoIcon} alt="PINTO" className="w-4 h-4 mx-1" />
                    PINTO
                  </span>
                </span>
              </div>
              <ul className="list-none space-y-1">
                <li className="flex items-center gap-2">
                  <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                  <span className="font-light text-[#9C9C9C]">
                    Execute when Temperature is at least{" "}
                    <span className="text-pinto-green-4">{sowData.temperature}</span>
                    <span className="text-pinto-green-4">%</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                  <span className="font-light text-[#9C9C9C]">
                    AND when Pod Line Length is at most{" "}
                    <span className="text-pinto-green-4">
                      {typeof sowData.maxPodLine === "string" && sowData.maxPodLine.includes(".")
                        ? formatter.number(parseFloat(sowData.maxPodLine.replace(/,/g, "")), {
                            maxDecimals: 0,
                          })
                        : formatter.number(sowData.maxPodLine, { maxDecimals: 0 })}
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                  <span className="font-light text-[#9C9C9C]">
                    AND when Available Soil is at least <span className="text-pinto-green-4">{sowData.minSoil}</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CornerBottomLeftIcon className="text-gray-300 ml-4" />
                  <span className="font-light text-[#9C9C9C]">
                    AND {sowData.morningAuction ? "during" : "after"} the Morning Auction
                  </span>
                </li>
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
                {sowData.operatorTip} <img src={pintoIcon} alt="PINTO" className="w-4 h-4 mx-1" />
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

/* <div className="flex items-center justify-center mb-4">
          <LinkedVisualization
            // className="flex items-center justify-center mb-4"
            nodes={[
              { isStart: true, content: "Withdraw" },
              { content: "Deposited Tokens" },
              {
                content: (
                  <>
                    <span>as</span>
                    <img src={pintoIcon} alt="PINTO" className="w-5 h-5 mx-1" />
                    <span className="font-medium">PINTO</span>
                  </>
                ),
              },
            ]}
            conditions={[
              <>
                <span>
                  Withdraw Deposited Tokens from the Silo with{" "}
                  {sowData.tokenStrategy?.type === "LOWEST_SEEDS"
                    ? "the Lowest Seeds"
                    : sowData.tokenStrategy?.type === "LOWEST_PRICE"
                      ? "the Best Price"
                      : sowData.tokenSymbol || "Selected Tokens"}
                </span>
              </>
            ]}
          />
        </div> */
