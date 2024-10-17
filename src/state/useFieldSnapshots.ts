import { beanstalkAddress } from "@/generated/contractHooks";
import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";
import request from "graphql-request";
import { FieldSnapshotsDocument } from "@/generated/gql/graphql";
import { useSunData } from "./useSunData";
import { useEffect } from "react";
import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import useTokenData from "./useTokenData";
import { subgraphs } from "@/constants/subgraph";

export default function useFieldSnapshots() {

    const season = useSunData().current;
    const chainId = useChainId();
    const fieldId = beanstalkAddress[chainId];
    const tokenData = useTokenData();
 
    const query = useQuery({
        queryKey: ["fieldSnapshots", { chainId: chainId, variables: [fieldId.toLowerCase()] }],
        queryFn: async () =>
          request(subgraphs[chainId].beanstalk, FieldSnapshotsDocument, {
            fieldId: fieldId.toLowerCase(),
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
        for (const fieldSnapshot of query.data.fieldHourlySnapshots) {
            if (!fieldSnapshot) return
            const _fieldSnapshot = {
                blocksToSoldOutSoil: Number(fieldSnapshot.blocksToSoldOutSoil || 0),
                caseId: Number(fieldSnapshot.caseId || 0),
                deltaHarvestablePods: TokenValue.fromBlockchain(fieldSnapshot.deltaHarvestablePods || 0n, PODS.decimals),
                deltaHarvestedPods: TokenValue.fromBlockchain(fieldSnapshot.deltaHarvestedPods || 0n, PODS.decimals),
                deltaIssuedSoil: TokenValue.fromBlockchain(fieldSnapshot.deltaIssuedSoil || 0n, tokenData.mainToken.decimals),
                deltaNumberOfSowers: fieldSnapshot.deltaNumberOfSowers || 0,
                deltaNumberOfSows: fieldSnapshot.deltaNumberOfSows || 0,
                deltaPodIndex: TokenValue.fromBlockchain(fieldSnapshot.deltaPodIndex || 0n, PODS.decimals),
                deltaPodRate: TokenValue.fromHuman(fieldSnapshot.deltaPodRate || 0n, 18),
                deltaRealRateOfReturn: TokenValue.fromHuman(fieldSnapshot.deltaRealRateOfReturn || 0n, 18),
                deltaSoil: TokenValue.fromBlockchain(fieldSnapshot.deltaSoil || 0n, tokenData.mainToken.decimals),
                deltaSownBeans: TokenValue.fromBlockchain(fieldSnapshot.deltaSownBeans || 0n, tokenData.mainToken.decimals),
                deltaTemperature: fieldSnapshot.deltaTemperature || 0,
                deltaUnharvestablePods: TokenValue.fromBlockchain(fieldSnapshot.deltaUnharvestablePods || 0n, PODS.decimals),
                harvestablePods: TokenValue.fromBlockchain(fieldSnapshot.harvestablePods || 0n, PODS.decimals),
                harvestedPods: TokenValue.fromBlockchain(fieldSnapshot.harvestedPods || 0n, PODS.decimals),
                issuedSoil: TokenValue.fromBlockchain(fieldSnapshot.issuedSoil || 0n, tokenData.mainToken.decimals),
                numberOfSowers: fieldSnapshot.numberOfSowers || 0,
                numberOfSows: fieldSnapshot.numberOfSows || 0,
                podIndex: TokenValue.fromBlockchain(fieldSnapshot.podIndex || 0n, PODS.decimals),
                podRate: TokenValue.fromHuman(fieldSnapshot.podRate || 0n, 18).mul(100),
                realRateOfReturn: TokenValue.fromHuman(fieldSnapshot.realRateOfReturn || 0n, 18).mul(100),
                season: fieldSnapshot.season || 0,
                seasonBlock: Number(fieldSnapshot.seasonBlock || 0),
                soil: TokenValue.fromBlockchain(fieldSnapshot.soil || 0n, tokenData.mainToken.decimals),
                soilSoldOut: fieldSnapshot.soilSoldOut || false,
                sownBeans: TokenValue.fromBlockchain(fieldSnapshot.sownBeans || 0n, tokenData.mainToken.decimals),
                temperature: fieldSnapshot.temperature || 0,
                unharvestablePods: TokenValue.fromBlockchain(fieldSnapshot.unharvestablePods || 0n, PODS.decimals),
                updatedAt: fieldSnapshot.updatedAt
            };
            output.push(_fieldSnapshot);
        };
    };

    return output

}