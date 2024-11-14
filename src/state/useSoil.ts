import { useCallback, useMemo } from "react";
import { useTotalSoil } from "./useFieldData";
import { useMorning, useSunData } from "./useSunData";
import useTemperature from "./useTemperature";

export default function useSoil() {
  const season = useSunData();
  const totalSoil = useTotalSoil();
  const morning = useMorning();

  const [_, { calculate: calculateTemperature }] = useTemperature();

  const isMorning = morning.isMorning;
  const abovePeg = season.abovePeg;
  const morningIndex = morning.index;

  const calculateNextSoil = useCallback(
    (morningIdx: number) => {
      if (!abovePeg) {
        return totalSoil;
      }

      const currTemp = calculateTemperature(morningIdx);
      const nextTemp = calculateTemperature(morningIdx + 1);

      const ratio = currTemp.add(100).div(nextTemp.add(100));

      return totalSoil.mul(ratio).roundDown();
    },
    [abovePeg, totalSoil, calculateTemperature],
  );

  const soilData = useMemo(() => {
    if (!isMorning || !abovePeg) {
      return {
        soil: totalSoil,
        nextSoil: totalSoil,
      };
    }

    const nextSoil = calculateNextSoil(morningIndex);

    return {
      soil: totalSoil,
      nextSoil,
    };
  }, [isMorning, abovePeg, totalSoil, morningIndex, calculateNextSoil]);

  return [soilData, calculateNextSoil] as const;
}
