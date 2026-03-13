// ────────────────────────────────────────────────────────────────────────────────
// AutomateClaim Blueprint — TypeScript Type Definitions
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Frequency preset for claim operation thresholds.
 * - "high": frequent execution (low thresholds)
 * - "medium": moderate execution frequency
 * - "low": infrequent execution (high thresholds)
 * - "custom": user-defined threshold value
 */
export type ClaimFrequencyPreset = "high" | "medium" | "low" | "custom";

// ────────────────────────────────────────────────────────────────────────────────
// Contract Struct Types (match ABI exactly)
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Per-field harvest configuration.
 * Maps to `AutomateClaimBlueprint.FieldHarvestConfig` in the contract.
 */
export interface FieldHarvestConfig {
  fieldId: bigint;
  minHarvestAmount: bigint;
}

/**
 * Claim parameters for the AutomateClaimBlueprint contract.
 * Maps to `AutomateClaimBlueprint.AutomateClaimParams` in the contract.
 *
 * Disabled operations use MAX_UINT256 for their min amounts.
 * Harvest is disabled by passing an empty `fieldHarvestConfigs` array.
 */
export interface AutomateClaimParams {
  minMowAmount: bigint;
  minTwaDeltaB: bigint;
  minPlantAmount: bigint;
  fieldHarvestConfigs: FieldHarvestConfig[];
  minRinseAmount: bigint;
  minUnripeClaimAmount: bigint;
  sourceTokenIndices: readonly number[];
  maxGrownStalkPerBdv: bigint;
  slippageRatio: bigint;
}

/**
 * Extended operator parameters with per-operation tip amounts.
 * Maps to `AutomateClaimBlueprint.OperatorParamsExtended` in the contract.
 */
export interface OperatorParamsExtended {
  baseOpParams: {
    whitelistedOperators: readonly `0x${string}`[];
    tipAddress: `0x${string}`;
    operatorTipAmount: bigint;
  };
  mowTipAmount: bigint;
  plantTipAmount: bigint;
  harvestTipAmount: bigint;
  rinseTipAmount: bigint;
  unripeClaimTipAmount: bigint;
}

/**
 * Top-level struct passed to the `automateClaimBlueprint` contract function.
 * Maps to `AutomateClaimBlueprint.AutomateClaimBlueprintStruct` in the contract.
 */
export interface AutomateClaimBlueprintStruct {
  claimParams: AutomateClaimParams;
  opParams: OperatorParamsExtended;
}

// ────────────────────────────────────────────────────────────────────────────────
// Decoded Blueprint Data (for display / visualization)
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Decoded and display-ready representation of an AutomateClaim blueprint.
 * Includes both raw bigint values and human-readable string representations.
 */
export interface AutomateClaimBlueprintData {
  claimParams: {
    minMowAmount: bigint;
    minMowAmountAsString: string;
    minTwaDeltaB: bigint;
    minTwaDeltaBAsString: string;
    minPlantAmount: bigint;
    minPlantAmountAsString: string;
    fieldHarvestConfigs: Array<{
      fieldId: bigint;
      minHarvestAmount: bigint;
      minHarvestAmountAsString: string;
    }>;
    minRinseAmount: bigint;
    minRinseAmountAsString: string;
    minUnripeClaimAmount: bigint;
    minUnripeClaimAmountAsString: string;
    sourceTokenIndices: readonly number[];
    maxGrownStalkPerBdv: bigint;
    maxGrownStalkPerBdvAsString: string;
    slippageRatio: bigint;
    slippageRatioAsString: string;
  };
  operatorParams: {
    whitelistedOperators: readonly `0x${string}`[];
    tipAddress: `0x${string}`;
    operatorTipAmount: bigint;
    operatorTipAmountAsString: string;
    mowTipAmount: bigint;
    mowTipAmountAsString: string;
    plantTipAmount: bigint;
    plantTipAmountAsString: string;
    harvestTipAmount: bigint;
    harvestTipAmountAsString: string;
    rinseTipAmount: bigint;
    rinseTipAmountAsString: string;
    unripeClaimTipAmount: bigint;
    unripeClaimTipAmountAsString: string;
  };
}
