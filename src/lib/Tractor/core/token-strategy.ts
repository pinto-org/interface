import { tractorHelpersABI } from "@/constants/abi/TractorHelpersABI";
import { TRACTOR_HELPERS_ADDRESS } from "@/constants/address";
import { Token } from "@/utils/types";
import { exists } from "@/utils/utils";
import { PublicClient } from "viem";
import { multicall } from "viem/actions";
import { TRACTOR_TOKEN_STRATEGY_INDICIES } from "./constants";

export const TRACTOR_TOKEN_STRATEGY_TYPES = ["LOWEST_SEEDS", "LOWEST_PRICE", "SPECIFIC_TOKEN", "MULTI_TOKENS"] as const;

export type TractorTokenStrategyType = (typeof TRACTOR_TOKEN_STRATEGY_TYPES)[number];

/**
 *
 */
export type TractorOrderSpecificTokenStrategy = {
  type: "SPECIFIC_TOKEN";
  addresses: `0x${string}`[];
};

export type TractorOrderDynamicFundingStrategy = { type: "LOWEST_SEEDS" } | { type: "LOWEST_PRICE" };

export interface ExtendedTractorOrderSpecificTokenStrategy extends TractorOrderSpecificTokenStrategy {
  token?: Token;
}

export type TractorOrderMultiTokensStrategy = {
  type: "MULTI_TOKENS";
  addresses: `0x${string}`[];
};

export interface ExtendedTractorOrderMultiTokensStrategy extends TractorOrderMultiTokensStrategy {
  tokens?: Token[];
}

// Add the TokenStrategy type
export type SowOrderTokenStrategy =
  | TractorOrderDynamicFundingStrategy
  | TractorOrderSpecificTokenStrategy
  | TractorOrderMultiTokensStrategy;

export type TractorTokenStrategy = SowOrderTokenStrategy;

// Extended type that includes token information for SPECIFIC_TOKEN
export type ExtendedTractorTokenStrategy =
  | TractorOrderDynamicFundingStrategy
  | ExtendedTractorOrderSpecificTokenStrategy
  | ExtendedTractorOrderMultiTokensStrategy;

export type TractorTokenStrategyUnion = {
  type: TractorTokenStrategyType;
  addresses?: (string | `0x${string}`)[];
};

// ────────────────────────────────────────────────────────────────────────────────
// TOKEN STRATEGY UTILITIES
// ────────────────────────────────────────────────────────────────────────────────

export async function getTractorTokenStrategyTokenIndex(
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
): Promise<number> {
  const index = await publicClient.readContract({
    address: TRACTOR_HELPERS_ADDRESS,
    abi: tractorHelpersABI,
    functionName: "getTokenIndex",
    args: [tokenAddress],
  });

  return Number(index);
}

export async function getTokenIndexesFromTractorTokenStrategy(
  pc: PublicClient,
  strategy: TractorTokenStrategyUnion,
): Promise<number[]> {
  const dynamicStrategyIndex = TRACTOR_TOKEN_STRATEGY_INDICIES[strategy.type];
  if (exists(dynamicStrategyIndex)) {
    return [dynamicStrategyIndex];
  }

  const tokens = strategy.addresses;

  if (!tokens) {
    throw new Error("Expected token address strategies to be > 0");
  }

  const result = await multicall(pc, {
    contracts: tokens.map((address) => ({
      address: TRACTOR_HELPERS_ADDRESS,
      abi: tractorHelpersABI,
      functionName: "getTokenIndex" as const,
      args: [address] as const,
    })),
  });

  return result.map((res, i) => {
    if (res.error) {
      throw new Error(`Failed to get strategy token index for token ${tokens[i]}}`);
    }

    return res.result;
  });
}

/**
 * Get the token strategy for a sow order.
 * @param indicies - The indices of the tokens to use for the order.
 * @returns The token strategy for the order.
 */
const getSowOrderTokenStrategy = (indicies: readonly number[]): TractorTokenStrategyType => {
  if (indicies.includes(TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_SEEDS)) {
    return "LOWEST_SEEDS";
  } else if (indicies.includes(TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_PRICE)) {
    return "LOWEST_PRICE";
  } else if (indicies.length > 1) {
    return "MULTI_TOKENS";
  }

  return "SPECIFIC_TOKEN";
};

const extractAddressesFromTokenStrategy = (tokenStrategy: TractorTokenStrategyUnion): `0x${string}`[] | undefined => {
  if (tokenStrategy.type === "SPECIFIC_TOKEN" || tokenStrategy.type === "MULTI_TOKENS") {
    return tokenStrategy.addresses as `0x${string}`[] | undefined;
  }
  return undefined;
};

