import { TokenValue } from "@/classes/TokenValue";
import { automateClaimBlueprintABI } from "@/constants/abi/AutomateClaimBlueprintABI";
import { AUTOMATE_CLAIM_BLUEPRINT_ADDRESS } from "@/constants/address";
import { PINTO } from "@/constants/tokens";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { AdvancedPipeCall } from "@/utils/types";
import { type PublicClient, decodeFunctionData, encodeFunctionData, maxUint256 } from "viem";
import { base } from "viem/chains";
import {
  CreateTractorDataReturnType,
  decodeEncodedTractorDataToAdvancedPipeCalls,
  encodeTractorAndOptimizeDeposits,
} from "../core";
import {
  AutomateClaimBlueprintData,
  AutomateClaimBlueprintStruct,
  ClaimFrequencyPreset,
  FieldHarvestConfig,
} from "./tractor-claim-types";

// ────────────────────────────────────────────────────────────────────────────────
// DECIMALS
// ────────────────────────────────────────────────────────────────────────────────

/** Mow thresholds are stored on-chain with 10 decimal places (Stalk precision) */
export const MOW_DECIMALS = 10;

// ────────────────────────────────────────────────────────────────────────────────
// PRESET VALUES
// ────────────────────────────────────────────────────────────────────────────────

export const CLAIM_PRESETS = {
  mow: {
    high: { value: 50, scaled: 50n * 10_000_000_000n },
    medium: { value: 100, scaled: 100n * 10_000_000_000n },
    low: { value: 1000, scaled: 1000n * 10_000_000_000n },
  },
  plant: {
    high: { value: 10, scaled: 10_000_000n },
    medium: { value: 50, scaled: 50_000_000n },
    low: { value: 500, scaled: 500_000_000n },
  },
  harvest: {
    high: { value: 10, scaled: 10_000_000n },
    medium: { value: 50, scaled: 50_000_000n },
    low: { value: 500, scaled: 500_000_000n },
  },
} as const;

// Default minTwaDeltaB: 10 PINTO × 1e6
const DEFAULT_MIN_TWA_DELTA_B = 10_000_000n;

// ────────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Resolve a preset or custom value to a scaled bigint for a given operation.
 * - Mow: scaled by MOW_DECIMALS (stalk precision)
 * - Plant/Harvest: scaled by PINTO.decimals
 */
export function resolvePresetValue(
  operation: "mow" | "plant" | "harvest",
  preset: ClaimFrequencyPreset | null,
  customValue: string,
): bigint {
  if (preset && preset !== "custom") {
    return CLAIM_PRESETS[operation][preset].scaled;
  }

  // Custom value — scale based on operation type
  const numericValue = parseFloat(customValue);
  if (Number.isNaN(numericValue) || numericValue <= 0) {
    throw new Error(`Invalid custom value for ${operation}: ${customValue}`);
  }

  if (operation === "mow") {
    return TokenValue.fromHuman(customValue, MOW_DECIMALS).toBigInt();
  }
  return TokenValue.fromHuman(customValue, PINTO.decimals).toBigInt();
}

/**
 * Calculate per-operation tip amounts based on which operations are enabled.
 * Disabled operations get 0 tip. Rinse and UnripeClaim are always 0.
 */
export function calculateTips(
  formValues: { mowEnabled: boolean; plantEnabled: boolean; harvestEnabled: boolean },
  tipPerExecution: bigint,
) {
  return {
    mowTipAmount: formValues.mowEnabled ? tipPerExecution : 0n,
    plantTipAmount: formValues.plantEnabled ? tipPerExecution : 0n,
    harvestTipAmount: formValues.harvestEnabled ? tipPerExecution : 0n,
    rinseTipAmount: 0n,
    unripeClaimTipAmount: 0n,
  };
}

/**
 * Estimate the total tip range for a given tip amount and number of enabled operations.
 */
