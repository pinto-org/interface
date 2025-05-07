import { defaultQuerySettingsMedium } from "@/constants/query";
import { BASE_RPC_URL, baseNetwork } from "@/utils/wagmi/chains";
import { useQuery } from "@tanstack/react-query";
import { http, createPublicClient } from "viem";

// Create a client specifically for fetching Base network gas price
const baseGasClient = createPublicClient({
  chain: baseNetwork,
  transport: http(BASE_RPC_URL),
});

export const useGasPrice = (refetchInterval: number = 30_000) => {
  return useQuery({
    queryKey: ["gasPrice"],
    queryFn: async () => {
      try {
        // Use the baseGasClient to fetch gas price from Base network
        const price = await baseGasClient.getGasPrice();
        console.debug("[useGasPrice] Current Base network gas price:", {
          wei: `${price.toString()} wei`,
          gwei: `${Number(price) / 1e9} gwei`,
        });
        return price;
      } catch (error) {
        console.error("[useGasPrice] Failed to fetch gas price:", error);
        return 0n;
      }
    },
    ...defaultQuerySettingsMedium,
    refetchInterval: refetchInterval,
    staleTime: refetchInterval,
    retryOnMount: true,
  });
};
