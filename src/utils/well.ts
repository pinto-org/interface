import { PoolData } from "@/state/usePriceData";
import { Token } from "./types";

export const getPintoIndex = (well: PoolData) => {
  const pintoIdx = (well.tokens ?? []).findIndex((tk) => tk.isMain);
  const nonPintoIdx = pintoIdx === 0 ? 1 : 0;

  if ((pintoIdx === 0 && nonPintoIdx !== 1) || (pintoIdx === 1 && nonPintoIdx !== 0)) {
    throw new Error("Invalid well configuration");
  }

  return {
    pinto: pintoIdx,
    nonPinto: nonPintoIdx,
  };
};

export interface BinaryWellTokenIndexes {
  main: number;
  pair: number;
}

/**
 * @param well: A well with exactly two tokens in positions 0 and 1.
 * @returns The indexes of the main protocol token and it's paired token.
 */
export const resolveBinaryWellTokenIndexes = (well: { tokens: Token[] }): BinaryWellTokenIndexes => {
  const primaryIndex = well.tokens.findIndex((token) => token.isMain);
  const pairedIndex = primaryIndex === 0 ? 1 : 0;

  if ((primaryIndex === 0 && pairedIndex !== 1) || (primaryIndex === 1 && pairedIndex !== 0)) {
    throw new Error("Well must contain exactly two tokens in positions 0 and 1");
  }

  return {
    main: primaryIndex,
    pair: pairedIndex,
  };
};
