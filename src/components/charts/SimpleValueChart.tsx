import LineChart, { LineChartData } from "@/components/charts/LineChart";
import { TimeTab } from "@/components/charts/TimeTabs";
import TimeTabsSelector from "@/components/charts/TimeTabs";
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
  chartTimeTab?: TimeTab;
  setChartTimeTab?: (tab: TimeTab) => void;
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
): { chartData: LineChartData[]; baseData: LineChartData[]; tokensWithData: Token[] } => {
  // Guard against undefined inputs
  if (!tokenQueries || !tokens || !tokens.length) {
    return { chartData: [], baseData: [], tokensWithData: [] };
  }

  // Validate that tokenQueries is a proper object
  if (typeof tokenQueries !== "object" || Array.isArray(tokenQueries)) {
    return { chartData: [], baseData: [], tokensWithData: [] };
  }

  // Filter out tokens that have no non-zero values across all time periods
  const tokensWithData = tokens.filter((token) => {
    const query = tokenQueries[token.address];
    if (!query || !Array.isArray(query.data) || query.data.length === 0) {
      return false;
    }

    // Check if token has any non-zero values
    return query.data.some((item) => {
      if (!item || typeof item.value !== "number" || Number.isNaN(item.value)) {
        return false;
      }
      return item.value > 0;
    });
  });

  // If no tokens have data, return empty result
  if (tokensWithData.length === 0) {
    return { chartData: [], baseData: [], tokensWithData: [] };
  }

  // Find all unique timestamps across all farmer's token positions
  const allTimestamps = new Set<number>();

  try {
    Object.values(tokenQueries).forEach((query) => {
      // Validate query structure
      if (!query || typeof query !== "object") return;

      // Validate query has data array
      if (!Array.isArray(query.data)) return;

      query.data.forEach((item) => {
        // Validate item has timestamp and it's a valid Date
        if (!item || !item.timestamp) return;

        let timestampMs: number;
        if (item.timestamp instanceof Date) {
          timestampMs = item.timestamp.getTime();
        } else if (typeof item.timestamp === "number") {
          timestampMs = item.timestamp;
        } else if (typeof item.timestamp === "string") {
          const parsed = new Date(item.timestamp);
          if (Number.isNaN(parsed.getTime())) return;
          timestampMs = parsed.getTime();
        } else {
          return;
        }

        // Only add valid timestamps
        if (!Number.isNaN(timestampMs) && timestampMs > 0) {
          allTimestamps.add(timestampMs);
        }
      });
    });
  } catch (error) {
    console.error("Error processing token queries for timestamps:", error);
    return { chartData: [], baseData: [], tokensWithData: [] };
  }

  // Return empty data if no valid timestamps found
  if (allTimestamps.size === 0) {
    return { chartData: [], baseData: [], tokensWithData: [] };
  }

  // Sort timestamps chronologically
  const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

  // Create complete dataset with all tokens for each timestamp
  const chartData: LineChartData[] = [];

  try {
    sortedTimestamps.forEach((timestamp) => {
      const values = tokensWithData.map((token) => {
        // Validate token has address
        if (!token || !token.address) return 0;

        const query = tokenQueries[token.address];
        if (!query || !Array.isArray(query.data)) return 0;

        const dataPoint = query.data.find((item) => {
          if (!item || !item.timestamp) return false;

          let itemTimestamp: number;
          if (item.timestamp instanceof Date) {
            itemTimestamp = item.timestamp.getTime();
          } else if (typeof item.timestamp === "number") {
            itemTimestamp = item.timestamp;
          } else {
            return false;
          }

          return itemTimestamp === timestamp;
        });

        // Validate and return the value
        if (dataPoint && typeof dataPoint.value === "number" && !Number.isNaN(dataPoint.value)) {
          return Math.max(0, dataPoint.value); // Ensure non-negative values
        }

        return 0; // 0 BDV if no deposits for this token at this time
      });

      // Only add data point if we have valid values
      if (values.length > 0) {
        chartData.push({ timestamp, values });
      }
    });
  } catch (error) {
    console.error("Error creating chart data:", error);
    return { chartData: [], baseData: [], tokensWithData: [] };
  }

  // Also return base data (before stacking) for display purposes
  const baseData = chartData.map((item) => ({ ...item, values: [...item.values] }));

  return { chartData, baseData, tokensWithData };
};

