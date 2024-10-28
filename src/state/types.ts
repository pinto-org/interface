import { DefaultError, QueryKey } from "@tanstack/react-query";
import { UseQueryParameters } from "wagmi/query";

export type ReactQueryOptions<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryKey extends QueryKey = QueryKey,
> = {
  query?: UseQueryParameters<queryFnData, error, data, queryKey>;
};