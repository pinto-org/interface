import { stringEq } from "./string";
import { Token } from "./types";

export const getTokenIndex = (token: Token) => {
  if (token.isNative && stringEq(token.symbol, "eth")) return "eth";
  return token.address.toLowerCase();
};
