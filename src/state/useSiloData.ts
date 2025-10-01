import { TokenValue } from "@/classes/TokenValue";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { QUERY_SETTINGS, SEASONAL_SCOPE_KEY, defaultQuerySettings } from "@/constants/query";
import { subgraphs } from "@/constants/subgraph";
import { beanstalkAbi } from "@/generated/contractHooks";
import { SiloYieldsDocument } from "@/generated/gql/pintostalk/graphql";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { SiloTokenData, Token } from "@/utils/types";
import { Lookup } from "@/utils/types.generic";
import { exists } from "@/utils/utils";
import { QueryKey, useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { chunk } from "lodash";
import { useMemo } from "react";
import { useCallback } from "react";
import { MulticallResponse, Omit } from "viem";
import { useChainId, useReadContract, useReadContracts } from "wagmi";
import useTokenData, { useMainToken, useWhitelistedTokens } from "./useTokenData";

const settings = {
  query: {
    ...defaultQuerySettings,
  },
};

export function useTotalDepositedBdvPerTokenQuery() {
  const whitelistedTokens = useWhitelistedTokens();
  const diamond = useProtocolAddress();

  const select = useCallback(
    (data: FailableChainResponse<bigint>[]) => {
      return data?.reduce<Lookup<TokenValue>>((acc, curr, idx) => {
        const token = whitelistedTokens[idx];

        if (token && exists(curr.result)) {
          acc[getTokenIndex(token)] = TokenValue.fromBlockchain(curr.result, token.decimals);
        }
        return acc;
      }, {});
    },
    [whitelistedTokens],
  );

  return useReadContracts({
    contracts: whitelistedTokens.map((token) => {
      return {
        address: diamond,
        abi: beanstalkAbi,
        functionName: "getTotalDepositedBdv" as const,
        args: [token.address] as const,
      } as const;
    }),
    query: {
      enabled: !!whitelistedTokens.length,
      ...settings.query,
      select,
    },
  });
}

const makeSiloTokenData = (
  siloTokenData: SiloTokenDataResponse,
  token: Token,
  mainToken: Token,
): Omit<SiloTokenData, "yields"> => {
  const ts = siloTokenData?.[5]?.result;
  const tokenSettings: SiloTokenData["tokenSettings"] = {
    deltaStalkEarnedPerSeason: TokenValue.fromBlockchain(ts?.deltaStalkEarnedPerSeason ?? 0n, STALK.decimals),
    encodeType: ts?.encodeType ?? "0x",
    gaugePointImplementation: {
      target: ts?.gaugePointImplementation.target ?? "0x",
      selector: ts?.gaugePointImplementation.selector ?? "0x",
      encodeType: ts?.gaugePointImplementation.encodeType ?? "0x",
      data: ts?.gaugePointImplementation.data ?? "0x",
    },
    gaugePoints: ts?.gaugePoints ?? 0n,
    liquidityWeightImplementation: {
      target: ts?.liquidityWeightImplementation.target ?? "0x",
      selector: ts?.liquidityWeightImplementation.selector ?? "0x",
      encodeType: ts?.liquidityWeightImplementation.encodeType ?? "0x",
      data: ts?.liquidityWeightImplementation.data ?? "0x",
    },
    milestoneSeason: ts?.milestoneSeason ?? 0,
    milestoneStem: TokenValue.fromBlockchain(ts?.milestoneStem ?? 0n, mainToken.decimals),
    optimalPercentDepositedBdv: TokenValue.fromBlockchain(ts?.optimalPercentDepositedBdv ?? 0n, mainToken.decimals),
    selector: ts?.selector ?? "0x",
    stalkEarnedPerSeason: TokenValue.fromBlockchain(ts?.stalkEarnedPerSeason ?? 1n, SEEDS.decimals),
    stalkIssuedPerBdv: TokenValue.fromBlockchain(ts?.stalkIssuedPerBdv ?? 1n, STALK.decimals).mul(
      10 ** mainToken.decimals,
    ),
  };
  const rewards: SiloTokenData["rewards"] = {
    seeds: TokenValue.fromBlockchain(ts?.stalkEarnedPerSeason ?? 0n, SEEDS.decimals),
    stalk: TokenValue.fromBlockchain(ts?.stalkIssuedPerBdv ?? 0n, STALK.decimals).mul(10 ** mainToken.decimals),
  };

  return {
    totalDeposited: TokenValue.fromBlockchain(siloTokenData?.[0]?.result ?? 0n, token.decimals),
    tokenBDV: TokenValue.fromBlockchain(siloTokenData?.[1]?.result ?? 0n, mainToken.decimals),
    stemTip: TokenValue.fromBlockchain(siloTokenData?.[2]?.result ?? 0n, mainToken.decimals),
    depositedBDV: TokenValue.fromBlockchain(siloTokenData?.[3]?.result ?? 0n, mainToken.decimals),
    germinatingStem: TokenValue.fromBlockchain(siloTokenData?.[4]?.result ?? 0n, mainToken.decimals),
    tokenSettings,
    rewards,
    germinatingAmount: TokenValue.fromBlockchain(siloTokenData?.[6]?.result ?? 0n, token.decimals),
    germinatingBDV: TokenValue.fromBlockchain(siloTokenData?.[7]?.result ?? 0n, mainToken.decimals),
  };
};

export function useReadSiloTokensDataQuery(tokens: Token[]) {
  const protocolAddress = useProtocolAddress();
  const { mainToken } = useTokenData();

  const scopeKey = tokens.map((token) => token.address).join(",");
  const enabled = Boolean(tokens.length && tokens.every((token) => !!token.address));

  const contractFunctionParameters = tokens.flatMap((token) => {
    const shared = {
      address: protocolAddress,
      abi: beanstalkAbi,
      args: [token.address],
    } as const;

    const bdvArgs = [token.address, BigInt(10 ** (token?.decimals ?? 1))] as const;

    return [
      { ...shared, functionName: "getTotalDeposited" },
      { ...shared, functionName: "bdv", args: bdvArgs },
      { ...shared, functionName: "stemTipForToken" },
      { ...shared, functionName: "getTotalDepositedBdv" },
      { ...shared, functionName: "getGerminatingStem" },
      { ...shared, functionName: "tokenSettings" },
      { ...shared, functionName: "getTotalGerminatingAmount" },
      { ...shared, functionName: "getTotalGerminatingBdv" },
    ] as const;
  });

  // Calculate calls per token dynamically
  const callsPerToken = tokens.length > 0 ? Math.round(contractFunctionParameters.length / tokens.length) : 0;

  // Ensure we have consistent calls per token
  if (tokens.length > 0 && contractFunctionParameters.length % tokens.length !== 0) {
    throw new Error(
      `Contract parameters length (${contractFunctionParameters.length}) is not evenly divisible by tokens length (${tokens.length})`,
    );
  }

  const selectSiloTokensData = useCallback(
    // unknown here because we expect the same data type for all tokens but it is [...Type, ...Type] not [Type, Type]
    (data: unknown[]) => {
      const chunks = chunk(data, callsPerToken) as SiloTokenDataResponse[];

      if (chunks.length !== tokens.length) {
        throw new Error("tokens and chunked data length mismatch");
      }

      return tokens.reduce<[token: Token, chunk: Omit<SiloTokenData, "yields">][]>((prev, token, i) => {
        const siloTokenData = makeSiloTokenData(chunks[i], token, mainToken);
        prev.push([token, siloTokenData]);
        return prev;
      }, []);
    },
    [tokens, mainToken, callsPerToken],
  );

  return useReadContracts({
    contracts: contractFunctionParameters,
    scopeKey,
    query: {
      ...settings.query,
      enabled,
      select: selectSiloTokensData,
    },
  });
}

const useComboSiloDataQuery = () => {
  const protocolAddress = useProtocolAddress();
  const BEAN = useTokenData().mainToken;

  const selectComboSiloData = useCallback(
    (queryData: SiloDataResponse) => {
      return {
        totalStalk: TokenValue.fromBlockchain(queryData[0], STALK.decimals),
        totalEarnedBeans: TokenValue.fromBlockchain(queryData[1], BEAN.decimals),
        averageGrownStalkPerBdvPerSeason: TokenValue.fromBlockchain(queryData[2], STALK.decimals),
      };
    },
    [BEAN],
  );

  return useReadContracts({
    contracts: [
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "totalStalk" as const,
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "totalEarnedBeans" as const,
      },
      {
        address: protocolAddress,
        abi: beanstalkAbi,
        functionName: "getAverageGrownStalkPerBdvPerSeason" as const,
      },
    ],
    allowFailure: false,
    query: {
      ...settings.query,
      select: selectComboSiloData,
    },
  });
};

