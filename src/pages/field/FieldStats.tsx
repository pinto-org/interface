import TextSkeleton from "@/components/TextSkeleton";
import { useInitialSoil, usePodLine, usePodLoading, useTemperature, useTotalSoil } from "@/state/useFieldData";
import { useMorning, useSunData } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { normalizeTV } from "@/utils/number";
import { MorningIntervalCountdown } from "./MorningCountdown";

const FieldStats = () => {
  const abovePeg = useSunData().abovePeg;
  const temperatures = useTemperature();
  const { isMorning } = useMorning();

  const totalSoilAtom = useTotalSoil();
  const totalSoil = totalSoilAtom.totalSoil;
  const soilIsLoading = totalSoilAtom.isLoading;

  const initialSoilAtom = useInitialSoil();
  const initialSoil = normalizeTV(initialSoilAtom.initialSoil);
  const initialSoilIsLoading = initialSoilAtom.isLoading;

  const podLine = usePodLine();
  const podLoading = usePodLoading();

  const scaledTemperature = normalizeTV(temperatures.scaled);
  const soil = normalizeTV(totalSoil);
  const pLine = normalizeTV(podLine);
  const maxTemperature = normalizeTV(temperatures.max);

  const isLoading = temperatures.isLoading || soilIsLoading || initialSoilIsLoading || podLoading;

  return (
    <div className="flex flex-col sm:flex-row gap-x-12 gap-y-4 w-full">
      <div className="flex flex-col flex-grow gap-1 sm:gap-2">
        <div className="flex flex-col gap-1">
          <div className="pinto-sm-light sm:pinto-body-light text-nowrap">
            {isMorning ? "Max Temperature" : "Current Temperature"}
          </div>
          <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light">
            {isMorning ? "Temperature after the Morning Auction" : "Interest rate for Sowing Pinto"}
          </div>
        </div>
        <TextSkeleton desktopHeight="same-h3" height="body" className="w-14" loading={isLoading}>
          <div
            className={`pinto-body sm:pinto-h3 ${isMorning ? "text-pinto-light sm:text-pinto-light" : "text-pinto-primary sm:text-pinto-primary"}`}
          >
            {formatter.pct(isMorning ? maxTemperature : scaledTemperature)}
          </div>
        </TextSkeleton>
      </div>
      <div className="flex flex-col flex-grow gap-1 sm:gap-2">
        <div className="flex flex-col gap-1">
          <div className="pinto-sm-light sm:pinto-body-light font-thin text-nowrap">Available Soil</div>
          <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light">
            Amount of Pinto that can be Sown
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <TextSkeleton desktopHeight="same-h3" height="body" className="w-14" loading={isLoading}>
            <div className="pinto-body sm:pinto-h3">
              {formatter.number(soil, { minValue: 0.01 })} / {formatter.number(initialSoil, { minValue: 0.01 })}
            </div>
          </TextSkeleton>
          {isMorning && abovePeg && (
            <div className="pinto-xs sm:pinto-sm-light text-pinto-morning sm:text-pinto-morning inline-block tabular-nums">
              <MorningIntervalCountdown prefix={"Decreasing in"} />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-1 sm:gap-2">
        <div className="flex flex-col gap-1">
          <div className="pinto-sm-light sm:pinto-body-light font-thin text-nowrap">Pod Line</div>
          <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light">
            FIFO queue of Pods that are not yet redeemable
          </div>
        </div>
        <div className="pinto-body sm:pinto-h3">
          <TextSkeleton desktopHeight="h3" height="body" className="w-32" loading={isLoading}>
            {formatter.number(pLine)}
          </TextSkeleton>
        </div>
      </div>
    </div>
  );
};

export default FieldStats;
