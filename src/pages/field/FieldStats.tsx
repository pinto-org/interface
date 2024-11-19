import Text from "@/components/ui/Text";
import { usePodLine, useTemperature, useTotalSoil } from "@/state/useFieldData";
import { useMorning, useSunData } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { normalizeTV } from "@/utils/number";
import { MorningIntervalCountdown } from "./MorningCountdown";

const FieldStats = () => {
  const abovePeg = useSunData().abovePeg;
  const temperatures = useTemperature();
  const { isMorning } = useMorning();
  const totalSoil = useTotalSoil();
  const podLine = usePodLine();

  const scaledTemperature = normalizeTV(temperatures.scaled);
  const soil = normalizeTV(totalSoil);
  const pLine = normalizeTV(podLine);
  const maxTemperature = normalizeTV(temperatures.max);

  return (
    <div className="flex flex-row gap-x-12 gap-y-4 flex-wrap w-full">
      <div className="flex flex-col flex-grow gap-2">
        <div className="flex flex-col gap-1">
          <Text variant="body-light">{isMorning ? "Max Temperature" : "Current Temperature"}</Text>
          <Text variant="sm" color="light">
            {isMorning ? "Temperature after the Morning Auction" : "Interest rate for Sowing Pinto"}
          </Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text
            variant="h3"
            color={isMorning ? "light" : "primary"}
          >{`${formatter.pct(isMorning ? maxTemperature : scaledTemperature)}`}</Text>
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-2">
        <div className="flex flex-col gap-1">
          <Text variant="body-light">Available Soil</Text>
          <Text variant="sm" color="light">
            Amount of Pinto that can be Sown
          </Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="h3">{formatter.number(soil, { minValue: 0.01 })}</Text>
          {isMorning && abovePeg && (
            <Text variant="sm-light" color="morning" className="inline-block tabular-nums">
              <MorningIntervalCountdown prefix={"Decreasing in"} />
            </Text>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-2">
        <div className="flex flex-col gap-1">
          <Text variant="body-light">Pod Line</Text>
          <Text variant="sm" color="light">
            FIFO queue of Pods that are not yet redeemable
          </Text>
        </div>
        <Text variant="h3">{formatter.number(pLine)}</Text>
      </div>
    </div>
  );
};

export default FieldStats;
