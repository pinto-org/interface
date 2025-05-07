import { useResolvedChainId } from "@/utils/chain";
import { ChainLookup } from "@/utils/types.generic";
import { useMemo } from "react";

export const getChainConstant = <T>(chainId: number, item: ChainLookup<T>) => {
  return item[chainId];
};

export const useChainConstant = <T>(item: ChainLookup<T>) => {
  const chainId = useResolvedChainId();
  return useMemo(() => getChainConstant(chainId, item), [item, chainId]);
};
