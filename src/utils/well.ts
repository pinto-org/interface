import { PINTO } from "@/constants/tokens";
import { stringEq } from "./string";
import { Token } from "./types";

export const getPintoIndex = (token: Token) => {
  const pintoIdx = (token.tokens ?? []).findIndex((tk) => stringEq(tk, PINTO.address));
  const nonPintoIdx = pintoIdx === 0 ? 1 : 0;

  if ((pintoIdx === 0 && nonPintoIdx !== 1) || (pintoIdx === 1 && nonPintoIdx !== 0)) {
    return undefined;
  }

  return {
    pinto: pintoIdx,
    nonPinto: nonPintoIdx,
  };
};
