import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";
import request from "graphql-request";
import { SiloSnapshotsDocument } from "@/generated/gql/graphql";
import { useSunData } from "./useSunData";
import { useEffect } from "react";
import { TokenValue } from "@/classes/TokenValue";
import useTokenData from "./useTokenData";

export default function useSiloSnapshots() {

    const season = useSunData().current;
    const chainId = useChainId();
    const tokenData = useTokenData();
 
    const query = useQuery({
        queryKey: ["siloSnapshots", { chainId: chainId }],
        queryFn: async () =>
          request("https://graph.bean.money/beanstalk", SiloSnapshotsDocument, {
            first: 7
          }),
        enabled: !!season,
        staleTime: Infinity
    });

    useEffect(() => {
        query.refetch()
    }, [season]);

    const output = [];

    if (query.data) {
        for (const siloSnapshot of query.data?.siloHourlySnapshots) {
            if (!siloSnapshot) return
            const _siloSnapshot = {
                deltaBeanMints: TokenValue.fromBlockchain(siloSnapshot.deltaBeanMints || 0n, tokenData.mainToken.decimals),
                season: Number(siloSnapshot.season || 0)
            };
            output.push(_siloSnapshot);
        };
    };

    return output

}