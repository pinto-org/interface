import { PINTO } from "@/constants/tokens";
import { Address } from "viem";
import { stringEq } from "./string";
import { Token } from "./types";

export const getTokenIndex = (token: Token | string | Address) => {
  if (typeof token !== "object") {
    return token.toLowerCase();
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
