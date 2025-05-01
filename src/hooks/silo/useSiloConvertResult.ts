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
  toTotalStalk: TV.ZERO,
  toInitialStalk: TV.ZERO,
  toGrownStalk: TV.ZERO,
  toSeed: TV.ZERO,
  fromTotalStalk: TV.ZERO,
  fromInitialStalk: TV.ZERO,
  fromGrownStalk: TV.ZERO,
  fromSeed: TV.ZERO,
  deltaBdv: TV.ZERO,
  fromBdv: TV.ZERO,
  toBdv: TV.ZERO,
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
          fromTotalStalk: prev.fromTotalStalk.add(picked.totalStalk),
          fromInitialStalk: prev.fromInitialStalk.add(picked.totalInitialStalk),
          fromGrownStalk: prev.fromGrownStalk.add(picked.totalGrownStalkSinceDeposit),
          fromSeed: prev.fromSeed.add(picked.totalSeeds),
          deltaBdv: prev.deltaBdv.add(deltaBdv),
          fromBdv: prev.fromBdv.add(fromBdv),
          toBdv: prev.toBdv.add(toBdv),
        };

        return struct;
      },
      { ...defaultData },
    );

    const deltaInitialStalk = calc.toInitialStalk.sub(calc.fromInitialStalk);
    const deltaGrownStalk = calc.toGrownStalk.sub(calc.fromGrownStalk);
    const deltaStalk = deltaInitialStalk.add(deltaGrownStalk);
    const deltaSeed = calc.toSeed.sub(calc.fromSeed);

    const data = {
      ...calc,
      deltaGrownStalk,
      deltaInitialStalk,
      deltaStalk,
      deltaSeed,
    };

    return data;
  }, [quote, results, siloTokenData, source, target]);
}
