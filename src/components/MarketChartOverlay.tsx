import { TokenValue } from "@/classes/TokenValue";
import { calculatePodScore } from "@/utils/podScore";
import { buildPodScoreColorScaler } from "@/utils/podScoreColorScaler";
import { Chart } from "chart.js";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Performance constants - hoisted outside component
const MILLION = 1_000_000;
const RESIZE_DEBOUNCE_MS = 100;
const DIMENSION_UPDATE_DELAY_MS = 0;
const BOX_SIZE = 12;
const HALF_BOX_SIZE = 6; // Pre-calculated for performance
const BORDER_WIDTH = 1;

// Frozen color constants for immutability and optimization
const BUY_OVERLAY_COLORS = Object.freeze({
  shadedRegion: "rgba(92, 184, 169, 0.15)", // Teal with 15% opacity
  border: "rgba(92, 184, 169, 0.8)", // Teal with 80% opacity
});

const SELL_OVERLAY_COLORS = Object.freeze({
  plotBorder: "#ED7A00",
  plotFill: "#e0b57d",
  lineColor: "black",
});

// Tailwind class strings for reuse
const BASE_OVERLAY_CLASSES = "absolute pointer-events-none";
const TRANSITION_CLASSES = "transition-all duration-150 ease-out";
const LINE_TRANSITION_CLASSES = "transition-[top,opacity] duration-150 ease-out";

// Overlay parameter types
export interface PlotOverlayData {
  startIndex: TokenValue; // Absolute pod index
  amount: TokenValue; // Number of pods in this plot
}

interface BuyOverlayParams {
  mode: "buy";
  pricePerPod: number;
  maxPlaceInLine: number;
}

interface SellOverlayParams {
  mode: "sell";
  pricePerPod: number;
  plots: PlotOverlayData[];
}

export type OverlayParams = BuyOverlayParams | SellOverlayParams | null;

interface MarketChartOverlayProps {
  overlayParams: OverlayParams;
  chartRef: React.RefObject<Chart | null>;
  visible: boolean;
  harvestableIndex: TokenValue;
  marketListingScores?: number[]; // Pod Scores from existing market listings for color scaling
}

type ChartDimensions = {
  left: number;
  top: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
};

interface PlotRectangle {
  x: number; // Left edge pixel position
  y: number; // Top edge pixel position (price line)
  width: number; // Width in pixels (based on plot amount)
  height: number; // Height in pixels (from price to bottom)
}

