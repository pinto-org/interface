import { TV } from "@/classes/TokenValue";
import { API_SERVICES } from "@/constants/endpoints";
import { PODS } from "@/constants/internalTokens";
import { defaultQuerySettings } from "@/constants/query";
import { SG_FETCH_DISABLED } from "@/constants/subgraph";
import { MAIN_TOKEN } from "@/constants/tokens";
import { getChainConstant } from "@/utils/chain";
import { Prettify } from "@/utils/types.generic";
import { DefaultError, QueryObserverOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { TEMPERATURE_DECIMALS } from "./protocol/field";

export type FieldPlotSummaryParams<T extends string | number = number> = {
  bucketSize?: T;
  onlyHarvested?: boolean;
  onlyUnharvested?: boolean;
};

type BaseFieldPlotSummaryResponse = {
  startSeason: number;
  numPlots: number;
  endSeason: number;
};

type RawFieldPlotBucketSummary = Prettify<
  {
    startTimestamp: string;
    startIndex: string;
    endIndex: string;
    avgSownBeansPerPod: number;
    endTimestamp: string;
  } & BaseFieldPlotSummaryResponse
>;

export type FieldPlotBucketSummary = Prettify<
  {
    startTimestamp: number;
    endTimestamp: number;
    bucketSize: number;
    startIndex: TV;
    endIndex: TV;
    avgSownBeansPerPod: TV;
    avgTemperature: TV;
    bucketIndex: number;
  } & BaseFieldPlotSummaryResponse
>;

export interface AggregatedFieldPlotsSummary extends Omit<FieldPlotBucketSummary, "bucketIndex"> {
  data: FieldPlotBucketSummary[];
}

const endpoint = API_SERVICES.pinto;
const DEFAULT_BUCKET_SIZE = 50_000;

const requestArgs = {
  method: "GET",
  headers: new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  }),
} as const;

const combineURLParams = (params: FieldPlotSummaryParams = {}) => {
  const urlParams = new URLSearchParams({
    bucketSize: params?.bucketSize?.toString() ?? DEFAULT_BUCKET_SIZE?.toString(),
    onlyHarvested: params?.onlyHarvested?.toString() ?? "false",
    onlyUnharvested: params?.onlyUnharvested?.toString() ?? "true",
  });

  return urlParams;
};

const makeRequest = async (args: URLSearchParams, chainId: number) => {
  const mainToken = getChainConstant(chainId, MAIN_TOKEN);
  const url = `${endpoint}/field/plots-summary?${args.toString()}`;

  const data: RawFieldPlotBucketSummary[] = await fetch(url, { ...requestArgs }).then((r) => r.json());

  return data.map((r, i): FieldPlotBucketSummary => {
    const startIndex = TV.fromBlockchain(r.startIndex, PODS.decimals);
    const endIndex = TV.fromBlockchain(r.endIndex, PODS.decimals);
    const avgSownBeansPerPod = TV.fromHuman(r.avgSownBeansPerPod, mainToken.decimals);
    const avgTemperature = TV.fromHuman(1, avgSownBeansPerPod.decimals).div(avgSownBeansPerPod).sub(1).mul(100);

    return {
      ...r,
      bucketIndex: i,
      bucketSize: endIndex.sub(startIndex).toNumber(),
      startTimestamp: new Date(r.startTimestamp).getTime(),
      endTimestamp: new Date(r.endTimestamp).getTime(),
      startIndex,
      endIndex,
      avgSownBeansPerPod,
      avgTemperature,
    };
  });
};

export type UseBucketedFieldPlotSummaryOptions<T> = FieldPlotSummaryParams &
  Pick<QueryObserverOptions<FieldPlotBucketSummary[] | undefined, DefaultError, T>, "select">;

export default function useBucketedFieldPlotSummary<Data>({
  select,
  ...args
}: UseBucketedFieldPlotSummaryOptions<Data> = {}) {
  // Hooks
  const chainId = useChainId();

  // Query
  const params = combineURLParams(args);

  const paramsStr = params.toString();

  const queryKey = useMemo(() => ["fieldPlotSummary", paramsStr], [paramsStr]);

  return useQuery<FieldPlotBucketSummary[], DefaultError, Data>({
    queryKey,
    queryFn: () => makeRequest(params, chainId),
    select,
    ...defaultQuerySettings,
    enabled: !SG_FETCH_DISABLED,
  });
}

