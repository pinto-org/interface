import { PoolData } from "@/state/usePriceData";

export const getPintoIndex = (well: PoolData) => {
  const pintoIdx = (well.tokens ?? []).findIndex((tk) => tk.isMain);
  const nonPintoIdx = pintoIdx === 0 ? 1 : 0;

  if ((pintoIdx === 0 && nonPintoIdx !== 1) || (pintoIdx === 1 && nonPintoIdx !== 0)) {
    return undefined;
  }

  return {
    pinto: pintoIdx,
    nonPinto: nonPintoIdx,
  };
};
