import { TokenValue } from "@/classes/TokenValue";
import { ZERO_ADDRESS } from "@/constants/address";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { SiloYieldsDocument } from "@/generated/gql/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { SiloTokenData, Token } from "@/utils/types";
import { Lookup, Prettify } from "@/utils/types.generic";
import { exists } from "@/utils/utils";
import { QueryKey, useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useMemo } from "react";
import { useCallback } from "react";
import { Address, Omit } from "viem";
import { ContractFunctionParameters } from "viem";
import { UseReadContractsReturnType, useChainId, useReadContract, useReadContracts } from "wagmi";
import useTokenData, { useWhitelistedTokens } from "./useTokenData";

const settings = {
  query: {
    staleTime: 1000 * 60 * 20,
    refetchInterval: 1000 * 60 * 20, // 3 minutes, in milliseconds
  },
};

type GetTotalDepositedBDVParams = ContractFunctionParameters<typeof GetTotalDepositedBDVABI>;

type GetTotalDepositedBdvContractsResponse = Prettify<UseReadContractsReturnType<GetTotalDepositedBDVParams[], true>>;

export function useTotalDepositedBdvPerTokenQuery() {
  const whitelistedTokens = useWhitelistedTokens();
  const diamond = useProtocolAddress();

  const select = useCallback(
    (data: GetTotalDepositedBdvContractsResponse["data"]) => {
      return data?.reduce<Lookup<TokenValue>>((acc, curr, idx) => {
        const token = whitelistedTokens[idx];

        if (!token || !exists(curr.result)) return acc;
        acc[getTokenIndex(token)] = TokenValue.fromBlockchain(curr.result, token.decimals);
        return acc;
      }, {});
    },
    [whitelistedTokens],
  );

  return useReadContracts({
    contracts: whitelistedTokens.map((token) => {
      return {
        address: diamond,
        abi: GetTotalDepositedBDVABI,
        functionName: "getTotalDepositedBdv",
        args: [token.address],
      };
    }),
    query: {
      enabled: !!whitelistedTokens.length,
      ...settings.query,
      select: (data) => select(data),
    },
  });
}

function useReadSiloTokenData(token: Token | undefined) {
  const chainId = useChainId();
  const protocolAddress = beanstalkAddress[chainId as keyof typeof beanstalkAddress];

  const BEAN = useTokenData().mainToken;

  return useReadContracts({
    contracts: [
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "getTotalDeposited",
        args: [token?.address ?? ZERO_ADDRESS],
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "bdv",
        args: [token?.address ?? ZERO_ADDRESS, BigInt(10 ** (token?.decimals ?? 1))],
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "stemTipForToken",
        args: [token?.address ?? ZERO_ADDRESS],
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "getTotalDepositedBdv",
        args: [token?.address ?? ZERO_ADDRESS],
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "getGerminatingStem",
        args: [token?.address ?? ZERO_ADDRESS],
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "tokenSettings",
        args: [token?.address ?? ZERO_ADDRESS],
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "getTotalGerminatingAmount",
        args: [token?.address ?? ZERO_ADDRESS],
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "getTotalGerminatingBdv",
        args: [token?.address ?? ZERO_ADDRESS],
      },
    ],
    scopeKey: token?.address,
    query: {
      ...settings.query,
      enabled: Boolean(token?.address),
      select: (siloTokenData) => {
        // should never happen
        if (!token) return {} as Omit<SiloTokenData, "yields">;

        return {
          totalDeposited: TokenValue.fromBlockchain(siloTokenData?.[0]?.result ?? 0n, token.decimals),
          tokenBDV: TokenValue.fromBlockchain(siloTokenData?.[1]?.result ?? 0n, BEAN.decimals),
          stemTip: TokenValue.fromBlockchain(siloTokenData?.[2]?.result ?? 0n, BEAN.decimals),
          depositedBDV: TokenValue.fromBlockchain(siloTokenData?.[3]?.result ?? 0n, BEAN.decimals),
          germinatingStem: TokenValue.fromBlockchain(siloTokenData?.[4]?.result ?? 0n, BEAN.decimals),
          tokenSettings: {
            deltaStalkEarnedPerSeason: TokenValue.fromBlockchain(
              siloTokenData?.[5]?.result?.deltaStalkEarnedPerSeason ?? 0n,
              STALK.decimals,
            ),
            encodeType: siloTokenData?.[5]?.result?.encodeType as string,
            gaugePointImplementation: {
              target: siloTokenData?.[5]?.result?.gaugePointImplementation.target as Address,
              selector: siloTokenData?.[5]?.result?.gaugePointImplementation.selector as string,
              encodeType: siloTokenData?.[5]?.result?.gaugePointImplementation.encodeType as string,
              data: siloTokenData?.[5]?.result?.gaugePointImplementation.data as string,
            },
            gaugePoints: siloTokenData?.[5]?.result?.gaugePoints as bigint,
            liquidityWeightImplementation: {
              target: siloTokenData?.[5]?.result?.liquidityWeightImplementation.target as Address,
              selector: siloTokenData?.[5]?.result?.liquidityWeightImplementation.selector as string,
              encodeType: siloTokenData?.[5]?.result?.liquidityWeightImplementation.encodeType as string,
              data: siloTokenData?.[5]?.result?.liquidityWeightImplementation.data as string,
            },
            milestoneSeason: siloTokenData?.[5]?.result?.milestoneSeason as number,
            milestoneStem: TokenValue.fromBlockchain(siloTokenData?.[5]?.result?.milestoneStem ?? 0n, BEAN.decimals),
            optimalPercentDepositedBdv: TokenValue.fromBlockchain(
              siloTokenData?.[5]?.result?.optimalPercentDepositedBdv ?? 0n,
              BEAN.decimals,
            ),
            selector: siloTokenData?.[5]?.result?.selector as string,
            stalkEarnedPerSeason: TokenValue.fromBlockchain(
              siloTokenData?.[5]?.result?.stalkEarnedPerSeason ?? 1n,
              SEEDS.decimals,
            ),
            stalkIssuedPerBdv: TokenValue.fromBlockchain(
              siloTokenData?.[5]?.result?.stalkIssuedPerBdv ?? 1n,
              STALK.decimals,
            ).mul(10 ** BEAN.decimals),
          },
          rewards: {
            seeds: TokenValue.fromBlockchain(siloTokenData?.[5]?.result?.stalkEarnedPerSeason ?? 0n, SEEDS.decimals),
            stalk: TokenValue.fromBlockchain(siloTokenData?.[5]?.result?.stalkIssuedPerBdv ?? 0n, STALK.decimals).mul(
              10 ** BEAN.decimals,
            ),
          },
          germinatingAmount: TokenValue.fromBlockchain(siloTokenData?.[6]?.result ?? 0n, token.decimals),
          germinatingBDV: TokenValue.fromBlockchain(siloTokenData?.[7]?.result ?? 0n, BEAN.decimals),
        } as Omit<SiloTokenData, "yields">;
      },
    },
  });
}

