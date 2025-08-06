import { ChartOptions } from "chart.js";
import { useCallback, useMemo, useRef } from "react";

interface UseStableChartOptionsProps {
  maxValue: number;
  hasPreview: boolean;
}

export const useStableChartOptions = ({ maxValue, hasPreview }: UseStableChartOptionsProps) => {
  // Static configurations that never change
  const staticConfig = useRef({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    layout: {
      padding: {
        left: 15,
        right: 15,
        top: 15,
        bottom: 50, // Extra bottom padding for icons
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  });

  // Stable tooltip callbacks
  const tooltipLabelCallback = useCallback((context: any) => {
    const label = context.dataset.label || "";
    const value = Number(context.parsed.y).toFixed(4);
    return `${label}: ${value} BDV`;
  }, []);

  const tooltipTitleCallback = useCallback((tooltipItems: any[]) => {
    return tooltipItems[0]?.label || "";
  }, []);

  const tooltipBeforeBodyCallback = useCallback((tooltipItems: any[]) => {
    if (tooltipItems.length > 1) {
      const current = Number(tooltipItems.find((item) => item.dataset.label === "Current BDV")?.parsed.y || 0);
      const after = Number(tooltipItems.find((item) => item.dataset.label === "After Deposit")?.parsed.y || 0);
      const gain = after - current;
      if (gain > 0) {
        return [`Gain: +${gain.toFixed(4)} BDV`];
      }
    }
    return [];
  }, []);

  const yAxisTickCallback = useCallback((value: any) => {
    return Number(value).toFixed(2);
  }, []);

  // Memoize chart options with stable dependencies
  const chartOptions: ChartOptions<"bar"> = useMemo(() => {
    const scaledMax = maxValue * 1.15;

    return {
      ...staticConfig.current,
      plugins: {
        ...staticConfig.current.plugins,
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(56, 127, 92, 0.8)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          padding: 12,
          callbacks: {
            label: tooltipLabelCallback,
            title: tooltipTitleCallback,
            beforeBody: hasPreview ? tooltipBeforeBodyCallback : undefined,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: scaledMax > 0 ? scaledMax : undefined,
          ticks: {
            maxTicksLimit: 3,
            callback: yAxisTickCallback,
            font: {
              size: 12,
              family: "Pinto",
            },
            color: "rgba(0, 0, 0, 0.7)",
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            display: true,
            font: {
              size: 14,
              family: "Pinto",
              weight: 500,
            },
            color: "rgba(0, 0, 0, 0.8)",
            maxRotation: 0,
            minRotation: 0,
            padding: 40, // Add extra padding for icons
          },
          grid: {
            display: false,
          },
        },
      },
    };
  }, [maxValue, hasPreview, tooltipLabelCallback, tooltipTitleCallback, tooltipBeforeBodyCallback, yAxisTickCallback]);

  return chartOptions;
};
