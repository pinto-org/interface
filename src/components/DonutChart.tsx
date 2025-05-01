import { cn } from "@/utils/utils";
import { ArcElement, Chart, ChartData, ChartOptions, PieController, Tooltip } from "chart.js";
import { useMemo } from "react";
import { ReactChart } from "./ReactChart";

Chart.register(PieController, ArcElement, Tooltip);

export interface DonutChartProps {
  data: ChartData;
  size?: number;
  className?: string;
  options?: ChartOptions;
  showLabels?: boolean;
  onHover?: (index: number) => void;
}

export default function DonutChart({ data, size = 50, className, options, onHover }: DonutChartProps) {
  const mergedOptions = useMemo(() => {
    return mergeOptions(options, onHover);
  }, [options, onHover]);

  return (
    <div className={cn("w-4 h-4", className)}>
      <ReactChart type="doughnut" data={data} options={mergedOptions as ChartOptions} height={size} width={size} />
    </div>
  );
}

const mergeOptions = (options: ChartOptions | undefined, onHover?: (index: number) => void): ChartOptions => {
  const config: ChartOptions = {
    ...options,
    plugins: {
      ...options?.plugins,
      legend: {
        display: false,
        ...options?.plugins?.legend,
      },
      tooltip: {
        enabled: false,
        ...options?.plugins?.tooltip,
      },
      // datalabels: {
      //   color: "#000",
      //   clip: false,
      //   formatter: (_value: number, context: DataLabelsContext) => {
      //     return showLabels ? context.chart.data.labels?.[context.dataIndex] || "" : "";
      //   },
      //   ...options?.plugins?.datalabels,
      // },
    },
    onHover: (_event, chartElement) => {
      if (onHover && chartElement.length > 0) {
        const index = chartElement[0].index;
        onHover?.(index);
      }
    },
    // @ts-ignore - offset is a valid property for doughnut charts
    offset: options?.offset ?? 0,
  };

  return config;
};