export function useSiloData() {
  const chainId = useChainId();
  const protocolAddress = useProtocolAddress();

  const { data: stalkTotal = 0n } = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "totalStalk",
    args: [],
    ...settings,
  });

  const { data: earnedBeansTotal = 0n } = useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "totalEarnedBeans",
    args: [],
    ...settings,
  });

  const { data: yields } = useQuery({
    queryKey: ["siloYields", { chainId: chainId }],
    queryFn: async () => request(subgraphs[chainId].beanstalk, SiloYieldsDocument),
    ...settings,
  });

  const SILO_WHITELIST = useTokenData().whitelistedTokens;
  const BEAN = useTokenData().mainToken;

  // we have 5 whitelisted tokens
  const wlTokenData0 = useReadSiloTokenData(SILO_WHITELIST?.[0]);
  const wlTokenData1 = useReadSiloTokenData(SILO_WHITELIST?.[1]);
  const wlTokenData2 = useReadSiloTokenData(SILO_WHITELIST?.[2]);
  const wlTokenData3 = useReadSiloTokenData(SILO_WHITELIST?.[3]);
  const wlTokenData4 = useReadSiloTokenData(SILO_WHITELIST?.[4]);
  const wlTokenData5 = useReadSiloTokenData(SILO_WHITELIST?.[5]);

  const wlTokenDatas = useMemo(() => {
    const keys: QueryKey[] = [];
    const data: Map<Token, SiloTokenData> = new Map();

    const wl = [wlTokenData0, wlTokenData1, wlTokenData2, wlTokenData3, wlTokenData4, wlTokenData5];

    for (const [i, { data: wlTokenData, queryKey }] of wl.entries()) {
      const token = SILO_WHITELIST[i];

      const index = yields?.siloYields[0]?.tokenAPYS?.findIndex((apys) => stringEq(apys?.token, token?.address));
      const yieldData = index ? yields?.siloYields[0]?.tokenAPYS?.[index] : undefined;

      if (!wlTokenData) continue;

      keys.push(queryKey);
      data.set(token, {
        ...(wlTokenData satisfies Omit<SiloTokenData, "yields">),
        yields: {
          beanAPY: yieldData ? Number(yieldData.beanAPY) : 0,
          stalkAPY: yieldData ? Number(yieldData.stalkAPY) : 0,
        },
      });
    }

    return {
      tokenData: data.size !== SILO_WHITELIST.length ? new Map<Token, SiloTokenData>() : data,
      queryKeys: keys,
    };
  }, [wlTokenData0, wlTokenData1, wlTokenData2, wlTokenData3, wlTokenData4, wlTokenData5, SILO_WHITELIST, yields]);

  return {
    ...wlTokenDatas,
    totalStalk: TokenValue.fromBlockchain(stalkTotal, STALK.decimals),
    totalEarnedBeans: TokenValue.fromBlockchain(earnedBeansTotal, BEAN.decimals),
  };
}

const GetTotalDepositedBDVABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTotalDepositedBdv",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
