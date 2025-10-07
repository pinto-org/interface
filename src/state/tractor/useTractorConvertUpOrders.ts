import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { QUERY_SETTINGS, defaultQuerySettingsMedium } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import {
  ConvertUpOrderbookEntry,
  TractorAPI,
  TractorAPIOrdersResponse,
  loadConvertUpOrderbookData,
} from "@/lib/Tractor";
import { HashString } from "@/utils/types.generic";
import { isDev } from "@/utils/utils";
import { DefaultError, QueryObserverOptions, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useChainId, usePublicClient } from "wagmi";
import { queryKeys } from "../queryKeys";

const getLookbackBlocks = (
  chainOnly: boolean,
  error: boolean,
  currentBlock: bigint,
  lastUpdatedBlock: number | undefined,
) => {
  if (chainOnly || error) return undefined;
  if (!lastUpdatedBlock) {
    if (isDev()) {
      return TIME_TO_BLOCKS.day;
    }

    return undefined;
  }
  const diff = currentBlock - BigInt(lastUpdatedBlock);
  return diff > 0n ? diff : undefined;
};

type UseTractorAPISowOrdersParams = Omit<UseTractorConvertOrderbookOptions<TractorAPIOrdersResponse>, "select">;

const useTractorAPIConvertUpOrders = ({
  address,
  cancelled = false,
  chainOnly,
  enabled,
}: UseTractorAPISowOrdersParams = {}) => {
  const chainId = useChainId();

  const args = {
    publisher: address,
    // orderType: "CONVERT_UP",
    cancelled,
  } as const;

  const query = useQuery({
    queryKey: queryKeys.tractor.convertUpOrders({ ...args }),
    queryFn: async () => {
      if (!chainId) return;
      return TractorAPI.getOrders<"CONVERT_UP_V0">({ ...args, orderType: "CONVERT_UP_V0", isConvert: true });
    },
    enabled: !!chainId && !chainOnly && !!enabled,
    ...QUERY_SETTINGS.slow,
  });

  useEffect(() => {
    if (query.data) {
      console.log("query.data", query.data);
    }
  }, [query.data]);

  return query;
};

type UseTractorConvertOrderbookOptions<T = ConvertUpOrderbookEntry[]> = {
  /** The Blueprint Publisher Address If none provided, all orders will be returned */
  address?: HashString;
  /**
   * If true, only cancelled orders will be returned
   * If false, only uncompleted orders will be returned
   * If undefined, all orders will be returned
   */
  cancelled?: boolean;
  /**
   * If false, only completed orders will be returned
   * If true, only uncompleted orders will be returned
   * If undefined, all orders will be returned
   */
  filterOutCompleted?: boolean;
  /**
   * If true, only fetch data from on-chain.
   */
  chainOnly?: boolean;
  /**
   * Whether queries are enabled.
   */
  enabled?: boolean;
} & Pick<QueryObserverOptions<any[] | undefined, DefaultError, T>, "select">;

const empty: UseTractorConvertOrderbookOptions<ConvertUpOrderbookEntry[]> = {
  enabled: true,
};

export function useTractorConvertUpOrderbook<T = ConvertUpOrderbookEntry[]>(
  params?: UseTractorConvertOrderbookOptions<T>,
) {
  const chainId = useChainId();
  const client = usePublicClient({ chainId });
  const diamond = useProtocolAddress();

  const { address, chainOnly = false, enabled } = params ?? empty;

  const apiOrdersQuery = useTractorAPIConvertUpOrders({
    address,
    cancelled: params?.cancelled,
    chainOnly,
    enabled,
  });

  const orderQueriesError = false;
  const lastUpdated = apiOrdersQuery.data?.lastUpdated;

  const ordersChainQuery = useQuery({
    queryKey: queryKeys.tractor.convertUpOrdersV0Chain(lastUpdated ?? chainOnly ? 1 : 0, params),
    queryFn: async () => {
      if (!client) return [];
      const latestBlock = await client.getBlock({ blockTag: "latest" });
      const lookbackBlocks = getLookbackBlocks(chainOnly, orderQueriesError, latestBlock.number, lastUpdated);

      const events = await loadConvertUpOrderbookData(address, diamond, client, latestBlock, [], lookbackBlocks, {
        filterOutCompleted: params?.filterOutCompleted ?? true,
      });

      return events;
    },
    enabled: enabled && !!client,
    select: params?.select,
    ...defaultQuerySettingsMedium,
  });

  return ordersChainQuery;
}
