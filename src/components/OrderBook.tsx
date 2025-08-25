import LoadingSpinner from "@/components/LoadingSpinner";
import { cn } from "@/utils/utils";
import React, { useMemo, useCallback, useRef } from "react";

// ────────────────────────────────────────────────────────────────────────────────
// Types and Interfaces
// ────────────────────────────────────────────────────────────────────────────────

export interface OrderbookColumnConfig<T> {
  key: keyof T;
  header: string;
  format?: (value: T[keyof T], row: T) => string;
  align?: "left" | "right" | "center";
  width?: string;
}

export interface DepthVisualizationConfig<T> {
  enabled: boolean;
  field: keyof T;
  alignment: "left" | "right" | "center";
  maxValue?: number;
}

export interface OrderBookColors {
  bid: string;
  ask: string;
  bidDepth: string;
  askDepth: string;
  text?: string;
  mutedText?: string;
}

export interface OrderBookProps<T extends Record<string, any>> {
  bids: T[];
  asks: T[];
  columns: OrderbookColumnConfig<T>[];
  depthVisualization?: DepthVisualizationConfig<T>;
  showSpread?: boolean;
  visibleLevels?: number;
  colors?: Partial<OrderBookColors>;
  onRowHover?: (row: T | null, side: "bid" | "ask" | null) => void;
  className?: string;
  isLoading?: boolean;
  onEmpty?: React.ReactNode;
}

// ────────────────────────────────────────────────────────────────────────────────
// Default Colors
// ────────────────────────────────────────────────────────────────────────────────

const DEFAULT_COLORS: OrderBookColors = {
  // bid: "#52C2A9",
  // bidDepth: '#EAF8F2',
  // ask: "#E95D71",
  // askDepth: "#FEECEE",
  bid: "#10B981", // green-500
  ask: "#EF4444", // red-500
  bidDepth: "rgba(16, 185, 129, 0.1)", // green with opacity
  askDepth: "rgba(239, 68, 68, 0.1)", // red with opacity
  text: "inherit",
  mutedText: "#9C9C9C", // pinto-gray-4
};

// ────────────────────────────────────────────────────────────────────────────────
// OrderBookRow Component
// ────────────────────────────────────────────────────────────────────────────────

interface OrderBookRowProps<T extends Record<string, any>> {
  row: T;
  columns: OrderbookColumnConfig<T>[];
  side: "bid" | "ask";
  depthVisualization?: DepthVisualizationConfig<T>;
  depthPercentage: number;
  colors: OrderBookColors;
  onHover?: (row: T | null) => void;
}

