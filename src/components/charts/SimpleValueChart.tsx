import LineChart, { LineChartData } from "@/components/charts/LineChart";
import { getAreaGradientFunctions, gradientFunctions } from "@/components/charts/chartHelpers";
import { chartFormatters as f, formatDate } from "@/utils/format";
import { cn } from "@/utils/utils";
import React, { useMemo, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface SimpleValueChartProps {
  className?: string;
}

// Token colors and names from constants/tokens.ts
const TOKEN_INFO = {
  PINTO: { color: "#246645", name: "PINTO" },
  PINTOUSDC: { color: "#2775CA", name: "PINTO-USDC" },
  PINTOCBBTC: { color: "#F7931A", name: "PINTO-cbBTC" },
  PINTOCBETH: { color: "#0052FF", name: "PINTO-cbETH" },
  SPINTO: { color: "#246645", name: "sPINTO" },
};

const TOKEN_KEYS = Object.keys(TOKEN_INFO) as (keyof typeof TOKEN_INFO)[];
const TOKEN_COLORS = Object.fromEntries(Object.entries(TOKEN_INFO).map(([key, value]) => [key, value.color])) as Record<
  keyof typeof TOKEN_INFO,
  string
>;

// Token address mapping for navigation to silo token pages
const TOKEN_ADDRESS_MAP = {
  PINTO: "0xb170000aeeFa790fa61D6e837d1035906839a3c8",
  PINTOUSDC: "0x3e1133aC082716DDC3114bbEFEeD8B1731eA9cb1",
  PINTOCBBTC: "0x3e11226fe3d85142B734ABCe6e58918d5828d1b4",
  PINTOCBETH: "0x3e111115A82dF6190e36ADf0d552880663A4dBF1",
  SPINTO: "sPinto", // Special route
} as Record<keyof typeof TOKEN_INFO, string>;

// Convert hex to rgb values for rgba
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const createTokenFadeGradient = (baseColor: string, opacity: number = 0.5, isHighlighted: boolean = true) => {
  return (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return undefined;

    const rgb = hexToRgb(baseColor);
    if (!rgb) return undefined;

    // Reduce opacity if not highlighted
    const finalOpacity = isHighlighted ? opacity : opacity * 0.3;

    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    // Start with strong opacity on the left (recent)
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${finalOpacity})`);
    // Add a middle stop for smoother transition
    gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${finalOpacity * 0.5})`);
    // Fade to very light on the right (older)
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.01)`);
    return gradient;
  };
};

// Simple mock data for testing - base values for 5 tokens before stacking
const baseData: LineChartData[] = [
  { timestamp: 1641024000000, values: [80, 40, 30, 25, 45] }, // Total: 220
  { timestamp: 1641110400000, values: [90, 45, 35, 30, 50] }, // Total: 250
  { timestamp: 1641196800000, values: [85, 42, 32, 28, 48] }, // Total: 235
  { timestamp: 1641283200000, values: [95, 48, 38, 32, 52] }, // Total: 265
  { timestamp: 1641369600000, values: [100, 50, 40, 35, 55] }, // Total: 280
  { timestamp: 1641456000000, values: [98, 49, 39, 34, 53] }, // Total: 273
  { timestamp: 1641542400000, values: [105, 52, 42, 36, 58] }, // Total: 293
];

// Transform data to stacked format (cumulative, ordered from least to most value)
const transformToStackedData = (data: LineChartData[]): { stackedData: LineChartData[]; seriesOrder: number[] } => {
  // First, calculate the average value for each series to determine stacking order
  const seriesAverages = new Array(data[0].values.length).fill(0);

  data.forEach((item) => {
    item.values.forEach((value, index) => {
      seriesAverages[index] += value;
    });
  });

  // Get average values and sort by most to least for proper stacking
  const seriesOrder = seriesAverages
    .map((sum, index) => ({ index, average: sum / data.length }))
    .sort((a, b) => b.average - a.average)
    .map(({ index }) => index);

  const stackedData = data.map((item) => {
    const stackedValues = new Array(item.values.length);
    let cumulative = 0;

    // Stack in order from most to least average value (largest at bottom)
    seriesOrder.forEach((seriesIndex) => {
      cumulative += item.values[seriesIndex];
      stackedValues[seriesIndex] = cumulative;
    });

    return {
      ...item,
      values: stackedValues,
    };
  });

  return { stackedData, seriesOrder };
};

const { stackedData: mockData, seriesOrder } = transformToStackedData(baseData);

const SimpleValueChart = React.memo(({ className }: SimpleValueChartProps) => {
  const [displayIndex, setDisplayIndex] = useState<number>(mockData.length - 1);
  const displayIndexRef = useRef<number>(mockData.length - 1);
  const navigate = useNavigate();

  // Update ref when state changes
  React.useEffect(() => {
    displayIndexRef.current = displayIndex;
  }, [displayIndex]);

  // Static chart data - no complex dependencies
  const chartData = useMemo(() => mockData, []);

  // Calculate max value with 10% padding for better visual spacing
  const maxDataValue = useMemo(() => {
    const max = mockData.reduce((acc, item) => Math.max(acc, ...item.values), 0);
    return max * 1.1; // Add 10% padding
  }, []);

  // Token-specific line gradients with solid colors (for borders)
  // Static gradients - no dependencies to prevent re-renders
  const lineGradients = useMemo(() => {
    const gradients = seriesOrder.map((originalIndex) => {
      const tokenKey = TOKEN_KEYS[originalIndex];
      const color = TOKEN_COLORS[tokenKey];
      return gradientFunctions.solid(color);
    });
    return gradients;
  }, []);

  // Area gradients with fade-over-time effect - strong colors that fade to light over time
  // Static gradients - no dependencies to prevent re-renders
  const areaGradients = useMemo(() => {
    const gradients = seriesOrder.map((originalIndex) => {
      const tokenKey = TOKEN_KEYS[originalIndex];
      const color = TOKEN_COLORS[tokenKey];
      return createTokenFadeGradient(color, 0.1, true);
    });
    return gradients;
  }, []);

  // Static props
  const lineChartProps = useMemo(
    () => ({
      xKey: "timestamp" as const,
      size: "small" as const,
      valueFormatter: f.price0dFormatter,
      useLogarithmicScale: false,
      yAxisMax: maxDataValue,
    }),
    [maxDataValue],
  );

  // Stable mouseover handler - no dependencies to avoid callback recreation
  const handleMouseOver = useCallback((index: number) => {
    if (typeof index === "number" && !Number.isNaN(index) && index !== displayIndexRef.current) {
      setDisplayIndex(index);
    }
  }, []);

  // Handle chart section click for navigation
  const handleChartClick = useCallback(
    (datasetIndex: number) => {
      if (typeof datasetIndex === "number" && datasetIndex >= 0 && datasetIndex < TOKEN_KEYS.length) {
        // Map from chart dataset index to original token index using seriesOrder
        const originalTokenIndex = seriesOrder[datasetIndex];
        const tokenKey = TOKEN_KEYS[originalTokenIndex];
        const tokenAddress = TOKEN_ADDRESS_MAP[tokenKey];

        if (tokenAddress) {
          const navigationPath = tokenAddress === "sPinto" ? "/sPinto" : `/silo/${tokenAddress}`;
          navigate(navigationPath);
        }
      }
    },
    [navigate],
  );

  // Prepare token names and base data for tooltip
  const tokenNames = useMemo(() => {
    const names = seriesOrder.map((originalIndex) => {
      const tokenKey = TOKEN_KEYS[originalIndex];
      return TOKEN_INFO[tokenKey].name;
    });
    return names;
  }, []);

  const baseDataValues = useMemo(() => {
    const values = baseData.map((item) => {
      return seriesOrder.map((originalIndex) => item.values[originalIndex]);
    });
    return values;
  }, []);

  const currentDisplayData = chartData[displayIndex];
  const currentBaseData = baseData[displayIndex];

  return (
    <div className={cn("rounded-[20px] bg-gray-1", className)}>
      <div className="flex justify-between pt-2 px-2 sm:pt-4 sm:px-6">
        <div className="flex flex-row gap-1 items-center">
          <div className="sm:pinto-body text-pinto-light sm:text-pinto-light pinto-sm-light font-thin pb-0.5">
            Token Value Distribution
          </div>
        </div>
      </div>

      {currentDisplayData && currentBaseData && (
        <TokenDisplayData displayData={currentDisplayData} baseData={currentBaseData} seriesOrder={seriesOrder} />
      )}

      <div className="aspect-3/1">
        <div className="px-1 pt-2 pb-4 h-[300px] sm:px-4 sm:pt-4">
          <LineChart
            data={chartData}
            {...lineChartProps}
            makeLineGradients={lineGradients}
            makeAreaGradients={areaGradients}
            onMouseOver={handleMouseOver}
            onChartClick={handleChartClick}
            tokenNames={tokenNames}
            baseDataValues={baseDataValues}
          />
        </div>
      </div>
    </div>
  );
});

SimpleValueChart.displayName = "SimpleValueChart";

const TokenDisplayData = ({
  displayData,
  baseData,
  seriesOrder,
}: {
  displayData: LineChartData;
  baseData: LineChartData;
  seriesOrder: number[];
}) => {
  // Calculate individual token values from base data and show cumulative stacked display
  const totalValue = Math.max(...displayData.values);
  const timestamp = new Date(displayData.timestamp as number);

  // Create token value breakdown for display - use seriesOrder to match stacking
  const tokenBreakdown = seriesOrder.map((originalIndex) => {
    const key = TOKEN_KEYS[originalIndex];
    return {
      name: TOKEN_INFO[key].name,
      color: TOKEN_INFO[key].color,
      baseValue: baseData.values[originalIndex],
      cumulativeValue: displayData.values[originalIndex],
    };
  });

  return (
    <div className="h-[80px] sm:h-[65px] px-1 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-pinto-green-3 sm:text-pinto-green-3 pinto-body sm:pinto-h3 px-1">
          {f.price2dFormatter(totalValue)}
        </div>
        <div className="pinto-xs sm:pinto-sm-light text-pinto-light sm:text-pinto-light px-1 mt-1 sm:mt-0">
          {formatDate(timestamp)}
        </div>
      </div>
      <div className="flex flex-col gap-0 mt-2 sm:gap-2 sm:mt-3 px-1">
        <div className="flex flex-wrap gap-1 mb-1 sm:gap-3">
          {tokenBreakdown.map((token) => (
            <div key={token.name} className="flex items-center gap-0.5 text-xs">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: token.color }} />
              <span className="pinto-xs text-pinto-light whitespace-nowrap">
                {token.name}: {f.price2dFormatter(token.baseValue)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleValueChart;
