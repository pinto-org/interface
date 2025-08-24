import { TV } from "@/classes/TokenValue";
import { convertUpBlueprintV0ABI } from "@/constants/abi/convertUpBlueprintV0ABI";
import { CONVERT_UP_BLUEPRINT_V0_ADDRESS } from "@/constants/address";
import { STALK } from "@/constants/internalTokens";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { getChainConstant } from "@/utils/chain";
import { AdvancedPipeCall } from "@/utils/types";
import { PublicClient, decodeFunctionData, encodeFunctionData } from "viem";
import { encodeTractorAndOptimizeDeposits } from "../core/encoding";
import { CreateTractorDataReturnType } from "../core/shared-tractor-types";
import { getTokenIndexesFromTractorTokenStrategy } from "../core/token-strategy";
import { ConvertUpBlueprintStruct, PreparedConvertUpArgs } from "./tractor-convert-up-types";

// ────────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ────────────────────────────────────────────────────────────────────────────────

const MAX_GROWN_STALK_PER_BDV_PENALTY_DECIMALS = 18;

export const getTractorConvertUpParamsDecimalConfig = (chainId: number) => {
  const { decimals } = getChainConstant(chainId, MAIN_TOKEN);

  return {
    totalConvertBdv: decimals,
    minConvertBdvPerExecution: decimals,
    maxConvertBdvPerExecution: decimals,
    minTimeBetweenConverts: 0,
    minConvertBonusCapacity: decimals,
    maxGrownStalkPerBdv: STALK.decimals,
    minGrownStalkPerBdvBonus: STALK.decimals,
    maxPriceToConvertUp: decimals,
    minPriceToConvertUp: decimals,
    operatorTip: decimals,
    maxGrownStalkPerBdvPenalty: MAX_GROWN_STALK_PER_BDV_PENALTY_DECIMALS,
    slippageRatio: 18,
  };
};

const guardDecimals = (args: PreparedConvertUpArgs<TV>, chainId: number) => {
  const decimalConfig = getTractorConvertUpParamsDecimalConfig(chainId);

  Object.entries(decimalConfig).forEach(([key, decimals]) => {
    const val = args[key as keyof PreparedConvertUpArgs<TV>];

    if (val instanceof TV) {
      if (val.decimals !== decimals) {
        throw new Error(`Invalid decimal for ${key}: expected ${decimals}, got ${val.decimals}`);
      }
    }
  });
};

// ────────────────────────────────────────────────────────────────────────────────
// ORDER CREATION
// ────────────────────────────────────────────────────────────────────────────────

export const TRACTOR_CONVERT_UP_DEFAULT_CONSTRAINTS = {
  minSizePerExecution: TV.fromHuman("100", 6),
  maxSizePerExecution: TV.fromHuman("125", 6),
  minSizePerExecutionPct: 0.05,
  maxSizePerExecutionPct: 0.1,
} as const;