export function useSiloData() {
  const chainId = useChainId();
  const comboSiloData = useComboSiloDataQuery();
  const { whitelistedTokens, deWhitelistedTokens, mayBeWhitelistedTokens } = useTokenData();

  const { data: yields } = useQuery({
    queryKey: ["siloYields", { chainId: chainId }],
    queryFn: () => request(subgraphs[chainId].beanstalk, SiloYieldsDocument),
    ...settings.query,
  });

  const { data: whitelistedTokensData, ...wLTokenDataQuery } = useReadSiloTokensDataQuery(whitelistedTokens);
  const { data: deWhitelistedTokensData, ...dWLTokenDataQuery } = useReadSiloTokensDataQuery(deWhitelistedTokens);

  const wlTokenDatas = useMemo(() => {
    const keys: QueryKey[] = [];
    const data: Map<Token, SiloTokenData> = new Map();

    const wl = [...(whitelistedTokensData ?? []), ...(deWhitelistedTokensData ?? [])];

    for (const [token, wlTokenData] of wl) {
      const index = yields?.siloYields[0]?.tokenAPYS?.findIndex((apys) => stringEq(apys?.token, token?.address));
      const yieldData = index ? yields?.siloYields[0]?.tokenAPYS?.[index] : undefined;

      data.set(token, {
        ...wlTokenData,
        yields: {
          beanAPY: yieldData ? Number(yieldData.beanAPY) : 0,
          stalkAPY: yieldData ? Number(yieldData.stalkAPY) : 0,
        },
      });
    }

    return {
      tokenData: data.size !== mayBeWhitelistedTokens.length ? new Map<Token, SiloTokenData>() : data,
      queryKeys: keys,
    };
  }, [whitelistedTokensData, deWhitelistedTokensData, mayBeWhitelistedTokens, yields]);

  const keys = useMemo(
    () => [wLTokenDataQuery.queryKey, dWLTokenDataQuery.queryKey, comboSiloData.queryKey],
    [wLTokenDataQuery.queryKey, dWLTokenDataQuery.queryKey, comboSiloData.queryKey],
  );

  const isLoading = wLTokenDataQuery.isLoading || dWLTokenDataQuery.isLoading || comboSiloData.isLoading;

  return useMemo(() => {
    return {
      ...wlTokenDatas,
      queryKeys: keys,
      isLoading,
      totalStalk: comboSiloData.data?.totalStalk ?? TokenValue.ZERO,
      totalEarnedBeans: comboSiloData.data?.totalEarnedBeans ?? TokenValue.ZERO,
      averageGrownStalkPerBdvPerSeason: comboSiloData.data?.averageGrownStalkPerBdvPerSeason ?? TokenValue.ZERO,
    };
  }, [comboSiloData.data, wlTokenDatas, isLoading, keys]);
}

