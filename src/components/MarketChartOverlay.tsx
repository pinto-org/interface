import { TokenValue } from "@/classes/TokenValue";
import { Chart } from "chart.js";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MILLION = 1_000_000;

const OVERLAY_COLORS = {
  shadedRegion: "rgba(64, 176, 166, 0.15)", // Teal with 15% opacity
  border: "rgba(64, 176, 166, 0.8)", // Teal with 80% opacity
};

interface MarketChartOverlayProps {
  pricePerPod: number | null;
  maxPlaceInLine: number | null;
  chartRef: React.RefObject<Chart | null>;
  visible: boolean;
  harvestableIndex: TokenValue;
}

type ChartDimensions = {
  left: number;
  top: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
};

const MarketChartOverlay = React.memo<MarketChartOverlayProps>(
  ({ pricePerPod, maxPlaceInLine, chartRef, visible, harvestableIndex }) => {
    const [dimensions, setDimensions] = useState<ChartDimensions | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate pixel position from data value using chart scales
    const calculatePixelPosition = useCallback((dataValue: number, axis: "x" | "y"): number | null => {
      // Handle null chart ref gracefully
      if (!chartRef.current) return null;

      // Handle uninitialized chart scales
      const scale = chartRef.current.scales?.[axis];
      if (!scale) return null;

      // Verify scale has required methods and properties
      if (typeof scale.getPixelForValue !== 'function') return null;
      if (scale.min === undefined || scale.max === undefined) return null;

      // Clamp data value to scale bounds to prevent out-of-range rendering
      const clampedValue = Math.max(scale.min, Math.min(dataValue, scale.max));

      try {
        return scale.getPixelForValue(clampedValue);
      } catch (error) {
        // Handle any errors during pixel calculation
        console.warn(`Error calculating pixel position for ${axis}-axis:`, error);
        return null;
      }
    }, [chartRef]);

    // Get chart dimensions from chart instance
    const getChartDimensions = useCallback((): ChartDimensions | null => {
      // Handle null chart ref gracefully
      if (!chartRef.current) return null;

      // Handle uninitialized chart area
      const chartArea = chartRef.current.chartArea;
      if (!chartArea) return null;

      // Validate all required properties exist
      if (
        typeof chartArea.left !== 'number' ||
        typeof chartArea.top !== 'number' ||
        typeof chartArea.right !== 'number' ||
        typeof chartArea.bottom !== 'number'
      ) {
        return null;
      }

      // Validate dimensions are positive and sensible
      const width = chartArea.right - chartArea.left;
      const height = chartArea.bottom - chartArea.top;
      
      if (width <= 0 || height <= 0) {
        return null;
      }

      return {
        left: chartArea.left,
        top: chartArea.top,
        width,
        height,
        bottom: chartArea.bottom,
        right: chartArea.right,
      };
    }, [chartRef]);

    // Update dimensions when chart changes or resizes
    useEffect(() => {
      const updateDimensions = () => {
        try {
          const newDimensions = getChartDimensions();
          if (newDimensions) {
            setDimensions(newDimensions);
          }
        } catch (error) {
          // Handle errors during dimension calculation
          console.warn('Error updating chart dimensions:', error);
        }
      };

      // Initial dimensions with slight delay to ensure chart is ready
      const initialTimeout = setTimeout(updateDimensions, 0);

      // Set up ResizeObserver with debouncing for parent element
      let resizeTimeoutId: NodeJS.Timeout;
      let resizeObserver: ResizeObserver | null = null;

      try {
        resizeObserver = new ResizeObserver(() => {
          clearTimeout(resizeTimeoutId);
          resizeTimeoutId = setTimeout(updateDimensions, 100);
        });

        if (containerRef.current?.parentElement) {
          resizeObserver.observe(containerRef.current.parentElement);
        }
      } catch (error) {
        console.warn('Error setting up ResizeObserver:', error);
      }

      // Also listen to window resize events
      let windowResizeTimeoutId: NodeJS.Timeout;
      const handleWindowResize = () => {
        clearTimeout(windowResizeTimeoutId);
        windowResizeTimeoutId = setTimeout(updateDimensions, 100);
      };

      window.addEventListener("resize", handleWindowResize);

      return () => {
        clearTimeout(initialTimeout);
        clearTimeout(resizeTimeoutId);
        clearTimeout(windowResizeTimeoutId);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        window.removeEventListener("resize", handleWindowResize);
      };
    }, [getChartDimensions]);

    // Calculate pixel coordinates for overlay elements
    const overlayCoordinates = useMemo(() => {
      // Early return for missing required data
      if (!visible || !pricePerPod || !maxPlaceInLine || !dimensions) {
        return null;
      }

      // Validate input values are finite numbers
      if (!Number.isFinite(pricePerPod) || !Number.isFinite(maxPlaceInLine)) {
        return null;
      }

      // Handle null chart ref gracefully
      if (!chartRef.current) {
        return null;
      }

      // Check if chart has valid scales
      const xScale = chartRef.current.scales?.x;
      const yScale = chartRef.current.scales?.y;
      
      if (!xScale || !yScale) {
        return null;
      }

      // Handle uninitialized chart scales
      if (xScale.max === undefined || xScale.max === 0 || yScale.max === undefined) {
        return null;
      }

      // Convert maxPlaceInLine to chart x-axis value (millions)
      const placeInLineChartX = maxPlaceInLine / MILLION;

      // Validate converted value is reasonable
      if (!Number.isFinite(placeInLineChartX) || placeInLineChartX < 0) {
        return null;
      }

      // Get pixel positions (already clamped in calculatePixelPosition)
      const priceY = calculatePixelPosition(pricePerPod, "y");
      const placeX = calculatePixelPosition(placeInLineChartX, "x");

      if (priceY === null || placeX === null) {
        return null;
      }

      // Additional clamping to chart boundaries to prevent overflow
      const clampedPlaceX = Math.max(dimensions.left, Math.min(placeX, dimensions.right));
      const clampedPriceY = Math.max(dimensions.top, Math.min(priceY, dimensions.bottom));

      // Validate final coordinates are within bounds
      if (
        !Number.isFinite(clampedPlaceX) ||
        !Number.isFinite(clampedPriceY) ||
        clampedPlaceX < dimensions.left ||
        clampedPlaceX > dimensions.right ||
        clampedPriceY < dimensions.top ||
        clampedPriceY > dimensions.bottom
      ) {
        return null;
      }

      return {
        priceY: clampedPriceY,
        placeX: clampedPlaceX,
      };
    }, [visible, pricePerPod, maxPlaceInLine, dimensions, calculatePixelPosition, chartRef]);

    // Don't render if not visible or no valid coordinates
    if (!visible || !overlayCoordinates || !dimensions) {
      return null;
    }

    const { priceY, placeX } = overlayCoordinates;

    // Additional validation: ensure coordinates are within chart bounds
    // This is a safety check since coordinates should already be clamped
    if (
      !Number.isFinite(placeX) ||
      !Number.isFinite(priceY) ||
      placeX < dimensions.left ||
      placeX > dimensions.right ||
      priceY < dimensions.top ||
      priceY > dimensions.bottom
    ) {
      return null;
    }

    // Calculate dimensions for the shaded region
    const rectWidth = placeX - dimensions.left;
    const rectHeight = dimensions.bottom - priceY;

    // Don't render if dimensions are invalid or too small
    if (!Number.isFinite(rectWidth) || !Number.isFinite(rectHeight) || rectWidth <= 0 || rectHeight <= 0) {
      return null;
    }

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2, willChange: "transform" }}
      >
        <svg className="w-full h-full" style={{ willChange: "contents" }}>
          {/* Shaded region - from top-left to the intersection point */}
          <rect
            x={dimensions.left}
            y={priceY}
            width={rectWidth}
            height={rectHeight}
            rx={4}
            ry={4}
            fill={OVERLAY_COLORS.shadedRegion}
            stroke={OVERLAY_COLORS.border}
            strokeWidth={1}
            style={{
              willChange: "auto",
              transition: "x 0.15s ease-out, y 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out",
            }}
          />
        </svg>
      </div>
    );
  },
);

MarketChartOverlay.displayName = "MarketChartOverlay";

export default MarketChartOverlay;
