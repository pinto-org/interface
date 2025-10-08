import { TV } from "@/classes/TokenValue";
import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { QUERY_SETTINGS, defaultQuerySettingsMedium } from "@/constants/query";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import {
  ConvertUpBlueprintStruct,
  ConvertUpOrderbookEntry,
  TractorAPI,
  TractorAPIOrdersResponse,
  loadConvertUpOrderbookData,
  transformConvertUpRequisitionEvent,
} from "@/lib/Tractor";
import { decodeBlueprintCallData } from "@/lib/Tractor/blueprint-decoders";
import { convertUpBlueprintDecoder } from "@/lib/Tractor/blueprint-decoders/convert-up-decoder";
import { getChainConstant, resolveChainId } from "@/utils/chain";
import { HashString } from "@/utils/types.generic";
import { isDev } from "@/utils/utils";
import { DefaultError, QueryObserverOptions, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
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
  chainOnly = false,
  enabled = true,
}: UseTractorAPISowOrdersParams = {}) => {
  const chainId = useChainId();

  const args = {
    publisher: address,
    orderType: "CONVERT_UP_V0",
    cancelled,
  } as const;

  const select = useMemo(() => transformAPIOrderbookData(chainId), [chainId]);

  const envExists = Boolean(import.meta.env.VITE_TRACTOR_CONVERT_URL);

  const queryEnabled = !!chainId && !chainOnly && enabled && envExists;

  const query = useQuery({
    queryKey: queryKeys.tractor.convertUpOrders({ ...args }),
    queryFn: async () => {
      if (!chainId) return;
      return TractorAPI.getOrders<"CONVERT_UP_V0">({
        ...args,
        orderType: "CONVERT_UP_V0",
        isConvert: true,
      });
    },
    enabled: queryEnabled,
    select,
    ...QUERY_SETTINGS.slow,
  });

  useEffect(() => {
    if (query.data) {
      console.log("query.data", query.data);
    }
  }, [query.data]);

  return query;
};

const transformAPIOrderbookData =
  (chainId: number) => (response: TractorAPIOrdersResponse<"CONVERT_UP_V0"> | undefined) => {
    if (!response) return { orders: [], lastUpdated: 0, totalRecords: 0 };

    const mainToken = getChainConstant(resolveChainId(chainId), MAIN_TOKEN);

    const res = response.orders.map((order): ConvertUpOrderbookEntry => {
      const bd = order.blueprintData;
      const bdvLeftToConvert = TV.fromBlockchain(bd.beansLeftToConvert, mainToken.decimals);

      const availableAmount = TV.fromBlockchain(bd.cascadeAmountFunded, mainToken.decimals);

      const decodedData = decodeBlueprintCallData(order.data) ?? undefined;
      const transformed = transformConvertUpRequisitionEvent(decodedData?.params, chainId);

      return {
        requisitionType: "convertUpBlueprint",
        decodedData: transformed ?? undefined,
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
        totalAvailableBdv: availableAmount,
        amountConvertibleNextExecution: TV.min(
          availableAmount,
          transformed?.convertUpParams?.maxBeansConvertPerExecution ?? TV.ZERO,
        ),
        // Will be filled in later
        meetsConditions: {
          price: false,
          bonus: false,
          capacity: false,
        },
        orderInfo: {
          lastExecutedTimestamp: bd.lastExecutedTimestamp,
          bdvLeftToConvert,
        },
        isComplete: bd.orderComplete,
      };
    });

    return {
      orders: res,
      lastUpdated: response.lastUpdated,
      totalRecords: response.totalRecords,
    };
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

  const { address, chainOnly = false, enabled = true } = params ?? empty;

  const { data: orders, ...ordersQuery } = useTractorAPIConvertUpOrders({
    address,
    cancelled: params?.cancelled,
    chainOnly,
    enabled,
  });

  const envExists = Boolean(import.meta.env.VITE_TRACTOR_CONVERT_URL);
  const orderQueriesError = !!ordersQuery.error;

  // check if the API data exists, is not loading, and is not an error
  const ordersAPIDataExists = Boolean(orders?.orders && !ordersQuery.isLoading && !ordersQuery.isError);

  // only run the chain query if we have a client, a max temperature, the API data exists, and we have a latest block reference.
  const orderChainQueryEnabled = (chainOnly || ordersAPIDataExists || !envExists) && enabled;

  /**
   * If the orders API request failed, fetch since the TRACTOR_DEPLOYMENT_BLOCK
   * otherwise,
   * - DEV, use a 24 hour lookback to allow for forwarding seasons locally
   * - PROD, use a 1 hour lookback
   */
  const ordersChainQuery = useQuery({
    queryKey: queryKeys.tractor.convertUpOrdersV0Chain(orders?.lastUpdated ?? chainOnly ? 1 : 0, params),
    queryFn: async () => {
      if (!client) return [];
      const latestBlock = await client.getBlock({ blockTag: "latest" });
      const lookbackBlocks = getLookbackBlocks(chainOnly, orderQueriesError, latestBlock.number, orders?.lastUpdated);

      console.log("lookbackBlocks", {
        orders,
        ordersAPIDataExists,
        orderChainQueryEnabled,
        lookbackBlocks,
      });

      const events = await loadConvertUpOrderbookData(
        address,
        diamond,
        client,
        latestBlock,
        orders?.orders ?? [],
        lookbackBlocks,
        {
          filterOutCompleted: params?.filterOutCompleted ?? true,
        },
      );

      return events;
    },
    enabled: orderChainQueryEnabled,
    select: params?.select,
    ...defaultQuerySettingsMedium,
  });

  return ordersChainQuery;
}
