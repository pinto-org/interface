import { TokenValue } from "@/classes/TokenValue";
import { subgraphs } from "@/constants/subgraph";
import { SiloSnapshotsDocument } from "@/generated/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useEffect, useMemo } from "react";
import { useChainId } from "wagmi";
import { useSunData } from "./useSunData";
import useTokenData from "./useTokenData";

export interface SiloSnapshot {
  deltaBeanMints: TokenValue;
  season: number;
}

export default function useSiloSnapshots() {
  const season = useSunData().data.current;
  const chainId = useChainId();
  const tokenData = useTokenData();

  const queryKey = ["siloSnapshots", { chainId: chainId }];

  const query = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return request(subgraphs[chainId].beanstalk, SiloSnapshotsDocument, {
        first: 7,
      });
    },
    select: (data) => {
      if (!data) return [];
      const snapshots = data.siloHourlySnapshots;
      const output: SiloSnapshot[] = [];
      for (const siloSnapshot of snapshots) {
        if (!siloSnapshot) {
          continue;
        }
        const _siloSnapshot: SiloSnapshot = {
          deltaBeanMints: TokenValue.fromBlockchain(siloSnapshot.deltaBeanMints || 0n, tokenData.mainToken.decimals),
          season: siloSnapshot.season,
        };
        output.push(_siloSnapshot);
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
