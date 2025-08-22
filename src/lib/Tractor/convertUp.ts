import { TV } from "@/classes/TokenValue";
import { convertUpBlueprintV0ABI } from "@/constants/abi/convertUpBlueprintV0ABI";
import { CONVERT_UP_BLUEPRINT_V0_ADDRESS } from "@/constants/address";
import { STALK } from "@/constants/internalTokens";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { getChainConstant } from "@/utils/chain";
import { Address, PublicClient, encodeFunctionData } from "viem";
import { ExtendedTractorTokenStrategy, TractorTokenStrategy } from "./types";
import {
  CreateTractorDataReturnType,
  encodeTractorAndOptimizeDeposits,
  getTokenIndexesFromTractorTokenStrategy,
} from "./utils";

// Types based on ConvertUpBlueprintv0.sol contract

/**
 * How low stalk deposits are processed.
 * See LibSiloHelpers.Mode for more details (protocol)
 *
 * - USE (0): Use low stalk deposit.
 * - OMIT (1): Omit low stalk deposit.
 * - USE_LAST (2): Use low stalk deposit last.
 */
export enum LowStalkDepositsMode {
  USE = 0,
  OMIT = 1,
  USE_LAST = 2,
}

/**
 * Prepared ConvertUp arguments for form transformation
 */
export interface PreparedConvertUpArgs<Numeric extends TV | string = TV> {
  tokenStrategy: TractorTokenStrategy;
  totalConvertBdv: Numeric;
  minConvertBdvPerExecution: Numeric;
  maxConvertBdvPerExecution: Numeric;
  minTimeBetweenConverts: Numeric;
  minConvertBonusCapacity: Numeric;
  maxGrownStalkPerBdv: Numeric;
  minGrownStalkPerBdvBonus: Numeric;
  maxPriceToConvertUp: Numeric;
  minPriceToConvertUp: Numeric;
  maxGrownStalkPerBdvPenalty: Numeric;
  slippageRatio: Numeric;
  operatorTip: Numeric;
  lowStalkDeposits: LowStalkDepositsMode;
}

export interface ExtendedPreparedConvertUpArgs extends PreparedConvertUpArgs<TV> {
  tokenStrategy: ExtendedTractorTokenStrategy;
}

/**
 * Struct to hold convert up parameters for the Convert Up Blueprint.
 */
export interface ConvertUpParams {
  /**
   * Indices of source tokens to use for conversion
   */
  sourceTokenIndices: number[];
  /**
   * Total amount to convert in BDV terms
   */
  totalConvertBdv: bigint;
  /**
   * Minimum BDV to convert per execution
   */
  minConvertBdvPerExecution: bigint;
  /**
   * Maximum BDV to convert per execution
   */
  maxConvertBdvPerExecution: bigint;
  /**
   * Minimum time (in seconds) between convert executions
   */
  minTimeBetweenConverts: bigint;
  /**
   * Minimum capacity required for convert bonus
   */
  minConvertBonusCapacity: bigint;
  /**
   * Maximum grown stalk per BDV to withdraw from deposits
   */
  maxGrownStalkPerBdv: bigint;
  /**
   * Threshold for considering a deposit to have a good stalk-to-BDV ratio
   */
  minGrownStalkPerBdvBonus: bigint;
  /**
   * Maximum price at which to convert up (for MEV resistance)
   */
  maxPriceToConvertUp: bigint;
  /**
   * Minimum price at which to convert up (for range targeting)
   */
  minPriceToConvertUp: bigint;
  /**
   * Maximum grown stalk per BDV penalty to accept
   */
  maxGrownStalkPerBdvPenalty: bigint;
  /**
   * Slippage tolerance ratio for the conversion
   */
  slippageRatio: bigint;
  /**
   * How low stalk deposits are processed.
   */
  lowStalkDeposits: LowStalkDepositsMode;
}

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
    maxGrownStalkPerBdvPenalty: 18,
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

export interface OperatorParams {
  whitelistedOperators: Address[];
  tipAddress: Address;
  operatorTipAmount: bigint;
}

export interface ConvertUpBlueprintStruct {
  convertUpParams: ConvertUpParams;
  opParams: OperatorParams;
}
