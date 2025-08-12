import { Address, Hex, WalletClient, encodeAbiParameters, encodeFunctionData, parseEther, parseUnits } from "viem";

// Types based on ConvertUpBlueprintv0.sol contract

export interface ConvertUpParams {
  sourceTokenIndices: number[];
  totalConvertBdv: bigint;
  minConvertBdvPerExecution: bigint;
  maxConvertBdvPerExecution: bigint;
  minTimeBetweenConverts: bigint;
  minConvertBonusCapacity: bigint;
  maxGrownStalkPerBdv: bigint;
  minGrownStalkPerBdvBonus: bigint;
  maxPriceToConvertUp: bigint;
  minPriceToConvertUp: bigint;
  maxGrownStalkPerBdvPenalty: bigint;
  slippageRatio: bigint;
  lowStalkDeposits: number; // 0: USE, 1: OMIT, 2: USE_LAST
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

export interface Blueprint {
  publisher: Address;
  data: Hex;
  operatorPasteInstrs: Hex[];
  maxNonce: bigint;
  startTime: bigint;
  endTime: bigint;
}

export interface Requisition {
  blueprint: Blueprint;
  signature?: Hex;
}

// Constants
const BEANSTALK_ADDRESS: Address = "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5"; // Update with actual address
const DEFAULT_SLIPPAGE_RATIO = parseEther("0.01"); // 1%
const ZERO_ADDRESS: Address = "0x0000000000000000000000000000000000000000";

// Domain for EIP-712 signing
const DOMAIN = {
  name: "Tractor",
  version: "1.0.0",
  chainId: 1, // Update for target network
  verifyingContract: BEANSTALK_ADDRESS,
} as const;

// Types for EIP-712 signing
const BLUEPRINT_TYPES = {
  Blueprint: [
    { name: "publisher", type: "address" },
    { name: "data", type: "bytes" },
    { name: "operatorPasteInstrs", type: "bytes32[]" },
    { name: "maxNonce", type: "uint256" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
  ],
} as const;

// ABI for ConvertUpBlueprintv0 function
const CONVERT_UP_ABI = [
  {
    name: "convertUp",
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
    sourceTokenIndices: [0], // Default to first token
    totalConvertBdv: parseEther("1000"),
    minConvertBdvPerExecution: parseEther("10"),
    maxConvertBdvPerExecution: parseEther("100"),
    minTimeBetweenConverts: BigInt(3600), // 1 hour
    minConvertBonusCapacity: parseEther("0.1"),
    maxGrownStalkPerBdv: parseEther("10"),
    minGrownStalkPerBdvBonus: parseEther("1"),
    maxPriceToConvertUp: parseEther("1.05"), // 5% above peg
    minPriceToConvertUp: parseEther("0.95"), // 5% below peg
    maxGrownStalkPerBdvPenalty: parseEther("-0.1"),
    slippageRatio: DEFAULT_SLIPPAGE_RATIO,
    lowStalkDeposits: 0, // USE
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

/**
 * Encodes ConvertUp blueprint data for contract execution
 */
function encodeConvertUpBlueprintData(blueprintStruct: ConvertUpBlueprintStruct): Hex {
  // Encode function call
  const callData = encodeFunctionData({
    abi: CONVERT_UP_ABI,
    functionName: "convertUp",
    args: [
      {
        sourceTokenIndices: blueprintStruct.convertUpParams.sourceTokenIndices,
        totalConvertBdv: blueprintStruct.convertUpParams.totalConvertBdv,
        minConvertBdvPerExecution: blueprintStruct.convertUpParams.minConvertBdvPerExecution,
        maxConvertBdvPerExecution: blueprintStruct.convertUpParams.maxConvertBdvPerExecution,
        minTimeBetweenConverts: blueprintStruct.convertUpParams.minTimeBetweenConverts,
        minConvertBonusCapacity: blueprintStruct.convertUpParams.minConvertBonusCapacity,
        maxGrownStalkPerBdv: blueprintStruct.convertUpParams.maxGrownStalkPerBdv,
        minGrownStalkPerBdvBonus: blueprintStruct.convertUpParams.minGrownStalkPerBdvBonus,
        maxPriceToConvertUp: blueprintStruct.convertUpParams.maxPriceToConvertUp,
        minPriceToConvertUp: blueprintStruct.convertUpParams.minPriceToConvertUp,
        maxGrownStalkPerBdvPenalty: blueprintStruct.convertUpParams.maxGrownStalkPerBdvPenalty,
        slippageRatio: blueprintStruct.convertUpParams.slippageRatio,
        lowStalkDeposits: blueprintStruct.convertUpParams.lowStalkDeposits,
      },
      {
        whitelistedOperators: blueprintStruct.opParams.whitelistedOperators,
        tipAddress: blueprintStruct.opParams.tipAddress,
        operatorTipAmount: blueprintStruct.opParams.operatorTipAmount,
      },
    ],
  });

  // Create normal blueprint data (type 0)
  const blueprintData = encodeAbiParameters([{ type: "bytes[]" }], [[callData]]);
  return `0x00${blueprintData.slice(2)}` as Hex;
}

/**
 * Creates a ConvertUp blueprint for automated LP-to-Bean conversions
 */
export function createConvertUpBlueprint(
  params: Partial<ConvertUpParams>,
  operatorParams: Partial<OperatorParams>,
  publisher: Address,
  options: {
    maxNonce?: bigint;
    startTime?: bigint;
    endTime?: bigint;
  } = {},
): Requisition {
  // Merge with default parameters
  const convertUpParams = { ...getDefaultConvertUpParams(), ...params };
  const opParams = { ...getDefaultOperatorParams(), ...operatorParams };

  // Create blueprint struct
  const blueprintStruct: ConvertUpBlueprintStruct = {
    convertUpParams,
    opParams,
  };

  // Encode the blueprint data
  const blueprintData = encodeConvertUpBlueprintData(blueprintStruct);

  // Create blueprint
  const blueprint: Blueprint = {
    publisher,
    data: blueprintData,
    operatorPasteInstrs: [], // To be filled by advanced blueprint logic if needed
    maxNonce: options.maxNonce || BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
    startTime: options.startTime || BigInt(Math.floor(Date.now() / 1000)),
    endTime: options.endTime || BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
  };

  return { blueprint };
}

/**
 * Signs a ConvertUp blueprint requisition using EIP-712
 */
export async function signConvertUpBlueprint(
  requisition: Requisition,
  walletClient: WalletClient,
): Promise<Requisition> {
  if (!walletClient.account) {
    throw new Error("WalletClient must have an account");
  }

  const signature = await walletClient.signTypedData({
    account: walletClient.account,
    domain: DOMAIN,
    types: BLUEPRINT_TYPES,
    primaryType: "Blueprint",
    message: requisition.blueprint,
  });

  return { ...requisition, signature };
}

// Utility functions for building ConvertUp blueprints

/**
 * Creates a ConvertUp blueprint with fluent parameter building
 */
export function buildConvertUpBlueprint(publisher: Address) {
  const params: Partial<ConvertUpParams> = {};
  const operatorParams: Partial<OperatorParams> = {};
  const options: {
    maxNonce?: bigint;
    startTime?: bigint;
    endTime?: bigint;
  } = {};

  return {
    // Conversion parameters
    sourceTokens: (indices: number[]) => {
      params.sourceTokenIndices = indices;
      return params;
    },

    totalBdv: (amount: bigint) => {
      params.totalConvertBdv = amount;
      return params;
    },

    executionRange: (min: bigint, max: bigint) => {
      params.minConvertBdvPerExecution = min;
      params.maxConvertBdvPerExecution = max;
      return params;
    },

    timeBetweenExecutions: (seconds: number) => {
      params.minTimeBetweenConverts = BigInt(seconds);
      return params;
    },

    priceRange: (min: bigint, max: bigint) => {
      params.minPriceToConvertUp = min;
      params.maxPriceToConvertUp = max;
      return params;
    },

    slippage: (ratio: bigint) => {
      params.slippageRatio = ratio;
      return params;
    },

    bonusCapacity: (capacity: bigint) => {
      params.minConvertBonusCapacity = capacity;
      return params;
    },

    // Operator parameters
    operators: (addresses: Address[]) => {
      operatorParams.whitelistedOperators = addresses;
      return params;
    },

    tip: (address: Address, amount: bigint) => {
      operatorParams.tipAddress = address;
      operatorParams.operatorTipAmount = amount;
      return params;
    },

    // Timeline options
    validUntil: (endTime: bigint) => {
      options.endTime = endTime;
      return params;
    },

    maxExecutions: (nonce: bigint) => {
      options.maxNonce = nonce;
      return params;
    },

    // Build the blueprint
    build: (): Requisition => {
      return createConvertUpBlueprint(params, operatorParams, publisher, options);
    },

    // Build and sign in one step
    buildAndSign: async (walletClient: WalletClient): Promise<Requisition> => {
      const requisition = createConvertUpBlueprint(params, operatorParams, publisher, options);
      return signConvertUpBlueprint(requisition, walletClient);
    },
  };
}

// Common parameter presets
export const CONVERT_UP_PRESETS = {
  conservative: {
    slippageRatio: parseEther("0.005"), // 0.5%
    maxPriceToConvertUp: parseEther("1.02"), // 2% above peg
    minPriceToConvertUp: parseEther("0.98"), // 2% below peg
  },
  aggressive: {
    slippageRatio: parseEther("0.02"), // 2%
    maxPriceToConvertUp: parseEther("1.1"), // 10% above peg
    minPriceToConvertUp: parseEther("0.9"), // 10% below peg
  },
} as const;

// Helper utilities for parsing human-readable amounts
export const convertUpUtils = {
  parseBdv: (amount: string) => parseEther(amount),
  parseSlippage: (percent: number) => parseEther((percent / 100).toString()),
  parsePrice: (price: string) => parseEther(price),
  hoursToSeconds: (hours: number) => hours * 3600,
  daysToSeconds: (days: number) => days * 24 * 3600,
} as const;

// Main export object with all utilities
export const ConvertUpBlueprint = {
  create: createConvertUpBlueprint,
  sign: signConvertUpBlueprint,
  build: buildConvertUpBlueprint,
  presets: CONVERT_UP_PRESETS,
  utils: convertUpUtils,
  defaults: {
    params: getDefaultConvertUpParams,
    operators: getDefaultOperatorParams,
  },
} as const;