export function estimatedTotalTipRange(tipPerExecution: bigint, enabledOpsCount: number) {
  return {
    min: tipPerExecution * 1n,
    max: tipPerExecution * BigInt(enabledOpsCount),
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// STRUCT BUILDER
// ────────────────────────────────────────────────────────────────────────────────

export interface AutomateClaimFormValues {
  mowEnabled: boolean;
  mowPreset: ClaimFrequencyPreset | null;
  mowCustomValue: string;

  plantEnabled: boolean;
  plantPreset: ClaimFrequencyPreset | null;
  plantCustomValue: string;

  harvestEnabled: boolean;
  harvestPreset: ClaimFrequencyPreset | null;
  harvestCustomValue: string;

  // Advanced defaults
  sourceTokenIndices?: number[];
  maxGrownStalkPerBdv?: string;
  slippageRatio?: string;
}

/**
 * Build the AutomateClaimBlueprintStruct from form values.
 */
export function buildAutomateClaimStruct(
  formValues: AutomateClaimFormValues,
  tipPerExecution: bigint,
  whitelistedOperators: readonly `0x${string}`[],
): AutomateClaimBlueprintStruct {
  // Mow
  const minMowAmount = formValues.mowEnabled
    ? resolvePresetValue("mow", formValues.mowPreset, formValues.mowCustomValue)
    : maxUint256;

  // Plant
  const minPlantAmount = formValues.plantEnabled
    ? resolvePresetValue("plant", formValues.plantPreset, formValues.plantCustomValue)
    : maxUint256;

  // Harvest
  const fieldHarvestConfigs: FieldHarvestConfig[] = formValues.harvestEnabled
    ? [
        {
          fieldId: 0n,
          minHarvestAmount: resolvePresetValue("harvest", formValues.harvestPreset, formValues.harvestCustomValue),
        },
        {
          fieldId: 1n,
          minHarvestAmount: resolvePresetValue("harvest", formValues.harvestPreset, formValues.harvestCustomValue),
        },
      ]
    : [];

  // Tips
  const tips = calculateTips(formValues, tipPerExecution);

  const sourceTokenIndices = formValues.sourceTokenIndices ?? [255];
  const maxGrownStalkPerBdv = formValues.maxGrownStalkPerBdv
    ? TokenValue.fromHuman(formValues.maxGrownStalkPerBdv, 6).toBigInt()
    : TokenValue.fromHuman("1", 18).toBigInt();
  const slippageRatio = formValues.slippageRatio
    ? TokenValue.fromHuman(formValues.slippageRatio, 18).toBigInt()
    : TokenValue.fromHuman("1", 18).toBigInt();

  return {
    claimParams: {
      minMowAmount,
      minTwaDeltaB: DEFAULT_MIN_TWA_DELTA_B,
      minPlantAmount,
      fieldHarvestConfigs,
      minRinseAmount: maxUint256,
      minUnripeClaimAmount: maxUint256,
      sourceTokenIndices,
      maxGrownStalkPerBdv,
      slippageRatio,
    },
    opParams: {
      baseOpParams: {
        whitelistedOperators,
        tipAddress: "0x0000000000000000000000000000000000000000" as `0x${string}`,
        operatorTipAmount: tipPerExecution,
      },
      ...tips,
    },
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// CREATE ORDER (ENCODING)
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Creates encoded tractor data from form values.
 * Follows the advancedFarm(advancedPipe(automateClaimBlueprint(...))) wrapping pattern.
 */
export async function createAutomateClaimTractorData({
  formValues,
  tipPerExecution,
  whitelistedOperators,
  publicClient,
  farmerDeposits,
  userAddress,
  protocolAddress,
}: {
  formValues: AutomateClaimFormValues;
  tipPerExecution: bigint;
  whitelistedOperators: readonly `0x${string}`[];
  publicClient: PublicClient;
  farmerDeposits?: ReturnType<typeof useFarmerSilo>["deposits"];
  userAddress: `0x${string}`;
  protocolAddress: `0x${string}`;
}): Promise<CreateTractorDataReturnType> {
  // 1. Build struct from form values
  const struct = buildAutomateClaimStruct(formValues, tipPerExecution, whitelistedOperators);

  // 2. Encode the automateClaimBlueprint function call
  // Convert sourceTokenIndices from number[] to bigint[] for ABI encoding (uint256[])
  const abiStruct = {
    ...struct,
    claimParams: {
      ...struct.claimParams,
      sourceTokenIndices: struct.claimParams.sourceTokenIndices.map((i) => BigInt(i)),
    },
  };

  const blueprintCall = encodeFunctionData({
    abi: automateClaimBlueprintABI,
    functionName: "automateClaimBlueprint",
    args: [abiStruct],
  });

  // 3. Create advancedPipe struct targeting the blueprint contract
  const advPipeStruct: AdvancedPipeCall = {
    target: AUTOMATE_CLAIM_BLUEPRINT_ADDRESS,
    callData: blueprintCall,
    clipboard: "0x0000" as `0x${string}`,
  };

  // 4. Wrap with encodeTractorAndOptimizeDeposits
  const { data, depositOptimizationCalls } = await encodeTractorAndOptimizeDeposits(
    { client: publicClient, protocolAddress, farmerAddress: userAddress },
    advPipeStruct,
    farmerDeposits,
  );

  return {
    data,
    // AutomateClaim uses transient storage (getTractorData) for operator-provided data, not paste instructions
    operatorPasteInstrs: [],
    rawCall: blueprintCall,
    depositOptimizationCalls,
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// DECODE BLUEPRINT DATA
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Decode an automateClaimBlueprint call from advancedPipe calls.
 * Extracts the inner function call and decodes using the ABI.
 */
export function decodeAutomateClaimBlueprintFromAdvancedPipe(
  calls: readonly AdvancedPipeCall[] | undefined,
): AutomateClaimBlueprintStruct | null {
  if (!calls?.length) return null;

  try {
    const decoded = decodeFunctionData({
      abi: automateClaimBlueprintABI,
      data: calls[0].callData,
    });

    const params = decoded.args?.[0];
    if (!params) return null;

    return params as unknown as AutomateClaimBlueprintStruct;
  } catch (error) {
    console.error("[Tractor/decodeAutomateClaimBlueprintFromAdvancedPipe] Failed to decode:", error);
    return null;
  }
}

/**
 * Decode encoded tractor data (advancedFarm → advancedPipe → automateClaimBlueprint).
 * Entry point for decoding a full encoded blueprint.
 */
export function decodeAutomateClaimBlueprint(encodedData: `0x${string}`): AutomateClaimBlueprintStruct | null {
  try {
    const pipeCalls = decodeEncodedTractorDataToAdvancedPipeCalls(encodedData, "automateClaim");

    if (pipeCalls?.length) {
      return decodeAutomateClaimBlueprintFromAdvancedPipe(pipeCalls);
    }
  } catch (e) {
    console.error("[Tractor/decodeAutomateClaimBlueprint] Failed to decode:", e);
  }

  return null;
}

// ────────────────────────────────────────────────────────────────────────────────
// TRANSFORM (raw decoded → display-ready data)
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Transform raw decoded AutomateClaimBlueprintStruct into display-ready
 * AutomateClaimBlueprintData with string representations.
 */
export function transformAutomateClaimRequisitionEvent(
  params: unknown | null,
  _chainId: number = base.id,
): AutomateClaimBlueprintData | null {
  try {
    if (!params || typeof params !== "object") {
      return null;
    }

    const struct = params as AutomateClaimBlueprintStruct;

    if (!struct.claimParams || !struct.opParams) {
      return null;
    }

    const cp = struct.claimParams;
    const op = struct.opParams;

    const humanOrDisabled = (value: bigint, decimals: number): string =>
      value === maxUint256 ? "Disabled" : TokenValue.fromBlockchain(value, decimals).toHuman();

    return {
      claimParams: {
        minMowAmount: cp.minMowAmount,
        minMowAmountAsString: humanOrDisabled(cp.minMowAmount, MOW_DECIMALS),
        minTwaDeltaB: cp.minTwaDeltaB,
        minTwaDeltaBAsString: TokenValue.fromBlockchain(cp.minTwaDeltaB, PINTO.decimals).toHuman(),
        minPlantAmount: cp.minPlantAmount,
        minPlantAmountAsString: humanOrDisabled(cp.minPlantAmount, PINTO.decimals),
        fieldHarvestConfigs: cp.fieldHarvestConfigs.map((config) => ({
          fieldId: config.fieldId,
          minHarvestAmount: config.minHarvestAmount,
          minHarvestAmountAsString: humanOrDisabled(config.minHarvestAmount, PINTO.decimals),
        })),
        minRinseAmount: cp.minRinseAmount,
        minRinseAmountAsString: humanOrDisabled(cp.minRinseAmount, PINTO.decimals),
        minUnripeClaimAmount: cp.minUnripeClaimAmount,
        minUnripeClaimAmountAsString: humanOrDisabled(cp.minUnripeClaimAmount, PINTO.decimals),
        sourceTokenIndices: cp.sourceTokenIndices,
        maxGrownStalkPerBdv: cp.maxGrownStalkPerBdv,
        maxGrownStalkPerBdvAsString: TokenValue.fromBlockchain(cp.maxGrownStalkPerBdv, PINTO.decimals).toHuman(),
        slippageRatio: cp.slippageRatio,
        slippageRatioAsString: TokenValue.fromBlockchain(cp.slippageRatio, 18).toHuman(),
      },
      operatorParams: {
        whitelistedOperators: op.baseOpParams.whitelistedOperators,
        tipAddress: op.baseOpParams.tipAddress,
        operatorTipAmount: op.baseOpParams.operatorTipAmount,
        operatorTipAmountAsString: TokenValue.fromBlockchain(
          op.baseOpParams.operatorTipAmount,
          PINTO.decimals,
        ).toHuman(),
        mowTipAmount: op.mowTipAmount,
        mowTipAmountAsString: TokenValue.fromBlockchain(op.mowTipAmount, PINTO.decimals).toHuman(),
        plantTipAmount: op.plantTipAmount,
        plantTipAmountAsString: TokenValue.fromBlockchain(op.plantTipAmount, PINTO.decimals).toHuman(),
        harvestTipAmount: op.harvestTipAmount,
        harvestTipAmountAsString: TokenValue.fromBlockchain(op.harvestTipAmount, PINTO.decimals).toHuman(),
        rinseTipAmount: op.rinseTipAmount,
        rinseTipAmountAsString: TokenValue.fromBlockchain(op.rinseTipAmount, PINTO.decimals).toHuman(),
        unripeClaimTipAmount: op.unripeClaimTipAmount,
        unripeClaimTipAmountAsString: TokenValue.fromBlockchain(op.unripeClaimTipAmount, PINTO.decimals).toHuman(),
      },
    };
  } catch (e) {
    console.debug("[Tractor/transformAutomateClaimRequisitionEvent] Failed to transform:", e);
  }

  return null;
}
