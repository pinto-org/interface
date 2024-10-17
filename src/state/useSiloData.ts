import { QueryKey, useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useChainId, useReadContracts } from "wagmi";
import {
  beanstalkAbi,
  beanstalkAddress,
  useReadBeanstalk_TotalEarnedBeans,
  useReadBeanstalk_TotalStalk,
} from "@/generated/contractHooks";
import { SiloYieldsDocument } from "@/generated/gql/graphql";
import { TokenValue } from "@/classes/TokenValue";
import useTokenData from "./useTokenData";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { Address } from "viem";
import { subgraphs } from "@/constants/subgraph";

const settings = {
  query: {
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
  }
};

export function useSiloData() {
  const chainId = useChainId();
  const protocolAddress = beanstalkAddress[chainId as keyof typeof beanstalkAddress];

  const stalkTotal = useReadBeanstalk_TotalStalk({ ...settings }).data || 0n;
  const earnedBeansTotal = useReadBeanstalk_TotalEarnedBeans({ ...settings }).data || 0n;
  const { data: yields } = useQuery({
    queryKey: ["siloYields", { chainId: chainId }],
    queryFn: async () => request(subgraphs[chainId].beanstalk, SiloYieldsDocument),
  });
  const SILO_WHITELIST = useTokenData().whitelistedTokens;
  const BEAN = useTokenData().mainToken;

  const queryKeys: QueryKey[] = [];

  const data = new Map();
  SILO_WHITELIST.forEach((token) => {
    const contractCalls = [
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: 'getTotalDeposited',
        args: [token.address]
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: 'bdv',
        args: [token.address, BigInt(10 ** token.decimals)]
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: 'stemTipForToken',
        args: [token.address]
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: 'getTotalDepositedBdv',
        args: [token.address]
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: 'getGerminatingStem',
        args: [token.address]
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: 'tokenSettings',
        args: [token.address]
      }
    ];

    const result = useReadContracts({
      contracts: contractCalls,
      ...settings
    });
    const siloTokenData = result.data as Array<{ result: any, status: string }>

    const index = yields?.siloYields[0].tokenAPYS.findIndex(
      (apys) => apys.token.toLowerCase() === token.address.toLowerCase(),
    );
    const yieldData = index ? yields?.siloYields[0].tokenAPYS[index] : undefined;

    if (siloTokenData) {
      data.set(token, {
        totalDeposited: TokenValue.fromBlockchain(siloTokenData[0].result || 0n, token.decimals),
        tokenBDV: TokenValue.fromBlockchain(siloTokenData[1].result || 0n, BEAN.decimals),
        stemTip: TokenValue.fromBlockchain(siloTokenData[2].result || 0n, BEAN.decimals),
        depositedBDV: TokenValue.fromBlockchain(siloTokenData[3].result || 0n, BEAN.decimals),
        germinatingStem: TokenValue.fromBlockchain(siloTokenData[4].result || 0n, BEAN.decimals),
        tokenSettings: {
          deltaStalkEarnedPerSeason: TokenValue.fromBlockchain(siloTokenData[5].result.deltaStalkEarnedPerSeason || 0n, STALK.decimals),
          encodeType: siloTokenData[5].result.encodeType as string,
          gaugePointImplementation: {
            target: siloTokenData[5].result.gaugePointImplementation.target as Address, 
            selector: siloTokenData[5].result.gaugePointImplementation.selector as string, 
            encodeType: siloTokenData[5].result.gaugePointImplementation.encodeType as string, 
            data: siloTokenData[5].result.gaugePointImplementation.data as string
          },
          gaugePoints: siloTokenData[5].result.gaugePoints as bigint,
          liquidityWeightImplementation: {
            target: siloTokenData[5].result.liquidityWeightImplementation.target as Address, 
            selector: siloTokenData[5].result.liquidityWeightImplementation.selector as string, 
            encodeType: siloTokenData[5].result.liquidityWeightImplementation.encodeType as string, 
            data: siloTokenData[5].result.liquidityWeightImplementation.data as string
          },
          milestoneSeason: siloTokenData[5].result.milestoneSeason as number,
          milestoneStem: TokenValue.fromBlockchain(siloTokenData[5].result.milestoneStem || 0n, BEAN.decimals),
          optimalPercentDepositedBdv: TokenValue.fromBlockchain(siloTokenData[5].result.optimalPercentDepositedBdv || 0n, BEAN.decimals),
          selector: siloTokenData[5].result.selector as string,
          stalkEarnedPerSeason: TokenValue.fromBlockchain(siloTokenData[5].result.stalkEarnedPerSeason || 0n, SEEDS.decimals),
          stalkIssuedPerBdv: TokenValue.fromBlockchain(siloTokenData[5].result.stalkIssuedPerBdv || 0n, STALK.decimals),
        },
        rewards: {
          seeds: TokenValue.fromBlockchain(siloTokenData[5].result.stalkEarnedPerSeason || 0n, SEEDS.decimals),
          stalk: TokenValue.fromBlockchain(siloTokenData[5].result.stalkIssuedPerBdv || 0n, STALK.decimals),
        },
        yields: {
          beanAPY: yieldData ? Number(yieldData.beanAPY) : 0,
          stalkAPY: yieldData ? Number(yieldData.stalkAPY) : 0,
        },
      });
    };

    queryKeys.push(result.queryKey);
  });

  console.log("tokendata: ", data)

  return {
    tokenData: data,
    totalStalk: TokenValue.fromBlockchain(stalkTotal, STALK.decimals),
    totalEarnedBeans: TokenValue.fromBlockchain(earnedBeansTotal, BEAN.decimals),
    queryKeys: queryKeys
  };
}
