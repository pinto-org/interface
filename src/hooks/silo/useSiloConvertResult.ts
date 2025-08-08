import { TV } from "@/classes/TokenValue";
import { STALK } from "@/constants/internalTokens";
import { useLPTokenToNonPintoUnderlyingMap, useTokenMap } from "@/hooks/pinto/useTokenMap";
import { SiloConvertSummary } from "@/lib/siloConvert/SiloConvert";
import { SiloConvertType } from "@/lib/siloConvert/strategies/core";
import { useSiloData } from "@/state/useSiloData";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { SiloTokenData, Token } from "@/utils/types";
import { useCallback, useMemo } from "react";

const defaultData = {
  germinatingStalk: TV.ZERO,
  germinatingSeasons: 0,
  totalAmountOut: TV.ZERO,
  toTotalStalk: TV.ZERO,
  toInitialStalk: TV.ZERO,
  toGrownStalk: TV.ZERO,
  toSeed: TV.ZERO,
  fromTotalStalk: TV.ZERO,
  fromAmountIn: TV.ZERO,
  fromInitialStalk: TV.ZERO,
  fromGrownStalk: TV.ZERO,
  fromSeed: TV.ZERO,
  deltaBdv: TV.ZERO,
  fromBdv: TV.ZERO,
  toBdv: TV.ZERO,
  withdrawalAmount: TV.ZERO,
};

export type SiloConvertResultResult = typeof defaultData & {
  deltaInitialStalk: TV;
  deltaGrownStalk: TV;
  deltaStalk: TV;
  deltaSeed: TV;
};

export interface IUseSiloConvertResultReturnType {
  results: SiloConvertResultResult[] | undefined;
  sortedIndexes: number[] | undefined;
  showRoutes: boolean;
}

