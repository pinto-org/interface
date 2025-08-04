import LineChart, { LineChartData } from "@/components/charts/LineChart";
import { gradientFunctions } from "@/components/charts/chartHelpers";
import { chartFormatters as f } from "@/utils/format";
import React, { useMemo, useCallback, useState } from "react";

interface SimpleValueChartProps {
  className?: string;
}

// Simple mock data for testing
const mockData: LineChartData[] = [
  { timestamp: 1641024000000, values: [100, 150, 200] },
  { timestamp: 1641110400000, values: [120, 170, 240] },
  { timestamp: 1641196800000, values: [110, 160, 220] },
  { timestamp: 1641283200000, values: [130, 180, 260] },
  { timestamp: 1641369600000, values: [140, 190, 280] },
  { timestamp: 1641456000000, values: [135, 185, 270] },
  { timestamp: 1641542400000, values: [145, 195, 290] },
];

const SimpleValueChart = ({ className }: SimpleValueChartProps) => {
  const [displayIndex, setDisplayIndex] = useState<number>(mockData.length - 1);

  console.log("🔍 SimpleValueChart render - displayIndex:", displayIndex);

  // Static chart data - no complex dependencies
  const chartData = useMemo(() => mockData, []);

  // Static gradients
  const lineGradients = useMemo(
    () => [gradientFunctions.solid("#246645"), gradientFunctions.solid("#4ade80"), gradientFunctions.solid("#22c55e")],
    [],
  );

  // Static props
  const lineChartProps = useMemo(
    () => ({
      xKey: "timestamp" as const,
      size: "small" as const,
      valueFormatter: f.price0dFormatter,
      useLogarithmicScale: false,
    }),
    [],
  );

  // Simple mouseover handler
  const handleMouseOver = useCallback(
    (index: number) => {
      console.log("📍 Mouse over index:", index, "current:", displayIndex);
      if (typeof index === "number" && !Number.isNaN(index) && index !== displayIndex) {
        setDisplayIndex(index);
      }
    },
    [displayIndex],
  );

  const currentDisplayData = chartData[displayIndex];

  return (
    <div className={`rounded-[20px] bg-gray-1 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Simple Value Chart (Test)</h3>
        <p className="text-sm text-gray-600">
          Current Index: {displayIndex} | Value:{" "}
          {currentDisplayData ? f.price2dFormatter(currentDisplayData.values[2]) : "N/A"}
        </p>
      </div>

      <div className="h-[300px]">
        <LineChart
          data={chartData}
          {...lineChartProps}
          makeLineGradients={lineGradients}
          onMouseOver={handleMouseOver}
        />
      </div>
    </div>
  );
};

export default SimpleValueChart;
