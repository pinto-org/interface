import { TokenValue } from "@/classes/TokenValue";
import { PINTO } from "@/constants/tokens";
import { maxUint256 } from "viem";
import { CLAIM_PRESETS, MOW_DECIMALS } from "./tractor-claim";
import type { AutomateClaimBlueprintData } from "./tractor-claim-types";

/**
 * Determine which claim operations are enabled from decoded blueprint data.
 * Centralizes the MAX_UINT256 comparison logic used across multiple components.
 */
export function getEnabledClaimOps(transformed: AutomateClaimBlueprintData) {
  const mowEnabled = transformed.claimParams.minMowAmount !== maxUint256;
  const plantEnabled = transformed.claimParams.minPlantAmount !== maxUint256;
  const harvestEnabled = transformed.claimParams.fieldHarvestConfigs.length > 0;

  return { mowEnabled, plantEnabled, harvestEnabled };
}

/**
 * Get a list of enabled operation labels (e.g. ["Mow", "Plant"]).
 */
export function getEnabledClaimOpLabels(ops: {
  mowEnabled: boolean;
  plantEnabled: boolean;
  harvestEnabled: boolean;
}): string[] {
  return [ops.mowEnabled && "Mow", ops.plantEnabled && "Plant", ops.harvestEnabled && "Harvest"].filter(
    Boolean,
  ) as string[];
}

/**
 * Get a descriptive condition label for a claim operation based on its threshold.
 * Matches the threshold against known presets, or shows the custom value.
 */
export function getClaimOpConditionLabel(
  op: "mow" | "plant" | "harvest",
  enabled: boolean,
  thresholdBigInt: bigint,
): string {
  if (!enabled) return "";

  const presets = CLAIM_PRESETS[op];
  const unit = op === "mow" ? "Stalk" : "PINTO";
  const opLabel = op === "mow" ? "Mow" : op === "plant" ? "Plant" : "Harvest";

  if (thresholdBigInt === presets.high.scaled) {
    return `${opLabel}: Aggressive (≥ ${presets.high.value} ${unit})`;
  }
  if (thresholdBigInt === presets.medium.scaled) {
    return `${opLabel}: Moderate (≥ ${presets.medium.value} ${unit})`;
  }
  if (thresholdBigInt === presets.low.scaled) {
    return `${opLabel}: Conservative (≥ ${presets.low.value} ${unit})`;
  }

  const decimals = op === "mow" ? MOW_DECIMALS : PINTO.decimals;
  const humanValue = TokenValue.fromBlockchain(thresholdBigInt, decimals).toHuman();
  return `${opLabel}: Custom (≥ ${humanValue} ${unit})`;
}

/**
 * Validate a custom numeric input value (used in ConditionSection and SpecifyConditionsDialog).
 * Returns true if the value is a positive number.
 */
export function isValidCustomValue(v: string): boolean {
  const normalized = v.trim().replace(",", ".");
  if (!normalized) return false;
  const num = Number(normalized);
  return !Number.isNaN(num) && num > 0;
}
