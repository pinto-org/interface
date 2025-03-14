import { decodeFunctionData } from "viem";
import { beanstalkAbi } from "@/generated/contractHooks";

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

  // For sowBlueprintv0, show decoded parameters
  if (selector === "0x01f6a174") {
    console.log("Raw data:", data);

    // Log first several 32-byte chunks to understand the structure
    console.log("Data chunks:");
    for (let i = 0; i < 10; i++) {
      const start = i * 64;
      const chunk = data.slice(start, start + 64);
      console.log(`Chunk ${i}:`, {
        hex: chunk,
        decimal: parseInt(chunk, 16),
        position: start,
      });
    }

    // First 32 bytes points to struct start (in bytes, not hex chars)
    const structStartBytes = parseInt(data.slice(0, 64), 16);
    const structStart = structStartBytes * 2;
    console.log("Struct start (bytes):", structStartBytes);
    console.log("Struct start (hex pos):", structStart);

    // At struct start, log the next few chunks
    console.log("Struct data chunks:");
    for (let i = 0; i < 5; i++) {
      const start = structStart + i * 64;
      const chunk = data.slice(start, start + 64);
      console.log(`Chunk ${i}:`, {
        hex: chunk,
        decimal: parseInt(chunk, 16),
        position: start,
      });
    }

    // First field in struct points to array data
    const arrayOffsetBytes = parseInt(
      data.slice(structStart, structStart + 64),
      16
    );
    const arrayOffset = arrayOffsetBytes * 2;
    console.log("Array offset (bytes):", arrayOffsetBytes);
    console.log("Array offset (hex pos):", arrayOffset);

    // At array offset, log the chunks
    console.log("Array data chunks:");
    for (let i = 0; i < 5; i++) {
      const start = arrayOffset + i * 64;
      const chunk = data.slice(start, start + 64);
      console.log(`Chunk ${i}:`, {
        hex: chunk,
        decimal: parseInt(chunk, 16),
        position: start,
      });
    }

    // At array offset, first 32 bytes is array length
    const arrayLength = parseInt(
      data.slice(arrayOffset + 64, arrayOffset + 128),
      16
    );
    console.log("Array length:", arrayLength);

    const indices: number[] = [];

    // Array data follows immediately after length
    for (let i = 0; i < arrayLength; i++) {
      const startPos = arrayOffset + 128 + i * 64; // Start after offset and length
      const value = parseInt(data.slice(startPos + 62, startPos + 64), 16);
      console.log(`Element ${i}:`, {
        startPos,
        fullSlice: data.slice(startPos, startPos + 64),
        lastByte: data.slice(startPos + 62, startPos + 64),
        value,
      });
      indices.push(value);
    }

    return (
      <div className="space-y-2">
        <div className="text-gray-500">Function: sowBlueprintv0</div>
        <div className="pl-4 space-y-1 text-gray-600">
          <div>sourceTokenIndices: [{indices.join(", ")}]</div>
          <div>sowAmounts: {data.slice(64, 128)}</div>
          <div>minTemp: {parseInt(data.slice(128, 192), 16).toString()}</div>
          <div>
            operatorTipAmount: {parseInt(data.slice(192, 256), 16).toString()}
          </div>
          <div>tipAddress: 0x{data.slice(280, 320)}</div>
          <div>
            maxPodlineLength: {parseInt(data.slice(320, 384), 16).toString()}
          </div>
          <div>
            maxGrownStalkPerBdv: {parseInt(data.slice(384, 448), 16).toString()}
          </div>
          <div>
            runBlocksAfterSunrise:{" "}
            {parseInt(data.slice(448, 512), 16).toString()}
          </div>
          <div>whitelistedOperators: {data.slice(512)}</div>
        </div>
      </div>
    );
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
              : selector === "0x01f6a174"
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
