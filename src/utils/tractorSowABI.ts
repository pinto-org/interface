import { sowBlueprintv0ABI } from "@/constants/abi/SowBlueprintv0ABI";
import { sowReleaseABI } from "@/constants/abi/tractorReleaseABI";
import { toFunctionSelector } from "viem";

// The tuple is unchanged, but removing the v0 suffix changes the selector.
export const sowCompatibleABI = [...sowBlueprintv0ABI, ...sowReleaseABI] as const;
export const SOW_RELEASE_SELECTOR = toFunctionSelector(sowReleaseABI[0]);

export function sowEntryPoint(explicitRelease: boolean) {
  return explicitRelease ? "sowBlueprint" : "sowBlueprintv0";
}
