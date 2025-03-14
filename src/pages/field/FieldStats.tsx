import { Skeleton } from "@/components/ui/Skeleton";
import { usePodLine, usePodLoading, useTemperature, useTotalSoil } from "@/state/useFieldData";
import { useMorning, useSunData } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { normalizeTV } from "@/utils/number";
import { MorningIntervalCountdown } from "./MorningCountdown";

const FieldStats = () => {
  const abovePeg = useSunData().abovePeg;
  const temperatures = useTemperature();
  const { isMorning } = useMorning();
  const totalSoil = useTotalSoil().totalSoil;
  const soilIsLoading = useTotalSoil();
  const podLine = usePodLine();
  const podLoading = usePodLoading();

  const scaledTemperature = normalizeTV(temperatures.scaled);
  const soil = normalizeTV(totalSoil);
  const pLine = normalizeTV(podLine);
  const maxTemperature = normalizeTV(temperatures.max);

  return (
    <div className="flex flex-row gap-x-12 gap-y-4 flex-wrap w-full">
      <div className="flex flex-col flex-grow gap-1 sm:gap-2">
        <div className="flex flex-col gap-1">
          <div className="pinto-sm-light sm:pinto-body-light">
            {isMorning ? "Max Temperature" : "Current Temperature"}
          </div>
          <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light">
            {isMorning ? "Temperature after the Morning Auction" : "Interest rate for Sowing Pinto"}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div
            className={`pinto-body sm:pinto-h3 ${isMorning ? "text-pinto-light sm:text-pinto-light" : "text-pinto-primary sm:text-pinto-primary"}`}
          >
            {temperatures.isLoading ? (
              <Skeleton className="w-14 h-[2.2rem]" />
            ) : (
              `${formatter.pct(isMorning ? maxTemperature : scaledTemperature)}`
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-1 sm:gap-2">
        <div className="flex flex-col gap-1">
          <div className="pinto-sm-light sm:pinto-body-light font-thin">Available Soil</div>
          <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light">
            Amount of Pinto that can be Sown
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="pinto-body sm:pinto-h3">
            {soilIsLoading.isLoading ? (
              <Skeleton className="w-14 h-[2.2rem]" />
            ) : (
              formatter.number(soil, {
                minValue: 0.01,
              })
            )}
          </div>
          {isMorning && abovePeg && (
            <div className="pinto-xs sm:pinto-sm-light text-pinto-morning sm:text-pinto-morning inline-block tabular-nums">
              <MorningIntervalCountdown prefix={"Decreasing in"} />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-1 sm:gap-2">
        <div className="flex flex-col gap-1">
          <div className="pinto-sm-light sm:pinto-body-light font-thin">Pod Line</div>
          <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light">
            FIFO queue of Pods that are not yet redeemable
          </div>
        </div>
        {/* //TODO h: add podLine isLoading boolean */}
        <div className="pinto-body sm:pinto-h3">
          {podLoading ? <Skeleton className="w-14 h-[2.2rem]" /> : formatter.number(pLine)}
        </div>
      </div>
    </div>
  );
};

export default FieldStats;
