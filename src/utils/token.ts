import { TokenValue } from "@/classes/TokenValue";
import { PINTO, tokens } from "@/constants/tokens";
import { Address } from "viem";
import { resolveChainId } from "./chain";
import { stringEq } from "./string";
import { AddressMap, InternalToken, SiloTokenData, Token, TokenDepositData } from "./types";
import { ChainLookup } from "./types.generic";
import { exists } from "./utils";

export const getTokenIndex = (token: Token | string | Address) => {
  if (typeof token !== "object" || typeof token === "string") {
    return token.toString().toLowerCase();
  }

  if (token.isNative && stringEq(token.symbol, "eth")) return "eth";
  return token.address.toLowerCase();
};

export const isProtocolToken = (token: Token | Address | string) => {
  if (typeof token === "object") {
    return stringEq(token.address, PINTO.address);
  }
  return stringEq(token, PINTO.address);
};

type TokenIsh = { address: Address; symbol: string } | Token | InternalToken;

const isInternalToken = (token: TokenIsh): token is InternalToken => {
  return !("address" in token);
};

/**
 * @param a - The first token
 * @param b - The second token
 * @returns True if the tokens share the same address and symbol, false otherwise
 */
export const tokensEqual = (a: TokenIsh | undefined | null, b: TokenIsh | undefined | null) => {
  if (!a || !b) return false;

  const aIsInternal = isInternalToken(a);
  const bIsInternal = isInternalToken(b);

  if (aIsInternal || bIsInternal) {
    return aIsInternal && bIsInternal && stringEq(a.symbol, b.symbol);
  }

  return stringEq(a.address, b.address) && stringEq(a.symbol, b.symbol);
};

/**
 * Sort tokens for tables, with configurable sorting modes:
 *
 * value mode:
 * 1. PINTO if owned
 * 2. Other owned tokens sorted by current USD value in descending order
 * 3. PINTO if unowned
 * 4. Remaining unowned tokens
 *
 * rewards mode:
 * 1. PINTO always first
 * 2. All other tokens sorted by seed rewards in descending order
 */
export type DepositSortMode = "value" | "rewards";
export const sortTokensForDeposits = (
  tokens: Token[],
  deposits: Map<Token, TokenDepositData>,
  mainToken: Token,
  protocolPrice: TokenValue,
  sortMode: DepositSortMode = "value",
  siloData?: Map<Token, SiloTokenData>,
) => {
  if (sortMode === "rewards") {
    if (!siloData) {
      throw new Error("Silo data is required for rewards sorting mode");
    }

    // For rewards mode, separate PINTO from other tokens
    const pintoToken = tokens.find((t) => t.address === mainToken.address);
    const otherTokens = tokens.filter((t) => t.address !== mainToken.address);

    // Sort other tokens by seed reward rate
    const sortedOtherTokens = otherTokens.sort((a, b) => {
      const aData = siloData.get(a);
      const bData = siloData.get(b);

      // Get seeds per BDV - tokens without silo data go to bottom of list
      const aSeedsPerBDV = exists(aData) ? aData.rewards.seeds : TokenValue.ZERO;
      const bSeedsPerBDV = exists(bData) ? bData.rewards.seeds : TokenValue.ZERO;

      return Number(bSeedsPerBDV.sub(aSeedsPerBDV).toHuman());
    });

    // Return PINTO first, followed by sorted tokens
    return pintoToken ? [pintoToken, ...sortedOtherTokens] : sortedOtherTokens;
  }

  // Value mode sorting starts here
  const pintoToken = tokens.find((t) => t.address === mainToken.address);
  const pintoData = pintoToken ? deposits.get(pintoToken) : undefined;
  const isPintoOwned = pintoData?.amount.gt(0);

  // Separate owned and unowned tokens (excluding PINTO)
  const [owned, unowned] = tokens
    .filter((token) => token.address !== mainToken.address)
    .reduce<[Token[], Token[]]>(
      (acc, token) => {
        const data = deposits.get(token);
        if (data?.amount.gt(0)) {
          acc[0].push(token);
        } else {
          acc[1].push(token);
        }
        return acc;
      },
      [[], []],
    );

  // Sort owned tokens by USD value
  const sortedOwned = owned.sort((a, b) => {
    const aData = deposits.get(a);
    const bData = deposits.get(b);
    const aValue = aData ? aData.currentBDV.mul(protocolPrice) : TokenValue.ZERO;
    const bValue = bData ? bData.currentBDV.mul(protocolPrice) : TokenValue.ZERO;

    return Number(bValue.sub(aValue).toHuman());
  });

  // Combine arrays for value mode
  const result: Token[] = [];

  // Add PINTO first if owned
  if (isPintoOwned && pintoToken) {
    result.push(pintoToken);
  }

  // Add other owned tokens
  result.push(...sortedOwned);

  // Add PINTO next if unowned
  if (!isPintoOwned && pintoToken) {
    result.push(pintoToken);
  }

  // Add remaining unowned tokens
  result.push(...unowned);

  return result;
};

