import { PINTO } from "@/constants/tokens";
import { Address } from "viem";
import { stringEq } from "./string";
import { InternalToken, Token } from "./types";

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
export const tokensEqual = (a: TokenIsh | undefined, b: TokenIsh | undefined) => {
  if (!a || !b) return false;

  const aIsInternal = isInternalToken(a);
  const bIsInternal = isInternalToken(b);

  if (aIsInternal || bIsInternal) {
    return aIsInternal && bIsInternal && stringEq(a.symbol, b.symbol);
  }

  return stringEq(a.address, b.address) && stringEq(a.symbol, b.symbol);
};
