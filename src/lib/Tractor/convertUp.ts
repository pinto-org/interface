import { TV, TokenValue } from "@/classes/TokenValue";
import { ConvertUpV0FormSchema } from "@/components/Tractor/form/schema/convertUp.schema";
import { diamondABI } from "@/constants/abi/diamondABI";
import { SOW_BLUEPRINT_V0_ADDRESS } from "@/constants/address";
import { STALK } from "@/constants/internalTokens";
import { tractorTokenStrategyUtil as StrategyUtil } from "@/lib/Tractor";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { postSanitizedSanitizedValue, sanitizeNumericInputValue } from "@/utils/string";
import { Address, PublicClient, encodeFunctionData, parseEther } from "viem";
import { generateBatchSortDepositsCallData } from "../claim/depositUtils";
import { ExtendedTractorTokenStrategy, TractorTokenStrategy } from "./types";
import { CreateTractorDataReturnType, getTokenIndexesFromTractorTokenStrategy } from "./utils";

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
  farmerDeposits: ReturnType<typeof useFarmerSilo>["deposits"];
  whitelistedOperators?: `0x${string}`[];
}): Promise<CreateTractorDataReturnType> {
  console.debug("[tractor/convertUp/createConvertUpTractorData] args", args);

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
    abi: CONVERT_UP_ABI,
    functionName: "convertUpBlueprintv0",
    args: [struct],
  });

  console.debug("ConvertUp encoded call:", convertUpCall);

  const advPipeStruct = {
    target: SOW_BLUEPRINT_V0_ADDRESS,
    callData: convertUpCall,
    clipboard: "0x0000" as `0x${string}`, // Minimal clipboard data
  } as const;

  // Step 1. Wrap in advancedPipe call
  const advancedPipeCall = encodeFunctionData({
    abi: diamondABI,
    functionName: "advancedPipe",
    args: [
      [advPipeStruct],
      0n, // outputIndex parameter
    ],
  });

  const farmCalls = [
    {
      callData: advancedPipeCall,
      clipboard: "0x" as `0x${string}`, // Empty clipboard
    },
  ] as const;

  // 2. Wrap in advancedFarm call
  const advancedFarmCall = encodeFunctionData({
    abi: diamondABI,
    functionName: "advancedFarm",
    args: [farmCalls],
  });

  // Step 3: Generate deposit optimization calls separately (for the user transaction)
  let depositOptimizationCalls: `0x${string}`[] | undefined;

  if (farmerDeposits && userAddress && protocolAddress) {
    console.debug("Generating deposit optimization calls for user transaction");

    try {
      depositOptimizationCalls = await generateBatchSortDepositsCallData(
        userAddress,
        farmerDeposits,
        publicClient,
        protocolAddress,
      );

      console.debug(`Generated ${depositOptimizationCalls.length} deposit optimization calls for user transaction`);
    } catch (error) {
      console.warn("Failed to generate deposit optimization calls:", error);
      // Continue without optimization calls - don't fail the entire transaction
    }
  }

  console.debug("[Tractor/convertUp/createConvertUpTractorData] RESULTS:", {
    data: advancedFarmCall,
    operatorPasteInstrs: [], // TODO: Update if needed
    rawCall: convertUpCall,
    depositOptimizationCalls,
  });

  return {
    data: advancedFarmCall,
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

// Constants
const DEFAULT_SLIPPAGE_RATIO = parseEther("0.01"); // 1%
const ZERO_ADDRESS: Address = "0x0000000000000000000000000000000000000000";

// Domain for EIP-712 signing
// const DOMAIN = {
//   name: "Tractor",
//   version: "1.0.0",
//   chainId: 1, // Update for target network
//   verifyingContract: BEANSTALK_ADDRESS,
// } as const;

// Types for EIP-712 signing
// const BLUEPRINT_TYPES = {
//   Blueprint: [
//     { name: "publisher", type: "address" },
//     { name: "data", type: "bytes" },
//     { name: "operatorPasteInstrs", type: "bytes32[]" },
//     { name: "maxNonce", type: "uint256" },
//     { name: "startTime", type: "uint256" },
//     { name: "endTime", type: "uint256" },
//   ],
// } as const;

// ABI for ConvertUpBlueprintv0 function
const CONVERT_UP_ABI = [
  {
    name: "convertUpBlueprintv0",
    type: "function",
    inputs: [
      {
        name: "convertUpParams",
        type: "tuple",
        components: [
          { name: "sourceTokenIndices", type: "uint8[]" },
          { name: "totalConvertBdv", type: "uint256" },
          { name: "minConvertBdvPerExecution", type: "uint256" },
          { name: "maxConvertBdvPerExecution", type: "uint256" },
          { name: "minTimeBetweenConverts", type: "uint256" },
          { name: "minConvertBonusCapacity", type: "uint256" },
          { name: "maxGrownStalkPerBdv", type: "uint256" },
          { name: "minGrownStalkPerBdvBonus", type: "uint256" },
          { name: "maxPriceToConvertUp", type: "uint256" },
          { name: "minPriceToConvertUp", type: "uint256" },
          { name: "maxGrownStalkPerBdvPenalty", type: "int256" },
          { name: "slippageRatio", type: "uint256" },
          { name: "lowStalkDeposits", type: "uint8" },
        ],
      },
      {
        name: "opParams",
        type: "tuple",
        components: [
          { name: "whitelistedOperators", type: "address[]" },
          { name: "tipAddress", type: "address" },
          { name: "operatorTipAmount", type: "int256" },
        ],
      },
    ],
  },
] as const;

/**
 * Creates default ConvertUp parameters
 */
export function getDefaultConvertUpParams(): ConvertUpParams {
  return {
    sourceTokenIndices: [255], // Default to LOWEST_SEEDS
    totalConvertBdv: parseEther("1000"),
    minConvertBdvPerExecution: parseEther("10"),
    maxConvertBdvPerExecution: parseEther("100"),
    minTimeBetweenConverts: BigInt(3600), // 1 hour
    minConvertBonusCapacity: parseEther("0.1"),
    maxGrownStalkPerBdv: parseEther("10"),
    minGrownStalkPerBdvBonus: parseEther("1"),
    maxPriceToConvertUp: parseEther("0.999"), // Just below $1
    minPriceToConvertUp: parseEther("0.001"), // Just above $0
    maxGrownStalkPerBdvPenalty: 0n,
    slippageRatio: DEFAULT_SLIPPAGE_RATIO,
    lowStalkDeposits: LowStalkDepositsMode.USE,
  };
}

/**
 * Creates default operator parameters
 */
export function getDefaultOperatorParams(): OperatorParams {
  return {
    whitelistedOperators: [],
    tipAddress: ZERO_ADDRESS,
    operatorTipAmount: 0n,
  };
}