// Transform data to stacked format (cumulative, ordered from least to most value)
const transformToStackedData = (data: LineChartData[]): { stackedData: LineChartData[]; seriesOrder: number[] } => {
  // Guard against empty or invalid data
  if (!Array.isArray(data) || data.length === 0) {
    return { stackedData: [], seriesOrder: [] };
  }

  // Validate first item to determine series count
  const firstItem = data[0];
  if (!firstItem || !Array.isArray(firstItem.values) || firstItem.values.length === 0) {
    return { stackedData: [], seriesOrder: [] };
  }

  const seriesCount = firstItem.values.length;

  // Validate all data items have consistent structure
  const isValidData = data.every((item) => {
    return (
      item &&
      Array.isArray(item.values) &&
      item.values.length === seriesCount &&
      item.values.every((value) => typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value))
    );
  });

  if (!isValidData) {
    return { stackedData: [], seriesOrder: [] };
  }

  // Calculate the average value for each series to determine stacking order
  const seriesAverages = new Array(seriesCount).fill(0);
  const validDataCount = data.length;

  try {
    data.forEach((item) => {
      item.values.forEach((value, index) => {
        if (typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value)) {
          seriesAverages[index] += Math.max(0, value); // Only include non-negative values
        }
      });
    });

    // Calculate averages with division by zero protection
    const seriesOrder = seriesAverages
      .map((sum, index) => ({
        index,
        average: validDataCount > 0 ? sum / validDataCount : 0,
      }))
      .sort((a, b) => b.average - a.average)
      .map(({ index }) => index);

    // Create stacked data
    const stackedData = data.map((item) => {
      const stackedValues = new Array(seriesCount).fill(0);
      let cumulative = 0;

      // Stack in order from most to least average value (largest at bottom)
      seriesOrder.forEach((seriesIndex) => {
        if (seriesIndex >= 0 && seriesIndex < item.values.length) {
          const value = item.values[seriesIndex];
          if (typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value)) {
            cumulative += Math.max(0, value); // Ensure non-negative cumulative values
            stackedValues[seriesIndex] = cumulative;
          } else {
            stackedValues[seriesIndex] = cumulative; // Keep previous cumulative value
          }
        }
      });

      return {
        timestamp: item.timestamp,
        values: stackedValues,
      };
    });

    return { stackedData, seriesOrder };
  } catch (error) {
    console.error("Error in transformToStackedData:", error);
    return { stackedData: [], seriesOrder: [] };
  }
};

