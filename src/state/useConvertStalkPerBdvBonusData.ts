import { TV } from "@/classes/TokenValue";
import { diamondABI } from "@/constants/abi/diamondABI";
import { STALK } from "@/constants/internalTokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useCallback, useEffect } from "react";
import { useReadContract } from "wagmi";
import { useMainToken } from "./useTokenData";

export default function useConvertStalkPerBdvBonusData() {
  const diamond = useProtocolAddress();

  const mainToken = useMainToken();

  const query = useReadContract({
    abi: diamondABI,
    address: diamond,
    functionName: "getConvertStalkPerBdvBonusAndMaximumCapacity" as const,
    query: {
      select: useCallback(
        (data: readonly [bigint, bigint]) => {
          const [bonus, maxCapacity] = data;
          console.debug("[useConvertStalkPerBdvBonusData/select]", { bonus, maxCapacity });

          return {
            bonus: TV.fromBigInt(bonus, STALK.decimals),
            maxCapacity: TV.fromBigInt(maxCapacity, mainToken.decimals),
          };
        },
        [mainToken.decimals],
      ),
    },
  });

  useEffect(() => {
    console.log("bonusGrownStalkPerBDV", query.data);
  }, [query.data]);

  return query;
}
