import { TV } from "@/classes/TokenValue";
import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { defaultQuerySettingsMedium } from "@/constants/query";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { getChainConstant } from "@/hooks/useChainConstant";
import {
  OrderbookEntry,
  TractorAPI,
  TractorAPIOrderOptions,
  TractorAPIOrdersResponse,
  loadOrderbookData,
} from "@/lib/Tractor";
import { TEMPERATURE_DECIMALS } from "@/state/protocol/field";
import { queryKeys } from "@/state/queryKeys";
import { useTemperature } from "@/state/useFieldData";
import { resolveChainId } from "@/utils/chain";
import { HashString } from "@/utils/types.generic";
import { isDev } from "@/utils/utils";
import { DefaultError, QueryObserverOptions, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useChainId, usePublicClient } from "wagmi";

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
  const diff = currentBlock - BigInt(lastUpdatedBlock);
  return diff > 0n ? diff : undefined;
};

const useTractorAPISowOrders = (address?: HashString, args?: TractorAPIOrderOptions, chainOnly: boolean = false) => {
  const chainId = useChainId();

  const selectAndTransformOrders = useMemo(() => transformAPIOrderbookData(chainId), [chainId]);

  return useQuery({
    queryKey: queryKeys.tractor.sowOrdersV0(args),
    queryFn: async () => {
      if (!chainId) return;
      const options = { orderType: "SOW_V0", cancelled: false, ...args } satisfies TractorAPIOrderOptions;
      if (address) options.publisher = address;

      return TractorAPI.getOrders(options);
    },
    enabled: !!chainId && !chainOnly,
    select: selectAndTransformOrders,
    ...defaultQuerySettingsMedium,
  });
};

const transformAPIOrderbookData = (chainId: number) => (response: TractorAPIOrdersResponse | undefined) => {
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
          startTime: BigInt(new Date(order.startTime).getTime()),
          endTime: BigInt(new Date(order.endTime).getTime()),
        },
        blueprintHash: order.blueprintHash,
        signature: order.signature,
      },
      withdrawalPlan: undefined,
      blockNumber: order.publishedBlock,
      timestamp: Number(new Date(order.publishedTimestamp).getTime()),
      isCancelled: order.cancelled,
      requisitionType: order.orderType === "SOW_V0" ? "sowBlueprintv0" : "unknown",
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
  address?: HashString;
  args?: TractorAPIOrderOptions;
  chainOnly?: boolean;
} & Pick<QueryObserverOptions<OrderbookEntry[] | undefined, DefaultError, T>, "select">;

export function useTractorSowOrderbook<T = OrderbookEntry[]>({
  address,
  args,
  chainOnly = false,
  select,
}: UseTractorSowOrderbookOptions<T> = {}) {
  const chainId = useChainId();
  const client = usePublicClient({ chainId });
  const diamond = useProtocolAddress();
  const temperature = useTemperature();

  //
  const { data: orders, ...ordersQuery } = useTractorAPISowOrders(address, args, chainOnly);

  // check if the API data exists, is not loading, and is not an error
  const ordersAPIDataExists = Boolean(orders?.orders?.length && !ordersQuery.isLoading && !ordersQuery.isError);

  // only run the chain query if we have a client, a max temperature, the API data exists, and we have a latest block reference.
  const orderChainQueryEnabled = chainOnly || Boolean(temperature.max.gt(0) && ordersAPIDataExists);

  /**
   * If the orders API request failed, fetch since the TRACTOR_DEPLOYMENT_BLOCK
   * otherwise,
   * - DEV, use a 24 hour lookback to allow for forwarding seasons locally
   * - PROD, use a 1 hour lookback
   */

  const ordersChainQuery = useQuery<OrderbookEntry[] | undefined, DefaultError, T>({
    queryKey: queryKeys.tractor.sowOrdersV0Chain(orders?.lastUpdated ?? chainOnly ? 1 : 0, temperature.max),
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
      );

      console.debug("[TRACTOR/useTractorSowOrderbook/ordersChainQuery] DATA", {
        lookbackBlocks,
        data,
      });

      return data;
    },
    enabled: client && orderChainQueryEnabled,
    select: select,
    ...defaultQuerySettingsMedium,
  });

  const refetch = useCallback(async () => {
    if (chainOnly) {
      return ordersChainQuery.refetch();
    }
    return ordersQuery.refetch();
    // no need to refetch the chain query, it will refetch automatically when the orders refetch
  }, [ordersChainQuery, ordersQuery, chainOnly]);

  return { ...ordersChainQuery, refetch };
}
