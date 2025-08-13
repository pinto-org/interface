import { diamondABI } from "@/constants/abi/diamondABI";
import { defaultQuerySettingsNoRefetch } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { ExtendedTractorTokenStrategy, getSowOrderTokenStrategy } from "@/lib/Tractor";
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
      if (indicies.length > 1) {
        throw new Error("Multiple source token indices currently not supported");
      }

      const strat = getSowOrderTokenStrategy(indicies);

      const index = indicies[0];

      if (strat === "SPECIFIC_TOKEN") {
        return {
          addresses: [wlStatuses[index]?.token],
          type: "SPECIFIC_TOKEN",
          token: tokenMap[getTokenIndex(wlStatuses[index]?.token)] ?? undefined,
        };
      }

      return {
        type: strat,
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