const MarketChartOverlay = React.memo<MarketChartOverlayProps>(
  ({ overlayParams, chartRef, visible, harvestableIndex, marketListingScores = [] }) => {
    const [dimensions, setDimensions] = useState<ChartDimensions | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Note: Throttling removed to ensure immediate updates during price changes
    // Performance is acceptable without throttling due to optimized calculations
    const throttledOverlayParams = overlayParams;

    // Optimized pixel position calculator with minimal validation overhead
    const calculatePixelPosition = useCallback(
      (dataValue: number, axis: "x" | "y"): number | null => {
        const chart = chartRef.current;
        if (!chart?.scales) return null;

        const scale = chart.scales[axis];
        if (!scale?.getPixelForValue || scale.min === undefined || scale.max === undefined) {
          return null;
        }

        // Fast clamp without Math.max/min for better performance
        const clampedValue = dataValue < scale.min ? scale.min : dataValue > scale.max ? scale.max : dataValue;

        try {
          return scale.getPixelForValue(clampedValue);
        } catch {
          return null;
        }
      },
      [chartRef],
    );

    // Optimized dimension calculator with minimal object creation
    const getChartDimensions = useCallback((): ChartDimensions | null => {
      const chart = chartRef.current;
      if (!chart?.chartArea) return null;

      const { left, top, right, bottom } = chart.chartArea;

      // Fast type validation
      if (
        typeof left !== "number" ||
        typeof top !== "number" ||
        typeof right !== "number" ||
        typeof bottom !== "number"
      ) {
        return null;
      }

      const width = right - left;
      const height = bottom - top;

      if (width <= 0 || height <= 0) return null;

      return { left, top, width, height, bottom, right };
    }, [chartRef]);

    // Optimized resize handling with single debounced handler
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      let animationFrameId: number | null = null;
      let resizeObserver: ResizeObserver | null = null;

      const updateDimensions = () => {
        // Use requestAnimationFrame to sync with browser's repaint cycle
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
          const newDimensions = getChartDimensions();
          if (newDimensions) {
            setDimensions(newDimensions);
          }
          animationFrameId = null;
        });
      };

      const debouncedUpdate = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateDimensions, RESIZE_DEBOUNCE_MS);
      };

      // Initial update
      const initialTimeout = setTimeout(() => {
        const dimensions = getChartDimensions();
        if (dimensions) setDimensions(dimensions);
      }, DIMENSION_UPDATE_DELAY_MS);

      // Single ResizeObserver for all resize events
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(debouncedUpdate);
        const parent = containerRef.current?.parentElement;
        if (parent) {
          resizeObserver.observe(parent);
        }
        // Also observe the chart canvas itself for more accurate updates
        const chart = chartRef.current;
        if (chart?.canvas) {
          resizeObserver.observe(chart.canvas);
        }
      }

      // Fallback window resize listener with passive flag for better performance
      window.addEventListener("resize", debouncedUpdate, { passive: true });

      // Listen to Chart.js resize events for immediate sync
      const chart = chartRef.current;
      if (chart) {
        // Chart.js emits 'resize' event when chart dimensions change
        chart.resize();
        // Force update after chart is ready
        updateDimensions();
      }

      return () => {
        clearTimeout(initialTimeout);
        clearTimeout(timeoutId);
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
        resizeObserver?.disconnect();
        window.removeEventListener("resize", debouncedUpdate);
      };
    }, [getChartDimensions, chartRef]);

    // Update dimensions when overlay params or visibility changes
    useEffect(() => {
      if (visible && throttledOverlayParams) {
        const newDimensions = getChartDimensions();
        if (newDimensions) {
          setDimensions(newDimensions);
        }
      }
    }, [throttledOverlayParams, visible, getChartDimensions]);

    // Optimized buy overlay renderer with minimal validation
    const renderBuyOverlay = useCallback(
      (params: BuyOverlayParams) => {
        const { pricePerPod, maxPlaceInLine } = params;

        // Fast early returns
        if (!dimensions || !chartRef.current?.scales) return null;

        const { scales } = chartRef.current;
        const { x: xScale, y: yScale } = scales;

        if (!xScale?.max || xScale.max === 0 || !yScale?.max) return null;

        // Optimized conversion and validation
        const placeInLineChartX = maxPlaceInLine / MILLION;
        if (placeInLineChartX < 0) return null;

        // Batch pixel position calculations
        const priceY = calculatePixelPosition(pricePerPod, "y");
        const placeX = calculatePixelPosition(placeInLineChartX, "x");

        if (priceY === null || placeX === null) return null;

        // Fast clamping with ternary operators
        const { left, right, top, bottom } = dimensions;
        const clampedPlaceX = placeX < left ? left : placeX > right ? right : placeX;
        const clampedPriceY = priceY < top ? top : priceY > bottom ? bottom : priceY;

        // Calculate dimensions
        const rectWidth = clampedPlaceX - left;
        const rectHeight = bottom - clampedPriceY;

        // Single validation check
        if (rectWidth <= 0 || rectHeight <= 0) return null;

        return (
          <svg className="w-full h-full" style={{ willChange: "contents" }}>
            <rect
              x={left}
              y={clampedPriceY}
              width={rectWidth}
              height={rectHeight}
              rx={4}
              ry={4}
              fill={BUY_OVERLAY_COLORS.shadedRegion}
              stroke={BUY_OVERLAY_COLORS.border}
              strokeWidth={1}
              style={{
                willChange: "auto",
                transition: "x 0.15s ease-out, y 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out",
              }}
            />
          </svg>
        );
      },
      [dimensions, calculatePixelPosition],
    );

    // Highly optimized plot rectangle calculator
    const calculatePlotRectangle = useCallback(
      (plot: PlotOverlayData, pricePerPod: number): PlotRectangle | null => {
        // Early returns for performance
        if (!dimensions || !chartRef.current?.scales || !plot.startIndex || !plot.amount) {
          return null;
        }

        const { scales } = chartRef.current;
        const { x: xScale, y: yScale } = scales;

        if (!xScale?.max || !yScale?.max) return null;

        // Optimized place in line calculation - avoid intermediate TokenValue object
        const placeInLineNum = plot.startIndex.toNumber() - harvestableIndex.toNumber();
        if (placeInLineNum < 0) return null;

        // Batch calculations for better performance
        const startX = placeInLineNum / MILLION;
        const endX = (placeInLineNum + plot.amount.toNumber()) / MILLION;

        // Fast validation
        if (startX < 0 || endX <= startX) return null;

        // Batch pixel position calculations
        const startPixelX = calculatePixelPosition(startX, "x");
        const endPixelX = calculatePixelPosition(endX, "x");
        const pricePixelY = calculatePixelPosition(pricePerPod, "y");

        if (startPixelX === null || endPixelX === null || pricePixelY === null) {
          return null;
        }

        // Optimized clamping with ternary operators
        const { left, right, top, bottom } = dimensions;
        const clampedStartX = startPixelX < left ? left : startPixelX > right ? right : startPixelX;
        const clampedEndX = endPixelX < left ? left : endPixelX > right ? right : endPixelX;
        const clampedPriceY = pricePixelY < top ? top : pricePixelY > bottom ? bottom : pricePixelY;

        const width = clampedEndX - clampedStartX;
        const height = bottom - clampedPriceY;

        // Single validation check
        if (width <= 0 || height <= 0 || clampedStartX >= right || clampedEndX <= left) {
          return null;
        }

        return { x: clampedStartX, y: clampedPriceY, width, height };
      },
      [dimensions, calculatePixelPosition, harvestableIndex],
    );

    // Highly optimized rectangle memoization with minimal object creation
    const memoizedRectangles = useMemo(() => {
      if (!throttledOverlayParams || throttledOverlayParams.mode !== "sell" || !dimensions) return null;

      const { pricePerPod, plots } = throttledOverlayParams;

      // Fast validation
      if (pricePerPod <= 0 || !plots?.length) return null;

      // Pre-allocate array for better performance
      const rectangles: Array<PlotRectangle & { plotKey: string; plotIndex: number; podScore?: number }> = [];

      // Use for loop for better performance than map/filter chain
      for (let i = 0; i < plots.length; i++) {
        const plot = plots[i];
        const rect = calculatePlotRectangle(plot, pricePerPod);

        if (rect) {
          // Calculate place in line for Pod Score
          const placeInLineNum = plot.startIndex.toNumber() - harvestableIndex.toNumber();
          // Use placeInLine in millions for consistent scaling with market listings
          const podScore = calculatePodScore(pricePerPod, placeInLineNum / MILLION);

          rectangles.push({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            plotKey: plot.startIndex.toHuman(),
            plotIndex: i,
            podScore,
          });
        }
      }

      return rectangles.length > 0 ? rectangles : null;
    }, [throttledOverlayParams, dimensions, calculatePlotRectangle, harvestableIndex]);

    // Highly optimized sell overlay renderer with pre-calculated values
    const renderSellOverlay = useCallback(
      (params: SellOverlayParams) => {
        const { pricePerPod } = params;

        if (!dimensions || !memoizedRectangles) return null;

        // Calculate price line Y position
        const pricePixelY = calculatePixelPosition(pricePerPod, "y");
        if (pricePixelY === null) return null;

        // Fast clamping
        const { top, bottom, left } = dimensions;
        const clampedPriceY = pricePixelY < top ? top : pricePixelY > bottom ? bottom : pricePixelY;

        // Pre-calculate common values to avoid repeated calculations
        const lineWidth = dimensions.right - left;
        const lineHeight = bottom - top;
        const lastRectIndex = memoizedRectangles.length - 1;

        // Build color scaler from both market listings and overlay plot scores
        // This ensures overlay colors are relative to existing market conditions
        const plotScores = memoizedRectangles
          .map((rect) => rect.podScore)
          .filter((score): score is number => score !== undefined);

        // Combine market listing scores with overlay plot scores for consistent scaling
        const allScores = [...marketListingScores, ...plotScores];

        const colorScaler = buildPodScoreColorScaler(allScores);

        return (
          <>
            {/* Horizontal price line - Tailwind + minimal inline styles */}
            <div
              className={`${BASE_OVERLAY_CLASSES} ${LINE_TRANSITION_CLASSES} h-0 border-t border-dashed border-black`}
              style={{
                left,
                top: clampedPriceY,
                width: lineWidth,
              }}
            />

            {/* Selection boxes - Tailwind + minimal inline styles */}
            {memoizedRectangles.map((rect) => {
              const centerX = rect.x + (rect.width >> 1); // Bit shift for division by 2
              const centerY = clampedPriceY;

              // Get dynamic color based on Pod Score, fallback to default if undefined
              const fillColor =
                rect.podScore !== undefined ? colorScaler.toColor(rect.podScore) : SELL_OVERLAY_COLORS.plotFill;

              return (
                <div
                  key={rect.plotKey}
                  className={`${BASE_OVERLAY_CLASSES} ${TRANSITION_CLASSES} w-3 h-3 border border-solid`}
                  style={{
                    left: centerX - HALF_BOX_SIZE,
                    top: centerY - HALF_BOX_SIZE,
                    backgroundColor: fillColor,
                    borderColor: SELL_OVERLAY_COLORS.plotBorder,
                  }}
                />
              );
            })}

            {/* Vertical lines - Tailwind + minimal inline styles */}
            {memoizedRectangles.length > 0 && (
              <>
                <div
                  key="vertical-line-left"
                  className={`${BASE_OVERLAY_CLASSES} ${TRANSITION_CLASSES} w-0 border-l border-dashed border-black`}
                  style={{
                    left: memoizedRectangles[0].x,
                    top,
                    height: lineHeight,
                  }}
                />
                <div
                  key="vertical-line-right"
                  className={`${BASE_OVERLAY_CLASSES} ${TRANSITION_CLASSES} w-0 border-l border-dashed border-black`}
                  style={{
                    left: memoizedRectangles[lastRectIndex].x + memoizedRectangles[lastRectIndex].width,
                    top,
                    height: lineHeight,
                  }}
                />
              </>
            )}
          </>
        );
      },
      [dimensions, memoizedRectangles, calculatePixelPosition],
    );

    // Don't render if not visible or no overlay params
    if (!visible || !throttledOverlayParams || !dimensions) {
      return null;
    }

    // Determine which overlay to render based on mode
    let overlayContent: JSX.Element | null = null;
    if (throttledOverlayParams.mode === "buy") {
      overlayContent = renderBuyOverlay(throttledOverlayParams);
    } else if (throttledOverlayParams.mode === "sell") {
      overlayContent = renderSellOverlay(throttledOverlayParams);
    }

    if (!overlayContent) {
      return null;
    }

    return (
      <div ref={containerRef} className="absolute inset-0 pointer-events-none z-[2] will-change-transform">
        {overlayContent}
      </div>
    );
  },
);

MarketChartOverlay.displayName = "MarketChartOverlay";

export default MarketChartOverlay;
