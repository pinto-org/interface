import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";
import request from "graphql-request";
import { SiloSnapshotsDocument } from "@/generated/gql/graphql";
import { useSunData } from "./useSunData";
import { TokenValue } from "@/classes/TokenValue";
import useTokenData from "./useTokenData";
import { subgraphs } from "@/constants/subgraph";

export interface SiloSnapshot {
  deltaBeanMints: TokenValue;
  season: number;
}

export default function useSiloSnapshots() {
  const season = useSunData().current;
  const chainId = useChainId();
  const tokenData = useTokenData();

  const query = useQuery({
    queryKey: ["siloSnapshots", { chainId: chainId }],
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

  return useMemo(() => query.data ?? [], [query.data]);
}