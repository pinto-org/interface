import { TV } from "@/classes/TokenValue";
import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { PODS, STALK } from "@/constants/internalTokens";
import { defaultQuerySettingsMedium } from "@/constants/query";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import {
  CombinedConvertUpEventLog,
  PublisherTractorExecution,
  TractorAPI,
  TractorAPIExecutionSowOrderItem,
  TractorAPIResponseExecution,
  TractorEventLogArgsMap,
  TractorEventMapping,
  fetchPublisherTractorExecutionEvents,
} from "@/lib/Tractor";
import { queryKeys } from "@/state/queryKeys";
import { getChainConstant } from "@/utils/chain";
import { resolveChainId } from "@/utils/chain";
import { getChainTokenMap, getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { HashString } from "@/utils/types.generic";
import { isDev } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useChainId, usePublicClient } from "wagmi";

// ────────────────────────────────────────────────────────────────────────────────
// Fetch ALL EXECUTIONS QUERY
// ────────────────────────────────────────────────────────────────────────────────

export const useTractorAPIExecutionsQuery = (
  publisher: HashString | undefined,
  enabled: boolean = true,
  chainOnly: boolean = false,
  isConvert: boolean = false,
) => {
  const chainId = useChainId();

  const selectTractorExecutions = useMemo(() => getSelectTractorExecutions(resolveChainId(chainId)), [chainId]);

  return useQuery({
    queryKey: queryKeys.tractor.tractorExecutions(publisher),
    queryFn: async () => {
      if (!publisher) return undefined;
      const ex = await TractorAPI.getExecutions({ publisher, isConvert: true });
      return ex;
    },
    select: selectTractorExecutions,
    enabled: !!publisher && !chainOnly && enabled,
    ...defaultQuerySettingsMedium,
  });
};

const getLookbackBlocks = (
  chainOnly: boolean,
  error: boolean,
  currentBlock: bigint,
  lastUpdatedBlock: number | undefined,
) => {
  if (chainOnly || error || !lastUpdatedBlock) return undefined;
  if (isDev()) {
    return TIME_TO_BLOCKS.week;
  }
  const diff = currentBlock - BigInt(lastUpdatedBlock);
  return diff > 0n ? diff : undefined;
};