function OrderBookRow<T extends Record<string, any>>({
  row,
  columns,
  side,
  depthVisualization,
  depthPercentage,
  colors,
  onHover,
}: OrderBookRowProps<T>) {
  const depthStyle = useMemo(() => {
    if (!depthVisualization?.enabled) return {};

    const alignment = depthVisualization.alignment;
    const color = side === "bid" ? colors.bidDepth : colors.askDepth;

    return {
      "--depth-width": `${depthPercentage}%`,
      "--depth-color": color,
      "--depth-alignment": alignment,
    } as React.CSSProperties;
  }, [depthVisualization, depthPercentage, side, colors]);

  return (
    <div
      className={cn(
        "orderbook-row relative group",
        onHover && "hover:bg-black/5 transition-colors duration-150 cursor-pointer",
      )}
      style={depthStyle}
      onMouseEnter={() => onHover?.(row)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Depth visualization bar */}
      {depthVisualization?.enabled && (
        <div
          className={cn("absolute inset-y-0 z-0", "transition-all duration-300 ease-out", {
            "left-0": depthVisualization.alignment === "left",
            "right-0": depthVisualization.alignment === "right",
            "left-1/2 -translate-x-1/2": depthVisualization.alignment === "center",
          })}
          style={{
            width: "var(--depth-width)",
            backgroundColor: "var(--depth-color)",
          }}
        />
      )}

      {/* Row content */}
      <div className="relative z-10 grid grid-cols-[repeat(var(--columns),1fr)] gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2">
        {columns.map((column, index) => {
          const value = row[column.key];
          const formattedValue = column.format ? column.format(value, row) : String(value);

          return (
            <div
              key={String(column.key)}
              className={cn("text-xs sm:text-xs", {
                "text-left": column.align === "left" || !column.align,
                "text-right": column.align === "right",
                "text-center": column.align === "center",
              })}
              style={{
                color: index === 0 ? (side === "bid" ? colors.bid : colors.ask) : colors.text,
                width: column.width,
              }}
            >
              {formattedValue}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// SpreadDisplay Component
// ────────────────────────────────────────────────────────────────────────────────

interface SpreadDisplayProps<T extends Record<string, any>> {
  bestBid?: T;
  bestAsk?: T;
  priceKey: keyof T;
  format?: (value: T[keyof T]) => string;
  colors: OrderBookColors;
}

function SpreadDisplay<T extends Record<string, any>>({
  bestBid,
  bestAsk,
  priceKey,
  format,
  colors,
}: SpreadDisplayProps<T>) {
  const spread = useMemo(() => {
    if (!bestBid || !bestAsk) return null;

    const bidPrice = Number(bestBid[priceKey]);
    const askPrice = Number(bestAsk[priceKey]);

    if (Number.isNaN(bidPrice) || Number.isNaN(askPrice)) return null;

    const spreadValue = askPrice - bidPrice;
    const spreadPercent = ((spreadValue / askPrice) * 100).toFixed(2);

    return {
      value: spreadValue,
      percent: spreadPercent,
      formatted: format ? format(spreadValue as T[keyof T]) : spreadValue.toFixed(2),
    };
  }, [bestBid, bestAsk, priceKey, format]);

  if (!spread) return null;

  return (
    <div className="spread-display">
      <div className="flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-3 py-1.5 sm:py-2">
        <span className="text-xs font-medium" style={{ color: colors.mutedText }}>
          Spread
        </span>
        <span className="text-xs sm:text-sm font-semibold" style={{ color: colors.text }}>
          {spread.formatted}
        </span>
        <span className="text-xs font-medium" style={{ color: colors.mutedText }}>
          ({spread.percent}%)
        </span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Main OrderBook Component
// ────────────────────────────────────────────────────────────────────────────────

export default function OrderBook<T extends Record<string, any>>({
  bids,
  asks,
  columns,
  depthVisualization,
  showSpread = true,
  visibleLevels = 10,
  colors: userColors,
  onRowHover,
  className,
  isLoading = false,
  onEmpty,
}: OrderBookProps<T>) {
  const colors = useMemo(() => ({ ...DEFAULT_COLORS, ...userColors }), [userColors]);

  // Calculate visible rows based on visibleLevels
  const { visibleAsks, visibleBids } = useMemo(() => {
    const hasAsks = asks.length > 0;
    const hasBids = bids.length > 0;

    if (!hasAsks && !hasBids) {
      return { visibleAsks: [], visibleBids: [] };
    }

    if (!hasAsks) {
      return { visibleAsks: [], visibleBids: bids.slice(0, visibleLevels * 2) };
    }

    if (!hasBids) {
      return { visibleAsks: asks.slice(0, visibleLevels * 2), visibleBids: [] };
    }

    return {
      visibleAsks: asks.slice(0, visibleLevels),
      visibleBids: bids.slice(0, visibleLevels),
    };
  }, [asks, bids, visibleLevels]);

  // Calculate max value for depth visualization
  const maxDepthValue = useMemo(() => {
    if (!depthVisualization?.enabled) return 0;

    const depthField = depthVisualization.field;
    const allValues = [...visibleAsks, ...visibleBids].map((row) => Number(row[depthField]));

    return depthVisualization.maxValue ?? Math.max(...allValues, 0);
  }, [depthVisualization, visibleAsks, visibleBids]);

  // Calculate depth percentage for a row
  const getDepthPercentage = useCallback(
    (row: T) => {
      if (!depthVisualization?.enabled || maxDepthValue === 0) return 0;

      const value = Number(row[depthVisualization.field]);
      return Math.min((value / maxDepthValue) * 100, 100);
    },
    [depthVisualization, maxDepthValue],
  );

  // Find best bid and ask for spread calculation
  const { bestBid, bestAsk } = useMemo(() => {
    return {
      bestBid: visibleBids[0],
      bestAsk: visibleAsks[visibleAsks.length - 1],
    };
  }, [visibleBids, visibleAsks]);

  const handleRowHover = useCallback(
    (row: T | null, side: "bid" | "ask" | null) => {
      onRowHover?.(row, side);
    },
    [onRowHover],
  );

  // Calculate min height based on visibleLevels using rem units that scale with font-size
  const minHeight = useMemo(() => {
    const headerHeight = 1.5; // rem
    const rowHeight = 1.5; // rem
    const spreadHeight = showSpread ? 1.5 : 0; // rem

    // Always reserve space for the maximum possible rows (visibleLevels * 2 for bids + asks)
    // This prevents height shrinking when there are fewer rows than visibleLevels
    const maxPossibleRows = visibleLevels;

    return `${headerHeight + maxPossibleRows * rowHeight + spreadHeight}rem`;
  }, [visibleLevels, showSpread]);

  // create a stable reference to the css variables
  const cssVariables = { "--columns": columns.length, minHeight: minHeight } as React.CSSProperties;

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={cn("orderbook-container flex items-center justify-center", "overflow-hidden min-w-0", className)}
        style={{ minHeight: minHeight }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "orderbook-container",
        "overflow-hidden",
        "min-w-0", // Prevent container from expanding beyond parent
        className,
      )}
      style={cssVariables}
    >
      {/* Header */}
      <div className="orderbook-header">
        <div className="grid grid-cols-[repeat(var(--columns),1fr)] gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2">
          {columns.map((column) => (
            <div
              key={`${String(column.key)}-${column.header}`}
              className={cn("text-[10px] sm:text-xs", {
                "text-left": column.align === "left" || !column.align,
                "text-right": column.align === "right",
                "text-center": column.align === "center",
              })}
              style={{
                color: colors.mutedText,
                width: column.width,
              }}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Asks section */}
      {visibleAsks.length > 0 && (
        <div className="asks-section">
          {[...visibleAsks].reverse().map((ask, index) => (
            <OrderBookRow
              key={index}
              row={ask}
              columns={columns}
              side="ask"
              depthVisualization={depthVisualization}
              depthPercentage={getDepthPercentage(ask)}
              colors={colors}
              onHover={onRowHover ? (row) => handleRowHover(row, row ? "ask" : null) : undefined}
            />
          ))}
        </div>
      )}

      {/* Spread display */}
      {showSpread && bestBid && bestAsk && (
        <SpreadDisplay
          bestBid={bestBid}
          bestAsk={bestAsk}
          priceKey={columns[0].key} // Assume first column is price
          format={(v) => {
            const format = columns[0].format;
            if (typeof format === "function") {
              return format(v, bestBid);
            }
            return v;
          }}
          colors={colors}
        />
      )}

      {/* Bids section */}
      {visibleBids.length > 0 && (
        <div className="bids-section">
          {visibleBids.map((bid, index) => (
            <OrderBookRow
              key={index}
              row={bid}
              columns={columns}
              side="bid"
              depthVisualization={depthVisualization}
              depthPercentage={getDepthPercentage(bid)}
              colors={colors}
              onHover={onRowHover ? (row) => handleRowHover(row, row ? "bid" : null) : undefined}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {visibleAsks.length === 0 && visibleBids.length === 0 && (
        <div className="empty-state flex items-center justify-center py-8 sm:py-12">
          {onEmpty || (
            <p className="text-xs sm:text-sm" style={{ color: colors.mutedText }}>
              No orders available
            </p>
          )}
        </div>
      )}

      {/* Fill remaining space with message when we have some data but fewer rows than visibleLevels */}
      {(visibleAsks.length > 0 || visibleBids.length > 0) &&
        visibleAsks.length + visibleBids.length < visibleLevels && (
          <div className="flex items-center justify-center py-4">
            <p className="text-xs" style={{ color: colors.mutedText }}>
              No additional orders available
            </p>
          </div>
        )}
    </div>
  );
}