const tiers = [1_000_000, 500_000, 250_000, 100_000, 50_000] as const;
const REASONABLE_BUCKET_SIZE_RANGE = [10, 50] as const;

type AggregateFieldPlotBucketSummaryOptions = {
  // the minimum aggregated buckets
  min?: number;
  // the maximum aggregated buckets
  max?: number;
};

// opt for the tier that is the closest to the number of buckets we want
const getBucketSize = (pods: number, options?: AggregateFieldPlotBucketSummaryOptions) => {
  const min = options?.min ?? REASONABLE_BUCKET_SIZE_RANGE[0];
  const max = options?.max ?? REASONABLE_BUCKET_SIZE_RANGE[1];

  const reversedTiers = [...tiers].reverse();

  const bucketSize = reversedTiers.find((tier) => {
    const buckets = Math.ceil(pods / tier);
    return buckets >= min && buckets <= max;
  });

  return bucketSize ?? min;
};

const emptySummary: AggregatedFieldPlotsSummary = {
  startSeason: 0,
  endSeason: 0,
  numPlots: 0,
  startTimestamp: 0,
  endTimestamp: 0,
  startIndex: TV.ZERO,
  endIndex: TV.ZERO,
  avgSownBeansPerPod: TV.ZERO,
  avgTemperature: TV.ZERO,
  bucketSize: 0,
  data: [],
} as const;

// In the case where we have too many bars, we want to combine them into a single bar
export const aggregateFieldPlotBucketSummary = (
  data: FieldPlotBucketSummary[] | undefined,
  options?: AggregateFieldPlotBucketSummaryOptions,
) => {
  // If there is no data, return an empty array
  if (!data?.length) return { ...emptySummary };

  const toAggregatedFieldPlotsSummary = (data: FieldPlotBucketSummary[]): AggregatedFieldPlotsSummary => {
    const firstData = data[0];
    const lastData = data[data.length - 1];

    const datum = {
      ...emptySummary,
      startSeason: firstData.startSeason,
      endSeason: lastData.endSeason,
      startTimestamp: firstData.startTimestamp,
      endTimestamp: lastData.endTimestamp,
      startIndex: firstData.startIndex,
      endIndex: lastData.endIndex,
      data,
      ...getWeightedAverages(data),
    };

    return datum;
  };

  const first = data[0];
  const last = data[data.length - 1];

  const currBucketSize = first.bucketSize;
  const totalCount = last.endIndex.sub(first.startIndex);
  const aggregatedBucketSize = getBucketSize(totalCount.toNumber(), options);

  const combineCount = Math.ceil(aggregatedBucketSize / currBucketSize);

  // We want to combine x data points into a single bar
  if (combineCount <= 1) return toAggregatedFieldPlotsSummary(data);

  const aggregated: FieldPlotBucketSummary[] = [];

  let buckets: FieldPlotBucketSummary[] = [];
  let idx = 0;
  let curr: FieldPlotBucketSummary = data[0];

  while (idx < data.length) {
    while (buckets.length < combineCount && idx < data.length) {
      curr = data[idx];
      buckets.push(curr);
      idx += 1;
    }

    const start = buckets[0];
    const end = buckets[buckets.length - 1];

    aggregated.push({
      startSeason: start.startSeason,
      endSeason: end.endSeason,
      startTimestamp: start.startTimestamp,
      endTimestamp: end.endTimestamp,
      startIndex: start.startIndex,
      endIndex: end.endIndex,
      bucketSize: end.endIndex.sub(start.startIndex).toNumber(),
      bucketIndex: aggregated.length,
      ...getWeightedAverages(buckets),
    });

    buckets = [];
  }

  return toAggregatedFieldPlotsSummary(aggregated);
};

const getWeightedAverages = (data: FieldPlotBucketSummary[]) => {
  let weightedSum = TV.fromHuman(0, PODS.decimals);
  let totalWeight = TV.fromHuman(0, PODS.decimals);
  let numPlots = 0;

  for (const item of data) {
    numPlots += item.numPlots;
    weightedSum = weightedSum.add(item.avgSownBeansPerPod.mul(item.bucketSize));
    totalWeight = totalWeight.add(item.bucketSize);
  }

  const avgSownBeansPerPod = totalWeight.gt(0) ? weightedSum.div(totalWeight) : TV.ZERO;
  const avgTemperature = TV.fromHuman(1, TEMPERATURE_DECIMALS).div(avgSownBeansPerPod).sub(1).mul(100);

  return { avgSownBeansPerPod, avgTemperature, numPlots };
};
