import { TV } from "@/classes/TokenValue";
import { STALK } from "@/constants/internalTokens";
import { tractorTokenStrategyUtil as StrategyUtil } from "@/lib/Tractor";
import { postSanitizedSanitizedValue } from "@/utils/string";
import { Address, Hex, WalletClient, encodeAbiParameters, encodeFunctionData, parseEther, parseUnits } from "viem";
import { TractorTokenStrategy } from "./types";

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
export interface PreparedConvertUpArgs {
  tokenStrategy: TractorTokenStrategy;
  totalConvertBdv: TV;
  minConvertBdvPerExecution: TV;
  maxConvertBdvPerExecution: TV;
  minTimeBetweenConverts: string;
  minConvertBonusCapacity: TV;
  maxGrownStalkPerBdv: TV;
  minGrownStalkPerBdvBonus: TV;
  maxPriceToConvertUp: TV;
  minPriceToConvertUp: TV;
  maxGrownStalkPerBdvPenalty: TV;
  slippageRatio: string;
  lowStalkDeposits: LowStalkDepositsMode;
  operatorTip: TV;
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

const CONVERT_UP_DEFAULT_MIN_SIZE_PER_EXECUTION = TV.fromHuman("100", 6);
const DEFAULT_MAX_SIZE_PER_EXECUTION = TV.fromHuman("125", 6);
const MIN_SIZE_PER_EXECUTION_PCT = 0.05;
const MAX_SIZE_PER_EXECUTION_PCT = 0.1;

// export interface OperatorParams {
//   whitelistedOperators: Address[];
//   tipAddress: Address;
//   operatorTipAmount: bigint;
// }

// export interface ConvertUpBlueprintStruct {
//   convertUpParams: ConvertUpParams;
//   opParams: OperatorParams;
// }

// export interface Blueprint {
//   publisher: Address;
//   data: Hex;
//   operatorPasteInstrs: Hex[];
//   maxNonce: bigint;
//   startTime: bigint;
//   endTime: bigint;
// }

// Constants
// const BEANSTALK_ADDRESS: Address = "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5"; // Update with actual address
// const DEFAULT_SLIPPAGE_RATIO = parseEther("0.01"); // 1%
// const ZERO_ADDRESS: Address = "0x0000000000000000000000000000000000000000";

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

// // ABI for ConvertUpBlueprintv0 function
// const CONVERT_UP_ABI = [
//   {
//     name: "convertUp",
//     type: "function",
//     inputs: [
//       {
//         name: "convertUpParams",
//         type: "tuple",
//         components: [
//           { name: "sourceTokenIndices", type: "uint8[]" },
//           { name: "totalConvertBdv", type: "uint256" },
//           { name: "minConvertBdvPerExecution", type: "uint256" },
//           { name: "maxConvertBdvPerExecution", type: "uint256" },
//           { name: "minTimeBetweenConverts", type: "uint256" },
//           { name: "minConvertBonusCapacity", type: "uint256" },
//           { name: "maxGrownStalkPerBdv", type: "uint256" },
//           { name: "minGrownStalkPerBdvBonus", type: "uint256" },
//           { name: "maxPriceToConvertUp", type: "uint256" },
//           { name: "minPriceToConvertUp", type: "uint256" },
//           { name: "maxGrownStalkPerBdvPenalty", type: "int256" },
//           { name: "slippageRatio", type: "uint256" },
//           { name: "lowStalkDeposits", type: "uint8" },
//         ],
//       },
//       {
//         name: "opParams",
//         type: "tuple",
//         components: [
//           { name: "whitelistedOperators", type: "address[]" },
//           { name: "tipAddress", type: "address" },
//           { name: "operatorTipAmount", type: "int256" },
//         ],
//       },
//     ],
//   },
// ] as const;

/**
 * Transforms form data into prepared ConvertUp arguments
 */
export const transformFormToConvertUpArgs = (
  values: any, // Will be typed properly when we import the form schema
  mainTokenDecimals: number,
): PreparedConvertUpArgs => {
  // Import the strategy util locally to avoid circular imports

  const strategy = StrategyUtil.isValidStrategy(values.tokenStrategy) ? values.tokenStrategy : undefined;

  if (!strategy) {
    throw new Error("Invalid token strategy");
  }

  const decimals = mainTokenDecimals;

  const totalConvertBdv = postSanitizedSanitizedValue(values.totalConvertBdv, decimals).tv;
  const minPriceToConvertUp = postSanitizedSanitizedValue(values.minPriceToConvertUp, decimals).tv;
  const maxPriceToConvertUp = postSanitizedSanitizedValue(values.maxPriceToConvertUp, decimals).tv;
  const minGrownStalkPerBdvBonus = postSanitizedSanitizedValue(values.minGrownStalkPerBdvBonus, decimals).tv;
  const minSizePerExecution = postSanitizedSanitizedValue(values.minConvertBdvPerExecution, decimals).tv;
  const maxSizePerExecution = postSanitizedSanitizedValue(values.maxConvertBdvPerExecution, decimals).tv;

  // Default to min of (5% of total convert bdv) or (100 PDV)
  const defaultMinSizePerExecution = TV.min(
    totalConvertBdv.mul(TRACTOR_CONVERT_UP_DEFAULT_CONSTRAINTS.minSizePerExecutionPct),
    TRACTOR_CONVERT_UP_DEFAULT_CONSTRAINTS.minSizePerExecution,
  );

  // default to min of (10% of total convert bdv) or (125 PDV)
  const defaultMaxSizePerExecution = TV.min(
    totalConvertBdv.sub(TRACTOR_CONVERT_UP_DEFAULT_CONSTRAINTS.maxSizePerExecutionPct),
    TRACTOR_CONVERT_UP_DEFAULT_CONSTRAINTS.maxSizePerExecution,
  );

  const preparedArgs: PreparedConvertUpArgs = {
    tokenStrategy: strategy,
    totalConvertBdv,
    minConvertBonusCapacity: defaultMinSizePerExecution,
    minConvertBdvPerExecution: minSizePerExecution.eq(0) ? defaultMinSizePerExecution : minSizePerExecution,
    maxConvertBdvPerExecution: maxSizePerExecution.eq(0) ? defaultMaxSizePerExecution : maxSizePerExecution,
    minPriceToConvertUp,
    maxPriceToConvertUp,
    minTimeBetweenConverts: values.minTimeBetweenConverts,
    maxGrownStalkPerBdv: postSanitizedSanitizedValue(values.maxGrownStalkPerBdv, STALK.decimals).tv,
    minGrownStalkPerBdvBonus,
    maxGrownStalkPerBdvPenalty: postSanitizedSanitizedValue(values.maxGrownStalkPerBdvPenalty, decimals).tv,
    slippageRatio: values.slippageRatio,
    operatorTip: postSanitizedSanitizedValue(values.operatorTip, decimals).tv,
    lowStalkDeposits: values.lowStalkDeposits,
  };

  return preparedArgs;
};

/**
 * Creates default ConvertUp parameters
 */
// export function getDefaultConvertUpParams(): ConvertUpParams {
//   return {
//     sourceTokenIndices: [0], // Default to first token
//     totalConvertBdv: parseEther("1000"),
//     minConvertBdvPerExecution: parseEther("10"),
//     maxConvertBdvPerExecution: parseEther("100"),
//     minTimeBetweenConverts: BigInt(3600), // 1 hour
//     minConvertBonusCapacity: parseEther("0.1"),
//     maxGrownStalkPerBdv: parseEther("10"),
//     minGrownStalkPerBdvBonus: parseEther("1"),
//     maxPriceToConvertUp: parseEther("1.05"), // 5% above peg
//     minPriceToConvertUp: parseEther("0.95"), // 5% below peg
//     maxGrownStalkPerBdvPenalty: parseEther("-0.1"),
//     slippageRatio: DEFAULT_SLIPPAGE_RATIO,
//     lowStalkDeposits: 0, // USE
//   };
// }

/**
 * Creates default operator parameters
 */
// export function getDefaultOperatorParams(): OperatorParams {
//   return {
//     whitelistedOperators: [],
//     tipAddress: ZERO_ADDRESS,
//     operatorTipAmount: 0n,
//   };
// }

// /**
//  * Encodes ConvertUp blueprint data for contract execution
//  */
// function encodeConvertUpBlueprintData(blueprintStruct: ConvertUpBlueprintStruct): Hex {
//   // Encode function call
//   const callData = encodeFunctionData({
//     abi: CONVERT_UP_ABI,
//     functionName: "convertUp",
//     args: [
//       {
//         sourceTokenIndices: blueprintStruct.convertUpParams.sourceTokenIndices,
//         totalConvertBdv: blueprintStruct.convertUpParams.totalConvertBdv,
//         minConvertBdvPerExecution: blueprintStruct.convertUpParams.minConvertBdvPerExecution,
//         maxConvertBdvPerExecution: blueprintStruct.convertUpParams.maxConvertBdvPerExecution,
//         minTimeBetweenConverts: blueprintStruct.convertUpParams.minTimeBetweenConverts,
//         minConvertBonusCapacity: blueprintStruct.convertUpParams.minConvertBonusCapacity,
//         maxGrownStalkPerBdv: blueprintStruct.convertUpParams.maxGrownStalkPerBdv,
//         minGrownStalkPerBdvBonus: blueprintStruct.convertUpParams.minGrownStalkPerBdvBonus,
//         maxPriceToConvertUp: blueprintStruct.convertUpParams.maxPriceToConvertUp,
//         minPriceToConvertUp: blueprintStruct.convertUpParams.minPriceToConvertUp,
//         maxGrownStalkPerBdvPenalty: blueprintStruct.convertUpParams.maxGrownStalkPerBdvPenalty,
//         slippageRatio: blueprintStruct.convertUpParams.slippageRatio,
//         lowStalkDeposits: blueprintStruct.convertUpParams.lowStalkDeposits,
//       },
//       {
//         whitelistedOperators: blueprintStruct.opParams.whitelistedOperators,
//         tipAddress: blueprintStruct.opParams.tipAddress,
//         operatorTipAmount: blueprintStruct.opParams.operatorTipAmount,
//       },
//     ],
//   });

//   // Create normal blueprint data (type 0)
//   const blueprintData = encodeAbiParameters([{ type: "bytes[]" }], [[callData]]);
//   return `0x00${blueprintData.slice(2)}` as Hex;
// }

// /**
//  * Creates a ConvertUp blueprint for automated LP-to-Bean conversions
//  */
// export function createConvertUpBlueprint(
//   params: Partial<ConvertUpParams>,
//   operatorParams: Partial<OperatorParams>,
//   publisher: Address,
//   options: {
//     maxNonce?: bigint;
//     startTime?: bigint;
//     endTime?: bigint;
//   } = {},
// ): Requisition {
//   // Merge with default parameters
//   const convertUpParams = { ...getDefaultConvertUpParams(), ...params };
//   const opParams = { ...getDefaultOperatorParams(), ...operatorParams };

//   // Create blueprint struct
//   const blueprintStruct: ConvertUpBlueprintStruct = {
//     convertUpParams,
//     opParams,
//   };

//   // Encode the blueprint data
//   const blueprintData = encodeConvertUpBlueprintData(blueprintStruct);

//   // Create blueprint
//   const blueprint: Blueprint = {
//     publisher,
//     data: blueprintData,
//     operatorPasteInstrs: [], // To be filled by advanced blueprint logic if needed
//     maxNonce: options.maxNonce || BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
//     startTime: options.startTime || BigInt(Math.floor(Date.now() / 1000)),
//     endTime: options.endTime || BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
//   };

//   return { blueprint };
// }

// /**
//  * Signs a ConvertUp blueprint requisition using EIP-712
//  */
// export async function signConvertUpBlueprint(
//   requisition: Requisition,
//   walletClient: WalletClient,
// ): Promise<Requisition> {
//   if (!walletClient.account) {
//     throw new Error("WalletClient must have an account");
//   }

//   const signature = await walletClient.signTypedData({
//     account: walletClient.account,
//     domain: DOMAIN,
//     types: BLUEPRINT_TYPES,
//     primaryType: "Blueprint",
//     message: requisition.blueprint,
//   });

//   return { ...requisition, signature };
// }

// // Utility functions for building ConvertUp blueprints

// /**
//  * Creates a ConvertUp blueprint with fluent parameter building
//  */
// export function buildConvertUpBlueprint(publisher: Address) {
//   const params: Partial<ConvertUpParams> = {};
//   const operatorParams: Partial<OperatorParams> = {};
//   const options: {
//     maxNonce?: bigint;
//     startTime?: bigint;
//     endTime?: bigint;
//   } = {};

//   return {
//     // Conversion parameters
//     sourceTokens: (indices: number[]) => {
//       params.sourceTokenIndices = indices;
//       return params;
//     },

//     totalBdv: (amount: bigint) => {
//       params.totalConvertBdv = amount;
//       return params;
//     },

//     executionRange: (min: bigint, max: bigint) => {
//       params.minConvertBdvPerExecution = min;
//       params.maxConvertBdvPerExecution = max;
//       return params;
//     },

//     timeBetweenExecutions: (seconds: number) => {
//       params.minTimeBetweenConverts = BigInt(seconds);
//       return params;
//     },

//     priceRange: (min: bigint, max: bigint) => {
//       params.minPriceToConvertUp = min;
//       params.maxPriceToConvertUp = max;
//       return params;
//     },

//     slippage: (ratio: bigint) => {
//       params.slippageRatio = ratio;
//       return params;
//     },

//     bonusCapacity: (capacity: bigint) => {
//       params.minConvertBonusCapacity = capacity;
//       return params;
//     },

//     // Operator parameters
//     operators: (addresses: Address[]) => {
//       operatorParams.whitelistedOperators = addresses;
//       return params;
//     },

//     tip: (address: Address, amount: bigint) => {
//       operatorParams.tipAddress = address;
//       operatorParams.operatorTipAmount = amount;
//       return params;
//     },

//     // Timeline options
//     validUntil: (endTime: bigint) => {
//       options.endTime = endTime;
//       return params;
//     },

//     maxExecutions: (nonce: bigint) => {
//       options.maxNonce = nonce;
//       return params;
//     },

//     // Build the blueprint
//     build: (): Requisition => {
//       return createConvertUpBlueprint(params, operatorParams, publisher, options);
//     },

//     // Build and sign in one step
//     buildAndSign: async (walletClient: WalletClient): Promise<Requisition> => {
//       const requisition = createConvertUpBlueprint(params, operatorParams, publisher, options);
//       return signConvertUpBlueprint(requisition, walletClient);
//     },
//   };
// }

// // Common parameter presets
// export const CONVERT_UP_PRESETS = {
//   conservative: {
//     slippageRatio: parseEther("0.005"), // 0.5%
//     maxPriceToConvertUp: parseEther("1.02"), // 2% above peg
//     minPriceToConvertUp: parseEther("0.98"), // 2% below peg
//   },
//   aggressive: {
//     slippageRatio: parseEther("0.02"), // 2%
//     maxPriceToConvertUp: parseEther("1.1"), // 10% above peg
//     minPriceToConvertUp: parseEther("0.9"), // 10% below peg
//   },
// } as const;

// // Helper utilities for parsing human-readable amounts
// export const convertUpUtils = {
//   parseBdv: (amount: string) => parseEther(amount),
//   parseSlippage: (percent: number) => parseEther((percent / 100).toString()),
//   parsePrice: (price: string) => parseEther(price),
//   hoursToSeconds: (hours: number) => hours * 3600,
//   daysToSeconds: (days: number) => days * 24 * 3600,
// } as const;

// // Main export object with all utilities
// export const ConvertUpBlueprint = {
//   create: createConvertUpBlueprint,
//   sign: signConvertUpBlueprint,
//   build: buildConvertUpBlueprint,
//   presets: CONVERT_UP_PRESETS,
//   utils: convertUpUtils,
//   defaults: {
//     params: getDefaultConvertUpParams,
//     operators: getDefaultOperatorParams,
//   },
// } as const;
