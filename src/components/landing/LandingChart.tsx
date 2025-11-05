import Beaver_1 from "@/assets/landing/Beaver_1.png";
import Beaver_2 from "@/assets/landing/Beaver_2.png";
import Beaver_3 from "@/assets/landing/Beaver_3.png";
import Beaver_4 from "@/assets/landing/Beaver_4.png";
import Beaver_5 from "@/assets/landing/Beaver_5.png";
import Beaver_6 from "@/assets/landing/Beaver_6.png";
import Beaver_7 from "@/assets/landing/Beaver_7.png";
import Beaver_8 from "@/assets/landing/Beaver_8.png";
import Beaver_9 from "@/assets/landing/Beaver_9.png";
import Beaver_10 from "@/assets/landing/Beaver_10.png";
import Beaver_11 from "@/assets/landing/Beaver_11.png";
import Beaver_12 from "@/assets/landing/Beaver_12.png";
import useIsMobile from "@/hooks/display/useIsMobile";
import { cubicBezier, findBezierExtrema } from "@/utils/utils";
import { MotionValue, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FloaterContainer from "./FloaterContainer";

// Function to calculate grid X offset so measurement line aligns with grid lines
function calculateGridXOffset(viewportWidth: number) {
  const defaultWidth = 1920; // Grid is aligned at this width
  const measurementLinePercentage = ANIMATION_CONFIG.measurementLine.final; // 75%

  // Calculate the difference in measurement line position between default and current width
  const defaultMeasurementPosition = defaultWidth * measurementLinePercentage;
  const currentMeasurementPosition = viewportWidth * measurementLinePercentage;
  const offset = currentMeasurementPosition - defaultMeasurementPosition;

  return offset;
}

// Function to calculate grid Y offset so price line aligns with grid lines
function calculateGridYOffset(chartHeight: number) {
  const defaultHeight = ANIMATION_CONFIG.height; // Grid is aligned at this height (577)
  const priceLinePercentage = ANIMATION_CONFIG.horizontalReference.position; // 50%

  // Calculate the difference in price line position between default and current height
  const defaultPricePosition = defaultHeight * priceLinePercentage;
  const currentPricePosition = chartHeight * priceLinePercentage;
  const offset = currentPricePosition - defaultPricePosition;

  return offset;
}

// Master animation configuration - Variable-driven system
// This configuration drives all animations through percentages and proportions
// instead of hardcoded values, making the entire system responsive and scalable
const ANIMATION_CONFIG = {
  // Visual constants
  height: 577,
  repetitions: 20,
  pointSpacing: 140,

  // Speed constants
  baseSpeed: 2.8, // pixels per frame at 60fps

  gridSpacing: 72,
  gridStrokeWidth: 1,

  // Measurement line positions (as viewport percentages)
  measurementLine: {
    initial: 0.1, // 75% from left
    minimum: 0.1, // 10% from left
    final: 0.75, // back to 75%
  },

  // Clip path expansion
  clipPath: {
    initial: 0.1, // 10% width
    final: 0.75, // 75% width
  },

  // Fade-in sequence timing (as percentages of fade-in phase)
  fadeInSequence: {
    grid: { start: 0.0, duration: 0.4 },
    measurementLine: { start: 0.1, duration: 0.2 },
    priceLine: { start: 0.2, duration: 0.4 },
    priceIndicator: { start: 0.1, duration: 0.2 },
  },

  // Price indicator
  priceIndicator: {
    staticPosition: 0.5, // 50% of chart height
  },

  // Horizontal reference line (represents $1.00)
  horizontalReference: {
    position: 0.5, // 50% of chart height
    color: "#387F5C", // pinto-green-4
    strokeWidth: 2,
    dashArray: "10,10",
  },

  // Price labels configuration
  priceLabels: {
    staticX: 0.75, // 75% from left (same as measurement line final position)
    xOffset: 20, // pixels to the right of the line
    yOffset: 4,
    levels: [1.3, 1.2, 1.1, 0.9, 0.8, 0.7], // Removed 1.0 since it overlaps with horizontal line
    fontSize: 14,
    color: "#9C9C9C", // pinto-gray-4
  },
};

// Legacy constants for backward compatibility during transition
const repetitions = ANIMATION_CONFIG.repetitions;
const pointSpacing = ANIMATION_CONFIG.pointSpacing;

// Duration calculation system - simplified for fade-in only
function calculateDurations() {
  const fadeInDuration = 8; // Fixed fade-in duration in seconds

  return {
    // Fade-in sequence durations only
    fadeInSequence: {
      grid: {
        start: fadeInDuration * ANIMATION_CONFIG.fadeInSequence.grid.start,
        duration: fadeInDuration * ANIMATION_CONFIG.fadeInSequence.grid.duration,
      },
      measurementLine: {
        start: fadeInDuration * ANIMATION_CONFIG.fadeInSequence.measurementLine.start,
        duration: fadeInDuration * ANIMATION_CONFIG.fadeInSequence.measurementLine.duration,
      },
      priceLine: {
        start: fadeInDuration * ANIMATION_CONFIG.fadeInSequence.priceLine.start,
        duration: fadeInDuration * ANIMATION_CONFIG.fadeInSequence.priceLine.duration,
      },
      priceIndicator: {
        start: fadeInDuration * ANIMATION_CONFIG.fadeInSequence.priceIndicator.start,
        duration: fadeInDuration * ANIMATION_CONFIG.fadeInSequence.priceIndicator.duration,
      },
    },
  };
}

// Calculate phase2Duration based on current position, target, speed, and viewport
function calculatePhase2Duration(
  measurementLineOffset: MotionValue<number>,
  clipPathWidth: MotionValue<number>,
  containerRef: React.RefObject<HTMLDivElement>,
  isMobile: boolean,
): number {
  // Get the actual current container width
  const actualViewportWidth = containerRef.current?.clientWidth || window.innerWidth;

  // Calculate measurement line distance
  const currentMeasurementLineOffset = measurementLineOffset.get();
  const finalMeasurementLineOffset = ANIMATION_CONFIG.measurementLine.final * 100;
  const measurementLineDistance = Math.abs(finalMeasurementLineOffset - currentMeasurementLineOffset);
  const measurementLinePixelDistance = (measurementLineDistance / 100) * actualViewportWidth;

  // Calculate clip path distance (clipPathWidth is stored as decimal percentage 0-1)
  const currentClipPathWidth = clipPathWidth.get();
  const finalClipPathWidth = ANIMATION_CONFIG.clipPath.final;
  const clipPathDistance = Math.abs(finalClipPathWidth - currentClipPathWidth);
  const clipPathPixelDistance = clipPathDistance * actualViewportWidth;

  // Use the larger distance to determine duration
  const maxPixelDistance = Math.max(measurementLinePixelDistance, clipPathPixelDistance);
  const speedPixelsPerSecond = ANIMATION_CONFIG.baseSpeed * 60; // Convert to pixels per second
  const calculatedDuration = maxPixelDistance / speedPixelsPerSecond;

  // Apply mobile scaling and reasonable bounds
  return Math.max(isMobile ? 0.5 : 1, Math.min(calculatedDuration, isMobile ? 2 : 8));
}

// Price data with more baseline points to space out peaks and dips
// Define the type for priceData
export interface PricePoint {
  txType: string | null;
  value: number;
  farmer?: string; // Farmer is now just a filename string
  speed?: number; // Optional speed for specific transactions
}

// Define transaction marker with stable ID
export interface TransactionMarker {
  id: string; // Stable unique identifier
  x: number;
  y: number;
  txType: string;
  farmer?: string;
  index: number;
  apexType?: "peak" | "valley";
}

const stablePriceData: PricePoint[] = [
  { txType: null, value: 0.9994, speed: 3 },
  { txType: "yield", value: 1.005, speed: 3 },
  { txType: "deposit", value: 0.995, speed: 0.85 },
  { txType: null, value: 1.0004, speed: 0.85 },
  { txType: null, value: 0.9994, speed: 0.85 },
  { txType: "deposit", value: 1.0004, speed: 0.85 },
];

// Track amplitude calls for progressive dampening
let amplitudeCallCount = 0;

// Generate randomized stable data with slight variations (0.1%)
function generateRandomizedStableData(baseData: PricePoint[]): PricePoint[] {
  // Increment call count for progressive amplitude reduction
  amplitudeCallCount++;

  // Calculate amplitude modifier (decreases price movement over time)
  // Starts at 1.0 (full amplitude) and can reduce to 0.2 (20% amplitude)
  const maxReduction = 0.2; // 80% reduction maximum
  const reductionRate = 0.2; // 20% reduction per call
  const amplitudeModifier = Math.max(maxReduction, 1.0 - (amplitudeCallCount - 1) * reductionRate);
  // Transaction types for different price movements
  const priceUpTxTypes = ["deposit", "convertUp", "sow", "buy"];
  const priceDownTxTypes = ["withdraw", "convertDown", "harvest", "sell"];

  // First pass: randomize values and speeds, clear all txTypes
  const randomizedData = baseData.map((point) => {
    // Determine price randomization direction based on original price relative to $1.00
    let priceMultiplier: number;
    if (point.value > 1.0) {
      // Price is above $1.00, only allow upward movement
      priceMultiplier = 1 + Math.random() * 0.002 * amplitudeModifier; // 0% to +0.2% * amplitude
    } else if (point.value < 1.0) {
      // Price is below $1.00, only allow downward movement
      priceMultiplier = 1 - Math.random() * 0.002 * amplitudeModifier; // -0.2% to 0% * amplitude
    } else {
      // Price is exactly $1.00, allow small movement in either direction
      priceMultiplier = 1 + (Math.random() - 0.5) * 0.002 * amplitudeModifier; // ±0.1% * amplitude
    }

    return {
      ...point,
      value: point.value * priceMultiplier,
      txType: null as string | null, // Clear all txTypes initially
      farmer: undefined, // Clear farmer assignment so new batch gets fresh farmers
      speed: (point.speed || 1) + (Math.random() - 0.5) * 0.1 * amplitudeModifier, // ±0.05 randomization * amplitude
    };
  });

  // Second pass: assign txTypes to datapoints
  randomizedData.forEach((point, index) => {
    if (point.value >= 1.0) {
      // Price above or at $1, use bearish transaction
      randomizedData[index].txType = priceDownTxTypes[Math.floor(Math.random() * priceDownTxTypes.length)];
    } else {
      // Price below $1, use bullish transaction
      randomizedData[index].txType = priceUpTxTypes[Math.floor(Math.random() * priceUpTxTypes.length)];
    }
  });

  // Calculate total speed deviation and balance it
  const originalTotalSpeed = baseData.reduce((sum, point) => sum + (point.speed || 1), 0);
  const randomizedTotalSpeed = randomizedData.reduce((sum, point) => sum + point.speed, 0);
  const speedDeviation = randomizedTotalSpeed - originalTotalSpeed;

  // Distribute the correction across all points
  const correctionPerPoint = speedDeviation / randomizedData.length;
  return randomizedData.map((point) => ({
    ...point,
    speed: Math.max(0.1, point.speed - correctionPerPoint), // Ensure speed never goes below 0.1
  }));
}

// Initial combined price data
const initialFullPriceData: PricePoint[] = [
  { txType: null, value: 1, speed: 0.85 },
  { txType: null, value: 1.0005, speed: 0.85 },
  ...Array.from({ length: repetitions }).flatMap(() => generateRandomizedStableData(stablePriceData)),
];

// Array of person icons with different color backgrounds
const personIcons = [
  Beaver_1,
  Beaver_2,
  Beaver_3,
  Beaver_4,
  Beaver_5,
  Beaver_6,
  Beaver_7,
  Beaver_8,
  Beaver_9,
  Beaver_10,
  Beaver_11,
  Beaver_12,
];

// Helper function to get group index (farmers 1&2 = group 0, farmers 3&4 = group 1, etc.)
function getFarmerGroup(farmerFilename: string): number {
  const farmerNumber = parseInt(farmerFilename.replace(/\D/g, ""), 10);
  return Math.floor((farmerNumber - 1) / 2);
}

// Helper function to select a farmer that doesn't have the same group as the previous one
function selectFarmer(previousFarmer?: string): string {
  if (!previousFarmer) {
    // First farmer, can be any
    const randomIndex = Math.floor(Math.random() * personIcons.length);
    return personIcons[randomIndex];
  }

  const previousGroup = getFarmerGroup(previousFarmer);
  const availableFarmers = personIcons.filter((farmer) => getFarmerGroup(farmer) !== previousGroup);

  const randomIndex = Math.floor(Math.random() * availableFarmers.length);
  return availableFarmers[randomIndex];
}

// Convert price to Y coordinate (inverted because SVG Y increases downward)
function priceToY(price: number, chartHeight = ANIMATION_CONFIG.height) {
  const minPrice = 0.99;
  const maxPrice = 1.01;
  const minY = chartHeight - 0; // Bottom margin
  const maxY = 0; // Top margin
  return minY - ((price - minPrice) / (maxPrice - minPrice)) * (minY - maxY);
}

// Convert price to Y coordinate for labels (aligned to grid lines)
function priceLabelToY(
  price: number,
  chartHeight = ANIMATION_CONFIG.height,
  gridSpacing = ANIMATION_CONFIG.gridSpacing,
) {
  const middle = chartHeight / 2;
  const levels = ANIMATION_CONFIG.priceLabels.levels;
  const fontSize = ANIMATION_CONFIG.priceLabels.fontSize;
  const yOffset = ANIMATION_CONFIG.priceLabels.yOffset;

  // Find the index of this price in the levels array
  const index = levels.indexOf(price);
  if (index === -1) return middle; // Fallback to middle if not found

  // Calculate center reference index based on levels array
  const totalLevels = levels.length;
  const centerIndex = Math.ceil((totalLevels - 1) / 2);

  // Adjust index for symmetric spacing (skip center position)
  const beforeMiddle = index < centerIndex;
  const adjustedIndex = beforeMiddle ? index : index + 1;

  const gridOffset = (adjustedIndex - centerIndex) * gridSpacing + (beforeMiddle ? yOffset * -1 : fontSize);
  return middle + gridOffset;
}

// Generate stable ID for transaction marker based on data content (not index)
function generateMarkerId(txType: string, value: number, farmer?: string, speed?: number): string {
  // Create a content-based hash that's independent of array position
  const contentHash = `${txType}-${value.toFixed(6)}-${farmer || "default"}-${speed || 1}`;
  return `marker-${contentHash}`;
}

// Update markers incrementally based on data changes
function updateMarkersIncremental(
  currentData: PricePoint[],
  previousData: PricePoint[],
  existingMarkers: Map<string, TransactionMarker>,
  pointSpacing: number,
  chartHeight: number,
): Map<string, TransactionMarker> {
  const updatedMarkers = new Map<string, TransactionMarker>();

  // If this is the first run (no previous data), generate all markers from scratch
  if (previousData.length === 0 || existingMarkers.size === 0) {
    let x = 0;
    for (let i = 0; i < currentData.length; i++) {
      const dataPoint = currentData[i];
      if (dataPoint.txType) {
        const markerId = generateMarkerId(dataPoint.txType, dataPoint.value, dataPoint.farmer, dataPoint.speed);
        const y = priceToY(dataPoint.value, chartHeight);
        updatedMarkers.set(markerId, {
          id: markerId,
          x,
          y,
          txType: dataPoint.txType,
          farmer: dataPoint.farmer,
          index: i,
        });
      }
      const segSpeed = dataPoint.speed || 1;
      x += pointSpacing / segSpeed;
    }
    return updatedMarkers;
  }

  // Find the common prefix length (unchanged data at the beginning)
  let commonPrefixLength = 0;
  const minLength = Math.min(currentData.length, previousData.length);

  for (let i = 0; i < minLength; i++) {
    const current = currentData[i];
    const previous = previousData[i];

    // Compare data points for equality (including farmer to maintain consistency)
    if (
      current.txType === previous.txType &&
      current.value === previous.value &&
      current.speed === previous.speed &&
      current.farmer === previous.farmer
    ) {
      commonPrefixLength++;
    } else {
      break;
    }
  }

  // Preserve markers from unchanged prefix
  let x = 0;
  for (let i = 0; i < commonPrefixLength; i++) {
    const dataPoint = currentData[i];
    if (dataPoint.txType) {
      const markerId = generateMarkerId(dataPoint.txType, dataPoint.value, dataPoint.farmer, dataPoint.speed);
      const existingMarker = existingMarkers.get(markerId);
      if (existingMarker) {
        // Update position but preserve the marker object identity
        updatedMarkers.set(markerId, {
          ...existingMarker,
          x, // Update x position in case spacing changed
          y: priceToY(dataPoint.value, chartHeight),
          index: i, // Update index to reflect current position
        });
      } else {
        // Fallback: create new marker if existing not found
        const y = priceToY(dataPoint.value, chartHeight);
        updatedMarkers.set(markerId, {
          id: markerId,
          x,
          y,
          txType: dataPoint.txType,
          farmer: dataPoint.farmer,
          index: i,
        });
      }
    }
    const segSpeed = dataPoint.speed || 1;
    x += pointSpacing / segSpeed;
  }

  // Generate new markers for changed/added data
  for (let i = commonPrefixLength; i < currentData.length; i++) {
    const dataPoint = currentData[i];
    if (dataPoint.txType) {
      const markerId = generateMarkerId(dataPoint.txType, dataPoint.value, dataPoint.farmer, dataPoint.speed);
      const y = priceToY(dataPoint.value, chartHeight);
      updatedMarkers.set(markerId, {
        id: markerId,
        x,
        y,
        txType: dataPoint.txType,
        farmer: dataPoint.farmer,
        index: i,
      });
    }
    const segSpeed = dataPoint.speed || 1;
    x += pointSpacing / segSpeed;
  }

  return updatedMarkers;
}

// Generate complete line path with incremental marker updates
function generateCompletePathWithIncrementalMarkers(
  pointSpacing: number,
  chartHeight = ANIMATION_CONFIG.height,
  priceData = initialFullPriceData,
  previousData: PricePoint[] = [],
  existingMarkers: Map<string, TransactionMarker> = new Map(),
) {
  const points: { x: number; y: number; price: number }[] = [];
  const beziers: {
    p0: { x: number; y: number };
    c1: { x: number; y: number };
    c2: { x: number; y: number };
    p1: { x: number; y: number };
  }[] = [];

  // Update markers incrementally instead of regenerating all
  const transactionMarkers = updateMarkersIncremental(
    priceData,
    previousData,
    existingMarkers,
    pointSpacing,
    chartHeight,
  );

  let x = 0;
  for (let i = 0; i < priceData.length; i++) {
    const y = priceToY(priceData[i].value, chartHeight);
    points.push({ x, y, price: priceData[i].value });
    // If this segment has a speed, compress the next segment's width
    const segSpeed = priceData[i].speed || 1;
    x += pointSpacing / segSpeed;
  }

  if (points.length === 0) return { path: "", points: [], totalWidth: 0, beziers: [], transactionMarkers: new Map() };

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const prev = points[i - 2] || p0;
    const next = points[i + 1] || p1;
    // Calculate control points
    const c1x = p0.x + (p1.x - prev.x) / 6;
    const c1y = p0.y + (p1.y - prev.y) / 6;
    const c2x = p1.x - (next.x - p0.x) / 6;
    const c2y = p1.y - (next.y - p0.y) / 6;
    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p1.x} ${p1.y}`;
    beziers.push({ p0, c1: { x: c1x, y: c1y }, c2: { x: c2x, y: c2y }, p1 });
  }

  // Find all curve extrema (apexes) for better marker positioning
  type ExtremumPoint = { x: number; y: number; type: "peak" | "valley"; segmentIndex: number };
  const allExtrema: Array<ExtremumPoint> = [];
  beziers.forEach((segment, index) => {
    const extrema = findBezierExtrema(segment);
    extrema.forEach((extremum) => {
      allExtrema.push({ ...extremum, segmentIndex: index });
    });
  });

  // Reposition transaction markers to nearest appropriate apex
  const apexTransactionMarkers = new Map<string, TransactionMarker>();

  transactionMarkers.forEach((marker, id) => {
    // Find the closest apex to this transaction marker
    let closestApex: ExtremumPoint | null = null;
    let minDistance = Infinity;

    allExtrema.forEach((apex) => {
      const distance = Math.abs(apex.x - marker.x);
      // Only consider apexes within reasonable range (half segment width)
      if (distance < pointSpacing * 0.75 && distance < minDistance) {
        minDistance = distance;
        closestApex = apex;
      }
    });

    // If we found a close apex, use it; otherwise keep original position
    if (closestApex) {
      const apex = closestApex as ExtremumPoint;
      apexTransactionMarkers.set(id, {
        ...marker,
        x: apex.x,
        y: apex.y,
        apexType: apex.type, // Add metadata for positioning logic
      });
    } else {
      apexTransactionMarkers.set(id, marker);
    }
  });

  const totalWidth = points.length > 0 ? points[points.length - 1].x : 0;
  return { path, points, totalWidth, beziers, transactionMarkers: apexTransactionMarkers };
}

// Generate price label data
function generatePriceLabelData(chartHeight = ANIMATION_CONFIG.height) {
  return ANIMATION_CONFIG.priceLabels.levels.map((price) => {
    return {
      price,
      y: priceLabelToY(price, chartHeight),
      label: price.toFixed(1),
    };
  });
}

export default function LandingChart() {
  const [viewportWidth, setViewportWidth] = useState(1920); // Default width

  const [dynamicHeight, setDynamicHeight] = useState(ANIMATION_CONFIG.height); // Default to config height
  const [gridXOffset, setGridXOffset] = useState(() => calculateGridXOffset(1920)); // Grid X offset to align with measurement line
  const [gridYOffset, setGridYOffset] = useState(() => calculateGridYOffset(ANIMATION_CONFIG.height)); // Grid Y offset to align with price line
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Dynamic price data that gets updated
  const [fullPriceData, setFullPriceData] = useState<PricePoint[]>(initialFullPriceData);

  // Persistent marker cache that survives data updates
  const persistentMarkersRef = useRef<Map<string, TransactionMarker>>(new Map());
  const previousDataRef = useRef<PricePoint[]>(initialFullPriceData);

  // Calculate durations and positions
  const durations = useMemo(() => calculateDurations(), []);

  // Generate price label data
  const priceLabelData = useMemo(() => {
    const data = generatePriceLabelData(dynamicHeight);
    // console.log("Price label data:", data);
    return data;
  }, [dynamicHeight]);

  const scrollOffset = useMotionValue(0);
  const measurementLineOffset = useMotionValue(ANIMATION_CONFIG.measurementLine.initial * 100); // Separate offset for measurement line movement (percentage)
  const clipPathWidth = useMotionValue(ANIMATION_CONFIG.clipPath.initial); // Separate motion value for clip path (decimal 0-1)
  const horizontalLineClipPath = useMotionValue(viewportWidth); // For horizontal line reveal animation (starts hidden from right)
  const priceLabelsOpacity = useMotionValue(0); // 0 = hidden, 1 = visible
  const priceLineOpacity = useMotionValue(0); // 0 = hidden, 1 = visible
  const horizontalLineOpacity = useMotionValue(1); // 0 = hidden, 1 = visible
  const gridOpacity = useMotionValue(0); // 0 = hidden, 1 = visible
  const gridClipPath = useMotionValue("inset(0 0 100% 0)"); // Initial clip path
  const measurementLineClipPath = useMotionValue("inset(0 0 100% 0)"); // Initial clip path for measurement line
  const priceIndicatorOpacity = useMotionValue(0); // 0 = hidden, 1 = visible
  const x = useTransform(scrollOffset, (value) => viewportWidth * ANIMATION_CONFIG.clipPath.initial - value);

  // Transform values for motion properties (moved from JSX to avoid hook violations)
  const clipPathRectWidth = useTransform(clipPathWidth, (pct) => pct * viewportWidth);
  const measurementLineX = useTransform(measurementLineOffset, (offset) => (offset / 100) * viewportWidth);
  const horizontalLineClipPathStyle = useTransform(horizontalLineClipPath, (clipX) => `inset(0 ${clipX}px 0 0)`);

  // Update viewport width and dynamic height on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      let newViewportWidth = viewportWidth;
      if (containerRef.current) {
        newViewportWidth = containerRef.current.clientWidth;
        setViewportWidth(newViewportWidth);
      }

      // Calculate dynamic height based on parent container
      // The parent section already handles height calculation, so we use the full container height
      const parentElement = containerRef.current?.parentElement;
      if (parentElement) {
        const parentHeight = parentElement.clientHeight;

        // Use the parent height directly since it's already calculated to fit properly
        const newHeight = Math.min(parentHeight, ANIMATION_CONFIG.height);

        // Only update if the new height is significantly different and positive
        if (newHeight > 200 && Math.abs(newHeight - dynamicHeight) > 10) {
          setDynamicHeight(newHeight);
        }
      }

      // Recalculate grid X offset when viewport width changes
      if (newViewportWidth !== viewportWidth) {
        const newGridXOffset = calculateGridXOffset(newViewportWidth);
        setGridXOffset(newGridXOffset);
      }
    };

    // Use ResizeObserver for more efficient resize detection
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    // Also add a direct window resize listener to catch maximize/minimize events
    const handleWindowResize = () => {
      // Use a small delay to ensure the window has finished resizing
      setTimeout(updateDimensions, 10);
    };

    if (containerRef.current) {
      // Initial measurement
      updateDimensions();

      // Start observing
      resizeObserver.observe(containerRef.current);
    }

    // Listen to window resize events (for maximize/minimize and other window operations)
    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [dynamicHeight, viewportWidth]);

  // Update grid X offset when viewportWidth changes
  useEffect(() => {
    const newGridXOffset = calculateGridXOffset(viewportWidth);
    setGridXOffset(newGridXOffset);
  }, [viewportWidth]);

  // Update grid Y offset when dynamicHeight changes
  useEffect(() => {
    const newGridYOffset = calculateGridYOffset(dynamicHeight);
    setGridYOffset(newGridYOffset);
  }, [dynamicHeight]);

  // Assign farmers to price data and generate path with incremental markers
  const { path, beziers, transactionMarkersMap } = useMemo(() => {
    // Create a working copy to avoid mutating state
    const workingData = [...fullPriceData];

    // Assign farmer icons consistently - check existing markers for assignments
    let lastAssignedFarmer: string | undefined;
    for (let i = 0; i < workingData.length; i++) {
      if (workingData[i].txType !== null && !workingData[i].farmer) {
        // Look for existing marker with same content pattern
        let existingMarker: TransactionMarker | undefined;
        for (const [id, marker] of persistentMarkersRef.current) {
          const txType = workingData[i].txType;
          if (
            txType &&
            id.includes(txType) &&
            id.includes(workingData[i].value.toFixed(6)) &&
            id.includes(`${workingData[i].speed || 1}`)
          ) {
            existingMarker = marker;
            break;
          }
        }

        if (existingMarker) {
          // Reuse farmer from existing marker
          workingData[i].farmer = existingMarker.farmer;
          lastAssignedFarmer = existingMarker.farmer;
        } else {
          // Generate new farmer assignment avoiding same group as previous
          workingData[i].farmer = selectFarmer(lastAssignedFarmer);
          lastAssignedFarmer = workingData[i].farmer;
        }
      } else if (workingData[i].farmer) {
        // Track existing farmer assignments
        lastAssignedFarmer = workingData[i].farmer;
      }
    }

    const result = generateCompletePathWithIncrementalMarkers(
      pointSpacing,
      dynamicHeight,
      workingData,
      previousDataRef.current,
      persistentMarkersRef.current,
    );

    // Update persistent cache and previous data reference
    persistentMarkersRef.current = result.transactionMarkers;
    previousDataRef.current = workingData;

    return { ...result, transactionMarkersMap: result.transactionMarkers };
  }, [dynamicHeight, fullPriceData]);

  // Convert Map to array for rendering while maintaining stable order
  const transactionMarkers = useMemo(() => {
    return Array.from(transactionMarkersMap.values()).sort((a, b) => a.index - b.index);
  }, [transactionMarkersMap]);

  // Dynamic measurement line position using percentage
  const measurementX = useTransform(measurementLineOffset, (offset) => (offset / 100) * viewportWidth);

  // Memoize getYOnBezierCurve
  const getYOnBezierCurve = useCallback(
    (xVal: number) => {
      for (const seg of beziers) {
        if (xVal >= seg.p0.x && xVal <= seg.p1.x) {
          // Find t for xVal in [p0.x, p1.x] using binary search
          let t0 = 0;
          let t1 = 1;
          let t = 0.5;
          let x = 0;
          for (let i = 0; i < 10; i++) {
            x = cubicBezier(seg.p0.x, seg.c1.x, seg.c2.x, seg.p1.x, t);
            if (Math.abs(x - xVal) < 0.5) break;
            if (x < xVal) t0 = t;
            else t1 = t;
            t = (t0 + t1) / 2;
          }
          // Now get y at t
          return cubicBezier(seg.p0.y, seg.c1.y, seg.c2.y, seg.p1.y, t);
        }
      }
      // Fallback: clamp to ends
      if (beziers.length > 0) {
        if (xVal < beziers[0].p0.x) return beziers[0].p0.y;
        if (xVal > beziers[beziers.length - 1].p1.x) return beziers[beziers.length - 1].p1.y;
      }
      return 0;
    },
    [beziers],
  );

  // Use Bezier curve for indicator Y - only when price tracking is active
  const currentY = useTransform([scrollOffset, measurementX], ([currentOffset, measX]) => {
    // Direct position calculation without looping to prevent desync
    // @ts-ignore-next-line
    const xVal = measX + currentOffset - viewportWidth * ANIMATION_CONFIG.clipPath.initial; // Account for price line offset
    return getYOnBezierCurve(xVal);
  });

  // currentTriggerPhase and setCurrentTriggerPhase are now passed as props

  // Refs to prevent timer interference
  const pintoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationControlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const clipPathControlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const lineStrokeColor = "#387F5C";

  // Track if animations are paused due to page visibility or component visibility
  const isPausedRef = useRef(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const isComponentVisibleRef = useRef(false);

  // Track last extension to prevent rapid fire updates
  const lastExtensionRef = useRef<number>(0);

  // Monitor scroll progress to fade in price labels and extend data
  useEffect(() => {
    const unsubscribe = scrollOffset.on("change", (currentOffset) => {
      if (isPausedRef.current) return;

      // Calculate total data width for progress tracking
      const totalDataWidth = fullPriceData.reduce((width, point) => {
        const segSpeed = point.speed || 1;
        return width + pointSpacing / segSpeed;
      }, 0);

      // Calculate progress based on scroll position (same as animation uses)
      const progress = currentOffset / totalDataWidth;

      // Throttle extensions to prevent rapid fire updates (minimum 2 seconds between extensions)
      const now = Date.now();
      const timeSinceLastExtension = now - lastExtensionRef.current;

      // Log progress when approaching extension threshold
      /*
      if (progress > 0.7 && progress < 1.0) {
        console.log(`📊 Progress: ${(progress * 100).toFixed(1)}%, timeSinceExtension: ${timeSinceLastExtension}ms`);
      }
      */

      if (progress >= 0.8 && timeSinceLastExtension > 2000) {
        //console.log(`🔄 Extending price data at 80% progress - current data length: ${fullPriceData.length}`);
        lastExtensionRef.current = now;

        // Stop current animation immediately
        if (animationControlsRef.current) {
          animationControlsRef.current.stop();
        }

        // Step 1: Generate new data in next tick
        setTimeout(() => {
          const newStableData = Array.from({ length: repetitions }).flatMap(() =>
            generateRandomizedStableData(stablePriceData),
          );

          const clipPathStartX = viewportWidth * ANIMATION_CONFIG.clipPath.initial;
          const offScreenBuffer = viewportWidth * 0.2;
          const safeRemovalThreshold = currentOffset - clipPathStartX - offScreenBuffer;

          // Step 2: Update state in next animation frame
          requestAnimationFrame(() => {
            setFullPriceData((currentData) => {
              // Fast calculation of removable points
              let removableWidth = 0;
              let pointsToRemove = 0;

              for (let i = 0; i < currentData.length && removableWidth < safeRemovalThreshold; i++) {
                const segSpeed = currentData[i].speed || 1;
                const pointWidth = pointSpacing / segSpeed;

                if (removableWidth + pointWidth <= safeRemovalThreshold) {
                  removableWidth += pointWidth;
                  pointsToRemove++;
                } else {
                  break;
                }
              }

              const maxPointsToRemove = Math.min(pointsToRemove, newStableData.length);

              if (maxPointsToRemove > 0) {
                // Pre-calculate removed width more efficiently
                let actualRemovedWidth = 0;
                for (let i = 0; i < maxPointsToRemove; i++) {
                  const segSpeed = currentData[i].speed || 1;
                  actualRemovedWidth += pointSpacing / segSpeed;
                }

                const newScrollOffset = Math.max(0, currentOffset - actualRemovedWidth);
                scrollOffset.set(newScrollOffset);

                /*console.log(
                  `📊 Safely removed ${maxPointsToRemove} off-screen points, added ${newStableData.length} new points`,
                );*/

                return [...currentData.slice(maxPointsToRemove), ...newStableData];
              } else {
                //console.log("📊 Added new data without removing (not safe to remove yet)");
                return [...currentData, ...newStableData];
              }
            });

            // Step 3: Restart animation in another frame
            setTimeout(() => {
              const speedScale = 1;
              const pxPerSecond = ANIMATION_CONFIG.baseSpeed * 60 * speedScale;

              const startContinuousScroll = () => {
                // Get fresh data from state - don't use closure variable
                const currentPriceData = fullPriceData;

                // Safety check: ensure we have data
                if (currentPriceData.length === 0) {
                  //console.warn("📊 No price data available, retrying in 100ms");
                  setTimeout(startContinuousScroll, 100);
                  return;
                }

                const currentDataWidth = currentPriceData.reduce((width, point) => {
                  const segSpeed = point.speed || 1;
                  return width + pointSpacing / segSpeed;
                }, 0);

                const currentScrollOffset = scrollOffset.get();
                const remainingWidth = currentDataWidth - currentScrollOffset;

                // If we've reached the end, reset to beginning and animate full width
                if (remainingWidth <= 0 || !Number.isFinite(remainingWidth)) {
                  //console.log("📊 Animation reached end, resetting to beginning");
                  scrollOffset.set(0);
                  const scrollDuration = currentDataWidth / pxPerSecond;

                  const controls = animate(scrollOffset, currentDataWidth, {
                    duration: scrollDuration,
                    ease: "linear",
                    onComplete: () => {
                      //console.log("📊 Animation completed, checking for restart...");
                      if (animationControlsRef.current === controls) {
                        //console.log("📊 Controls match, restarting scroll");
                        startContinuousScroll();
                      } else {
                        //console.warn("📊 Controls don't match, not restarting");
                      }
                    },
                  });
                  animationControlsRef.current = controls;
                  return;
                }

                const scrollDuration = remainingWidth / pxPerSecond;
                /*
                console.log(
                  `📊 Restarting scroll: offset=${currentScrollOffset}, width=${currentDataWidth}, duration=${scrollDuration}`,
                );
                */
                const controls = animate(scrollOffset, currentDataWidth, {
                  duration: scrollDuration,
                  ease: "linear",
                  onComplete: () => {
                    //console.log("📊 Animation completed, checking for restart...");
                    // Safety check before recursive call
                    if (animationControlsRef.current === controls) {
                      //console.log("📊 Controls match, restarting scroll");
                      startContinuousScroll();
                    } else {
                      //console.warn("📊 Controls don't match, not restarting");
                    }
                  },
                });
                animationControlsRef.current = controls;
              };

              startContinuousScroll();
            }, 0);
          });
        }, 0);
      }
    });
    return unsubscribe;
  }, [scrollOffset, fullPriceData]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (pintoTimerRef.current) {
        clearTimeout(pintoTimerRef.current);
      }
    };
  }, []);

  // Start animation function
  const startAnimation = useCallback(async () => {
    // Start with grid animation
    animate(gridOpacity, 1, {
      duration: durations.fadeInSequence.grid.duration,
      ease: "easeInOut",
      delay: durations.fadeInSequence.grid.start,
    });
    animate(gridClipPath, "inset(0 0 0 0)", {
      duration: durations.fadeInSequence.grid.duration,
      ease: "easeInOut",
      delay: durations.fadeInSequence.grid.start,
    });

    // Measurement line reveal animation
    animate(measurementLineClipPath, "inset(0 0 0.01% 0)", {
      duration: durations.fadeInSequence.measurementLine.duration,
      ease: "easeInOut",
      delay: durations.fadeInSequence.measurementLine.start,
    });

    // Price line reveal animation
    animate(priceLineOpacity, 1, {
      duration: durations.fadeInSequence.priceLine.duration,
      ease: "easeInOut",
    });

    // Price indicator opacity animation
    animate(priceIndicatorOpacity, 1, {
      delay: durations.fadeInSequence.priceIndicator.start,
      duration: durations.fadeInSequence.priceIndicator.duration,
      ease: "easeInOut",
    });

    // Wait for reveals to complete before starting movement
    await new Promise((resolve) =>
      setTimeout(
        resolve,
        Math.max(
          durations.fadeInSequence.priceLine.duration * 1000 * 0.5,
          durations.fadeInSequence.priceIndicator.duration * 1000 * 0.5,
        ),
      ),
    );

    // Calculate phase2Duration based on distance and speed
    const phase2Duration = calculatePhase2Duration(measurementLineOffset, clipPathWidth, containerRef, isMobile);

    // Horizontal line: Reveal during position animations
    animate(horizontalLineClipPath, 0, {
      duration: phase2Duration, // Same duration as full animation
      ease: "linear",
    });

    const clipPathControls = animate(clipPathWidth, ANIMATION_CONFIG.clipPath.final, {
      duration: phase2Duration,
      ease: "linear",
    });
    clipPathControlsRef.current = clipPathControls;

    const controls = animate(measurementLineOffset, ANIMATION_CONFIG.measurementLine.final * 100, {
      duration: phase2Duration,
      ease: "linear",
    });
    animationControlsRef.current = controls;

    await controls;

    // Fade in price labels only after measurement line reaches final position
    animate(priceLabelsOpacity, 1, { duration: 1, ease: "easeInOut" });

    // Start continuous scrolling after animation completes
    const speedScale = 1; // viewportWidth / 1920;
    const pxPerSecond = ANIMATION_CONFIG.baseSpeed * 60 * speedScale;

    const startContinuousScroll = () => {
      const currentDataWidth = fullPriceData.reduce((width, point) => {
        const segSpeed = point.speed || 1;
        return width + pointSpacing / segSpeed;
      }, 0);

      const currentOffset = scrollOffset.get();
      const remainingWidth = currentDataWidth - currentOffset;
      const scrollDuration = remainingWidth / pxPerSecond;

      const controls = animate(scrollOffset, currentDataWidth, {
        duration: scrollDuration,
        ease: "linear",
        onComplete: () => {
          setTimeout(startContinuousScroll, 0);
        },
      });
      animationControlsRef.current = controls;
    };

    startContinuousScroll();
  }, [
    durations,
    measurementLineOffset,
    horizontalLineClipPath,
    viewportWidth,
    clipPathWidth,
    scrollOffset,
    fullPriceData,
    pointSpacing,
  ]);

  // Handle component visibility with Intersection Observer
  useEffect(() => {
    const currentComponent = componentRef.current;
    if (!currentComponent) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        isComponentVisibleRef.current = isVisible;

        if (!isVisible && !isPausedRef.current) {
          // Component scrolled out of view - pause animations
          isPausedRef.current = true;
          if (animationControlsRef.current) {
            animationControlsRef.current.pause();
          }
          if (clipPathControlsRef.current) {
            clipPathControlsRef.current.pause();
          }
        } else if (isVisible && isPausedRef.current && !document.hidden) {
          // Component scrolled into view and page is visible - resume animations
          setTimeout(() => {
            isPausedRef.current = false;
            if (animationControlsRef.current) {
              animationControlsRef.current.play();
            }
            if (clipPathControlsRef.current) {
              clipPathControlsRef.current.play();
            }
          }, 100);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of component is visible
      },
    );

    observer.observe(currentComponent);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle page visibility changes to pause/resume animations properly
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        // Page is now hidden - pause all animations
        isPausedRef.current = true;
        if (animationControlsRef.current) {
          animationControlsRef.current.pause();
        }
        if (clipPathControlsRef.current) {
          clipPathControlsRef.current.pause();
        }
      } else if (document.visibilityState === "visible") {
        // Page is now visible AND component is visible - resume animations
        if (isComponentVisibleRef.current) {
          // Note: setTimeout/setInterval will be throttled by browser automatically
          isPausedRef.current = false;
          if (animationControlsRef.current) {
            animationControlsRef.current.play();
          }
          if (clipPathControlsRef.current) {
            clipPathControlsRef.current.play();
          }
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Start animation on mount
  useEffect(() => {
    startAnimation();

    return () => {
      if (animationControlsRef.current) {
        animationControlsRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div ref={componentRef} className="flex flex-col items-center justify-around h-full w-full">
      {/* Chart Component */}
      <div ref={containerRef} className={`w-full relative mb-10`} id={"cta-chart"}>
        <svg
          width="100%"
          height={dynamicHeight}
          viewBox={`0 0 ${viewportWidth} ${dynamicHeight}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="20%" stopColor="white" stopOpacity="1" />
              <stop offset="80%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="fadeMask" maskUnits="userSpaceOnUse">
              <rect width="100%" height="100%" fill="url(#fadeGradient)" />
            </mask>
            <linearGradient id="priceLabelsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.1" />
              <stop offset="20%" stopColor="white" stopOpacity="0.3" />
              <stop offset="50%" stopColor="white" stopOpacity="1" />
              <stop offset="80%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
            <mask id="priceLabelsOpacityMask" maskUnits="userSpaceOnUse">
              <rect x="0" y="0" width="100%" height={dynamicHeight} fill="url(#priceLabelsGradient)" />
            </mask>
            <pattern
              id="grid"
              width={ANIMATION_CONFIG.gridSpacing}
              height={ANIMATION_CONFIG.gridSpacing}
              patternUnits="userSpaceOnUse"
              x={gridXOffset}
              y={gridYOffset}
            >
              <path
                d={`M ${ANIMATION_CONFIG.gridSpacing} 0 L 0 0 0 ${ANIMATION_CONFIG.gridSpacing}`}
                fill="none"
                stroke="#D9D9D9"
                strokeWidth={ANIMATION_CONFIG.gridStrokeWidth}
              />
            </pattern>
            {/* Clip path to hide line outside viewport */}
            <clipPath id="viewport">
              <motion.rect x="0" y="0" width={clipPathRectWidth} height={dynamicHeight} />
            </clipPath>
          </defs>
          <motion.rect
            width="100%"
            height="100%"
            fill="url(#grid)"
            mask="url(#fadeMask)"
            style={{
              opacity: gridOpacity,
              clipPath: gridClipPath,
            }}
          />
          {/* Measurement line */}
          <motion.path
            d={`M 0 0 L 0 ${dynamicHeight}`}
            stroke="#387F5C"
            strokeWidth="2"
            strokeDasharray="3,3"
            fill="none"
            mask="url(#fadeMask)"
            style={{
              x: measurementLineX,
              clipPath: measurementLineClipPath,
            }}
          />
          {/* Horizontal reference line at $1.00 - Two-stage reveal */}
          <motion.path
            d={`M 0 ${dynamicHeight * ANIMATION_CONFIG.horizontalReference.position} L ${viewportWidth} ${dynamicHeight * ANIMATION_CONFIG.horizontalReference.position}`}
            stroke={ANIMATION_CONFIG.horizontalReference.color}
            strokeWidth={ANIMATION_CONFIG.horizontalReference.strokeWidth}
            strokeDasharray={ANIMATION_CONFIG.horizontalReference.dashArray}
            fill="none"
            mask="url(#fadeMask)"
            style={{
              clipPath: horizontalLineClipPathStyle,
              opacity: horizontalLineOpacity,
            }}
          />
          {/* Price labels - static positioned to the right of final measurement line position */}
          <motion.g mask="url(#priceLabelsOpacityMask)" style={{ opacity: priceLabelsOpacity }}>
            {priceLabelData.map((labelData) => (
              <motion.text
                key={labelData.price}
                x={viewportWidth * ANIMATION_CONFIG.priceLabels.staticX + ANIMATION_CONFIG.priceLabels.xOffset}
                y={labelData.y}
                fontSize={ANIMATION_CONFIG.priceLabels.fontSize}
                fill={ANIMATION_CONFIG.priceLabels.color}
                textAnchor="start"
              >
                {labelData.label}
              </motion.text>
            ))}
          </motion.g>
          {/* Scrolling price line */}
          <g clipPath="url(#viewport)">
            <motion.path
              d={path}
              fill="none"
              stroke={lineStrokeColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ x, opacity: priceLineOpacity }}
            />
          </g>
        </svg>
        {/* Static transaction floaters - only show during price tracking */}
        {transactionMarkers.map((marker, i) => {
          // Use apex type for smarter positioning, with fallback to original logic
          let positionAbove = false;

          if (marker.apexType) {
            // If positioned at an apex, use the apex type
            positionAbove = marker.apexType === "valley";
          } else {
            // Fallback to original logic for non-apex markers
            if (marker.index > 0 && marker.index < fullPriceData.length) {
              const prev = fullPriceData[marker.index - 1];
              const curr = fullPriceData[marker.index];
              if (prev && curr && curr.value !== prev.value) {
                positionAbove = curr.value > prev.value;
              } else if (marker.index < fullPriceData.length - 1) {
                const next = fullPriceData[marker.index + 1];
                if (next && curr) {
                  positionAbove = curr.value > next.value;
                }
              }
            }
          }
          return (
            <FloaterContainer
              key={marker.id}
              marker={marker}
              x={x}
              viewportWidth={viewportWidth}
              positionAbove={positionAbove}
              isFirst={i === 0}
              measurementX={measurementX}
            />
          );
        })}
        {/* Current measurement point */}
        <motion.div
          className="absolute -ml-[0.625rem] -mt-[0.625rem] z-10 rounded-full w-5 h-5 shadow-lg"
          style={{
            left: measurementX,
            top: currentY,
            pointerEvents: "none",
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: lineStrokeColor,
            backgroundColor: lineStrokeColor,
            boxShadow: `0 0 10px ${lineStrokeColor}, 0 0 4.32px ${lineStrokeColor}, 0 0 2.16px ${lineStrokeColor}`,
            opacity: priceIndicatorOpacity,
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="w-full h-full rounded-full bg-white" />
        </motion.div>
      </div>
    </div>
  );
}
