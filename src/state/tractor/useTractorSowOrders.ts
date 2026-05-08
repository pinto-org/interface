import { TV } from "@/classes/TokenValue";
import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { defaultQuerySettings, defaultQuerySettingsMedium } from "@/constants/query";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { OrderbookEntry, TractorAPI, TractorAPIOrdersResponse, loadOrderbookData } from "@/lib/Tractor";
import { TEMPERATURE_DECIMALS } from "@/state/protocol/field";
import { queryKeys } from "@/state/queryKeys";
import { useTemperature } from "@/state/useFieldData";
import { useSeason } from "@/state/useSunData";
import { getChainConstant } from "@/utils/chain";
import { resolveChainId } from "@/utils/chain";
import { HashString } from "@/utils/types.generic";
import { isDev } from "@/utils/utils";
import { DefaultError, QueryObserverOptions, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useChainId, usePublicClient } from "wagmi";

// Add 2 mins (60 blocks) of buffer b/c it takes some time for the API to update
const PROPOGATION_BLOCK_DIFF = 60n;

const getLookbackBlocks = (
  chainOnly: boolean,
  error: boolean,
  currentBlock: bigint,
  lastUpdatedBlock: number | undefined,
) => {
  if (chainOnly || error || !lastUpdatedBlock) return undefined;
  if (isDev()) {
    return TIME_TO_BLOCKS.day;
  }
  const diff = currentBlock - BigInt(lastUpdatedBlock) + PROPOGATION_BLOCK_DIFF;
  return diff > 0n ? diff : undefined;
};

type UseTractorAPISowOrdersParams = Omit<UseTractorSowOrderbookOptions<TractorAPIOrdersResponse>, "select">;

const useTractorAPISowOrders = ({
  address,
  cancelled = false,
  chainOnly,
  enabled,
}: UseTractorAPISowOrdersParams = {}) => {
  const chainId = useChainId();

  // biome-ignore lint/correctness/useExhaustiveDependencies: only re-run when the address / chainId changes
  const selectAndTransformOrders = useMemo(() => transformAPIOrderbookData(chainId), [chainId, address]);

  const args = { publisher: address, orderType: "SOW", cancelled } as const;

  const queryKey = queryKeys.tractor.sowOrdersV0({ ...args });

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!chainId)
        return {
          lastUpdated: 0,
          totalRecords: 0,
          orders: [],
        };

      const response = await TractorAPI.getOrders<"SOW">({ ...args, orderType: "SOW" });
      return response;
    },
    enabled: !!chainId && !chainOnly && !!enabled,
    select: selectAndTransformOrders,
    ...defaultQuerySettings,
  });
};

const transformAPIOrderbookData = (chainId: number) => (response: TractorAPIOrdersResponse<"SOW"> | undefined) => {
  if (!response) return { orders: [], lastUpdated: 0, totalRecords: 0 };

  const mainToken = getChainConstant(resolveChainId(chainId), MAIN_TOKEN);

  const res = response.orders.map((order): OrderbookEntry => {
    const totalAmountToSow = TV.fromBlockchain(order.blueprintData.totalAmountToSow, mainToken.decimals);
    const pintoSownCounter = TV.fromBlockchain(order.blueprintData.pintoSownCounter, mainToken.decimals);
    const cascadeAmountFunded = TV.fromBlockchain(order.blueprintData.cascadeAmountFunded, mainToken.decimals);
    const maxAmountToSowPerSeason = TV.fromBlockchain(order.blueprintData.maxAmountToSowPerSeason, mainToken.decimals);

    return {
      requisition: {
        blueprint: {
          publisher: order.publisher,
          data: order.data,
          operatorPasteInstrs: order.operatorPasteInstrs,
          maxNonce: BigInt(order.maxNonce),
          startTime: BigInt(Math.floor(new Date(order.startTime).getTime() / 1000)),
          endTime: BigInt(Math.floor(new Date(order.endTime).getTime() / 1000)),
        },
        blueprintHash: order.blueprintHash,
        signature: order.signature,
      },
      withdrawalPlan: undefined,
      blockNumber: order.publishedBlock,
      timestamp: Number(new Date(order.publishedTimestamp).getTime()),
      isCancelled: order.cancelled,
      requisitionType: order.orderType === "SOW" ? "sowBlueprintv0" : "unknown",
      pintosLeftToSow: totalAmountToSow.sub(pintoSownCounter),
      totalAvailablePinto: cascadeAmountFunded,
      currentlySowable: cascadeAmountFunded,
      minTemp: TV.fromBlockchain(order.blueprintData.minTemp, TEMPERATURE_DECIMALS),
      amountSowableNextSeason: TV.min(cascadeAmountFunded, maxAmountToSowPerSeason),
      amountSowableNextSeasonConsideringAvailableSoil: TV.ZERO,
      estimatedPlaceInLine: TV.ZERO,
      isComplete: order.blueprintData.orderComplete,
    };
  });

  console.debug("[TRACTOR/useTractorAPISowOrders/transformAPIOrderbookData] RES", res);

  return {
    orders: res,
    lastUpdated: response.lastUpdated,
    totalRecords: response.totalRecords,
  };
};

