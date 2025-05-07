import { defaultQuerySettingsMedium } from "@/constants/query";
import { getAverageTipPaid } from "@/lib/Tractor";
import { queryKeys } from "@/state/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

interface UseTractorOperatorAverageTipPaidOptions {
  lookbackBlocks?: bigint;
}

export default function useTractorOperatorAverageTipPaid(options?: UseTractorOperatorAverageTipPaidOptions) {
  // hooks
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: queryKeys.tractor.operatorAverageTipPaid(options?.lookbackBlocks),
    queryFn: async () => {
      if (!publicClient) return;
      const latestBlock = await publicClient.getBlock({ blockTag: "latest" });
      return getAverageTipPaid(publicClient, latestBlock, options?.lookbackBlocks);
    },
    ...defaultQuerySettingsMedium,
  });
}
