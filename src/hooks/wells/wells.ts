import { PoolData, selectPoolsToPoolsMap, usePriceData } from "@/state/usePriceData";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { useMemo } from "react";

export function useWells() {
  const priceData = usePriceData();

  return useMemo(() => selectPoolsToPoolsMap(priceData.pools), [priceData.pools]);
}

export function useWell(token?: Token): PoolData | undefined {
  const wells = useWells();

  return useMemo(() => (token ? wells[getTokenIndex(token)] : undefined), [wells, token]);
}

export function useWellUnderlying(token: Token) {
  const well = useWell(token);

  return useMemo(() => well?.pool.tokens, [well]);
}
