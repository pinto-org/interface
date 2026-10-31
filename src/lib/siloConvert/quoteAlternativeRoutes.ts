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

/**
 * Inline notice for a Convert quote that could not produce an executable route
 * (every alternative failed to quote/simulate, or the quote returned no output).
 * Without it the Convert button just stays disabled with no explanation.
 */
export function getConvertQuoteFailureNotice({
  quoteEnabled,
  isFetching,
  isError,
  hasZeroOutput,
  isDefaultConvert,
}: {
  quoteEnabled: boolean;
  isFetching: boolean;
  isError: boolean;
  hasZeroOutput: boolean;
  isDefaultConvert: boolean;
}): string | undefined {
  if (!quoteEnabled || isFetching || !(isError || hasZeroOutput)) return undefined;
  const hint = isDefaultConvert ? "Try lowering the amount or increasing slippage." : "Try increasing slippage.";
  return `Unable to quote this Convert. ${hint}`;
}