const getTractorTokenStrategySummary = (strategy: TractorTokenStrategyUnion) => {
  const obj = {
    isSingle: false,
    isMulti: false,
    isValid: false,
    isDynamic: false,
    isLowestSeeds: false,
    isLowestPrice: false,
    type: strategy.type,
    addresses: strategy.addresses || (undefined as `0x${string}`[] | undefined),
  };

  if (isDynamicTractorTokenStrategy(strategy)) {
    obj.isDynamic = true;
    obj.isValid = true;
    if (strategy.type === "LOWEST_SEEDS") {
      obj.isLowestSeeds = true;
    } else {
      obj.isLowestPrice = true;
    }

    return obj;
  } else if (isSingleTractorTokenStrategy(strategy)) {
    obj.isValid = true;
    obj.isSingle = true;
    return obj;
  } else if (isMultiTractorTokenStrategy(strategy)) {
    obj.isValid = true;
    obj.isMulti = true;
    return obj;
  }

  return obj;
};

const isDynamicTractorTokenStrategy = (
  tokenStrategy: TractorTokenStrategyUnion,
): tokenStrategy is TractorOrderDynamicFundingStrategy => {
  return tokenStrategy.type === "LOWEST_SEEDS" || tokenStrategy.type === "LOWEST_PRICE";
};

const isMultiTractorTokenStrategy = (
  strategy: TractorTokenStrategyUnion,
): strategy is TractorOrderMultiTokensStrategy => {
  if (strategy.type === "MULTI_TOKENS") {
    return !!strategy.addresses && strategy.addresses.every((adr) => typeof adr === "string" && adr.startsWith("0x"));
  }
  return false;
};

const isSingleTractorTokenStrategy = (
  strategy: TractorTokenStrategyUnion,
): strategy is TractorOrderSpecificTokenStrategy => {
  if (strategy.type === "SPECIFIC_TOKEN") {
    return !!strategy.addresses && strategy.addresses.length === 1 && strategy.addresses[0].startsWith("0x");
  }
  return false;
};

/**
 * Get the token strategy for a tractor order.
 * @param indicies - The indices of the tokens to use for the order.
 * @returns The token strategy for the order.
 */
const getTractorOrderTokenStrategyFromIndicies = (indicies: readonly number[]) => {
  if (!indicies.length) {
    throw new Error("No source token indices provided");
  }

  if (indicies.length > 1) {
    const hasInvalid = indicies.some(
      (index) =>
        index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_PRICE ||
        index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_SEEDS,
    );
    if (hasInvalid) {
      throw new Error("Invalid token indices. LOWEST SEEDS or LOWEST PRICE cannot be used with multiple tokens.");
    }
    return "MULTI_TOKENS";
  }

  const index = indicies[0];

  if (index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_SEEDS) {
    return "LOWEST_SEEDS";
  } else if (index === TRACTOR_TOKEN_STRATEGY_INDICIES.LOWEST_PRICE) {
    return "LOWEST_PRICE";
  } else {
    return "SPECIFIC_TOKEN";
  }
};

/**
 * Type guard function that validates if a value is a valid TractorTokenStrategy.
 *
 * @param value - The value to validate
 * @returns True if the value is a valid TractorTokenStrategy, false otherwise
 */
const isTractorTokenStrategy = (value: unknown): value is TractorTokenStrategy => {
  if (!value) return false;

  const strategy = value as Record<string, unknown>;

  if (typeof strategy.type !== "string") return false;

  switch (strategy.type) {
    case "LOWEST_SEEDS":
      return true;
    case "LOWEST_PRICE":
      return true;
    default: {
      if (!("addresses" in strategy) || !Array.isArray(strategy.addresses)) {
        return false;
      }
      if (strategy.type === "SPECIFIC_TOKEN") {
        return strategy.addresses?.length && strategy.addresses.length === 1 && strategy.addresses[0].startsWith("0x");
      }
      if (strategy.type === "MULTI_TOKENS") {
        return strategy.addresses.every((addr) => typeof addr === "string" && addr.startsWith("0x"));
      }
      return false;
    }
  }
};

export const tractorTokenStrategyUtil = {
  // validation methods
  isValidStrategy: isTractorTokenStrategy,
  // type guards
  getSummary: getTractorTokenStrategySummary,
  isDynamic: isDynamicTractorTokenStrategy,
  isMulti: isMultiTractorTokenStrategy,
  isSingle: isSingleTractorTokenStrategy,
  // getters
  extractAddresses: extractAddressesFromTokenStrategy,
  getStrategyFromIndicies: getTractorOrderTokenStrategyFromIndicies,
  // misc utils
  getSowOrderTokenStrategy,
};
