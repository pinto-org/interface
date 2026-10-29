import { throwIfAborted } from "@/utils/utils";

/** A failed optional route can shrink the next quote's indexes. */
export function reconcileRouteIndex(current: number | undefined, rankedIndexes: readonly number[] = []) {
  return current !== undefined && rankedIndexes.includes(current) ? current : rankedIndexes[0];
}

/** Alternatives are independent; the strategies within each alternative remain atomic. */
export async function quoteAlternativeRoutes<Route, Result>(
  routes: Route[],
  quoteAndSimulate: (route: Route) => Promise<Result>,
  signal?: AbortSignal,
): Promise<Result[]> {
  throwIfAborted(signal);
  const results = await Promise.allSettled(routes.map(quoteAndSimulate));
  throwIfAborted(signal);
  const successful = results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
  if (!successful.length) {
    const failure = results.find((result) => result.status === "rejected");
    throw failure?.reason ?? new Error("No executable conversion routes");
  }
  return successful;
}
