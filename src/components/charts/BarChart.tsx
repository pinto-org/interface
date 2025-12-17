import { exists } from "@/utils/utils";
import {
  BarController,
  BarElement,
  CartesianScaleTypeRegistry,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  PointElement,
} from "chart.js";
import React, { useEffect, useMemo, useState } from "react";
import { Col } from "../Container";
import LoadingSpinner from "../LoadingSpinner";
import { ReactChart } from "../ReactChart";
import { plugins } from "./chartHelpers";

ChartJS.register(BarController, BarElement, PointElement);

type BarChartProps = {
  data: ChartData<"bar">;
  isLoading?: boolean;
  onMouseOver?: (index: number | undefined) => void;
  yLabelFormatter?: (value: number | string) => string;
  xLabelFormatter?: (value: number | string) => string;
  defaultHoverIndex?: number;
  logThreshold?: number;
  enableTooltips?: boolean;
  yMinScalar?: number;
  yMaxScalar?: number;
  useLinearXAxis?: boolean;
  noData?: boolean;
};
interface IYScale {
  type: keyof CartesianScaleTypeRegistry;
  min?: number;
  max?: number;
}

const MIN_VALUES = 3;
const defaultIYScale: IYScale = { type: "linear" };

const BarChart = React.memo(
  ({
    data,
    isLoading,
    onMouseOver,
    yLabelFormatter,
    xLabelFormatter,
    defaultHoverIndex,
    logThreshold = 5,
    enableTooltips = false,
    yMinScalar = 0.99,
    yMaxScalar = 1.01,
    useLinearXAxis = false,
    noData,
  }: BarChartProps) => {
    const [iYScale, setIYScale] = useState<IYScale | undefined>(undefined);

    useEffect(() => {
      const yScaleObj: IYScale = { ...defaultIYScale };

      if (data.datasets.length) {
        const flattened = data.datasets.flatMap((d) => d.data.filter((d) => exists(d)).flat());
        const min = Math.min(...flattened);
        const max = Math.max(...flattened);

        const ratio = max / min;

        const hasMinLengths = data.datasets.every((dataset) => dataset.data.length >= MIN_VALUES);
        const useLog = hasMinLengths && ratio <= logThreshold; // tweak threshold as needed

        yScaleObj.type = useLog ? "logarithmic" : "linear";

        if (useLog && min > 0 && max > 0) {
          yScaleObj.min = min * yMinScalar;
          yScaleObj.max = max * yMaxScalar;
        }
      }

      setIYScale(yScaleObj);
    }, [data, logThreshold, yMinScalar, yMaxScalar]);

    const options: ChartOptions<"bar"> = useMemo(
      () => ({
        ...baseOptions,
        scales: {
          y: {
            type: iYScale?.type,
            min: iYScale?.min,
            max: iYScale?.max,
            ticks: {
              display: !!yLabelFormatter,
              callback: yLabelFormatter,
              beginAtZero: iYScale && iYScale.type === "linear", // only linear scale can begin at zero
              autoSkip: true,
              maxTicksLimit: 5,
            },
          },
          x: {
            type: useLinearXAxis ? "linear" : "category",
            stacked: false, //
            ticks: {
              display: !!xLabelFormatter,
              callback: xLabelFormatter,
              autoSkip: true,
              maxTicksLimit: 5,
            },
          },
        },
        onHover: (_, elements) => {
          onMouseOver?.(elements[0]?.index ?? undefined);
        },
        onLeave: () => {
          onMouseOver?.(defaultHoverIndex);
        },
        elements: {
          bar: {
            ...baseOptions.elements?.bar,
            backgroundColor: (ctx) => {
              const hoverColor = ctx.dataset.hoverBackgroundColor ?? baseOptions.elements?.bar?.hoverBackgroundColor;
              const color = ctx.dataset.backgroundColor ?? baseOptions.elements?.bar?.backgroundColor;
              // Don't handle the case where the background color is a scriptable function yet.
              if (typeof hoverColor !== "string" || typeof color !== "string") return undefined;
              const isHovered =
                ctx.active || (!ctx.chart.getActiveElements().length && ctx.dataIndex === defaultHoverIndex);
              return isHovered ? hoverColor : color;
            },
            borderColor: (ctx) => {
              const hoverColor = ctx.dataset.hoverBorderColor ?? baseOptions.elements?.bar?.hoverBorderColor;
              const color = ctx.dataset.borderColor ?? baseOptions.elements?.bar?.borderColor;

              // Don't handle the case where the border color is a scriptable function yet.
              if (typeof hoverColor !== "string" || typeof color !== "string") return undefined;
              const isHovered =
                ctx.active || (!ctx.chart.getActiveElements().length && ctx.dataIndex === defaultHoverIndex);
              return isHovered ? hoverColor : color;
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: enableTooltips,
          },
        },
      }),
      [onMouseOver, yLabelFormatter, xLabelFormatter, defaultHoverIndex, enableTooltips, iYScale],
    );

    const hasMouseOver = exists(onMouseOver);

    // Memoize the plugins.
    const chartPlugins = useMemo(() => {
      if (onMouseOver) {
        return [plugins.selectionCallback(onMouseOver)];
      }
      return [];
    }, [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      hasMouseOver, // only redefine if hasMouseOver changes
    ]);

    if (noData) {
      return (
        <Col className="flex items-center justify-center h-full">
          <div className="pinto-body-light">No data to display</div>
        </Col>
      );
    }

    if (isLoading || !data.datasets.length || !iYScale) {
      return (
        <Col className="flex items-center justify-center h-full">
          <LoadingSpinner size={75} />
        </Col>
      );
    }

    return <ReactChart type="bar" data={data} options={options} plugins={chartPlugins} />;
  },
);

export default BarChart;

const baseOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  // @ts-ignore
  borderRadius: 4,
  categoryPercentage: 0.95,
  // hover interaction for over the area not the bar
  interaction: {
    mode: "index",
    intersect: false,
    axis: "x",
  },
  hover: {
    mode: "index",
    intersect: false,
    axis: "x",
  },
  plugins: {
    tooltip: {
      enabled: false,
    },
  },
  elements: {
    // default colors. Can be overriden
    bar: {
      backgroundColor: "rgba(56, 127, 92, 0.5)",
      borderColor: "rgba(56, 127, 92, 0.6)",
      hoverBackgroundColor: "rgba(56, 127, 92, 0.8)",
      hoverBorderColor: "rgba(56, 127, 92, 1)",
      hoverBorderWidth: 1,
      borderWidth: 1,
    },
  },
};