export default function usePublisherTractorExecutions(
  publisher: HashString | undefined,
  enabled: boolean = true,
  chainOnly: boolean = false,
) {
  const client = usePublicClient();
  const diamond = useProtocolAddress();

  const { data: executionData, ...executionsQuery } = useTractorAPIExecutionsQuery(publisher, enabled, chainOnly);

  // Check if the API data exists and has any executions
  const executionsExist = !!executionData;

  // Only run the on-chain event query if we have a client, a publisher AND (the API data exists OR the API request failed)
  const executionsChainQueryEnabled =
    chainOnly || Boolean(client && publisher && Boolean(executionsExist || executionsQuery.error));

  // Merge the on-chain executions with the API data. Use useCallback to create a stable reference to the function
  const mergeExecutions = useCallback(
    (onChainExecutions: Awaited<ReturnType<typeof fetchPublisherTractorExecutionEvents>> | undefined) => {
      const sowBlueprintv0 = executionData?.executions.sowBlueprintv0 ?? [];
      const convertUpBlueprint = executionData?.executions.convertUpBlueprint ?? [];
      const unknown = executionData?.executions.unknown ?? [];

      // Create a Set of existing transaction hashes for O(1) lookup
      const existingTxHashes = new Set([
        ...sowBlueprintv0.map((exec) => exec.transactionHash.toLowerCase()),
        ...convertUpBlueprint.map((exec) => exec.transactionHash.toLowerCase()),
        ...unknown.map((exec) => exec.executedTxn.toLowerCase()),
      ]);

      const allExecutions: PublisherTractorExecution[] = [...sowBlueprintv0, ...convertUpBlueprint];

      console.log("[Tractor/mergeExecutions] onchain executions", onChainExecutions);

      // Filter out any on-chain executions that already exist in the API data & add the SOW_V0 executions if sowEvent is present
      onChainExecutions?.forEach((exec) => {
        if (!existingTxHashes.has(exec.transactionHash.toLowerCase())) {
          allExecutions.push(exec);
        }
      });

      // Combine and sort all executions
      allExecutions.sort((a, b) => b.blockNumber - a.blockNumber);
      console.log("[Tractor/mergeExecutions] All executions", allExecutions);

      return allExecutions;
    },
    [executionData?.executions],
  );

  const executionsChainQuery = useQuery({
    queryKey: queryKeys.tractor.tractorExecutionsChain(publisher, executionData?.lastUpdated),
    queryFn: async () => {
      if (!publisher || !client) return undefined;
      const latestBlock = await client.getBlock({ blockTag: "latest" });
      const lookbackBlocks = getLookbackBlocks(
        chainOnly,
        !!executionsQuery.error,
        latestBlock.number,
        executionData?.lastUpdated,
      );

      const executions = await fetchPublisherTractorExecutionEvents(
        client,
        diamond,
        publisher,
        ["sowBlueprintv0", "convertUpBlueprint"],
        latestBlock,
        lookbackBlocks,
      );

      return executions;
    },
    enabled: executionsChainQueryEnabled && enabled,
    select: mergeExecutions,
    ...defaultQuerySettingsMedium,
  });

  const refetch = useCallback(() => {
    return Promise.all([executionsChainQuery.refetch(), executionsQuery.refetch()]);
  }, [executionsChainQuery, executionsQuery]);

  const isLoading = executionsChainQuery.isLoading || executionsQuery.isLoading;

  return useMemo(
    () => ({
      data: executionsChainQuery.data,
      isLoading,
      error: executionsChainQuery.error || executionsQuery.error,
      refetch,
    }),
    [executionsChainQuery.data, executionsChainQuery.error, executionsQuery.error, isLoading, refetch],
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Helper Functions & Interfaces
// ────────────────────────────────────────────────────────────────────────────────

const transformSowEvent = (
  e: Awaited<ReturnType<typeof TractorAPI.getExecutions>>["sowBlueprintV0"][number],
  chainId: number,
): TractorEventMapping<TV>["sow"] => {
  const mainToken = getChainConstant(resolveChainId(chainId), MAIN_TOKEN);

  return {
    account: e.orderInfo.publisher,
    fieldId: 0n,
    index: TV.fromBlockchain(e.blueprintData.index, PODS.decimals),
    beans: TV.fromBlockchain(e.blueprintData.beans, mainToken.decimals),
    pods: TV.fromBlockchain(e.blueprintData.pods, PODS.decimals),
  };
};

const transformConvertUpEvent = (
  e: Awaited<ReturnType<typeof TractorAPI.getExecutions>>["convertUpBlueprintV0"][number],
  chainId: number,
): TractorEventMapping<TV, Token>["convertUp"] => {
  if (!e.blueprintData.usedTokens.length) {
    throw new Error("No used tokens found");
  }

  const tokenMap = getChainTokenMap(resolveChainId(chainId));
  const mainToken = getChainConstant(resolveChainId(chainId), MAIN_TOKEN);

  const bd = e.blueprintData;
  const usedToken = tokenMap[getTokenIndex(bd.usedTokens[0])];

  return {
    account: e.orderInfo.publisher,
    fromToken: usedToken,
    toToken: mainToken,
    fromAmount: TV.fromBlockchain(bd.tokenFromAmounts[0], usedToken.decimals),
    toAmount: TV.fromBlockchain(bd.tokenToAmounts[0], mainToken.decimals),
    fromBdv: TV.fromBlockchain(0, mainToken.decimals),
    toBdv: TV.fromBlockchain(bd.beansConverted, mainToken.decimals),
    grownStalkGained: TV.fromBlockchain(bd.gsBonusStalk, STALK.decimals),
    newGrownStalk: TV.fromBlockchain(bd.gsBonusStalk, STALK.decimals),
    bdvCapacityUsed: TV.fromBlockchain(bd.gsBonusBdv, mainToken.decimals),
    bdvConverted: TV.fromBlockchain(bd.gsBonusBdv, mainToken.decimals),
  };
};

type SelectTractorExecutions = {
  sowBlueprintv0: PublisherTractorExecution[];
  convertUpBlueprint: PublisherTractorExecution[];
  unknown: TractorAPIResponseExecution<unknown>[];
};

const getSelectTractorExecutions = (chainId: number) => {
  return (args: Awaited<ReturnType<typeof TractorAPI.getExecutions>> | undefined) => {
    if (!args) return undefined;

    const executionsByType: SelectTractorExecutions = {
      sowBlueprintv0: [],
      convertUpBlueprint: [],
      unknown: args.unknown,
    };

    executionsByType.sowBlueprintv0 = args.sowBlueprintV0.map((e) => {
      const sowEv = transformSowEvent(e, chainId);

      return {
        type: "sow",
        blockNumber: e.executedBlock,
        operator: e.operator,
        publisher: e.orderInfo.publisher,
        blueprintHash: e.blueprintHash,
        transactionHash: e.executedTxn,
        timestamp: new Date(e.executedTimestamp).getTime(),
        event: sowEv,
        sowEvent: sowEv,
      };
    });

    executionsByType.convertUpBlueprint = args.convertUpBlueprintV0.map((e) => {
      const ev = transformConvertUpEvent(e, chainId);

      return {
        type: "convertUp",
        blockNumber: e.executedBlock,
        operator: e.operator,
        publisher: e.orderInfo.publisher,
        blueprintHash: e.blueprintHash,
        transactionHash: e.executedTxn,
        timestamp: new Date(e.executedTimestamp).getTime(),
        event: ev,
      };
    });

    return {
      lastUpdated: args.lastUpdated,
      totalRecords: args.totalRecords,
      executions: executionsByType,
    };
  };
};