export function useSiloConvertResult(
  source: Token,
  target: Token | undefined,
  summaries: SiloConvertSummary<SiloConvertType>[] | undefined,
): IUseSiloConvertResultReturnType {
  const silo = useSiloData();
  const siloTokenData = silo.tokenData;

  const results = useMemo(() => {
    if (!summaries || !target || !summaries.length) return;

    const sourceData = siloTokenData.get(source);
    const targetData = siloTokenData.get(target);

    if (!targetData || !sourceData) return;

    const calcs = summaries.reduce<(typeof defaultData)[]>((memo, summary) => {
      memo.push(reduceSummary(summary, targetData));
      return memo;
    }, []);

    const data = calcs.map((calc) => {
      const deltaInitialStalk = calc.toInitialStalk.sub(calc.fromInitialStalk);
      const deltaGrownStalk = calc.toGrownStalk.sub(calc.fromGrownStalk);
      const deltaStalk = deltaInitialStalk.add(deltaGrownStalk);
      const deltaSeed = calc.toSeed.sub(calc.fromSeed);

      return {
        ...calc,
        deltaInitialStalk,
        deltaGrownStalk,
        deltaStalk,
        deltaSeed,
      };
    });

    return data;
  }, [summaries, siloTokenData, source, target]);

  const sortedIndexes = useMemo(() => {
    if (!results) return;

    const sortedIndicies = [...results]
      .map((result, index) => ({ ...result, index }))
      .sort((a, b) => {
        const aBDV = a.toBdv;
        const bBDV = b.toBdv;
        const aGrownStalk = a.toGrownStalk;
        const bGrownStalk = b.toGrownStalk;

        if (aBDV.gt(bBDV)) return -1;
        if (aBDV.lt(bBDV)) return 1;
        if (aGrownStalk.gt(bGrownStalk)) return -1;
        if (aGrownStalk.lt(bGrownStalk)) return 1;

        return 0;
      })
      .map((r) => r.index);

    return sortedIndicies;
  }, [results]);

  const showRoutes = useMemo(() => {
    if (!results || !sortedIndexes || sortedIndexes.length < 2) return false;

    // Get the best route (first in sortedIndexes) and the next best route
    const bestRouteIndex = sortedIndexes[0];
    const nextBestRouteIndex = sortedIndexes[1];

    const bestRoute = results[bestRouteIndex];
    const nextBestRoute = results[nextBestRouteIndex];

    if (!bestRoute || !nextBestRoute) return false;

    // Return true only if best route has higher totalAmountOut but lower toBdv than next route
    return bestRoute.totalAmountOut.gt(nextBestRoute.totalAmountOut) && bestRoute.toBdv.lt(nextBestRoute.toBdv);
  }, [results, sortedIndexes]);

  return useMemo(
    () => ({
      results,
      sortedIndexes,
      showRoutes,
    }),
    [results, sortedIndexes, showRoutes],
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Compare Convert Results
// ────────────────────────────────────────────────────────────────────────────────

const reduceSummary = (summary: SiloConvertSummary<SiloConvertType>, targetTokenData: SiloTokenData) => {
  const targetRewards = targetTokenData.rewards;
  const targetStemTip = targetTokenData.stemTip;

  return summary.results.reduce<typeof defaultData>(
    (prev, result, i) => {
      const quote = summary.quotes[i];
      const { pickedCrates: picked } = quote;

      let withdrawalAmount = TV.ZERO;
      if ("withdrawalAmount" in quote.summary.target) {
        withdrawalAmount = quote.summary.target.withdrawalAmount;
      }

      const resultToStem = result.toStem;
      const willGerminate = resultToStem.gte(targetStemTip);
      const germinatingSeasons = willGerminate ? (resultToStem.eq(targetStemTip) ? 2 : 1) : 0;

      const targetDeltaStem = targetStemTip.sub(result.toStem);
      const grownStalkBigInt = willGerminate ? 0n : targetDeltaStem.toBigInt() * result.toBdv.toBigInt();

      const toInitialStalk = result.toBdv.reDecimal(STALK.decimals);
      const toGrownStalk = TV.fromBigInt(grownStalkBigInt, STALK.decimals);
      const toTotalStalk = toInitialStalk.add(toGrownStalk);
      const toSeed = targetRewards.seeds.mul(result.toBdv);
      const fromBdv = picked.totalBDV;

      const toBdv = result.toBdv;
      const deltaBdv = toBdv.sub(fromBdv);

      const struct: typeof defaultData = {
        germinatingStalk: willGerminate ? prev.germinatingStalk.add(toInitialStalk) : TV.ZERO,
        germinatingSeasons: willGerminate && !prev.germinatingSeasons ? germinatingSeasons : prev.germinatingSeasons,
        totalAmountOut: prev.totalAmountOut.add(result.toAmount),
        toTotalStalk: willGerminate ? prev.toTotalStalk : prev.toTotalStalk.add(toTotalStalk),
        toInitialStalk: prev.toInitialStalk.add(toInitialStalk),
        toGrownStalk: prev.toGrownStalk.add(toGrownStalk),
        toSeed: prev.toSeed.add(toSeed),
        fromAmountIn: prev.fromAmountIn.add(result.fromAmount),
        fromTotalStalk: prev.fromTotalStalk.add(picked.totalStalk),
        fromInitialStalk: prev.fromInitialStalk.add(picked.totalInitialStalk),
        fromGrownStalk: prev.fromGrownStalk.add(picked.totalGrownStalkSinceDeposit),
        fromSeed: prev.fromSeed.add(picked.totalSeeds),
        deltaBdv: prev.deltaBdv.add(deltaBdv),
        fromBdv: prev.fromBdv.add(fromBdv),
        toBdv: prev.toBdv.add(toBdv),
        withdrawalAmount: prev.withdrawalAmount.add(withdrawalAmount),
      };

      return struct;
    },
    { ...defaultData },
  );
};
// ────────────────────────────────────────────────────────────────────────────────
// Extract Price data from Convert quotes
// ────────────────────────────────────────────────────────────────────────────────

export function useExtractSiloConvertResultPriceResults(
  summaries: (SiloConvertSummary<SiloConvertType> | undefined)[] | undefined,
) {
  return useMemo(() => {
    if (!summaries) return;

    return summaries.map((summary) => summary?.postPriceData);
  }, [summaries]);
}

export const useParseConvertRouteRoutes = () => {
  const tokenMap = useTokenMap();

  const underlying2LP = useLPTokenToNonPintoUnderlyingMap("underlying2LP");

  const findWellRoutes = useCallback(
    (summary: SiloConvertSummary<SiloConvertType>) => {
      const zeroXData = summary.quotes
        .map((quote) => quote.summary.swap)
        .filter((swap): swap is NonNullable<typeof swap> => !!swap);
      const routesThrough = new Set<string>();

      for (const swap of zeroXData) {
        swap.quote.route.fills.forEach((fill) => {
          if (stringEq(fill.source, "pinto")) {
            const source = tokenMap[getTokenIndex(fill.from)];
            const lp = underlying2LP[getTokenIndex(source.isMain ? fill.to : source)];
            lp && routesThrough.add(getTokenIndex(lp));
          }
        });
      }

      if (summary.route.source.isLP) {
        routesThrough.add(getTokenIndex(summary.route.source));
      }

      if (summary.route.target.isLP) {
        routesThrough.add(getTokenIndex(summary.route.target));
      }

      return [...routesThrough].map((address) => tokenMap[address]).filter((token) => !!token);
    },
    [underlying2LP, tokenMap],
  );

  return useCallback(
    (summary: SiloConvertSummary<SiloConvertType>) => {
      if (summary.route.convertType === "LPAndMain") {
        const route = summary.route;

        const lp = route.source.isLP ? route.source : route.target;
        return [lp];
      }

      return findWellRoutes(summary);
    },
    [findWellRoutes],
  );
};

/**
 * Returns the withdrawal pair amount for a given summary.
 *
 * It will only return truthy value if the withdrawal is enabled and if the convert is LP2MainWithdrawPair.
 *
 * @param summary - The summary of the convert.
 * @param source - The source token.
 * @param target - The target token.
 * @returns The withdrawal pair amount.
 */
export function useSiloConvertResultWithdrawalPairAmount(summary: SiloConvertSummary<SiloConvertType>[] | undefined) {
  return useMemo(() => {
    if (!summary) return;

    const isLP2MainWithdrawPair = summary?.find((summary) => {
      return summary.route.convertType === "LP2MainWithdrawPair";
    });

    if (!isLP2MainWithdrawPair) return;

    return summary.map((result) => {
      let withdrawalToken: Token | undefined;
      const amount = result.quotes.reduce<TV>((memo, quote) => {
        if ("withdrawalAmount" in quote.summary.target) {
          const amt = quote.summary.target.withdrawalAmount;
          const tk = quote.summary.target.withdrawalToken;
          withdrawalToken = withdrawalToken ?? tk;

          return memo.add(amt);
        }

        return memo;
      }, TV.ZERO);

      if (withdrawalToken) {
        return {
          token: withdrawalToken,
          amount,
        };
      }
    });
  }, [summary]);
}
