import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useChainId } from "wagmi";
import {
  useReadBeanstalk_Bdv,
  useReadBeanstalk_GetGerminatingStem,
  useReadBeanstalk_GetTotalDeposited,
  useReadBeanstalk_GetTotalDepositedBdv,
  useReadBeanstalk_GetTotalWithdrawn,
  useReadBeanstalk_StemTipForToken,
  useReadBeanstalk_TokenSettings,
  useReadBeanstalk_TotalEarnedBeans,
  useReadBeanstalk_TotalStalk,
} from "@/generated/contractHooks";
import { SiloYieldsDocument } from "@/generated/gql/graphql";
import { TokenValue } from "@/classes/TokenValue";
import useTokenData from "./useTokenData";
import { SEEDS, STALK } from "@/constants/internalTokens";

const querySettings = {
  staleTime: 1000 * 60 * 2,
  refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
};

export function useSiloData() {
  const chainId = useChainId();
  const stalkTotal = useReadBeanstalk_TotalStalk({ query: querySettings }).data || 0n;
  // const rootsTotal = useReadBeanstalk_TotalRoots();
  const earnedBeansTotal = useReadBeanstalk_TotalEarnedBeans({ query: querySettings }).data || 0n;
  const { data: yields } = useQuery({
    queryKey: ["siloYields", { chainId: chainId }],
    queryFn: async () => request("https://graph.node.bean.money/subgraphs/name/beanstalk", SiloYieldsDocument),
  });
  const SILO_WHITELIST = useTokenData().whitelistedTokens;
  const BEAN = useTokenData().mainToken;

  const queryKeys = [];

  const data = new Map();
  SILO_WHITELIST.forEach((token) => {
    //@ts-ignore
    const { data: totalDeposited, queryKey: queryKey1 } =
      useReadBeanstalk_GetTotalDeposited({
        args: [token.address],
        query: querySettings,
      });
    queryKeys.push(queryKey1);

    const { data: totalWithdrawn, queryKey: queryKey2 } =
      useReadBeanstalk_GetTotalWithdrawn({
        args: [token.address],
        query: querySettings,
      });
    queryKeys.push(queryKey2);

    const { data: tokenBDV, queryKey: queryKey3 } =
      useReadBeanstalk_Bdv({
        args: [token.address, BigInt(10 ** token.decimals)],
        query: querySettings,
      });
    queryKeys.push(queryKey3);

    const { data: stemTip, queryKey: queryKey4 } =
      useReadBeanstalk_StemTipForToken({
        args: [token.address],
        query: querySettings,
      });
    queryKeys.push(queryKey4);

    const { data: depositedBDV, queryKey: queryKey5 } =
      useReadBeanstalk_GetTotalDepositedBdv({
        args: [token.address],
        query: querySettings,
      });
    queryKeys.push(queryKey5);

    const { data: germinatingStem, queryKey: queryKey6 } =
      useReadBeanstalk_GetGerminatingStem({
        args: [token.address],
        query: querySettings,
      });
    queryKeys.push(queryKey6);

    const { data: tokenSettings, queryKey: queryKey7 } = useReadBeanstalk_TokenSettings({
      args: [token.address],
      query: querySettings,
    });
    queryKeys.push(queryKey7);

    const index = yields?.siloYields[0].tokenAPYS.findIndex(
      (apys) => apys.token.toLowerCase() === token.address.toLowerCase(),
    );
    const yieldData = index ? yields?.siloYields[0].tokenAPYS[index] : undefined;

    data.set(token, {
      totalDeposited: TokenValue.fromBlockchain(totalDeposited || 0n, token.decimals),
      totalWithdrawn: TokenValue.fromBlockchain(totalWithdrawn || 0n, token.decimals),
      tokenBDV: TokenValue.fromBlockchain(tokenBDV || 0n, BEAN.decimals),
      stemTip: TokenValue.fromBlockchain(stemTip || 0n, BEAN.decimals),
      depositedBDV: TokenValue.fromBlockchain(depositedBDV || 0n, BEAN.decimals),
      germinatingStem: TokenValue.fromBlockchain(germinatingStem || 0n, BEAN.decimals),
      rewards: {
        seeds: TokenValue.fromBlockchain(tokenSettings?.stalkEarnedPerSeason || 0n, SEEDS.decimals),
        stalk: TokenValue.fromBlockchain(tokenSettings?.stalkIssuedPerBdv || 0n, STALK.decimals),
      },
      yields: {
        beanAPY: yieldData ? Number(yieldData.beanAPY) : 0,
        stalkAPY: yieldData ? Number(yieldData.stalkAPY) : 0,
      },
    });
  });

  return {
    tokenData: data,
    totalStalk: TokenValue.fromBlockchain(stalkTotal, STALK.decimals),
    totalEarnedBeans: TokenValue.fromBlockchain(earnedBeansTotal, BEAN.decimals),
    queryKeys: queryKeys
  };
}
