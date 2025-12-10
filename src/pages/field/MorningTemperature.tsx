import LineChart, { LineChartData } from "@/components/charts/LineChart";

import { formatter } from "@/utils/format";
import { useCallback, useMemo, useState } from "react";

import { TokenValue } from "@/classes/TokenValue";
import MorningCard from "@/components/MorningCard";
import { metallicMorningAreaGradientFn, metallicMorningStrokeGradientFn } from "@/components/charts/chartHelpers";
import { MORNING_AUCTION_DURATION } from "@/constants/morning";
import { useContinuousMorningTime } from "@/hooks/useContinuousMorningTime";
import { MorningIntervalCountdown } from "@/pages/field/MorningCountdown";
import { scaleTemperatureWithMaxTemperature } from "@/state/protocol/field";
import useCalculateTemperature from "@/state/useCalculateTemperature";
import { useTemperature } from "@/state/useFieldData";
import { useMorning, useSunData } from "@/state/useSunData";
import { cn } from "@/utils/utils";
import { DateTime } from "luxon";
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
  const { generateContinuous } = useCalculateTemperature();
  const { max } = useTemperature();
  const { timestamp } = useSunData();

  const [hoveredIndex, setHoveredIndex] = useState<number>();
  const morning = useMorning();

  // Get continuous time updates at 60fps
  const continuousSecondsElapsed = useContinuousMorningTime();

  // Generate 600 data points (one per second) for the chart
  const mappedData = useMemo(() => {
    const datas: LineChartData[] = [];

    // Use generateContinuous to get all 600 temperature data points
    for (const value of Object.values(generateContinuous())) {
      datas.push({
        values: [value.temperature.toNumber()],
        interval: DateTime.fromSeconds(timestamp.toSeconds() + value.index).toFormat("hh:mm"),
      });
    }

    return datas;
  }, [generateContinuous]);

  const onMouseOver = useCallback((idx: number) => {
    setHoveredIndex(idx);
  }, []);

  // Show x-axis ticks at: 0s, 120s (2min), 240s (4min), 360s (6min), 480s (8min), 599s (end)
  const xAxisTickIndices = useMemo(() => [0, 120, 240, 360, 480, 599], []);

  return (
    <MorningCard className={cn("flex flex-col w-full p-6 h-[25rem]", className)}>
      <div className="flex flex-col w-full gap-2">
        <Stat
          morning={morning}
          data={mappedData}
          hoveredIndex={hoveredIndex}
          continuousSecondsElapsed={continuousSecondsElapsed}
          maxTemperature={max}
        />
        <div className={cn("w-full h-[18.75rem]", chartWrapperClassName)}>
          <LineChart
            data={mappedData}
            size="large"
            xKey="interval"
            makeLineGradients={makeLineGradients}
            makeAreaGradients={makeAreaGradients}
            onMouseOver={onMouseOver}
            valueFormatter={formatter.pct}
            activeIndex={continuousSecondsElapsed}
            hideXAxisGrid
            xAxisTickIndices={xAxisTickIndices}
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
  continuousSecondsElapsed,
  maxTemperature,
}: {
  morning: Morning;
  data: LineChartData[];
  hoveredIndex?: number;
  continuousSecondsElapsed: number;
  maxTemperature: TokenValue;
}) => {
  // Calculate the current temperature in real-time using continuous seconds
  const currentTemperature = useMemo(() => {
    if (!morning.isMorning || !maxTemperature || maxTemperature.lte(0)) {
      return 0;
    }
    return scaleTemperatureWithMaxTemperature(maxTemperature, continuousSecondsElapsed).toNumber();
  }, [morning.isMorning, maxTemperature, continuousSecondsElapsed]);

  // When hovering, show the temperature at the hovered data point
  const displayTemp = useMemo(() => {
    if (hoveredIndex !== undefined) {
      // Clamp the hovered index to valid range
      const clampedIndex = Math.max(0, Math.min(hoveredIndex, MORNING_AUCTION_DURATION - 1));
      return data[clampedIndex]?.values?.[0] ?? currentTemperature;
    }
    // Otherwise show the current real-time temperature
    return currentTemperature;
  }, [hoveredIndex, data, currentTemperature]);

  // Format the temperature - no decimals when at or above 100%
  const formattedTemp = useMemo(() => {
    if (displayTemp >= 1) {
      return formatter.pct(displayTemp, { maxDecimals: 0, minDecimals: 0 });
    }
    return formatter.pct(displayTemp);
  }, [displayTemp]);

  return (
    <div className="flex flex-col w-full gap-1">
      <div className="pinto-sm">Current Temperature</div>
      <div className="pinto-h3">{formattedTemp}</div>
    </div>
  );
};
