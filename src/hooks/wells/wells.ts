import { usePriceData } from "@/state/usePriceData";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { keyBy } from "lodash";
import { useMemo } from "react";

export function useWells() {
  const priceData = usePriceData();

  return useMemo(() => keyBy(priceData.pools, (p) => getTokenIndex(p.pool)), [priceData.pools]);
}

export function useWell(token: Token) {
  const wells = useWells();

  return useMemo(() => wells[getTokenIndex(token)], [wells, token]);
}

export function useWellUnderlying(token: Token) {
  const well = useWell(token);

  return useMemo(() => well?.pool.tokens, [well]);
}
