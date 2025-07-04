import LineChart, { LineChartData } from "@/components/charts/LineChart";

import { formatter } from "@/utils/format";
import { useCallback, useMemo, useState } from "react";

import MorningCard from "@/components/MorningCard";
import { metallicMorningAreaGradientFn, metallicMorningStrokeGradientFn } from "@/components/charts/chartHelpers";
import { MorningIntervalCountdown } from "@/pages/field/MorningCountdown";
import useCalculateTemperature from "@/state/useCalculateTemperature";
import { useMorning } from "@/state/useSunData";
import { cn } from "@/utils/utils";
import { Morning } from "../../state/protocol/sun";

const makeLineGradients = [metallicMorningStrokeGradientFn];
const makeAreaGradients = [metallicMorningAreaGradientFn];

const MorningTemperatureChart = ({
  className,
  chartWrapperClassName,
}: {
  className?: string;
  chartWrapperClassName?: string;
}) => {
  const { generate } = useCalculateTemperature();

  const [hoveredIndex, setHoveredIndex] = useState<number>();
  const morning = useMorning();

  const mappedData = useMemo(() => {
    const labels: number[] = [];
    const datas: LineChartData[] = [];

    for (const value of Object.values(generate())) {
      labels.push(value.interval);
      datas.push({ values: [value.temperature.toNumber()], interval: value.interval });
    }

    return datas;
  }, [generate]);

  const onMouseOver = useCallback((idx: number) => {
    setHoveredIndex(idx);
  }, []);

  return (
    <MorningCard className={cn("flex flex-col w-full p-6 h-[423px] lg:h-[435px]", className)}>
      <div className="flex flex-col w-full gap-2">
        <Stat morning={morning} data={mappedData} hoveredIndex={hoveredIndex} />
        <div className={cn("w-full h-[300px]", chartWrapperClassName)}>
          <LineChart
            data={mappedData}
            size="large"
            xKey="interval"
            makeLineGradients={makeLineGradients}
            makeAreaGradients={makeAreaGradients}
            onMouseOver={onMouseOver}
            valueFormatter={formatter.pct}
            activeIndex={morning.index}
          />
        </div>
      </div>
    </MorningCard>
  );
};

export default MorningTemperatureChart;

const Stat = ({
  hoveredIndex,
  data,
  morning,
}: {
  morning: Morning;
  data: LineChartData[];
  hoveredIndex?: number;
}) => {
  const morningIndex = morning.index > 25 ? 25 : morning.index < 0 ? 0 : morning.index;

  const index = hoveredIndex ?? morningIndex;
  const clampedIndex = index > 25 ? 25 : index < 0 ? 0 : index;

  const displayTemp = data[clampedIndex]?.values?.[0];

  return (
    <div className="flex flex-col w-full gap-1">
      <div className="pinto-sm">Current Temperature {clampedIndex}/25</div>
      <div className="flex flex-col gap-2">
        <div className="pinto-sm-thin text-pinto-light">
          <MorningIntervalCountdown prefix={"Increasing in"} />
        </div>
        <div className="pinto-h3">{formatter.pct(displayTemp)}</div>
      </div>
    </div>
  );
};
