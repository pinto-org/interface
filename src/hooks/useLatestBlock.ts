import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

export function useLatestBlock() {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["latestBlock"],
    queryFn: async () => {
      if (!publicClient) return null;
      return publicClient.getBlock();
    },
    enabled: !!publicClient,
    refetchInterval: 30_000,
  });
}
