import { type BlueprintType, decodeBlueprintCallData } from "@/lib/Tractor/blueprint-decoders";
import { safeJSONParse } from "@/utils/utils";

interface HighlightedCallDataProps {
  blueprintData: `0x${string}`;
  targetData: string;
  className?: string;
  decodeAbi?: boolean;
  isRequisitionData?: boolean;
  encodedData?: `0x${string}` | null;
  blueprintType?: BlueprintType;
}

function SowBlueprintDisplay({ params }: { params: any }) {
  return (
    <div className="space-y-2">
      <div className="text-gray-500">Function: sowBlueprintv0</div>
      <div className="pl-4 space-y-1 text-gray-600">
        <div>sourceTokenIndices: [{params.sowParams.sourceTokenIndices.join(", ")}]</div>
        <div>
          sowAmounts:
          <div className="pl-4">
            <div>totalAmountToSow: {params.sowParams.sowAmounts.totalAmountToSow.toString()}</div>
            <div>minAmountToSowPerSeason: {params.sowParams.sowAmounts.minAmountToSowPerSeason.toString()}</div>
            <div>maxAmountToSowPerSeason: {params.sowParams.sowAmounts.maxAmountToSowPerSeason.toString()}</div>
          </div>
        </div>
        <div>minTemp: {params.sowParams.minTemp.toString()}</div>
        <div>maxPodlineLength: {params.sowParams.maxPodlineLength.toString()}</div>
        <div>maxGrownStalkPerBdv: {params.sowParams.maxGrownStalkPerBdv.toString()}</div>
        <div>runBlocksAfterSunrise: {params.sowParams.runBlocksAfterSunrise.toString()}</div>
        <div>
          operatorParams:
          <div className="pl-4">
            <div>operatorTipAmount: {params.opParams.operatorTipAmount.toString()}</div>
            <div>tipAddress: {params.opParams.tipAddress}</div>
            <div>whitelistedOperators: [{params.opParams.whitelistedOperators.join(", ")}]</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConvertUpBlueprintDisplay({ params }: { params: any }) {
  return (
    <div className="space-y-2">
      <div className="text-gray-500">Function: convertUpBlueprint</div>
      <div className="pl-4 space-y-1 text-gray-600">
        <div>sourceTokenIndices: [{params.convertUpParams.sourceTokenIndices.join(", ")}]</div>
        <div>totalConvertBdv: {params.convertUpParams.totalConvertBdv.toString()}</div>
        <div>minConvertBdvPerExecution: {params.convertUpParams.minConvertBdvPerExecution.toString()}</div>
        <div>maxConvertBdvPerExecution: {params.convertUpParams.maxConvertBdvPerExecution.toString()}</div>
        <div>minTimeBetweenConverts: {params.convertUpParams.minTimeBetweenConverts.toString()}</div>
        <div>minConvertBonusCapacity: {params.convertUpParams.minConvertBonusCapacity.toString()}</div>
        <div>maxGrownStalkPerBdv: {params.convertUpParams.maxGrownStalkPerBdv.toString()}</div>
        <div>minGrownStalkPerBdvBonus: {params.convertUpParams.minGrownStalkPerBdvBonus.toString()}</div>
        <div>maxPriceToConvertUp: {params.convertUpParams.maxPriceToConvertUp.toString()}</div>
        <div>minPriceToConvertUp: {params.convertUpParams.minPriceToConvertUp.toString()}</div>
        <div>maxGrownStalkPerBdvPenalty: {params.convertUpParams.maxGrownStalkPerBdvPenalty.toString()}</div>
        <div>slippageRatio: {params.convertUpParams.slippageRatio.toString()}</div>
        <div>lowStalkDeposits: {params.convertUpParams.lowStalkDeposits.toString()}</div>
        <div>
          operatorParams:
          <div className="pl-4">
            <div>operatorTipAmount: {params.opParams.operatorTipAmount.toString()}</div>
            <div>tipAddress: {params.opParams.tipAddress}</div>
            <div>whitelistedOperators: [{params.opParams.whitelistedOperators.join(", ")}]</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericParameterDisplay({
  selector,
  data,
  functionAbi,
}: { selector: string; data: string; functionAbi: any }) {
  if (!functionAbi || functionAbi.type !== "function" || !functionAbi.inputs) {
    return (
      <div>
        <div className="text-gray-500">Selector: {selector}</div>
        <div className="text-gray-500">Raw Data: {data}</div>
      </div>
    );
  }

  // For advancedFarm, show structured data
  if (selector === "0x36bfafbd") {
    return (
      <div>
        <div className="text-gray-500">
          Selector: {selector} ({functionAbi.name})
        </div>
        <div className="text-gray-500">Raw Data: {data}</div>
      </div>
    );
  }

  // Regular parameter decoding for other functions
  return (
    <div>
      <div className="text-gray-500">Selector: {selector}</div>
      <div className="space-y-1">
        {functionAbi.inputs.map((input: any, index: number) => {
          const value = data.slice(index * 64, (index + 1) * 64);
          let displayValue = `0x${value}`;

          // Special handling for token addresses in transferToken
          if (functionAbi.name === "transferToken" && index === 0) {
            displayValue = `0x${value.slice(24)}`; // Extract last 40 chars for address
          }

          return (
            <div key={index} className="text-gray-500">
              {input.name} ({input.type}): {displayValue}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RequisitionDataDisplay({
  targetData,
  decodeAbi,
  className,
}: { targetData: string; decodeAbi: boolean; className: string }) {
  try {
    // If it's JSON data, try to parse and format it
    const jsonData = safeJSONParse(targetData, {});
    const formattedJson = JSON.stringify(jsonData, null, 2);

    return (
      <div className={className}>
        <pre>{formattedJson}</pre>
      </div>
    );
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    // If parsing fails, fall back to the original display
    return <div className={className}>{targetData}</div>;
  }
}

const knownBlueprintTypes = new Set(["sow", "convertUp"]);

export function HighlightedCallData({
  blueprintData,
  targetData,
  className = "",
  decodeAbi = false,
  isRequisitionData = false,
  encodedData,
  blueprintType: _blueprintType = "auto",
}: HighlightedCallDataProps) {
  const blueprintType = knownBlueprintTypes.has(_blueprintType) ? _blueprintType : "auto";
  // Handle requisition data display
  if (isRequisitionData) {
    return <RequisitionDataDisplay targetData={targetData} decodeAbi={decodeAbi} className={className} />;
  }

  // Handle blueprint decoding when specifically requested or in decode mode
  if (blueprintType !== "auto" || decodeAbi) {
    const decodedResult = decodeBlueprintCallData(blueprintData);

    if (decodedResult) {
      if (decodeAbi) {
        const displayContent = () => {
          switch (decodedResult.type) {
            case "sow":
              return <SowBlueprintDisplay params={decodedResult.params} />;
            case "convertUp":
              return <ConvertUpBlueprintDisplay params={decodedResult.params} />;
            case "generic":
              return (
                <GenericParameterDisplay
                  selector={decodedResult.params.selector}
                  data={decodedResult.params.data}
                  functionAbi={decodedResult.params.functionAbi}
                />
              );
            default:
              return <div className="text-gray-500">Unknown blueprint type</div>;
          }
        };

        return (
          <div className={className}>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">{decodedResult.functionName} call:</div>
                <div className="text-gray-500">{displayContent()}</div>
              </div>
            </div>
          </div>
        );
      }

      return <div className={className}>{targetData}</div>;
    }
  }

  // Fallback to target data
  return <div className={className}>{targetData}</div>;
}
