import { defaultQuerySettingsMedium } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { TractorRequisitionData, TractorRequisitionEvent } from "@/lib/Tractor";
import { decodeBlueprintCallData } from "@/lib/Tractor/blueprint-decoders";
import { decodeAutomateClaimBlueprint } from "@/lib/Tractor/claimOrder";
import { AutomateClaimBlueprintStruct } from "@/lib/Tractor/claimOrder/tractor-claim-types";
import { TRACTOR_DEPLOYMENT_BLOCK } from "@/lib/Tractor/core";
import { fetchTractorEvents } from "@/lib/Tractor/events/tractor-events";
import { stringEq } from "@/utils/string";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useChainId, usePublicClient } from "wagmi";

interface UseTractorAutomateClaimOrderbookOptions {
  address?: `0x${string}`;
  filterOutCompleted?: boolean;
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
    queryKey: ["tractor", "automateClaimOrders", address, chainId],
    queryFn: async (): Promise<TractorRequisitionEvent<AutomateClaimBlueprintStruct>[]> => {
      if (!client || !diamond) return [];

      // Use the general deployment block to catch all events
      const { publishEvents, cancelledHashes } = await fetchTractorEvents(client, diamond, TRACTOR_DEPLOYMENT_BLOCK);

      console.debug("[useTractorAutomateClaimOrderbook] Total publish events:", publishEvents.length);

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

        // First try the blueprint-decoders system to check if this is an automateClaim type
        const blueprintDecoded = decodeBlueprintCallData(blueprintData);

        // Try to decode as automateClaimBlueprint using the direct decoder
        const decodedData = decodeAutomateClaimBlueprint(blueprintData);

        // Accept if either decoder identifies this as automateClaim
        if (!decodedData && blueprintDecoded?.type !== "automateClaim") {
          continue;
        }

        console.debug("[useTractorAutomateClaimOrderbook] Found automateClaim order:", {
          hash: requisition.blueprintHash,
          publisher: requisition.blueprint.publisher,
          decodedData: !!decodedData,
          blueprintDecodedType: blueprintDecoded?.type,
        });

        const isCancelled = cancelledHashes.has(requisition.blueprintHash);

        // If direct decode worked, use it. Otherwise try to extract from blueprint-decoders result
        let finalDecodedData = decodedData;
        if (!finalDecodedData && blueprintDecoded?.type === "automateClaim" && blueprintDecoded.params) {
          // The blueprint-decoders system decoded the params directly from the inner call
          finalDecodedData = blueprintDecoded.params as AutomateClaimBlueprintStruct;
        }

        if (!finalDecodedData) continue;

        automateClaimOrders.push({
          requisition,
          blockNumber: Number(event.blockNumber ?? 0),
          timestamp: undefined,
          isCancelled,
          requisitionType: "automateClaimBlueprint",
          decodedData: finalDecodedData,
        });
      }

      console.debug("[useTractorAutomateClaimOrderbook] Found orders:", automateClaimOrders.length);

      return automateClaimOrders;
    },
    enabled: !!client && !!diamond && enabled,
    ...defaultQuerySettingsMedium,
  });

  const refetch = useCallback(async () => {
    return query.refetch();
  }, [query]);

  return { ...query, refetch } as const;
}
