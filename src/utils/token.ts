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
