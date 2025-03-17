import { decodeFunctionData, keccak256, toHex } from "viem";
import { beanstalkAbi } from "@/generated/contractHooks";
import { sowBlueprintv0ABI } from "@/constants/abi/SowBlueprintv0ABI";

// Define the function selector as a named constant
const SOW_BLUEPRINT_V0_SELECTOR = "0x1e08d5c0";

interface HighlightedCallDataProps {
  blueprintData: `0x${string}`;
  targetData: string;
  className?: string;
  decodeAbi?: boolean;
  isRequisitionData?: boolean;
  encodedData?: `0x${string}` | null;
  showSowBlueprintParams?: boolean;
}

export function decodeCallData(callData: string) {
  const selector = callData.slice(0, 10);
  const data = callData.slice(10);

  console.log("Function selector:", selector);
  console.log("sowBlueprintv0Selector:", SOW_BLUEPRINT_V0_SELECTOR);

  // For sowBlueprintv0, show decoded parameters
  if (selector === SOW_BLUEPRINT_V0_SELECTOR) {
    console.log("Decoding sowBlueprintv0 data");

    try {
      // Try to decode using the ABI
      const decoded = decodeFunctionData({
        abi: sowBlueprintv0ABI,
        data: callData as `0x${string}`,
      });

      console.log("Decoded sowBlueprintv0:", decoded);

      if (decoded.functionName === "sowBlueprintv0" && decoded.args[0]) {
        const params = decoded.args[0];
        return (
          <div className="space-y-2">
            <div className="text-gray-500">Function: sowBlueprintv0</div>
            <div className="pl-4 space-y-1 text-gray-600">
              <div>
                sourceTokenIndices: [
                {params.sowParams.sourceTokenIndices.join(", ")}]
              </div>
              <div>
                sowAmounts:
                <div className="pl-4">
                  <div>
                    totalAmountToSow:{" "}
                    {params.sowParams.sowAmounts.totalAmountToSow.toString()}
                  </div>
                  <div>
                    minAmountToSowPerSeason:{" "}
                    {params.sowParams.sowAmounts.minAmountToSowPerSeason.toString()}
                  </div>
                  <div>
                    maxAmountToSowPerSeason:{" "}
                    {params.sowParams.sowAmounts.maxAmountToSowPerSeason.toString()}
                  </div>
                </div>
              </div>
              <div>minTemp: {params.sowParams.minTemp.toString()}</div>
              <div>
                maxPodlineLength: {params.sowParams.maxPodlineLength.toString()}
              </div>
              <div>
                maxGrownStalkPerBdv:{" "}
                {params.sowParams.maxGrownStalkPerBdv.toString()}
              </div>
              <div>
                runBlocksAfterSunrise:{" "}
                {params.sowParams.runBlocksAfterSunrise.toString()}
              </div>
              <div>
                operatorParams:
                <div className="pl-4">
                  <div>
                    operatorTipAmount:{" "}
                    {params.opParams.operatorTipAmount.toString()}
                  </div>
                  <div>tipAddress: {params.opParams.tipAddress}</div>
                  <div>
                    whitelistedOperators: [
                    {params.opParams.whitelistedOperators.join(", ")}]
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error("Error decoding sowBlueprintv0:", error);
    }

    // Fallback to manual decoding if the above fails
    // ... existing manual decoding code ...
  }

  // Find the function in the ABI that matches this selector
  const functionAbi = beanstalkAbi.find(
    (item) =>
      item.type === "function" &&
      item.name ===
        (selector === "0x553030d0"
          ? "sowWithMin"
          : selector === "0x6204aa43"
            ? "transferToken"
            : selector === "0x36bfafbd"
              ? "advancedFarm"
              : selector === SOW_BLUEPRINT_V0_SELECTOR
                ? "sowBlueprintv0"
                : null)
  );

  if (!functionAbi || functionAbi.type !== "function" || !functionAbi.inputs) {
    return (
      <div>
        <div className="text-gray-500">Selector: {selector}</div>
        <div className="text-gray-500">Raw Data: {data}</div>
      </div>
    );
  }

  // For advancedFarm or sowBlueprintv0, show structured data
  if (selector === "0x36bfafbd" || selector === "0x01f6a174") {
    return (
      <div>
        <div className="text-gray-500">
          Selector: {selector} ({functionAbi.name})
        </div>
        {selector === "0x01f6a174" && (
          <div className="space-y-2 mt-2">
            <div className="text-gray-500">SowBlueprintStruct:</div>
            <div className="pl-4 space-y-1">
              <div>sourceTokenIndices: {data.slice(0, 64)}</div>
              <div>sowAmounts: {data.slice(64, 128)}</div>
              <div>minTemp: {data.slice(128, 192)}</div>
              <div>operatorTipAmount: {data.slice(192, 256)}</div>
              <div>tipAddress: 0x{data.slice(280, 320)}</div>
              <div>maxPodlineLength: {data.slice(320, 384)}</div>
              <div>maxGrownStalkPerBdv: {data.slice(384, 448)}</div>
              <div>runBlocksAfterSunrise: {data.slice(448, 512)}</div>
              <div>whitelistedOperators: {data.slice(512)}</div>
            </div>
          </div>
        )}
        {selector === "0x36bfafbd" && (
          <div className="text-gray-500">Raw Data: {data}</div>
        )}
      </div>
    );
  }

  // Regular parameter decoding for other functions
  return (
    <div>
      <div className="text-gray-500">Selector: {selector}</div>
      <div className="space-y-1">
        {functionAbi.inputs.map((input, index) => {
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

export function HighlightedCallData({
  blueprintData,
  targetData,
  className = "",
  decodeAbi = false,
  isRequisitionData = false,
  encodedData,
  showSowBlueprintParams = false,
}: HighlightedCallDataProps) {
  if (showSowBlueprintParams) {
    return decodeCallData(blueprintData);
  }

  try {
    const decoded = decodeFunctionData({
      abi: beanstalkAbi,
      data: blueprintData,
    });
    const sowWithMinCall = decoded.args?.[0]?.[0]?.callData;
    const transferTokenCall = decoded.args?.[0]?.[1]?.callData;
    if (!sowWithMinCall || !transferTokenCall) return targetData;

    // If it's requisition data and we're in decode mode, just show the JSON
    if (isRequisitionData && decodeAbi) {
      return <div className={className}>{targetData}</div>;
    }

    if (decodeAbi) {
      // For encoded farm data, show the advancedFarm call first
      if (!isRequisitionData && targetData === encodedData) {
        return (
          <div className={className}>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  advancedFarm call:
                </div>
                <div className="text-gray-500">
                  {decodeCallData(blueprintData)}
                </div>
              </div>
            </div>
          </div>
        );
      }

      // For individual farm calls section
      return (
        <div className={className}>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">sowWithMin call:</div>
              <div className="text-blue-500">
                {decodeCallData(sowWithMinCall)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">
                transferToken call:
              </div>
              <div className="text-orange-500">
                {decodeCallData(transferTokenCall)}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Find and highlight both calls within the target data
    const sowWithMinCallIndex = targetData.indexOf(sowWithMinCall.slice(2));
    const transferTokenCallIndex = targetData.indexOf(
      transferTokenCall.slice(2)
    );
    if (sowWithMinCallIndex === -1 || transferTokenCallIndex === -1)
      return targetData;

    // Sort indices to handle the calls in order
    const segments: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    [
      [sowWithMinCallIndex, sowWithMinCall, "blue"],
      [transferTokenCallIndex, transferTokenCall, "orange"],
    ]
      .sort((a, b) => a[0] - b[0])
      .forEach(([index, call, color]) => {
        segments.push(targetData.slice(lastIndex, index));
        segments.push(
          <span key={index} className={`text-${color}-500`}>
            {targetData.slice(index, index + (call as string).length - 2)}
          </span>
        );
        lastIndex = index + (call as string).length - 2;
      });
    segments.push(targetData.slice(lastIndex));

    return <div className={className}>{segments}</div>;
  } catch {
    return targetData;
  }
}