export async function createConvertUpTractorData({
  publicClient,
  userAddress,
  protocolAddress,
  farmerDeposits,
  whitelistedOperators,
  ...args
}: PreparedConvertUpArgs<TV> & {
  publicClient: PublicClient;
  userAddress: `0x${string}`;
  protocolAddress: `0x${string}`;
  farmerDeposits?: ReturnType<typeof useFarmerSilo>["deposits"];
  whitelistedOperators?: `0x${string}`[];
}): Promise<CreateTractorDataReturnType & { struct: ConvertUpBlueprintStruct }> {
  console.debug("[tractor/convertUp/createConvertUpTractorData] args", args);

  const chainId = await publicClient.getChainId();

  if (!chainId) {
    throw new Error("Chain ID is required");
  }

  guardDecimals(args, chainId);

  // Get source token indices based on strategy
  const sourceTokenIndices = await getTokenIndexesFromTractorTokenStrategy(publicClient, args.tokenStrategy);

  console.debug("ConvertUp sourceTokenIndices:", sourceTokenIndices);

  const struct = {
    convertUpParams: {
      sourceTokenIndices,
      totalConvertBdv: args.totalConvertBdv.toBigInt(),
      minConvertBdvPerExecution: args.minConvertBdvPerExecution.toBigInt(),
      maxConvertBdvPerExecution: args.maxConvertBdvPerExecution.toBigInt(),
      minTimeBetweenConverts: args.minTimeBetweenConverts.toBigInt(),
      minConvertBonusCapacity: args.minConvertBonusCapacity.toBigInt(),
      maxGrownStalkPerBdv: args.maxGrownStalkPerBdv.toBigInt(),
      minGrownStalkPerBdvBonus: args.minGrownStalkPerBdvBonus.toBigInt(),
      maxPriceToConvertUp: args.maxPriceToConvertUp.toBigInt(),
      minPriceToConvertUp: args.minPriceToConvertUp.toBigInt(),
      maxGrownStalkPerBdvPenalty: args.maxGrownStalkPerBdvPenalty.toBigInt(),
      slippageRatio: args.slippageRatio.toBigInt(),
      lowStalkDeposits: Number(args.lowStalkDeposits),
    },
    opParams: {
      whitelistedOperators: whitelistedOperators || [],
      tipAddress: "0x0000000000000000000000000000000000000000" as `0x${string}`,
      operatorTipAmount: args.operatorTip.toBigInt(),
    },
  } as const;

  // Encode the convertUpBlueprintv0 function call
  const convertUpCall = encodeFunctionData({
    abi: convertUpBlueprintV0ABI,
    functionName: "convertUpBlueprint" as const,
    args: [struct],
  });

  const advPipeStruct = {
    target: CONVERT_UP_BLUEPRINT_V0_ADDRESS,
    callData: convertUpCall,
    clipboard: "0x0000" as `0x${string}`, // Minimal clipboard data
  } as const;

  const { data, depositOptimizationCalls } = await encodeTractorAndOptimizeDeposits(
    { client: publicClient, protocolAddress, farmerAddress: userAddress },
    advPipeStruct,
    farmerDeposits,
  );

  console.debug("[Tractor/convertUp/createConvertUpTractorData] RESULTS:", {
    data,
    operatorPasteInstrs: [], // TODO: Update if needed
    rawCall: convertUpCall,
    depositOptimizationCalls,
  });

  return {
    struct,
    data,
    operatorPasteInstrs: [], // TODO: Update if needed
    rawCall: convertUpCall, // Return the raw call data
    depositOptimizationCalls, // Return optimization calls for user transaction
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// DECODE / LOAD ORDERS
// ────────────────────────────────────────────────────────────────────────────────

export async function loadConvertUpOrderbokData() {}

export function shallowCheckIsConvertUpParams(data: unknown): data is ConvertUpBlueprintStruct {
  return typeof data === "object" && data !== null && "convertUpParams" in data && "opParams" in data;
}

export const transformConvertUpRequisitionEvent = (params: unknown | null, chainId: number) => {
  try {
    if (!shallowCheckIsConvertUpParams(params)) {
      console.debug("[Tractor/transformConvertUpRequisitionEvent] Invalid params structure.");
      return null;
    }

    const { convertUpParams: cup, opParams: op } = params;

    const dc = getTractorConvertUpParamsDecimalConfig(chainId);

    const convertUpParams: ConvertUpBlueprintStruct<TV>["convertUpParams"] = {
      sourceTokenIndices: cup.sourceTokenIndices,
      totalConvertBdv: TV.fromBigInt(cup.totalConvertBdv, dc.totalConvertBdv),
      minConvertBdvPerExecution: TV.fromBigInt(cup.minConvertBdvPerExecution, dc.minConvertBdvPerExecution),
      maxConvertBdvPerExecution: TV.fromBigInt(cup.maxConvertBdvPerExecution, dc.maxConvertBdvPerExecution),
      minTimeBetweenConverts: TV.fromBigInt(cup.minTimeBetweenConverts, dc.minTimeBetweenConverts),
      minConvertBonusCapacity: TV.fromBigInt(cup.minConvertBonusCapacity, dc.minConvertBonusCapacity),
      maxGrownStalkPerBdv: TV.fromBigInt(cup.maxGrownStalkPerBdv, dc.maxGrownStalkPerBdv),
      minGrownStalkPerBdvBonus: TV.fromBigInt(cup.minGrownStalkPerBdvBonus, dc.minGrownStalkPerBdvBonus),
      maxPriceToConvertUp: TV.fromBigInt(cup.maxPriceToConvertUp, dc.maxPriceToConvertUp),
      minPriceToConvertUp: TV.fromBigInt(cup.minPriceToConvertUp, dc.minPriceToConvertUp),
      maxGrownStalkPerBdvPenalty: TV.fromBigInt(cup.maxGrownStalkPerBdvPenalty, dc.maxGrownStalkPerBdvPenalty),
      slippageRatio: TV.fromBigInt(cup.slippageRatio, dc.slippageRatio),
      lowStalkDeposits: cup.lowStalkDeposits,
    };

    const opParams: ConvertUpBlueprintStruct<TV>["opParams"] = {
      whitelistedOperators: op.whitelistedOperators,
      tipAddress: op.tipAddress,
      operatorTipAmount: TV.fromBigInt(op.operatorTipAmount, dc.operatorTip),
    };

    return {
      convertUpParams,
      opParams,
    };
  } catch (error) {
    console.debug("Failed to transform convertUpParams:", error);
  }

  return null;
};

export const decodeConvertUpBlueprintFromAdvancedPipe = (
  calls: readonly AdvancedPipeCall[] | undefined,
  chainId: number,
): ConvertUpBlueprintStruct<TV> | null => {
  if (!calls?.length) {
    console.debug("[Tractor/handleDecodeBlueprintFromAdvancedPipe] No calls provided. Returning null.");
    return null;
  }

  const callData = calls[0].callData;

  try {
    const decoded = decodeFunctionData({
      abi: convertUpBlueprintV0ABI,
      data: callData,
    });

    const params = decoded.args?.[0];

    return transformConvertUpRequisitionEvent(params, chainId);
  } catch (error) {
    console.debug("Failed to decode sowBlueprintv0 data:", error);
    return null;
  }
};
