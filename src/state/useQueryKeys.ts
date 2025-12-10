import { TokenValue } from "@/classes/TokenValue";
import { useMemo } from "react";
import { useChainId } from "wagmi";

export interface UseQueryKeysProps {
  chainId?: number;
  account?: string;
  harvestableIndex?: TokenValue;
}

export function useQueryKeys({ chainId, account, harvestableIndex }: UseQueryKeysProps) {
  const cid = useChainId();
  chainId ??= cid;

  const farmerField = useMemo(
    () => ["farmerField", { chainId: chainId, variables: [account?.toLowerCase()] }],
    [chainId, account],
  );

  const allPodListings = useMemo(
    () => ["allPodListings", { chainId: chainId, variables: [harvestableIndex?.toHuman()] }],
    [chainId, harvestableIndex],
  );

  const allPodOrders = useMemo(() => ["allPodOrders", { chainId: chainId }], [chainId]);

  const allMarket = useMemo(() => ["allMarket", { chainId: chainId }], [chainId]);

  const farmerMarket = useMemo(
    () => ["farmerMarket", { chainId: chainId, variables: [account?.toLowerCase()] }],
    [chainId, account],
  );

  return useMemo(
    () => ({
      farmerField,
      allPodListings,
      allPodOrders,
      allMarket,
      farmerMarket,
    }),
    [farmerField, allPodListings, allPodOrders, allMarket, farmerMarket],
  );
}
