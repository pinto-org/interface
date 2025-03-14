import { useQuery } from "@tanstack/react-query";
import { useSeason } from "./useSunData";
import request from "graphql-request";
import { useChainId } from "wagmi";
import { subgraphs } from "@/constants/subgraph";
import {
  BeanstalkSeasonalWrappedDepositErc20Query,
  BeanstalkSeasonalWrappedDepositErc20Document as Document
} from "@/generated/gql/graphql";
import { exists } from "@/utils/utils";
import { EMAWindows } from "./useSiloAPYs";
import { formatter } from "@/utils/format";
import { truncateBeanstalkWrappedDespositsSeasons } from "./seasonal/queries/useSeasonalBeanstalkWrappedDepositsSG";

const toSafeNumber = (value: any) => {
  if (exists(value)) {
    if (typeof value === "string") return Number(value);
    if (typeof value === "number") return value;
  };

  return 0;
}

const toEMAs = (data: BeanstalkSeasonalWrappedDepositErc20Query["wrappedDepositERC20HourlySnapshots"][number]) => {
  return {
    ema24: toSafeNumber(data.apy24h),
    ema168: toSafeNumber(data.apy7d),
    ema720: toSafeNumber(data.apy30d),
    ema2160: toSafeNumber(data.apy90d),
  }
}

type SiloWrappedDepositsAPYsResult = {
  delta24h: Partial<EMAWindows<number>>;
  current: Partial<EMAWindows<number>>;
}

const transformAPYs = (
  queryResult: BeanstalkSeasonalWrappedDepositErc20Query
): SiloWrappedDepositsAPYsResult | undefined => {
  const data = queryResult.wrappedDepositERC20HourlySnapshots;
  if (!data.length) {
    return undefined;
  }

  const has24HLookback = data.length > 24;
  const lookback = has24HLookback ? toEMAs(data[data.length - 1 - 24]) : undefined;
  const current = toEMAs(data[data.length - 1]);

  const delta24h = {
    ema24: lookback?.ema24 ? current.ema24 - lookback.ema24 : 0,
    ema168: lookback?.ema168 ? current.ema168 - lookback.ema168 : 0,
    ema720: lookback?.ema720 ? current.ema720 - lookback.ema720 : 0,
    ema2160: lookback?.ema2160 ? current.ema2160 - lookback.ema2160 : 0,
  }

  return {
    current,
    delta24h,
  }
}

const formatAPY = (apy: number) => formatter.pct(apy * 100)

export function useSiloWrappedDepositsAPYs() {
  const season = useSeason();
  const chainId = useChainId();

  const truncatedSeasons = truncateBeanstalkWrappedDespositsSeasons(season - 24, season);

  const query = useQuery({
    queryKey: ['s-wrapped-deposit-apys', season],
    queryFn: async () => {
      return request(subgraphs[chainId].beanstalk, Document, {
        from: truncatedSeasons.fromSeason,
        to: truncatedSeasons.toSeason,
      });
    },
    enabled: season > 0,
    select: transformAPYs,
  });

  return {
    ...query,
    format: formatAPY,
  }
}