import LineChart, { LineChartData } from "@/components/charts/LineChart";
import { TimeTab } from "@/components/charts/TimeTabs";
import { getAreaGradientFunctions, gradientFunctions } from "@/components/charts/chartHelpers";
import { useFarmerHistoricalTokensBDV, useTimeRangeSeasons } from "@/state/seasonal/seasonalDataHooks";
import useTokenData from "@/state/useTokenData";
import { chartFormatters as f, formatDate } from "@/utils/format";
import { Token, UseSeasonalResult } from "@/utils/types";
import { cn } from "@/utils/utils";
import React, { useMemo, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface SimpleValueChartProps {
  className?: string;
  timeTab?: TimeTab;
}

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

/**
 * Merge historical BDV data from multiple token queries into a unified timeline
 * Creates LineChartData format with all tokens for each timestamp
 */
const mergeTokenHistoricalData = (
  tokenQueries: { [address: string]: UseSeasonalResult },
  tokens: Token[],
): { chartData: LineChartData[]; baseData: LineChartData[] } => {
  // Guard against undefined inputs
  if (!tokenQueries || !tokens || !tokens.length) {
    return { chartData: [], baseData: [] };
  }

  // Find all unique timestamps across all farmer's token positions
  const allTimestamps = new Set<number>();
  Object.values(tokenQueries).forEach((query) => {
    query.data?.forEach((item) => allTimestamps.add(item.timestamp.getTime()));
  });

  // Sort timestamps chronologically
  const sortedTimestamps = Array.from(allTimestamps).sort();

  // Create complete dataset with all tokens for each timestamp
  const chartData: LineChartData[] = sortedTimestamps.map((timestamp) => {
    const values = tokens.map((token) => {
      const tokenData = tokenQueries[token.address]?.data;
      const dataPoint = tokenData?.find((item) => item.timestamp.getTime() === timestamp);
      return dataPoint?.value || 0; // 0 BDV if no deposits for this token
    });

    return { timestamp, values };
  });

  // Also return base data (before stacking) for display purposes
  const baseData = [...chartData];

  return { chartData, baseData };
};

// Transform data to stacked format (cumulative, ordered from least to most value)
const transformToStackedData = (data: LineChartData[]): { stackedData: LineChartData[]; seriesOrder: number[] } => {
  console.log("transformToStackedData called with:", data);

  // Guard against empty or invalid data
  if (
    !data ||
    !data.length ||
    !data[0] ||
    !data[0].values ||
    !Array.isArray(data[0].values) ||
    data[0].values.length === 0
  ) {
    console.log("transformToStackedData: returning empty due to invalid data");
    return { stackedData: [], seriesOrder: [] };
  }

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

const SimpleValueChart = React.memo(({ className, timeTab = TimeTab.Month }: SimpleValueChartProps) => {
  const navigate = useNavigate();

  // Hooks for data fetching
  const { whitelistedTokens } = useTokenData();
  const { from, to } = useTimeRangeSeasons(timeTab);
  const tokenQueries = useFarmerHistoricalTokensBDV(from, to, whitelistedTokens || []);

  // Loading and error states
  console.log("CHART DEBUG - tokenQueries:", tokenQueries, "whitelistedTokens:", whitelistedTokens);

  const tokenQueriesValues = Object.values(tokenQueries || {});
  const isLoading = tokenQueriesValues.length > 0 && tokenQueriesValues.some((query) => query?.isLoading);
  const hasError = tokenQueriesValues.length > 0 && tokenQueriesValues.some((query) => query?.isError);
  const hasData =
    tokenQueriesValues.length > 0 && tokenQueriesValues.some((query) => query?.data && query.data.length > 0);

  // Merge token data into unified timeline
  const { chartData: rawChartData, baseData } = useMemo(() => {
    console.log("rawChartData:");
    if (!hasData || !whitelistedTokens || !whitelistedTokens.length) {
      // Return empty data structure if no data or tokens not loaded
      console.log("No data or tokens not loaded");
      return { chartData: [], baseData: [] };
    }
    return mergeTokenHistoricalData(tokenQueries, whitelistedTokens);
  }, [tokenQueries, whitelistedTokens, hasData]);

  // Transform to stacked format
  const { stackedData, seriesOrder } = useMemo(() => {
    if (!rawChartData || !rawChartData.length) {
      return { stackedData: [], seriesOrder: [] };
    }
    return transformToStackedData(rawChartData);
  }, [rawChartData]);

  // Chart data state
  const [displayIndex, setDisplayIndex] = useState<number>(0);
  const displayIndexRef = useRef<number>(0);

  // Update display index when data changes
  React.useEffect(() => {
    if (stackedData.length > 0) {
      const newIndex = stackedData.length - 1;
      setDisplayIndex(newIndex);
      displayIndexRef.current = newIndex;
    }
  }, [stackedData.length]);

  // Update ref when state changes
  React.useEffect(() => {
    displayIndexRef.current = displayIndex;
  }, [displayIndex]);

  // Calculate max value with 10% padding for better visual spacing
  const maxDataValue = useMemo(() => {
    if (!stackedData || !stackedData.length) return 100; // Default value for empty state
    const max = stackedData.reduce((acc, item) => Math.max(acc, ...item.values), 0);
    return Math.max(max * 1.1, 1); // Add 10% padding, minimum of 1
  }, [stackedData]);

  // Token-specific line gradients with solid colors (for borders)
  const lineGradients = useMemo(() => {
    if (!whitelistedTokens || !whitelistedTokens.length || !seriesOrder || !seriesOrder.length) return [];

    const gradients = seriesOrder.map((originalIndex) => {
      const token = whitelistedTokens[originalIndex];
      const color = token?.color || "#246645"; // Fallback to Pinto green
      return gradientFunctions.solid(color);
    });
    return gradients;
  }, [whitelistedTokens, seriesOrder]);

  // Area gradients with fade-over-time effect - strong colors that fade to light over time
  const areaGradients = useMemo(() => {
    if (!whitelistedTokens || !whitelistedTokens.length || !seriesOrder || !seriesOrder.length) return [];

    const gradients = seriesOrder.map((originalIndex) => {
      const token = whitelistedTokens[originalIndex];
      const color = token?.color || "#246645"; // Fallback to Pinto green
      return createTokenFadeGradient(color, 0.1, true);
    });
    return gradients;
  }, [whitelistedTokens, seriesOrder]);

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
      if (
        typeof datasetIndex === "number" &&
        datasetIndex >= 0 &&
        whitelistedTokens &&
        datasetIndex < whitelistedTokens.length &&
        seriesOrder &&
        seriesOrder.length > 0
      ) {
        // Map from chart dataset index to original token index using seriesOrder
        const originalTokenIndex = seriesOrder[datasetIndex];
        const token = whitelistedTokens[originalTokenIndex];

        if (token) {
          // Navigate to silo token page
          const navigationPath = `/silo/${token.address}`;
          navigate(navigationPath);
        }
      }
    },
    [navigate, whitelistedTokens, seriesOrder],
  );

  // Prepare token names and base data for tooltip
  const tokenNames = useMemo(() => {
    if (!seriesOrder || !seriesOrder.length || !whitelistedTokens || !whitelistedTokens.length) return [];

    const names = seriesOrder.map((originalIndex) => {
      const token = whitelistedTokens[originalIndex];
      return token?.symbol || token?.name || "Unknown Token";
    });
    return names;
  }, [seriesOrder, whitelistedTokens]);

  const baseDataValues = useMemo(() => {
    if (!baseData || !baseData.length || !seriesOrder || !seriesOrder.length) return [];

    const values = baseData.map((item) => {
      return seriesOrder.map((originalIndex) => item.values[originalIndex] || 0);
    });
    return values;
  }, [baseData, seriesOrder]);

  // Handle empty states
  if (isLoading) {
    return (
      <div className={cn("rounded-[20px] bg-gray-1", className)}>
        <div className="flex justify-between pt-2 px-2 sm:pt-4 sm:px-6">
          <div className="sm:pinto-body text-pinto-light sm:text-pinto-light pinto-sm-light font-thin pb-0.5">
            My Token Value Distribution
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-pinto-light">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={cn("rounded-[20px] bg-gray-1", className)}>
        <div className="flex justify-between pt-2 px-2 sm:pt-4 sm:px-6">
          <div className="sm:pinto-body text-pinto-light sm:text-pinto-light pinto-sm-light font-thin pb-0.5">
            My Token Value Distribution
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-pinto-light">Error loading chart data</div>
        </div>
      </div>
    );
  }

  if (!hasData || !stackedData.length) {
    return (
      <div className={cn("rounded-[20px] bg-gray-1", className)}>
        <div className="flex justify-between pt-2 px-2 sm:pt-4 sm:px-6">
          <div className="sm:pinto-body text-pinto-light sm:text-pinto-light pinto-sm-light font-thin pb-0.5">
            My Token Value Distribution
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-pinto-light">No deposit history found</div>
        </div>
      </div>
    );
  }

  const currentDisplayData = stackedData[displayIndex];
  const currentBaseData = baseData[displayIndex];

  return (
    <div className={cn("rounded-[20px] bg-gray-1", className)}>
      <div className="flex justify-between pt-2 px-2 sm:pt-4 sm:px-6">
        <div className="flex flex-row gap-1 items-center">
          <div className="sm:pinto-body text-pinto-light sm:text-pinto-light pinto-sm-light font-thin pb-0.5">
            My Token Value Distribution
          </div>
        </div>
      </div>

      {currentDisplayData && currentBaseData && (
        <TokenDisplayData displayData={currentDisplayData} baseData={currentBaseData} seriesOrder={seriesOrder} />
      )}

      <div className="aspect-3/1">
        <div className="px-1 pt-2 pb-4 h-[300px] sm:px-4 sm:pt-4">
          <LineChart
            data={stackedData}
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
  const { whitelistedTokens } = useTokenData();

  const tokenBreakdown = seriesOrder.map((originalIndex) => {
    const token = whitelistedTokens[originalIndex];
    return {
      name: token?.symbol || token?.name || "Unknown Token",
      color: token?.color || "#246645", // Fallback to Pinto green
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
