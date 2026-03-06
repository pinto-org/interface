import { defaultQuerySettingsMedium } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { TractorRequisitionData, TractorRequisitionEvent } from "@/lib/Tractor";
import { decodeBlueprintCallData } from "@/lib/Tractor/blueprint-decoders";
import { decodeAutomateClaimBlueprint } from "@/lib/Tractor/claimOrder";
import { AutomateClaimBlueprintStruct } from "@/lib/Tractor/claimOrder/tractor-claim-types";
import { TRACTOR_DEPLOYMENT_BLOCK_AUTOMATE_CLAIM } from "@/lib/Tractor/core";
import { fetchTractorEvents } from "@/lib/Tractor/events/tractor-events";
import { queryKeys } from "@/state/queryKeys";
import { stringEq } from "@/utils/string";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useChainId, usePublicClient } from "wagmi";

interface UseTractorAutomateClaimOrderbookOptions {
  address?: `0x${string}`;
  enabled?: boolean;
}

export function useTractorAutomateClaimOrderbook({
  address,
  enabled = true,
}: UseTractorAutomateClaimOrderbookOptions = {}) {
  const chainId = useChainId();
  const client = usePublicClient({ chainId });
  const diamond = useProtocolAddress();

  const query = useQuery({
    queryKey: queryKeys.tractor.automateClaimOrders(address, chainId),
    queryFn: async (): Promise<TractorRequisitionEvent<AutomateClaimBlueprintStruct>[]> => {
      if (!client || !diamond) return [];

      const { publishEvents, cancelledHashes } = await fetchTractorEvents(
        client,
        diamond,
        TRACTOR_DEPLOYMENT_BLOCK_AUTOMATE_CLAIM,
      );

      // Get latest block for timestamp approximation
      const latestBlock = await client.getBlock({ blockTag: "latest" });
      const latestTimestamp = Number(latestBlock.timestamp);
      const latestBlockNumber = Number(latestBlock.number);

      const automateClaimOrders: TractorRequisitionEvent<AutomateClaimBlueprintStruct>[] = [];

      for (const event of publishEvents) {
        const requisition = event.args?.requisition as TractorRequisitionData;
        if (!requisition?.blueprint || !requisition?.blueprintHash || !requisition?.signature) {
          continue;
        }

        // Filter by publisher if address is provided
        if (address && !stringEq(requisition.blueprint.publisher, address)) {
          continue;
        }

        const blueprintData = requisition.blueprint.data;
        if (!blueprintData) continue;

        // Try direct decode first, fall back to blueprint-decoders system
        let decodedData = decodeAutomateClaimBlueprint(blueprintData);

        if (!decodedData) {
          const blueprintDecoded = decodeBlueprintCallData(blueprintData);
          if (blueprintDecoded?.type === "automateClaim" && blueprintDecoded.params) {
            decodedData = blueprintDecoded.params as AutomateClaimBlueprintStruct;
          }
        }

        if (!decodedData) continue;

        // Approximate timestamp from block number difference (~2s per block on Base)
        const eventBlockNumber = Number(event.blockNumber ?? 0);
        const timestamp = latestTimestamp * 1000 - (latestBlockNumber - eventBlockNumber) * 2000;

        automateClaimOrders.push({
          requisition,
          blockNumber: eventBlockNumber,
          timestamp,
          isCancelled: cancelledHashes.has(requisition.blueprintHash),
          requisitionType: "automateClaimBlueprint",
          decodedData,
        });
      }

      return automateClaimOrders;
    },
    enabled: !!client && !!diamond && enabled,
    ...defaultQuerySettingsMedium,
  });

  const refetch = useCallback(async () => {
    return query.refetch();
  }, [query.refetch]);

  return { ...query, refetch } as const;
}
