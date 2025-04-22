import {
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  Plugin,
  PointElement,
} from "chart.js";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ReactChart } from "../ReactChart";
import { LineChartData } from "./LineChart";
import { MakeGradientFunction, defaultLineChartOptions, plugins, scalesX } from "./chartHelpers";

Chart.register(LineController, LineElement, LinearScale, CategoryScale, PointElement, Filler);

export interface MultiAxisDataset extends LineChartData {
  /** Which Y-axis to map to. Example: "y", "y2", "y3", etc. */
  yAxisID: string;
}

export interface MultiAxisYAxisConfig {
  id: string;
  position?: "left" | "right";
  min?: number;
  max?: number;
  ticksCallback?: (value: number) => string;
}

export interface MultiAxisTickConfig {
  hideXTicks?: boolean;
  hideYTicks?: boolean;
}

export interface MultiAxisLineChartProps {
  /** All datasets to render. Each one points at a particular Y-axis by `yAxisID`. */
  datasets: MultiAxisDataset[];
  /** Labels for the X-axis. Should match the length of each dataset’s `values` array. */
  labels: (string | number | Date)[];
  /** Array of unique Y-axis IDs, each with a config specifying axis properties, position, etc. */
  yAxisConfigs: MultiAxisYAxisConfig[];
  xKey: keyof LineChartData;
  size?: "small" | "large";
  tickConfig?: MultiAxisTickConfig;
  activeIndex?: number;
  onMouseOver?: (index: number | undefined) => void;
  makeLineGradients: (MakeGradientFunction | string)[];
  makeAreaGradients?: (MakeGradientFunction | string)[];
}

const MultiAxisLineChart = React.memo(
  ({
    datasets,
    labels,
    yAxisConfigs,
    xKey,
    activeIndex,
    tickConfig,
    onMouseOver,
    makeLineGradients,
    makeAreaGradients,
    size = "large",
  }: MultiAxisLineChartProps) => {
    const chartRef = useRef<Chart<"line"> | null>(null);
    const activeIndexRef = useRef<number | undefined>(activeIndex);

    // Keep track of changes to activeIndex so we can re-render quickly (without animations).
    useEffect(() => {
      activeIndexRef.current = activeIndex;
      if (chartRef.current) {
        chartRef.current.update("none");
      }
    }, [activeIndex]);

    /**
     * Build a minimal dynamic scale config for each known yAxisID.
     * If you need more advanced styling, you can expand these objects.
     */
    const scales = useMemo(() => {
      const output: ChartOptions<"line">["scales"] = {
        x: {
          type: "category",
          offset: false,
          grid: {
            display: true,
            drawTicks: false,
            color: (context) => scalesX.grid.color(activeIndex)(context),
          },
          border: {
            display: !Boolean(tickConfig?.hideXTicks),
          },
          ticks: {
            padding: 0,
            minRotation: 0,
            maxRotation: 0,
            autoSkipPadding: 0,
            display: !Boolean(tickConfig?.hideXTicks),
            autoSkip: false,
            maxTicksLimit: 6,
            callback: (_value, index, values) => {
              return scalesX.ticksWithXValue(_value, index, values, labels[index], activeIndex);
            },
          },
        },
      };

      // For each Y-axis config, build out a scale entry keyed by id
      for (const config of yAxisConfigs) {
        const { id, position, min, max, ticksCallback } = config;
        output[id] = {
          type: "linear",
          position,
          min,
          max,
          // offset: false,
          grid: {
            // don't display grid lines on the Y-axis. Only X-axis has grid lines.
            display: false,
            drawTicks: false,
            // offset: false,
          },
          border: {
            display: true,
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            display: !Boolean(tickConfig?.hideYTicks),
            padding: 0,
            callback: (value) => {
              const numValue = typeof value === "string" ? Number(value) : value;
              return ticksCallback ? ticksCallback(numValue) : numValue;
            },
          },
        };
      }

      return output;
    }, [yAxisConfigs, tickConfig?.hideYTicks, tickConfig?.hideXTicks]);

    const chartOptions = useMemo<ChartOptions<"line">>(() => {
      return {
        ...defaultLineChartOptions,
        stacked: false,
        layout: {
          padding: {
            left: tickConfig?.hideXTicks ? 1 : 0,
            right: 1,
            top: 0,
            bottom: tickConfig?.hideYTicks ? 0 : 8,
          },
        },
        scales,
      };
    }, [scales, tickConfig?.hideXTicks, tickConfig?.hideYTicks]);

    /**
     * Construct the Chart.js data object from the props.
     */
    const chartData = useCallback(
      (ctx: CanvasRenderingContext2D | null): ChartData<"line"> => {
        return {
          labels: labels,
          datasets: datasets.map((ds, idx) => {
            const borderColorFnOrHex = makeLineGradients[idx];
            const areaColorFnOrHex = makeAreaGradients?.[idx];

            const borderColor =
              typeof borderColorFnOrHex === "string" ? borderColorFnOrHex : borderColorFnOrHex(ctx, idx);
            const backgroundColor = areaColorFnOrHex
              ? typeof areaColorFnOrHex === "string"
                ? areaColorFnOrHex
                : areaColorFnOrHex(ctx, idx)
              : undefined;

            return {
              label: ds.label ?? `Dataset ${idx}`,
              data: ds.values,
              yAxisID: ds.yAxisID,
              borderWidth: 1,
              borderColor,
              fill: Boolean(backgroundColor),
              backgroundColor,
              pointRadius: 0,
              pointHoverRadius: 0,
            };
          }),
        };
      },
      [datasets, labels, makeLineGradients, makeAreaGradients],
    );

    const gradientPlugin = useMemo(
      () => plugins.gradientShift(activeIndexRef, makeLineGradients, makeAreaGradients),
      [makeLineGradients, makeAreaGradients],
    );
    const verticalLinePlugin = useMemo<Plugin<"line">>(() => plugins.verticalLine(activeIndexRef, false), []);
    const selectionPointPlugin = useMemo<Plugin<"line">>(() => plugins.selectionPoint(activeIndexRef, false), []);
    const selectionCallbackPlugin: Plugin = useMemo<Plugin>(
      () => plugins.selectionCallback(onMouseOver),
      [onMouseOver],
    );

    const allPlugins = useMemo(
      () => [verticalLinePlugin, selectionPointPlugin, selectionCallbackPlugin, gradientPlugin],
      [verticalLinePlugin, selectionPointPlugin, selectionCallbackPlugin, gradientPlugin],
    );

    const chartDimensions = useMemo(() => {
      if (size === "small") {
        return { w: 3, h: 1 };
      } else {
        return { w: 6, h: 2 };
      }
    }, [size]);

    return (
      <ReactChart
        ref={chartRef}
        type="line"
        data={chartData}
        options={chartOptions}
        plugins={allPlugins}
        width={chartDimensions.w}
        height={chartDimensions.h}
      />
    );
  },
);

export default MultiAxisLineChart;