type SiloDataResponse = [totalStalk: bigint, totalEarnedBeans: bigint, averageGrownStalkPerBdvPerSeason: bigint];

type FailableChainResponse<T> = MulticallResponse<T, Error, true>;

type SiloTokenTokenSettings = {
  selector: `0x${string}`;
  stalkEarnedPerSeason: number;
  stalkIssuedPerBdv: number;
  milestoneSeason: number;
  milestoneStem: bigint;
  encodeType: `0x${string}`;
  deltaStalkEarnedPerSeason: number;
  gaugePoints: bigint;
  optimalPercentDepositedBdv: bigint;
  gaugePointImplementation: {
    target: `0x${string}`;
    selector: `0x${string}`;
    encodeType: `0x${string}`;
    data: `0x${string}`;
  };
  liquidityWeightImplementation: {
    target: `0x${string}`;
    selector: `0x${string}`;
    encodeType: `0x${string}`;
    data: `0x${string}`;
  };
};

type SiloTokenDataResponse = [
  totalDeposited: FailableChainResponse<bigint>,
  bdv: FailableChainResponse<bigint>,
  stemTipForToken: FailableChainResponse<bigint>,
  totalDepositedBdv: FailableChainResponse<bigint>,
  germinatingStem: FailableChainResponse<bigint>,
  tokenSettings: FailableChainResponse<SiloTokenTokenSettings>,
  germinatingAmount: FailableChainResponse<bigint>,
  germinatingBdv: FailableChainResponse<bigint>,
];

// ────────────────────────────────────────────────────────────────────────────────
// Helper Hooks
// ────────────────────────────────────────────────────────────────────────────────

export const useAverageGrownStalkPerBdv = () => {
  const protocolAddress = useProtocolAddress();
  const mainToken = useMainToken();

  const select = useCallback(
    (value: bigint) => {
      const decimals = mainToken.decimals;
      return TokenValue.fromBigInt(value, STALK.decimals - decimals);
    },
    [mainToken.decimals],
  );

  return useReadContract({
    address: protocolAddress,
    abi: beanstalkAbi,
    functionName: "getAverageGrownStalkPerBdv" as const,
    scopeKey: SEASONAL_SCOPE_KEY,
    query: {
      select,
      ...QUERY_SETTINGS.slow,
    },
  });
};
