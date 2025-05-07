import { TokenValue } from "@/classes/TokenValue";
import { subgraphs } from "@/constants/subgraph";
import { SeasonalNewPintoSnapshotsDocument } from "@/generated/gql/pintostalk/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useEffect, useMemo } from "react";
import { useChainId } from "wagmi";
import { useSeason } from "./useSunData";
import useTokenData from "./useTokenData";

export interface SupplySnapshot {
  season: number;
  rewardBeans: TokenValue;
  floodSiloBeans: TokenValue;
  floodFieldBeans: TokenValue;
  incentiveBeans: TokenValue;
}

export default function useSupplySnapshots() {
  const season = useSeason();
  const chainId = useChainId();
  const tokenData = useTokenData();

  const queryKey = ["supplySnapshots", { chainId: chainId }];

  const query = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return request(subgraphs[chainId].beanstalk, SeasonalNewPintoSnapshotsDocument, {
        first: 48,
      });
    },
    select: (data) => {
      if (!data) return [];
      const snapshots = data.seasons;
      const output: SupplySnapshot[] = [];
      for (const supplySnapshot of snapshots) {
        if (!supplySnapshot) {
          continue;
        }
        const _supplySnapshot: SupplySnapshot = {
          season: supplySnapshot.season,
          rewardBeans: TokenValue.fromBlockchain(supplySnapshot.rewardBeans || 0n, tokenData.mainToken.decimals),
          floodSiloBeans: TokenValue.fromBlockchain(supplySnapshot.floodSiloBeans || 0n, tokenData.mainToken.decimals),
          floodFieldBeans: TokenValue.fromBlockchain(
            supplySnapshot.floodFieldBeans || 0n,
            tokenData.mainToken.decimals,
          ),
          incentiveBeans: TokenValue.fromBlockchain(supplySnapshot.incentiveBeans || 0n, tokenData.mainToken.decimals),
        };
        output.push(_supplySnapshot);
      }
      return output;
    },
    enabled: !!season,
    staleTime: Infinity,
  });

  useEffect(() => {
    query.refetch();
  }, [season]);

  return useMemo(
    () => ({
      data: query.data ?? [],
      queryKey: queryKey,
    }),
    [query.data],
  );
}
