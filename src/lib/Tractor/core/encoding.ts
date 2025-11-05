import { Clipboard } from "@/classes/Clipboard";
import { diamondABI } from "@/constants/abi/diamondABI";
import { generateBatchSortDepositsCallData } from "@/lib/claim/depositUtils";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { AdvancedPipeCall } from "@/utils/types";
import { PublicClient, decodeFunctionData, encodeFunctionData } from "viem";

// ────────────────────────────────────────────────────────────────────────────────
// ENCODING/DECODING UTILITIES
// ────────────────────────────────────────────────────────────────────────────────

export const encodeTractorAndOptimizeDeposits = async (
  config: {
    client: PublicClient;
    protocolAddress: `0x${string}`;
    farmerAddress: `0x${string}`;
  },
  advPipeCall: AdvancedPipeCall,
  farmerDeposits?: ReturnType<typeof useFarmerSilo>["deposits"],
) => {
  const advPipe = encodeFunctionData({
    abi: diamondABI,
    functionName: "advancedPipe",
    args: [
      [advPipeCall],
      0n, // Output index parameter
    ],
  });

  const farmCalls = [
    {
      callData: advPipe,
      clipboard: Clipboard.encode([]), // Empty clipboard
    },
  ];

  const advFarm = encodeFunctionData({
    abi: diamondABI,
    functionName: "advancedFarm" as const,
    args: [farmCalls] as const,
  });

  // Step 3: Generate deposit optimization calls separately (for the user transaction)
  let depositOptimizationCalls: `0x${string}`[] | undefined;

  if (farmerDeposits && config.farmerAddress && config.protocolAddress) {
    console.debug(
      "[Tractor/encodeTractorAndOptimizeDeposits]: Generating deposit optimization calls for user transaction",
    );

    try {
      depositOptimizationCalls = await generateBatchSortDepositsCallData(
        config.farmerAddress,
        farmerDeposits,
        config.client,
        config.protocolAddress,
      );

      console.debug(
        `[Tractor/encodeTractorAndOptimizeDeposits]: Generated ${depositOptimizationCalls.length} deposit optimization calls for user transaction`,
      );
    } catch (error) {
      console.warn("[Tractor/encodeTractorAndOptimizeDeposits]: Failed to generate deposit optimization calls:", error);
      // Continue without optimization calls - don't fail the entire transaction
    }
  }

  return {
    data: advFarm,
    depositOptimizationCalls,
  };
};

export function decodeEncodedTractorDataToAdvancedPipeCalls(
  encodedData: `0x${string}`,
  operationName?: string,
): readonly AdvancedPipeCall[] | undefined {
  try {
    // Step 1: Attempt to decode.
    const calls = decodeFunctionData({
      abi: diamondABI,
      data: encodedData,
    });

    // Valid tractor orders are encoded as advancedFarm(advancedPipe(callData))
    // Step 2: If the encoded data is an advancedFarm call, decode again.
    if (calls.functionName === "advancedFarm" && calls.args[0]) {
      const farmCalls = calls.args[0];

      if (!farmCalls.length) {
        console.debug(
          `[Tractor/decodeTractorToAdvancedPipeCalls/${operationName}] No farm calls provided. Returning null. ${operationName ? `Operation: ${operationName}` : ""}`,
        );
        return undefined;
      }
      // Step 3: Try to decode the inner call as advancedPipe
      try {
        const pipeCallData = farmCalls[0].callData;
        const advancedPipeDecoded = decodeFunctionData({
          abi: diamondABI,
          data: pipeCallData,
        });

        if (advancedPipeDecoded.functionName === "advancedPipe" && advancedPipeDecoded.args?.[0]) {
          return advancedPipeDecoded.args[0];
        }

        console.debug(
          `[Tractor/decodeTractorToAdvancedPipeCalls/${operationName}] Decoded but function name is not advancedPipe: ${advancedPipeDecoded.functionName}`,
        );
      } catch (error) {
        console.debug(
          `[Tractor/decodeTractorToAdvancedPipeCalls/${operationName}] Failed to decode as advancedPipe: ${error}`,
        );
      }
    }
  } catch (error) {
    console.error(
      `[Tractor/decodeTractorToAdvancedPipeCalls/${operationName}] Failed to decode Tractor Data: ${error}`,
    );
  }
  // If we get here, we didn't find a valid sow blueprint.
  return undefined;
}
