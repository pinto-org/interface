import { TV } from "@/classes/TokenValue";
import Text from "@/components/ui/Text";
import { usePodLine, useTemperature, useTotalSoil } from "@/state/useFieldData";
import { useMorning } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { MorningIntervalCountdown } from "./MorningCountdown";

const FieldStats = () => {
  const temperatures = useTemperature();
  const { isMorning } = useMorning();
  const totalSoil = useTotalSoil();
  const podLine = usePodLine();

  const scaledTemperature = temperatures.scaled.lte(0) ? TV.ZERO : temperatures.scaled;
  const soil = totalSoil.lte(0) ? TV.ZERO : totalSoil;
  const pLine = podLine.lte(0) ? TV.ZERO : podLine;

  return (
    <div className="flex flex-row gap-x-12 gap-y-4 flex-wrap w-full">
      <div className="flex flex-col flex-grow gap-2">
        <div className="flex flex-col gap-1">
          <Text variant="body-light">{isMorning ? "Current Temperature" : "Max Temperature"}</Text>
          <Text variant="sm" color="light">
            {isMorning ? "The interest rate for lending Pinto" : "The temperature after the morning auction"}
          </Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="h3">{`${formatter.pct(temperatures.max.gt(0) ? scaledTemperature : 0)}`}</Text>
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-2">
        <div className="flex flex-col gap-1">
          <Text variant="body-light">Available Soil</Text>
          <Text variant="sm" color="light">
            The total number of Pinto that can be lent
          </Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="h3">{formatter.number(soil)}</Text>
          {isMorning && (
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
            The length of the queue for Pods to mature
          </Text>
        </div>
        <Text variant="h3">{formatter.number(pLine)}</Text>
      </div>
    </div>
  );
};

export default FieldStats;
