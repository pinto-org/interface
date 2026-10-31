import { describe, expect, it, vi } from "vitest";

const captured = vi.hoisted(() => ({ indices: undefined as unknown }));
vi.mock("viem", async (importOriginal) => {
  const actual = await importOriginal<typeof import("viem")>();
  return {
    ...actual,
    encodeFunctionData: (params: any) => {
      captured.indices = params.args[0].claimParams.sourceTokenIndices;
      return actual.encodeFunctionData(params);
    },
  };
});
vi.mock("@/lib/Tractor/core", () => ({
  encodeTractorAndOptimizeDeposits: async (_options: unknown, call: any) => ({
    data: call.callData,
    depositOptimizationCalls: [],
  }),
  decodeEncodedTractorDataToAdvancedPipeCalls: vi.fn(),
}));
import { automateClaimBlueprintABI } from "@/constants/abi/AutomateClaimBlueprintABI";
import { createAutomateClaimTractorData } from "@/lib/Tractor/claimOrder/tractor-claim";
import { decodeFunctionData } from "viem";

describe("automate claim ABI encoding", () => {
  it.each([[0, 1, 255], [255]])("keeps uint8 source indices as numbers (%j)", async (...indices) => {
    const sourceTokenIndices = indices as number[];
    const result = await createAutomateClaimTractorData({
      formValues: {
        mowEnabled: true,
        mowPreset: "high",
        mowCustomValue: "",
        plantEnabled: false,
        plantPreset: null,
        plantCustomValue: "",
        harvestEnabled: false,
        harvestPreset: null,
        harvestCustomValue: "",
        sourceTokenIndices,
      },
      tipPerExecution: 1_000_000n,
      whitelistedOperators: [],
      publicClient: {} as any,
      userAddress: "0x0000000000000000000000000000000000000001",
      protocolAddress: "0x0000000000000000000000000000000000000002",
    });
    expect(captured.indices).toEqual(sourceTokenIndices);
    const decoded = decodeFunctionData({ abi: automateClaimBlueprintABI, data: result.rawCall });
    expect(decoded.args[0].claimParams.sourceTokenIndices).toEqual(sourceTokenIndices);
  });
});
