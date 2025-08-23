import { Clipboard } from "@/classes/Clipboard";
import { diamondABI } from "@/constants/abi/diamondABI";
import { generateBatchSortDepositsCallData } from "@/lib/claim/depositUtils";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { AdvancedPipeCall } from "@/utils/types";
import { PublicClient, encodeFunctionData } from "viem";

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
