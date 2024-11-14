import Text from "@/components/ui/Text";
import { usePodLine, useTemperature, useTotalSoil } from "@/state/useFieldData";
import { useMorning } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { MorningIntervalCountdown } from "./MorningCountdown";

const FieldStats = () => {
  const temperatures = useTemperature();
  const morning = useMorning();
  const soil = useTotalSoil();
  const podLine = usePodLine();

  const temperature = morning.isMorning ? temperatures.scaled : temperatures.max;

  return (
    <div className="flex flex-row gap-x-12 gap-y-4 flex-wrap w-full">
      <div className="flex flex-col flex-grow gap-2">
        <div className="flex flex-col gap-1">
          <Text variant="body-light">Current Temperature</Text>
          <Text variant="sm" color="light">
            The interest rate for lending Pinto
          </Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="h3">{`${formatter.pct(temperature)}`}</Text>
          {morning.isMorning && (
            <Text variant="sm-light" color="morning" className="inline-block tabular-nums">
              <MorningIntervalCountdown prefix={"Increasing in"} />
            </Text>
          )}
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
          {morning.isMorning && (
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
        <Text variant="h3">{formatter.number(podLine)}</Text>
      </div>
    </div>
  );
};

export default FieldStats;
