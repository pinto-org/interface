import { TIME_TO_BLOCKS } from "@/constants/blocks";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { fetchTractorEvents, loadPublishedRequisitions } from "@/lib/Tractor";
import { isDev } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PublicClient } from "viem";
import { useAccount, useChainId, usePublicClient } from "wagmi";
import { queryKeys } from "../queryKeys";
import useCachedLatestBlockQuery from "../useCachedLatestBlockQuery";

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

export function useTractorConvertUpOrderbook() {
  const chainId = useChainId();
  const client = usePublicClient({ chainId });
  const diamond = useProtocolAddress();
  const { address } = useAccount();

  // const latestBlockQ = useCachedLatestBlockQuery();

  // console.log("latestblockQ: ", latestBlockQ.data);

  const query = useQuery({
    queryKey: ["tractor", "convertup"],
    queryFn: async () => {
      if (!client || !address) {
        return [];
      }

      return fetch(client, diamond, address);
    },
  });

  useEffect(() => {
    console.log("query.data: ", query.data);
  }, [query.data]);
}

const fetch = async (client: PublicClient, diamond: `0x${string}`, address: `0x${string}`) => {
  const fromBlock = 34525087n - 10000n;
  const latestBlock = await client.getBlock({ blockTag: "latest" });
  const lookbackBlocks = getLookbackBlocks(true, false, latestBlock.number, undefined);

  const events = await loadPublishedRequisitions(
    address,
    diamond,
    client,
    latestBlock,
    "convertUpBlueprint",
    fromBlock,
  );

  return events;
};
