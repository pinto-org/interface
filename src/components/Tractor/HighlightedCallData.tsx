import { sowBlueprintv0ABI } from "@/constants/abi/SowBlueprintv0ABI";
import { SOW_BLUEPRINT_V0_SELECTOR } from "@/constants/address";
import { beanstalkAbi } from "@/generated/contractHooks";
import { decodeFunctionData, keccak256, toHex } from "viem";

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
                : null),
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
        {selector === "0x36bfafbd" && <div className="text-gray-500">Raw Data: {data}</div>}
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

  // For requisition data, try to parse and format the JSON
  if (isRequisitionData) {
    try {
      // If it's JSON data, try to parse and format it
      const jsonData = JSON.parse(targetData);
      const formattedJson = JSON.stringify(jsonData, null, 2);

      if (decodeAbi) {
        // If we're in decode mode, show the formatted JSON
        return (
          <div className={className}>
            <pre>{formattedJson}</pre>
          </div>
        );
      }

      // If we're not in decode mode, show the formatted JSON with syntax highlighting
      return (
        <div className={className}>
          <pre>{formattedJson}</pre>
        </div>
      );
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      // If parsing fails, fall back to the original display
    }
  }

  try {
    // For sowBlueprintv0 data
    if (blueprintData.startsWith(SOW_BLUEPRINT_V0_SELECTOR)) {
      if (decodeAbi) {
        return (
          <div className={className}>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">sowBlueprintv0 call:</div>
                <div className="text-gray-500">{decodeCallData(blueprintData)}</div>
              </div>
            </div>
          </div>
        );
      }
      return <div className={className}>{targetData}</div>;
    }

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
  } catch {
    return targetData;
  }
}
