import { abiSnippets } from "@/constants/abiSnippets";
import { useProtocolAddress } from "@/hooks/pinto/useProtocolAddress";
import { useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

const MAX_ITERATIONS = 500;

export interface UseAllFertilizerIdsReturn {
  fertilizerIds: bigint[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook that traverses the Beanstalk Diamond contract's linked list
 * to collect all global fertilizer IDs.
 *
 * Uses getFirst() to get the first ID, then getNext(id) to traverse
 * until getNext returns 0 or MAX_ITERATIONS are reached.
 *
 * Does NOT require wallet connection — this is global data.
 */
export function useAllFertilizerIds(): UseAllFertilizerIdsReturn {
  const publicClient = usePublicClient();
  const protocolAddress = useProtocolAddress();

  const [fertilizerIds, setFertilizerIds] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchIds = useCallback(async () => {
    if (!publicClient || !protocolAddress) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);

      const firstId = await publicClient.readContract({
        address: protocolAddress,
        abi: abiSnippets.fertilizerLinkedList,
        functionName: "getFirst",
      });

      if (!firstId || firstId === 0n) {
        setFertilizerIds([]);
        setIsLoading(false);
        return;
      }

      const ids: bigint[] = [BigInt(firstId)];
      let currentId = firstId;

      for (let i = 0; i < MAX_ITERATIONS; i++) {
        const nextId = await publicClient.readContract({
          address: protocolAddress,
          abi: abiSnippets.fertilizerLinkedList,
          functionName: "getNext",
          args: [currentId],
        });

        if (!nextId || nextId === 0n) break;

        ids.push(BigInt(nextId));
        currentId = nextId;
      }

      setFertilizerIds(ids);
    } catch (error) {
      console.error("[useAllFertilizerIds] Linked list traverse failed:", error);
      setFertilizerIds([]);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, protocolAddress]);

  useEffect(() => {
    fetchIds();
  }, [fetchIds]);

  return { fertilizerIds, isLoading, isError, refetch: fetchIds };
}
