import * as T from "@/constants/tokens";
import { stringEq } from "@/utils/string";
import { tokensEqual } from "@/utils/token";
import { Token } from "@/utils/types";
import { base } from "viem/chains";
import { describe, expect, it, test } from "vitest";

// Type-safe definition of required token fields to prevent runtime errors
type RequiredTokenField = keyof Pick<Token, "name" | "symbol" | "chainId" | "decimals" | "address" | "logoURI">;
const requiredTokenFields: RequiredTokenField[] = ["name", "symbol", "chainId", "decimals", "address", "logoURI"];

// Configuration type for expected token flags - allows flexible validation
type TokenTypeConfig = {
  isMain?: boolean;
  isNative?: boolean;
  isWrappedNative?: boolean;
  isSiloWrapped?: boolean;
  is3PSiloWrapped?: boolean;
  isLPUnderlying?: boolean;
  isCompositeLPWhitelisted?: boolean | "defined";
  isLP?: boolean;
  isWhitelisted?: boolean | "defined";
};

const tokenTypeConfigFields: (keyof TokenTypeConfig)[] = [
  "isMain",
  "isLP",
  "isNative",
  "isWrappedNative",
  "isWhitelisted",
  "isLPUnderlying",
  "isCompositeLPWhitelisted",
  "isSiloWrapped",
  "is3PSiloWrapped",
];

/**
 * Validates that a token has all required fields defined
 * Prevents tokens from being used if they're missing critical data
 */
function expectRequiredFields(token: Token) {
  requiredTokenFields.forEach((field) => {
    expect(token[field], `${token.symbol}.${field} should be defined`).toBeDefined();
  });
}

/**
 * Validates token boolean flags match expected configuration
 * Ensures tokens are properly categorized for protocol logic
 */
function expectTokenFlags(token: Token, expectedConfig: TokenTypeConfig) {
  tokenTypeConfigFields.forEach((field) => {
    const expectedValue = expectedConfig[field];

    if (expectedValue === true) {
      expect(token[field], `${token.symbol}.${field} should be true`).toBe(true);
    } else if (expectedValue === false) {
      expect(token[field], `${token.symbol}.${field} should be false`).toBe(false);
    } else if (expectedValue === "defined") {
      expect(token[field], `${token.symbol}.${field} should be defined`).toBeDefined();
    } else if (expectedValue === undefined) {
      expect(token[field], `${token.symbol}.${field} should be falsy`).toBeFalsy();
    }
  });
}

/**
 * Validates LP token has required structure (underlying token addresses)
 * LP tokens must reference exactly 2 underlying tokens for DEX operations
 */
function expectLPTokenStructure(token: Token) {
  expect(token.tokens?.length, `${token.symbol}.tokens.length should be 2`).toBe(2);
  expect(token.tokens, `${token.symbol}.tokens should be defined`).toBeDefined();
}

// Tests for the tokensEqual utility function used throughout the app
describe("tokensEqual utility", () => {
  test("should return true for identical tokens", () => {
    // Same object reference should always be equal
    const main = T.MAIN_TOKEN[base.id];
    expect(tokensEqual(main, main)).toBe(true);
  });

  test("should return true for tokens with same address and symbol", () => {
    // Partial objects with matching address/symbol should be considered equal
    // This is important for token lookups and comparisons
    const main = T.MAIN_TOKEN[base.id];
    expect(tokensEqual(main, { address: main.address, symbol: main.symbol })).toBe(true);
  });

  test("should return false for different tokens", () => {
    // Different tokens should never be considered equal
    // This prevents accidental token substitution in the UI
    const main = T.MAIN_TOKEN[base.id];
    const eth = T.NATIVE_TOKEN[base.id];
    const weth = T.WETH_TOKEN[base.id];

    expect(tokensEqual(main, eth)).toBe(false);
    expect(tokensEqual(eth, weth)).toBe(false);
  });

  test("should return false when comparing with undefined", () => {
    // Undefined tokens should never match valid tokens
    // Prevents crashes when tokens fail to load
    const main = T.MAIN_TOKEN[base.id];
    expect(tokensEqual(main, undefined)).toBe(false);
  });
});

