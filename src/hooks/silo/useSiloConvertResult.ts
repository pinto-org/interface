import { TV } from "@/classes/TokenValue";
import { STALK } from "@/constants/internalTokens";
import { ConvertResultStruct } from "@/lib/siloConvert/SiloConvert";
import { DefaultConvertStrategyResult } from "@/lib/siloConvert/strategies/DefaultConvertStrategy";
import { LP2LPConvertStrategyResult } from "@/lib/siloConvert/strategies/LP2LPConvertStrategy";
import { useSiloData } from "@/state/useSiloData";
import { Token } from "@/utils/types";
import { useMemo } from "react";

const defaultData = {
  germinatingStalk: TV.ZERO,
  germinatingSeasons: 0,
  totalAmountOut: TV.ZERO,
  totalToStalk: TV.ZERO,
  totalToBaseStalk: TV.ZERO,
  totalToGrownStalk: TV.ZERO,
  totalToSeed: TV.ZERO,
  totalFromStalk: TV.ZERO,
  totalFromBaseStalk: TV.ZERO,
  totalFromGrownStalk: TV.ZERO,
  totalFromSeed: TV.ZERO,
  deltaBdv: TV.ZERO,
  totalFromBdv: TV.ZERO,
  totalToBdv: TV.ZERO,
};

export function useSiloConvertResult(
  source: Token,
  target: Token | undefined,
  quote: (DefaultConvertStrategyResult | LP2LPConvertStrategyResult)[] | undefined,
  results: ConvertResultStruct<TV>[] | undefined,
) {
  const silo = useSiloData();
  const siloTokenData = silo.tokenData;

  return useMemo(() => {
    if (!quote || !results || !target) return;

    const sourceData = siloTokenData.get(source);
    const targetData = siloTokenData.get(target);

    if (!targetData || !sourceData || quote.length !== results.length) return;

    const targetRewards = targetData.rewards;
    const targetStemTip = targetData.stemTip;

    const calc = results.reduce<typeof defaultData>(
      (prev, result, i) => {
        const { pickedCrates: picked } = quote[i];

        const resultToStem = result.toStem;
        const willGerminate = resultToStem.gte(targetStemTip);
        const germinatingSeasons = willGerminate ? (resultToStem.eq(targetStemTip) ? 2 : 1) : 0;

        const targetDeltaStem = targetStemTip.sub(result.toStem);
        const grownStalkBigInt = willGerminate ? 0n : targetDeltaStem.toBigInt() * result.toBdv.toBigInt();

        const toBaseStalk = result.toBdv.reDecimal(STALK.decimals);
        const toGrownStalk = TV.fromBigInt(grownStalkBigInt, STALK.decimals);
        const toTotalStalk = toBaseStalk.add(toGrownStalk);
        const toSeed = targetRewards.seeds.mul(result.toBdv);
        const fromBdv = picked.totalBDV;
        const toBdv = result.toBdv;
        const deltaBdv = toBdv.sub(fromBdv);

        return {
          germinatingStalk: willGerminate ? prev.germinatingStalk.add(toBaseStalk) : TV.ZERO,
          germinatingSeasons: willGerminate && !prev.germinatingSeasons ? germinatingSeasons : prev.germinatingSeasons,
          totalAmountOut: prev.totalAmountOut.add(result.toAmount),
          totalToBaseStalk: prev.totalToBaseStalk.add(toBaseStalk),
          totalToGrownStalk: prev.totalToGrownStalk.add(toGrownStalk),
          totalToSeed: prev.totalToSeed.add(toSeed),
          totalToStalk: willGerminate ? prev.totalToStalk : prev.totalToStalk.add(toTotalStalk),
          totalFromStalk: prev.totalFromStalk.add(picked.totalStalk),
          totalFromBaseStalk: prev.totalFromBaseStalk.add(picked.totalBaseStalk),
          totalFromGrownStalk: prev.totalFromGrownStalk.add(picked.totalGrownStalk),
          totalFromSeed: prev.totalFromSeed.add(picked.totalSeeds),
          deltaBdv: prev.deltaBdv.add(deltaBdv),
          totalFromBdv: prev.totalFromBdv.add(fromBdv),
          totalToBdv: prev.totalToBdv.add(toBdv),
        };
      },
      { ...defaultData },
    );

    const totalDeltaBaseStalk = calc.totalToBaseStalk.sub(calc.totalFromBaseStalk);
    const totalDeltaGrownStalk = calc.totalToGrownStalk.sub(calc.totalFromGrownStalk);
    const totalDeltaStalk = totalDeltaBaseStalk.add(totalDeltaGrownStalk);
    const totalDeltaSeed = calc.totalToSeed.sub(calc.totalFromSeed);

    return {
      toGerminatingStalk: calc.germinatingStalk,
      toGerminatingSeasons: calc.germinatingSeasons,
      deltaGrownStalk: totalDeltaGrownStalk,
      deltaBaseStalk: totalDeltaBaseStalk,
      deltaStalk: totalDeltaStalk,
      deltaSeed: totalDeltaSeed,
      deltaBdv: calc.deltaBdv,
      amountOut: calc.totalAmountOut,
    };
  }, [quote, results, siloTokenData, source, target]);
}

// console.debug("[SiloConvert/useSiloConvertResult]: ", {
//   fromTotalBaseStalk: calc.totalFromBaseStalk.toHuman(),
//   fromTotalGrownStalk: calc.totalFromGrownStalk.toHuman(),
//   fromTotalStalk: calc.totalFromStalk.toHuman(),
//   fromTotalSeed: calc.totalFromSeed.toHuman(),
//   toTotalBaseStalk: calc.totalToBaseStalk.toHuman(),
//   toTotalGrownStalk: calc.totalToGrownStalk.toHuman(),
//   toTotalTotalStalk: calc.totalToStalk.toHuman(),
//   toTotalToSeed: calc.totalToSeed.toHuman(),
//   toTotalAmountOut: calc.totalAmountOut.toHuman(),
//   deltaBaseStalk: totalDeltaBaseStalk.toHuman(),
//   deltaGrownStalk: totalDeltaGrownStalk.toHuman(),
//   deltaStalk: totalDeltaStalk.toHuman(),
//   deltaSeed: totalDeltaSeed.toHuman(),
//   deltaBdv: calc.deltaBdv.toHuman(),
//   totalFromBdv: calc.totalFromBdv.toHuman(),
//   totalToBdv: calc.totalToBdv.toHuman(),
//   quote,
//   results,
// });
