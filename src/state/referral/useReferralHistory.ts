import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import { calculatePintoSown, calculateTotalPodsCreated } from "@/utils/referral";
// TODO: Uncomment after subgraph is deployed and codegen is run
// import { UserReferralHistoryDocument } from "@/generated/gql/pintostalk/graphql";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useAccount, useChainId } from "wagmi";
import useTokenData from "../useTokenData";

// TODO: Remove after codegen - temporary inline query
const UserReferralHistoryDocument = gql`
  query UserReferralHistory($referrer: Bytes!, $first: Int!) {
    referralSows(
      where: { referrer: $referrer }
      first: $first
      orderBy: blockNumber
      orderDirection: desc
    ) {
      id
      referrer
      referrerIndex
      referrerPods
      referee
      refereeIndex
      refereePods
      blockNumber
      transactionHash
      createdAt
    }
  }
`;

// Query to get season data from field snapshots
const SeasonFromBlockDocument = gql`
  query SeasonFromBlock($blockNumber: BigInt!) {
    fieldHourlySnapshots(
      first: 1
      where: { blockNumber_lte: $blockNumber }
      orderBy: blockNumber
      orderDirection: desc
    ) {
      season
      temperature
    }
  }
`;

interface UserReferralHistoryResponse {
  referralSows: Array<{
    id: string;
    referrer: string;
    referrerIndex: string;
    referrerPods: string;
    referee: string;
    refereeIndex: string;
    refereePods: string;
    blockNumber: string;
    transactionHash: string;
    createdAt: string;
  }>;
}

interface SeasonFromBlockResponse {
  fieldHourlySnapshots: Array<{
    season: number;
    temperature: number;
  }>;
}

export interface ReferralHistoryEntry {
  id: string;
  referrer: string;
  referrerIndex: string;
  referrerPods: TokenValue;
  referee: string;
  refereeIndex: string;
  refereePods: TokenValue;
  totalPodsCreated: TokenValue;
  pintoSown: TokenValue;
  season: number | null;
  temperature: number | null;
  blockNumber: string;
  transactionHash: string;
  timestamp: Date;
}

export interface UseReferralHistoryReturn {
  data: ReferralHistoryEntry[];
  isLoading: boolean;
  queryKey: string[];
}

export function useReferralHistory(limit = 100): UseReferralHistoryReturn {
  const chainId = useChainId();
  const { address } = useAccount();
  const tokenData = useTokenData();

  const queryKey = ["referralHistory", chainId.toString(), address ?? "", limit.toString()];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // First, fetch referral sows
      const sowsData = await request<UserReferralHistoryResponse>(
        subgraphs[chainId].beanstalk,
        UserReferralHistoryDocument,
        { referrer: address?.toLowerCase() as `0x${string}`, first: limit },
      );

      // For each sow, try to get season/temperature data
      const entriesWithSeasonData = await Promise.all(
        sowsData.referralSows.map(async (sow) => {
          let season: number | null = null;
          let temperature: number | null = null;

          try {
            // Try to get season data from field snapshots
            const seasonData = await request<SeasonFromBlockResponse>(
              subgraphs[chainId].beanstalk,
              SeasonFromBlockDocument,
              { blockNumber: sow.blockNumber },
            );

            if (seasonData.fieldHourlySnapshots.length > 0) {
              season = seasonData.fieldHourlySnapshots[0].season;
              temperature = seasonData.fieldHourlySnapshots[0].temperature;
            }
          } catch (e) {
            // If season lookup fails, continue without it
            console.warn("Failed to fetch season data for block:", sow.blockNumber);
          }

          return { ...sow, season, temperature };
        }),
      );

      return entriesWithSeasonData;
    },
    enabled: !!address,
    select: (data) => {
      return data.map((sow) => {
        const referrerPods = TokenValue.fromBlockchain(sow.referrerPods, PODS.decimals);
        const refereePods = TokenValue.fromBlockchain(sow.refereePods, PODS.decimals);

        // Client-side calculation: totalPodsCreated = referrerPods + refereePods
        const totalPodsCreatedStr = calculateTotalPodsCreated(sow.referrerPods, sow.refereePods);
        const totalPodsCreated = TokenValue.fromBlockchain(totalPodsCreatedStr, PODS.decimals);

        // Client-side calculation: pintoSown = refereePods / (1 + temperature/100)
        let pintoSown = TokenValue.ZERO;
        if (sow.temperature !== null) {
          const pintoSownStr = calculatePintoSown(sow.refereePods, sow.temperature);
          pintoSown = TokenValue.fromBlockchain(pintoSownStr, tokenData.mainToken.decimals);
        }

        return {
          id: sow.id,
          referrer: sow.referrer,
          referrerIndex: sow.referrerIndex,
          referrerPods,
          referee: sow.referee,
          refereeIndex: sow.refereeIndex,
          refereePods,
          totalPodsCreated,
          pintoSown,
          season: sow.season,
          temperature: sow.temperature,
          blockNumber: sow.blockNumber,
          transactionHash: sow.transactionHash,
          timestamp: new Date(Number(sow.createdAt) * 1000),
        };
      });
    },
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    queryKey,
  };
}
