import { defaultQuerySettingsMedium } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { RequisitionType, fetchTractorEvents, getSelectRequisitionType } from "@/lib/Tractor/utils";
import { queryKeys } from "@/state/queryKeys";
import { MayArray } from "@/utils/types.generic";
import { safeJSONStringify } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePublicClient } from "wagmi";

export default function useTractorPublishedRequisitions(
  address?: string,
  requisitionType?: MayArray<RequisitionType>,
  enabled: boolean = true,
) {
  const publicClient = usePublicClient();
  const diamond = useProtocolAddress();

  // Create a stable reference for the requisitionType to prevent unnecessary re-renders.
  // This is particularly important when requisitionType is passed as an inline array
  // (e.g. ["sowv0"]) which would create a new reference on every render
  const stableRequisitionRef = safeJSONStringify(requisitionType, "");

  // Memoize the selection function to prevent unnecessary recalculations
  // The function will only be recreated when the requisition type or address changes
  const selectRequisitionType = useMemo(
    () => getSelectRequisitionType(requisitionType, address),
    [stableRequisitionRef, address],
  );

  return useQuery({
    queryKey: queryKeys.tractor.tractorEvents,
    queryFn: async () => {
      if (!publicClient || !diamond) return undefined;
      const [latestBlock, data] = await Promise.all([
        publicClient.getBlock({ blockTag: "latest" }),
        fetchTractorEvents(publicClient, diamond),
      ]);

      return { data, latestBlock };
    },
    select: selectRequisitionType,
    enabled,
    ...defaultQuerySettingsMedium,
  });
}