const tokenMapByChainId = Object.entries(tokens).reduce<ChainLookup<AddressMap<Token>>>(
  (prev, [chainId, chainTokens]) => {
    prev[Number(chainId)] = chainTokens.reduce<AddressMap<Token>>((acc, token) => {
      acc[getTokenIndex(token)] = token;
      return acc;
    }, {});

    return prev;
  },
  {},
);

export const getChainToken = (chainId: number, address: Address) => {
  const token = tokenMapByChainId[resolveChainId(chainId)]?.[getTokenIndex(address)];

  if (!token) {
    throw new Error(`Token not found for ${address} on chain ${chainId}`);
  }

  return token;
};

export const getChainTokenMap = (chainId: number) => {
  const tokenMap = tokenMapByChainId[resolveChainId(chainId)];

  if (!tokenMap) {
    throw new Error(`Token map not found for chain ${chainId}`);
  }

  return tokenMap;
};

// Static whitelist addresses in their contract order
export const WHITELISTED_TOKEN_ADDRESSES: Address[] = [
  "0xb170000aeeFa790fa61D6e837d1035906839a3c8", // PINTO - index 0
  "0x3e11001CfbB6dE5737327c59E10afAB47B82B5d3", // PINTOWETH LP - index 1
  "0x3e111115A82dF6190e36ADf0d552880663A4dBF1", // PINTOcbETH LP - index 2
  "0x3e11226fe3d85142B734ABCe6e58918d5828d1b4", // PINTOcbBTC LP - index 3
  "0x3e1133aC082716DDC3114bbEFEeD8B1731eA9cb1", // PINTOUSDC LP - index 4
  "0x3e11444c7650234c748D743D8d374fcE2eE5E6C9", // PINTOWSOL LP - index 5
];

/**
 * Maps a token index to its human-readable name
 * Used for displaying token strategies in various UI components
 *
 * @param index - The token index
 * @returns A human-readable name for the token
 */
export const getTokenNameByIndex = (index: number): string => {
  // Special indices that aren't actual tokens
  if (index === 254) return "PINTO Price";
  if (index === 255) return "PINTO Seeds";

  // Check if index is within the whitelisted addresses array
  if (index >= 0 && index < WHITELISTED_TOKEN_ADDRESSES.length) {
    const address = WHITELISTED_TOKEN_ADDRESSES[index];
    try {
      // Try to get token from chain tokens
      const token = getChainToken(8453, address); // Base chain ID
      return token.symbol;
    } catch (error) {
      // If token lookup fails, return address with index
      return `Token ${index} (${address.slice(0, 6)}...${address.slice(-4)})`;
    }
  }

  // Fallback for unknown indices
  return `PINTO Token ${index}`;
};
