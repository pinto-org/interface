import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { defaultQuerySettingsMedium } from "@/constants/query";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { ConvertUpOrderbookEntry, TRACTOR_DEPLOYMENT_BLOCKS_BY_TYPE, loadConvertUpOrderbookData } from "@/lib/Tractor";
import { HashString } from "@/utils/types.generic";
import { isDev } from "@/utils/utils";
import { DefaultError, QueryObserverOptions, useQuery } from "@tanstack/react-query";
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

  const ordersChainQuery = useQuery({
    queryKey: ["tractor", "convertup", address ?? "0x"],
    queryFn: async () => {
      if (!client) return [];
      const fromBlock = TRACTOR_DEPLOYMENT_BLOCKS_BY_TYPE.convertUpBlueprint;
      const latestBlock = await client.getBlock({ blockTag: "latest" });
      const lookbackBlocks = getLookbackBlocks(true, false, latestBlock.number, undefined);

      const events = await loadConvertUpOrderbookData(address, diamond, client, latestBlock, undefined, fromBlock);

      return events;
    },
    enabled: enabled && !!client,
    select: params?.select,
    ...defaultQuerySettingsMedium,
  });

  return ordersChainQuery;
}
