import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { STALK } from "@/constants/internalTokens";
import { SEASONAL_SCOPE_KEY, defaultQuerySettings } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useCallback, useEffect } from "react";
import { useReadContract } from "wagmi";
import { useMainToken } from "./useTokenData";

/**
 * Returns the grown stalk per BDVbonus and maximum grown stalk bonus capacity for the given season of the protocol
 * @param enabled
 * @returns
 */
const useConvertStalkPerBdvBonusAndMaximumCapacity = (enabled?: boolean) => {
  const diamondAddress = useProtocolAddress();
  const mainToken = useMainToken();

  const select = useCallback(
    (data: readonly [bonus: bigint, maxCapacity: bigint]) => {
      const [bonus, maxCapacity] = data;
      return {
        bonus: TV.fromBigInt(bonus, STALK.decimals),
        maxCapacity: TV.fromBigInt(maxCapacity, mainToken.decimals),
      };
    },
    [mainToken.decimals],
  );

  const query = useReadContract({
    abi: diamondABI,
    address: diamondAddress,
    functionName: "getConvertStalkPerBdvBonusAndMaximumCapacity" as const,
    scopeKey: SEASONAL_SCOPE_KEY,
    query: {
      enabled: enabled ?? true,
      ...defaultQuerySettings,
      select,
    },
  });

  useEffect(() => {
    console.log("convertStalkPerBdvBonusAndMaximumCapacity", query.data);
  }, [query.data]);

  return query;
};

export default useConvertStalkPerBdvBonusAndMaximumCapacity;

/**
 * Returns the remaining convert capacity for the given season of the protocol
 * @param enabled
 * @returns
 */
export const useConvertGrownStalkBonusRemainingCapacity = (enabled?: boolean) => {
  const diamondAddress = useProtocolAddress();
  const mainToken = useMainToken();

  const select = useCallback(
    (data: readonly [bonus: bigint, maxCapacity: bigint]) => {
      const [_, remainingCapacity] = data;
      return TV.fromBigInt(remainingCapacity, mainToken.decimals);
    },
    [mainToken.decimals],
  );

  const query = useReadContract({
    abi: diamondABI,
    address: diamondAddress,
    functionName: "getConvertStalkPerBdvBonusAndRemainingCapacity" as const,
    query: {
      enabled: enabled ?? true,
      ...defaultQuerySettings,
      select,
    },
  });

  return query;
};
