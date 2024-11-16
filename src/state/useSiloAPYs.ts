import { TV } from "@/classes/TokenValue";
import { beanstalkAbi } from "@/generated/contractHooks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { Lookup } from "@/utils/types.generic";
import { exists } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useReadContracts } from "wagmi";
import { useSiloData } from "./useSiloData";
import useTokenData from "./useTokenData";

type EmaWindow = 24 | 168 | 720;

const sharedSettings = {
  staleTime: 1000 * 60 * 20,
  refetchInterval: 1000 * 60 * 20,
};

export type SiloTokenEMAYield = {
  bean: number;
  ownership: number;
  stalk: number;
};

export interface SiloYieldsAPIResponse {
  ema: {
    [key in EmaWindow]: {
      beansPerSeason: string;
      effectiveWindow: number | EmaWindow;
    };
  };
  initType: "NEW" | "AVERAGE" | "CUSTOM";
  season: number;
  yields: {
    [key in EmaWindow]: {
      [tokenAddress: string]: SiloTokenEMAYield;
    };
  };
}

export function useSiloYieldsQuery() {
  return useQuery<SiloYieldsAPIResponse>({
    queryKey: ["api", "silo", "yields"],
    queryFn: async () => {
      const res = await fetch("https://api.bean.money/silo/yield", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    },
    ...sharedSettings,
  });
}

const selectTotalDepositedBdvPerToken = (
  data: (
    | {
        error: Error;
        result?: undefined;
        status: "failure";
      }
    | {
        error?: undefined;
        result: bigint;
        status: "success";
      }
  )[],
  whitelistedTokens: Token[],
) => {};

function useTotalDepositedBdvPerTokenQuery() {
  const siloYieldsQuery = useSiloYieldsQuery();
  const { whitelistedTokens } = useTokenData();

  const diamond = useProtocolAddress();

  return useReadContracts({
    contracts: whitelistedTokens.map((token) => {
      return {
        address: diamond,
        abi: abi,
        functionName: "getTotalDepositedBdv",
        args: [token.address],
      };
    }),
    query: {
      enabled: !!whitelistedTokens.length,
      ...sharedSettings,
      select: (data) => {
        return data?.reduce<Lookup<TV>>((acc, curr, idx) => {
          const token = whitelistedTokens[idx];
          if (!token || !exists(curr.result)) return acc;
          acc[getTokenIndex(token)] = TV.fromBlockchain(curr.result, token.decimals);
          return acc;
        }, {});
      },
    },
  });
}

export default function useSiloAPYs() {
  const siloYieldsQuery = useSiloYieldsQuery();
  const { whitelistedTokens } = useTokenData();

  const diamond = useProtocolAddress();

  const datas = useReadContracts({
    contracts: whitelistedTokens.map((token) => {
      return {
        address: diamond,
        abi: abi,
        functionName: "getTotalDepositedBdv",
        args: [token.address],
      };
    }),
    query: {
      enabled: !!whitelistedTokens.length,
      ...sharedSettings,
      select: (data) => {
        return data?.reduce<Lookup<TV>>((acc, curr, idx) => {
          const token = whitelistedTokens[idx];
          if (!token || !exists(curr.result)) return acc;
          acc[getTokenIndex(token)] = TV.fromBlockchain(curr.result, token.decimals);
          return acc;
        }, {});
      },
    },
  });
}

const abi = [
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
