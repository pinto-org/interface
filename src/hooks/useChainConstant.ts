import { useResolvedChainId } from "@/utils/chain";
import { ChainLookup } from "@/utils/types.generic";
import { useMemo } from "react";

export const useChainConstant = <T>(item: ChainLookup<T>) => {
  const chainId = useResolvedChainId();
  return useMemo(() => item[chainId], [item, chainId]);
};
