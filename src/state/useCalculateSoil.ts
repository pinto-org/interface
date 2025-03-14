import { normalizeTV } from "@/utils/number";
import { useCallback, useMemo } from "react";
import useCalculateTemperature from "./useCalculateTemperature";
import { useTotalSoil } from "./useFieldData";
import { useMorning, useSunData } from "./useSunData";

/**
 * Only works if we're below peg. Keeping for reference until we add more view functions to the contract.
 * Opting to re-fetch soil every 2 seconds until then.
 */
export default function useCalculateSoil() {
  const season = useSunData();
  const totalSoil = useTotalSoil().totalSoil;
  const morning = useMorning();

  const { calculate: calculateTemperature } = useCalculateTemperature();

  const isMorning = morning.isMorning;
  const abovePeg = season.abovePeg;
  const morningIndex = morning.index;

  const calculateNextSoil = useCallback(
    (morningIdx: number) => {
      const soil = normalizeTV(totalSoil);
      if (!abovePeg) {
        return soil;
      }

      const currTemp = calculateTemperature(morningIdx);
      const nextTemp = calculateTemperature(morningIdx + 1);

      const ratio = currTemp.add(100).div(nextTemp.add(100));

      return soil.mul(ratio).roundDown();
    },
    [abovePeg, totalSoil, calculateTemperature],
  );

  const soilData = useMemo(() => {
    const soil = normalizeTV(totalSoil);
    if (!isMorning || !abovePeg) {
      return {
        soil,
        nextSoil: soil,
      };
    }

    const nextSoil = calculateNextSoil(morningIndex);

    return {
      soil,
      nextSoil,
    };
  }, [isMorning, abovePeg, totalSoil, morningIndex, calculateNextSoil]);

  return [soilData, calculateNextSoil] as const;
}

/**
 * Max SOIL for the season:
 *
 * If we're above peg:
 * - amount of pods that became harvestable at the start of the season / 100% + max temperature
 * otherwise:
 * - capped deltaB
 *
 *
 *
 * 1000 pods harvested, temp is 100%
 *
 * above peg:
 * 1000 pods harvestable / 100% + max temperature = 200%. 1000 / 2 = 500 SOIL.
 *
 *
 * 1000 / (100% + 100%) = 1000 / 200% = 500 SOIL.
 *
 *
 *
 *
 */