// Comprehensive validation of token configurations across all token types
// These tests ensure tokens are properly configured for protocol operations
describe("Token Configs", () => {
  const main = T.MAIN_TOKEN[base.id];
  const weth = T.WETH_TOKEN[base.id];
  const eth = T.NATIVE_TOKEN[base.id];
  const LPs = T.LP_TOKENS[base.id];
  const underlying = T.UNDERLYING_TOKENS[base.id];

  // The main protocol token (PINTO) - core to all protocol operations
  describe("Main", () => {
    it("should have correct configuration", () => {
      // Main token must be properly configured as it's referenced throughout the protocol
      expectRequiredFields(main);
      expectTokenFlags(main, {
        isMain: true, // Identifies this as the core protocol token
        isWhitelisted: true,
      });
    });
  });

  // Native chain token (ETH)
  describe("Native", () => {
    it("should have correct configuration", () => {
      // Native token configuration is critical for wallet interactions
      expectRequiredFields(eth);
      expectTokenFlags(eth, {
        isNative: true, // This is the native chain token (ETH)
      });
    });
  });

  // Wrapped native token (WETH)
  describe("Wrapped Native", () => {
    it("should have correct configuration", () => {
      expectRequiredFields(weth);
      expectTokenFlags(weth, {
        isWrappedNative: true, // is WETH
        isLPUnderlying: true,
        isCompositeLPWhitelisted: false,
      });
    });
  });

  // Silo wrapped tokens (sPINTO)
  describe("Silo Wrapped", () => {
    it("should have correct configuration", () => {
      expectRequiredFields(T.S_MAIN_TOKEN[base.id]);
      expectTokenFlags(T.S_MAIN_TOKEN[base.id], {
        isSiloWrapped: true, // This is a silo-wrapped token
      });
    });
  });

  // Underlying tokens (USDC, WETH, etc.) - used as pair assets in LPs
  describe("Underlying", () => {
    const underlyingKeyedBySymbol = underlying.map((token) => [token.symbol, token]) as [string, Token][];

    it.each(underlyingKeyedBySymbol)("token %s should have correct configuration", (_symbol, token) => {
      // Underlying tokens are paired with PINTO in LP tokens
      expectRequiredFields(token);
      expectTokenFlags(token, {
        isLPUnderlying: true, // These are underlying assets of LP tokens
        isCompositeLPWhitelisted: "defined" as const,
        isWrappedNative: tokensEqual(weth, token) ? true : undefined,
      });
    });
  });

  // LP tokens - represent liquidity pool positions and can be deposited in Silo
  describe("LP", () => {
    const LPsKeyedBySymbol = LPs.map((token) => [token.symbol, token]) as [string, Token][];

    // Basic LP token configuration - flags and structure
    describe("Base LP Config", () => {
      it.each(LPsKeyedBySymbol)("%s should have correct flags", (_symbol, token) => {
        // LP tokens must be properly flagged for protocol recognition
        expectRequiredFields(token);
        expectTokenFlags(token, {
          isLP: true,
          isWhitelisted: "defined",
        });
        // LP tokens must reference their underlying token pair
        expectLPTokenStructure(token);
      });
    });

    // LP<>Underlying relationships - ensures consistency between LP and underlying tokens
    describe("LP<>Underlying", () => {
      it.each(LPsKeyedBySymbol)("%s have defined underlying pair", (symbol, token) => {
        // Every LP token must have a findable underlying pair token
        // This ensures the LP's non-PINTO underlying token is properly configured
        const pairAddress = stringEq(token.tokens?.[0], main.address) ? token.tokens?.[1] : token.tokens?.[0];
        const underlyingPairToken = T.tokens[base.id].find((t) => stringEq(t.address, pairAddress));

        expect(underlyingPairToken, `${symbol} underlying pair token should be findable`).toBeDefined();
      });

      it.each(LPsKeyedBySymbol)("%s underlying pair represents LP whitelist status", (symbol, token) => {
        // Critical business rule: underlying token's isCompositeLPWhitelisted flag
        // must match the LP token's whitelist status for proper protocol operation
        const pairAddress = stringEq(token.tokens?.[0], main.address) ? token.tokens?.[1] : token.tokens?.[0];
        const underlyingPairToken = T.tokens[base.id].find((t) => stringEq(t.address, pairAddress));

        if (token.isWhitelisted) {
          // If LP is whitelisted, underlying token should reflect this
          expect(
            underlyingPairToken?.isCompositeLPWhitelisted,
            `${symbol} -> ${underlyingPairToken?.symbol}.isCompositeLPWhitelisted should be true when LP is whitelisted`,
          ).toBe(true);
        } else {
          // If LP is not whitelisted, underlying token should reflect this
          expect(
            underlyingPairToken?.isCompositeLPWhitelisted,
            `${symbol} -> ${underlyingPairToken?.symbol}.isCompositeLPWhitelisted should be false when LP is not whitelisted`,
          ).toBe(false);
        }
      });
    });
  });
});