type UseTractorSowOrderbookOptions<T> = {
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
} & Pick<QueryObserverOptions<OrderbookEntry[] | undefined, DefaultError, T>, "select">;

export function useTractorSowOrderbook<T = OrderbookEntry[]>({
  select,
  ...params
}: UseTractorSowOrderbookOptions<T> = {}) {
  const chainId = useChainId();
  const client = usePublicClient({ chainId });
  const diamond = useProtocolAddress();
  const temperature = useTemperature();
  const currentSeason = useSeason();

  // Deconstructed args
  const { address, chainOnly = false, enabled = true } = params;

  // Fetch from API
  const { data: orders, ...ordersQuery } = useTractorAPISowOrders({
    enabled,
    chainOnly,
    ...params,
  });

  // check if the API data exists, is not loading, and is not an error
  const ordersAPIDataExists = Boolean(orders?.orders && !ordersQuery.isLoading && !ordersQuery.isError);

  // only run the chain query if we have a client, a max temperature, the API data exists, and we have a latest block reference.
  const orderChainQueryEnabled = (chainOnly || Boolean(temperature.max.gt(0) && ordersAPIDataExists)) && enabled;

  /**
   * If the orders API request failed, fetch since the TRACTOR_DEPLOYMENT_BLOCK
   * otherwise,
   * - DEV, use a 24 hour lookback to allow for forwarding seasons locally
   * - PROD, use a 1 hour lookback
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: Select may not change when address / order data changes so we re-select here.
  const selectOrders: NonNullable<typeof select> = useCallback(
    (data) => {
      return select?.(data) ?? (data as T);
    },
    [select, address, orders],
  );

  const ordersChainQuery = useQuery<OrderbookEntry[] | undefined, DefaultError, T>({
    queryKey: queryKeys.tractor.sowOrdersV0Chain(orders?.lastUpdated ?? chainOnly ? 1 : 0, temperature.max, {
      ...params,
      currentSeason,
    }),
    queryFn: async () => {
      if (temperature.max.lte(0) || !client) {
        return [];
      }
      const latestBlock = await client.getBlock({ blockTag: "latest" });
      const lookbackBlocks = getLookbackBlocks(chainOnly, !!ordersQuery.error, latestBlock.number, orders?.lastUpdated);

      console.debug("[TRACTOR/useTractorSowOrderbook/ordersChainQuery] LOOKBACK BLOCKS", {
        lookbackBlocks,
        orders,
      });

      const data = await loadOrderbookData(
        address,
        diamond,
        client,
        latestBlock,
        temperature.max.toNumber(),
        orders?.orders,
        lookbackBlocks,
        { ...params, currentSeason },
      );

      console.debug("[TRACTOR/useTractorSowOrderbook/ordersChainQuery] DATA", {
        lookbackBlocks,
        data,
      });

      return data;
    },
    enabled: client && orderChainQueryEnabled,
    select: selectOrders,
    ...defaultQuerySettingsMedium,
  });

  const refetch = useCallback(async () => {
    if (chainOnly) {
      return ordersChainQuery.refetch();
    }
    return ordersQuery.refetch();
    // no need to refetch the chain query, it will refetch automatically when the orders refetch
  }, [ordersChainQuery, ordersQuery, chainOnly]);

  return { ...ordersChainQuery, refetch } as const;
}