const SimpleValueChart = React.memo(
  ({ className, timeTab = TimeTab.Month, chartTimeTab, setChartTimeTab }: SimpleValueChartProps) => {
    const navigate = useNavigate();

    // Hooks for data fetching
    const { whitelistedTokens } = useTokenData();
    const { from, to } = useTimeRangeSeasons(timeTab);
    const tokenQueries = useFarmerHistoricalTokensBDV(from, to, whitelistedTokens || []);

    // Loading and error states
    const tokenQueriesValues = Object.values(tokenQueries || {});
    const isLoading = tokenQueriesValues.length > 0 && tokenQueriesValues.some((query) => query?.isLoading);
    const hasError = tokenQueriesValues.length > 0 && tokenQueriesValues.some((query) => query?.isError);
    const hasData =
      tokenQueriesValues.length > 0 && tokenQueriesValues.some((query) => query?.data && query.data.length > 0);

    // Merge token data into unified timeline
    const {
      chartData: rawChartData,
      baseData,
      tokensWithData,
    } = useMemo(() => {
      if (!hasData || !whitelistedTokens || !whitelistedTokens.length) {
        // Return empty data structure if no data or tokens not loaded
        return { chartData: [], baseData: [], tokensWithData: [] };
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

    // Hybrid hover state management - React state as fallback, DOM for performance
    const [displayIndex, setDisplayIndex] = useState<number>(0);
    const displayIndexRef = useRef<number>(0);
    const pendingUpdateRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isHoveringRef = useRef<boolean>(false);

    // Optimized DOM update function - only updates during hover
    const updateTokenDisplayDOM = useCallback(
      (index: number) => {
        if (!stackedData[index] || !baseData[index] || !containerRef.current) return;

        displayIndexRef.current = index;

        // Only update DOM during hover to prevent chart re-renders
        if (isHoveringRef.current) {
          try {
            const container = containerRef.current;
            const displayData = stackedData[index];
            const currentBaseData = baseData[index];
            const totalValue = Math.max(...displayData.values);
            const timestamp = new Date(displayData.timestamp as number);

            // Update total value display
            const totalValueElement = container.querySelector("[data-total-value]");
            if (totalValueElement) {
              totalValueElement.textContent = f.price2dFormatter(totalValue);
            }

            // Update timestamp display
            const timestampElement = container.querySelector("[data-timestamp]");
            if (timestampElement) {
              timestampElement.textContent = formatDate(timestamp);
            }

            // Update individual token values
            seriesOrder.forEach((originalIndex, displayOrderIndex) => {
              const valueElement = container.querySelector(`[data-token-value="${displayOrderIndex}"]`);
              if (valueElement) {
                const tokenValue = currentBaseData.values[originalIndex];
                valueElement.textContent = f.price2dFormatter(tokenValue);
              }
            });
          } catch (error) {
            console.warn("DOM update failed during hover:", error);
          }
        }
      },
      [stackedData, baseData, seriesOrder],
    );

    // RequestAnimationFrame-based update scheduling - DOM only during hover
    const scheduleDisplayUpdate = useCallback(
      (index: number) => {
        if (pendingUpdateRef.current) {
          cancelAnimationFrame(pendingUpdateRef.current);
        }

        pendingUpdateRef.current = requestAnimationFrame(() => {
          // Only update via DOM during hover to prevent re-renders
          updateTokenDisplayDOM(index);
          pendingUpdateRef.current = null;
        });
      },
      [updateTokenDisplayDOM],
    );

    // Initialize display to latest when data changes - use layoutEffect for synchronization
    React.useLayoutEffect(() => {
      if (stackedData.length > 0) {
        const newIndex = stackedData.length - 1;
        // Always use React state for initial render, DOM updates only during hover
        setDisplayIndex(newIndex);
        displayIndexRef.current = newIndex;
      }
    }, [stackedData.length]);

    // Calculate max value with 15% padding for better visual spacing
    const maxDataValue = useMemo(() => {
      if (!stackedData || !stackedData.length) return 100; // Default value for empty state
      const max = stackedData.reduce((acc, item) => Math.max(acc, ...item.values), 0);
      return Math.max(max * 1.15, 1); // Add 15% padding, minimum of 1
    }, [stackedData]);

    // Token-specific line gradients with solid colors (for borders)
    const lineGradients = useMemo(() => {
      if (!tokensWithData || !tokensWithData.length || !seriesOrder || !seriesOrder.length) return [];

      const gradients = seriesOrder.map((originalIndex) => {
        const token = tokensWithData[originalIndex];
        const color = token?.color || "#246645"; // Fallback to Pinto green
        return gradientFunctions.solid(color);
      });
      return gradients;
    }, [tokensWithData, seriesOrder]);

    // Area gradients with fade-over-time effect - strong colors that fade to light over time
    const areaGradients = useMemo(() => {
      if (!tokensWithData || !tokensWithData.length || !seriesOrder || !seriesOrder.length) return [];

      const gradients = seriesOrder.map((originalIndex) => {
        const token = tokensWithData[originalIndex];
        const color = token?.color || "#246645"; // Fallback to Pinto green
        return createTokenFadeGradient(color, 0.1, true);
      });
      return gradients;
    }, [tokensWithData, seriesOrder]);

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

    // Stable hover handlers to prevent Chart.js plugin recreation
    const stableHandleMouseOver = useCallback(
      (index: number) => {
        if (typeof index !== "number" || Number.isNaN(index) || index < 0 || index >= stackedData.length) return;

        isHoveringRef.current = true;
        scheduleDisplayUpdate(index);
      },
      [scheduleDisplayUpdate, stackedData.length],
    );

    // Handle mouse leave - revert DOM to latest data without triggering re-renders
    const stableHandleMouseLeave = useCallback(() => {
      isHoveringRef.current = false;

      // Cancel any pending updates
      if (pendingUpdateRef.current) {
        cancelAnimationFrame(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      }

      // Revert DOM to latest data without React state updates
      if (stackedData.length > 0 && containerRef.current) {
        const latestIndex = stackedData.length - 1;
        displayIndexRef.current = latestIndex;

        // Force DOM update to latest values without hovering state
        try {
          const container = containerRef.current;
          const displayData = stackedData[latestIndex];
          const currentBaseData = baseData[latestIndex];
          const totalValue = Math.max(...displayData.values);
          const timestamp = new Date(displayData.timestamp as number);

          // Update total value display
          const totalValueElement = container.querySelector("[data-total-value]");
          if (totalValueElement) {
            totalValueElement.textContent = f.price2dFormatter(totalValue);
          }

          // Update timestamp display
          const timestampElement = container.querySelector("[data-timestamp]");
          if (timestampElement) {
            timestampElement.textContent = formatDate(timestamp);
          }

          // Update individual token values
          seriesOrder.forEach((originalIndex, displayOrderIndex) => {
            const valueElement = container.querySelector(`[data-token-value="${displayOrderIndex}"]`);
            if (valueElement) {
              const tokenValue = currentBaseData.values[originalIndex];
              valueElement.textContent = f.price2dFormatter(tokenValue);
            }
          });
        } catch (error) {
          console.warn("DOM revert failed on mouse leave:", error);
        }
      }
    }, [stackedData, baseData, seriesOrder]);

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        if (pendingUpdateRef.current) {
          cancelAnimationFrame(pendingUpdateRef.current);
        }
      };
    }, []);

    // Handle chart section click for navigation
    const handleChartClick = useCallback(
      (datasetIndex: number) => {
        if (
          typeof datasetIndex === "number" &&
          datasetIndex >= 0 &&
          tokensWithData &&
          datasetIndex < tokensWithData.length &&
          seriesOrder &&
          seriesOrder.length > 0
        ) {
          // Map from chart dataset index to original token index using seriesOrder
          const originalTokenIndex = seriesOrder[datasetIndex];
          const token = tokensWithData[originalTokenIndex];

          if (token) {
            // Navigate to silo token page
            const navigationPath = `/silo/${token.address}`;
            navigate(navigationPath);
          }
        }
      },
      [navigate, tokensWithData, seriesOrder],
    );

    // Prepare token names and base data for tooltip
    const tokenNames = useMemo(() => {
      if (!seriesOrder || !seriesOrder.length || !tokensWithData || !tokensWithData.length) return [];

      const names = seriesOrder.map((originalIndex) => {
        const token = tokensWithData[originalIndex];
        return token?.symbol || token?.name || "Unknown Token";
      });
      return names;
    }, [seriesOrder, tokensWithData]);

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
              My Value Over Time
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
              My Value Over Time
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-pinto-light mb-2">Unable to load chart data</div>
              <div className="text-pinto-light/60 text-sm">Please try refreshing the page or check your connection</div>
            </div>
          </div>
        </div>
      );
    }

    if (!hasData || !stackedData.length) {
      return (
        <div className={cn("rounded-[20px] bg-gray-1", className)}>
          <div className="flex justify-between pt-2 px-2 sm:pt-4 sm:px-6">
            <div className="sm:pinto-body text-pinto-light sm:text-pinto-light pinto-sm-light font-thin pb-0.5">
              My Value Over Time
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-pinto-light mb-2">No deposit history found</div>
              <div className="text-pinto-light/60 text-sm">Make your first deposit to see your value over time</div>
            </div>
          </div>
        </div>
      );
    }

    // Validate display data exists and is valid
    const currentDisplayData = stackedData[displayIndex];
    const currentBaseData = baseData[displayIndex];

    // Additional validation for display data
    if (
      !currentDisplayData ||
      !currentBaseData ||
      !Array.isArray(currentDisplayData.values) ||
      !Array.isArray(currentBaseData.values)
    ) {
      return (
        <div className={cn("rounded-[20px] bg-gray-1", className)}>
          <div className="flex justify-between pt-2 px-2 sm:pt-4 sm:px-6">
            <div className="sm:pinto-body text-pinto-light sm:text-pinto-light pinto-sm-light font-thin pb-0.5">
              My Value Over Time
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-pinto-light mb-2">Chart data unavailable</div>
              <div className="text-pinto-light/60 text-sm">There was an issue processing your deposit data</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div ref={containerRef} className={cn("rounded-[20px] bg-gray-1", className)}>
        <div className="flex justify-between items-start pt-2 px-2 sm:pt-4 sm:px-6">
          <div className="flex flex-row gap-1 items-center">
            <div className="sm:pinto-body text-pinto-light sm:text-pinto-light pinto-sm-light font-thin pb-0.5">
              My Value Over Time
            </div>
          </div>
          {chartTimeTab !== undefined && setChartTimeTab && (
            <div className="flex flex-col items-end gap-1">
              <TimeTabsSelector tab={chartTimeTab} setTab={setChartTimeTab} />
            </div>
          )}
        </div>

        <TokenDisplayDataHybrid
          displayIndex={displayIndex}
          stackedData={stackedData}
          baseData={baseData}
          seriesOrder={seriesOrder}
          tokensWithData={tokensWithData}
        />

        <div className="aspect-3/1">
          <div className="px-1 pt-2 pb-4 h-[300px] sm:px-4 sm:pt-4">
            <LineChart
              data={stackedData}
              {...lineChartProps}
              makeLineGradients={lineGradients}
              makeAreaGradients={areaGradients}
              onMouseOver={stableHandleMouseOver}
              onMouseLeave={stableHandleMouseLeave}
              onChartClick={handleChartClick}
              tokenNames={tokenNames}
              baseDataValues={baseDataValues}
              useSeasonAxis={false}
            />
          </div>
        </div>
      </div>
    );
  },
);

