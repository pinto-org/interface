import { defaultQuerySettingsMedium } from "@/constants/query";
import { DefaultError, QueryObserverOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { GetBlockReturnType } from "viem";
import { usePublicClient } from "wagmi";
import { queryKeys } from "./queryKeys";

type UseLatestBlockQueryParameters<T> = Omit<
  QueryObserverOptions<GetBlockReturnType | undefined, DefaultError, T | undefined>,
  "queryFn" | "queryKey"
> & {
  // if provided, use this key instead of the default
  key?: string;
};

// Provide a default query key if not provided, but allow props to override it
export default function useCachedLatestBlockQuery<T>({
  enabled,
  key,
  select,
  ...props
}: UseLatestBlockQueryParameters<T> = {}) {
  const client = usePublicClient();

  const queryKey = useMemo(() => queryKeys.network.latestBlock(key), [key]);

  return useQuery<GetBlockReturnType | undefined, DefaultError, T | undefined>({
    queryKey: queryKey,
    queryFn: async () => client?.getBlock(),
    enabled: !!client && enabled,
    select,
    // We only use this block number as a reference, so no need to refetch this aggresively. If we need more aggressive updates, props will override this.
    ...defaultQuerySettingsMedium,
    ...props,
  });
}
