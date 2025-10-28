import { diamondABI } from "@/constants/abi/diamondABI";
import { defaultQuerySettingsNoRefetch } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import {
  ExtendedTractorTokenStrategy,
  tractorTokenStrategyUtil as StrategyUtil,
  TractorOrderDynamicFundingStrategy,
} from "@/lib/Tractor";
import { getTokenIndex } from "@/utils/token";
import { useCallback } from "react";
import { useReadContract } from "wagmi";
import { useTokenMap } from "../pinto/useTokenMap";

export interface SiloWhitelistedStatus {
  token: `0x${string}`;
  isWhitelisted: boolean;
  isWhitelistedLp: boolean;
  isWhitelistedWell: boolean;
  isSoppable: boolean;
}

const useSiloGetWhitelistStatusesQuery = () => {
  const protocolAddress = useProtocolAddress();
  return useReadContract({
    abi: diamondABI,
    address: protocolAddress,
    functionName: "getWhitelistStatuses",
    query: {
      ...defaultQuerySettingsNoRefetch, // We don't need to refetch this query
    },
  });
};

type BlueprintIsh = {
  sourceTokenIndices: readonly number[];
};

const useGetTractorTokenStrategyWithBlueprint = () => {
  const { data: wlStatuses, isLoading } = useSiloGetWhitelistStatusesQuery();
  const tokenMap = useTokenMap();

  const getTokenStrategy = useCallback(
    (bp: BlueprintIsh): ExtendedTractorTokenStrategy | undefined => {
      if (!wlStatuses) return undefined;

      const indicies = bp.sourceTokenIndices;

      // If no source token indices are provided, throw an error
      if (!indicies.length) {
        throw new Error("No source token indices provided");
      }

      const strat = StrategyUtil.getSowOrderTokenStrategy(indicies);

      if (strat === "SPECIFIC_TOKEN" && indicies.length === 1) {
        const index = indicies[0];
        return {
          addresses: [wlStatuses[index]?.token],
          type: "SPECIFIC_TOKEN",
          token: tokenMap[getTokenIndex(wlStatuses[index]?.token)] ?? undefined,
        };
      }

      if (strat === "MULTI_TOKENS" && !!indicies.length) {
        const addresses = indicies.map((i) => wlStatuses[i]?.token).filter(Boolean);
        const tokens = addresses.map((address) => tokenMap[getTokenIndex(address)] ?? undefined).filter(Boolean);
        return {
          addresses,
          type: "MULTI_TOKENS",
          tokens,
        };
      }

      return {
        type: strat as "LOWEST_SEEDS" | "LOWEST_PRICE",
      };
    },
    [wlStatuses, tokenMap],
  );

  return {
    getTokenStrategy,
    isLoading,
  };
};

export { useGetTractorTokenStrategyWithBlueprint };