SimpleValueChart.displayName = "SimpleValueChart";

// Hybrid TokenDisplayData that uses React state as primary mechanism with DOM optimization
const TokenDisplayDataHybrid = React.memo(
  ({
    displayIndex,
    stackedData,
    baseData,
    seriesOrder,
    tokensWithData,
  }: {
    displayIndex: number;
    stackedData: LineChartData[];
    baseData: LineChartData[];
    seriesOrder: number[];
    tokensWithData: Token[];
  }) => {
    // Use React state as primary display mechanism (reliable)
    const currentDisplayData = stackedData[displayIndex];
    const currentBaseData = baseData[displayIndex];

    if (!currentDisplayData || !currentBaseData) {
      return <div className="h-[80px] sm:h-[65px] px-1 sm:px-6" />;
    }

    const totalValue = Math.max(...currentDisplayData.values);
    const timestamp = new Date(currentDisplayData.timestamp as number);

    // Create token value breakdown for display - use seriesOrder to match stacking
    const tokenBreakdown = seriesOrder.map((originalIndex) => {
      const token = tokensWithData[originalIndex];
      return {
        name: token?.symbol || token?.name || "Unknown Token",
        color: token?.color || "#246645", // Fallback to Pinto green
        baseValue: currentBaseData.values[originalIndex],
        cumulativeValue: currentDisplayData.values[originalIndex],
      };
    });

    return (
      <div className="h-[80px] sm:h-[65px] px-1 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-pinto-green-3 sm:text-pinto-green-3 pinto-body sm:pinto-h3 px-1" data-total-value>
            {f.price2dFormatter(totalValue)}
          </div>
          <div
            className="pinto-xs sm:pinto-sm-light text-pinto-light sm:text-pinto-light px-1 mt-1 sm:mt-0"
            data-timestamp
          >
            {formatDate(timestamp)}
          </div>
        </div>
        <div className="flex flex-col gap-0 mt-2 sm:gap-2 sm:mt-3 px-1">
          <div className="flex flex-wrap gap-1 mb-1 sm:gap-3">
            {tokenBreakdown.map((token, displayOrderIndex) => (
              <div key={token.name} className="flex items-center gap-0.5 text-xs">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: token.color }} />
                <span className="pinto-xs text-pinto-light whitespace-nowrap">
                  {token.name}: <span data-token-value={displayOrderIndex}>{f.price2dFormatter(token.baseValue)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Re-render when displayIndex changes or data structure changes
    return (
      prevProps.displayIndex === nextProps.displayIndex &&
      prevProps.stackedData.length === nextProps.stackedData.length &&
      prevProps.baseData.length === nextProps.baseData.length &&
      prevProps.seriesOrder.length === nextProps.seriesOrder.length &&
      prevProps.tokensWithData.length === nextProps.tokensWithData.length
    );
  },
);

export default SimpleValueChart;
