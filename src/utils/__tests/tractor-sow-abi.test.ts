import { describe, expect, it } from "vitest";
import { encodeFunctionData, zeroAddress } from "viem";
import { diamondABI } from "@/constants/abi/diamondABI";
import { sowReleaseABI } from "@/constants/abi/tractorReleaseABI";
import { decodeBlueprintCallData } from "@/lib/Tractor/blueprint-decoders";
import { decodeTractorBlueprint } from "@/lib/Tractor/requisitions/tractor-requisition";
import { decodeSowTractorData } from "@/lib/Tractor/sowOrder/tractor-sow";
import { sowCompatibleABI, sowEntryPoint, SOW_RELEASE_SELECTOR } from "@/utils/tractorSowABI";
import { tractorBlueprintTarget } from "@/lib/Tractor/core/encoding";

const params = {
  sowParams: {
    sourceTokenIndices: [0],
    sowAmounts: {
      totalAmountToSow: 5_000_000n,
      minAmountToSowPerSeason: 5_000_000n,
      maxAmountToSowPerSeason: 5_000_000n,
    },
    minTemp: 1_000_000n,
    maxPodlineLength: 90_000_000_000_000n,
    maxGrownStalkPerBdv: 10n ** 24n,
    runBlocksAfterSunrise: 300n,
    slippageRatio: 10n ** 18n,
  },
  opParams: { whitelistedOperators: [], tipAddress: zeroAddress, operatorTipAmount: 200_000n },
} as const;

describe("Sow release ABI migration", () => {
  it.each([false, true])("encodes and discovers legacy/release orders (release=%s)", (release) => {
    const raw = encodeFunctionData({ abi: sowCompatibleABI, functionName: sowEntryPoint(release), args: [params] });
    if (release) {
      expect(raw).toBe(encodeFunctionData({ abi: sowReleaseABI, functionName: "sowBlueprint", args: [params] }));
      expect(raw.slice(0, 10)).toBe(SOW_RELEASE_SELECTOR);
      expect(SOW_RELEASE_SELECTOR).toBe("0x271ecf12");
    } else expect(raw.slice(0, 10)).toBe("0x3ca8e1b2");
    const target = release
      ? "0x0000000000000000000000000000000000000001"
      : "0x0000000000000000000000000000000000000002";
    const pipe = encodeFunctionData({
      abi: diamondABI,
      functionName: "advancedPipe",
      args: [[{ target, callData: raw, clipboard: "0x0000" }], 0n],
    });
    const wrapped = encodeFunctionData({
      abi: diamondABI,
      functionName: "advancedFarm",
      args: [[{ callData: pipe, clipboard: "0x" }]],
    });
    expect(decodeBlueprintCallData(wrapped)?.functionName).toBe(sowEntryPoint(release));
    expect(tractorBlueprintTarget(wrapped)).toBe(target);
    expect(decodeSowTractorData(wrapped, 1337)).toMatchObject({ sowAmounts: { totalAmountToSow: 5_000_000n } });
    expect(decodeTractorBlueprint(wrapped, 1337)).toMatchObject({
      type: "sowBlueprintv0",
      data: { sowAmounts: { totalAmountToSow: 5_000_000n } },
    });
  });
});
