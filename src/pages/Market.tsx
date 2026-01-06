import PodIcon from "@/assets/protocol/Pod.png";
import PintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { Col } from "@/components/Container";
import FrameAnimator from "@/components/LoadingSpinner";
import { ContextMenu } from "@/components/MarketContextMenu";
import PodLineGraph from "@/components/PodLineGraph";
import PodScoreGradientLegend from "@/components/PodScoreGradientLegend";
import ReadMoreAccordion from "@/components/ReadMoreAccordion";
import ScatterChart, { PointClickPayload, PointHoverPayload, ScatterChartRef } from "@/components/charts/ScatterChart";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import useNavHeight from "@/hooks/display/useNavHeight";
import { useAllMarket } from "@/state/market/useAllMarket";
import { useHarvestableIndex, usePodLine } from "@/state/useFieldData";
import { trackSimpleEvent } from "@/utils/analytics";
import { calculatePodScore } from "@/utils/podScore";
import { buildPodScoreColorScaler } from "@/utils/podScoreColorScaler";
import { ActiveElement, ChartEvent, PointStyle, TooltipOptions } from "chart.js";
import { Chart } from "chart.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AllActivityTable } from "./market/AllActivityTable";
import { FarmerActivityTable } from "./market/FarmerActivityTable";
import MarketModeSelect from "./market/MarketModeSelect";
import { PodListingsTable } from "./market/PodListingsTable";
import { PodOrdersTable } from "./market/PodOrdersTable";
import CreateListing, { PodListingData } from "./market/actions/CreateListing";
import CreateOrder from "./market/actions/CreateOrder";
import FillListing from "./market/actions/FillListing";
import FillOrder from "./market/actions/FillOrder";

// Constants
const TABLE_SLUGS = ["activity", "listings", "orders", "my-activity"];
const TABLE_LABELS = ["Activity", "Listings", "Orders", "My Activity"];

const MILLION = 1_000_000;
const TOOLTIP_Z_INDEX = 50;
const CHART_MAX_PRICE = 100;
// Only use listings with at least this many Pods remaining when computing the Pod Score color range.
const MIN_REMAINING_PODS_FOR_POD_SCORE_RANGE = 25;

// Responsive breakpoints for tooltip positioning
const BREAKPOINT_XL = 1600;
const BREAKPOINT_LG = 1100;

const TOOLTIP_OFFSET = {
  TOP: { XL: 15, LG: 15, DEFAULT: 15 },
  BOTTOM: { XL: 15, LG: 15, DEFAULT: 15 },
};

const getPointTopOffset = (): number => {
  const width = window.innerWidth;
  if (width > BREAKPOINT_XL) return TOOLTIP_OFFSET.TOP.XL;
  if (width > BREAKPOINT_LG) return TOOLTIP_OFFSET.TOP.LG;
  return TOOLTIP_OFFSET.TOP.DEFAULT;
};

const getPointBottomOffset = (): number => {
  const width = window.innerWidth;
  if (width > BREAKPOINT_XL) return TOOLTIP_OFFSET.BOTTOM.XL;
  if (width > BREAKPOINT_LG) return TOOLTIP_OFFSET.BOTTOM.LG;
  return TOOLTIP_OFFSET.BOTTOM.DEFAULT;
};

type MarketScatterChartDataPoint = {
  x: number;
  y: number;
  eventId: string;
  eventType: "ORDER" | "LISTING";
  status: string;
  amount: number;
  placeInLine: number;
  eventIndex?: number;
  podScore?: number;
  color?: string;
  remainingAmount?: number;
};

type MarketScatterChartData = {
  label: "Orders" | "Listings" | "Selected Plots";
  data: MarketScatterChartDataPoint[];
  color: string;
  pointStyle: PointStyle;
  pointRadius: number;
  pointBorderColor?: string;
  pointBorderWidth?: number;
};

/**
 * Transforms raw market data into scatter chart format with Pod Score coloring
 */
const shapeScatterChartData = (data: any[], harvestableIndex: TokenValue): MarketScatterChartData[] => {
  if (!data) return [];

  const result = data.reduce(
    (acc, event) => {
      // Skip Fill Orders
      if ("toFarmer" in event) {
        return acc;
      }

      const price = event.pricePerPod.toNumber();
      const eventId = event.id;
      const eventType: "ORDER" | "LISTING" = event.type as "ORDER" | "LISTING";

      if ("beanAmount" in event) {
        // Handle Orders
        const amount = event.beanAmount.div(event.pricePerPod).toNumber();
        const fillPct = event.beanAmountFilled.div(event.beanAmount).mul(100).toNumber();
        const status = fillPct > 99 ? "FILLED" : event.status === "CANCELLED_PARTIAL" ? "CANCELLED" : event.status;
        const placeInLine = event.maxPlaceInLine.toNumber();

        if (status === "ACTIVE" && placeInLine !== null && price !== null) {
          acc[0].data.push({
            x: placeInLine / MILLION,
            y: price,
            eventId,
            eventType,
            status,
            amount,
            placeInLine,
          });
        }
      } else if ("originalAmount" in event) {
        // Handle Listings
        const amount = event.originalAmount.toNumber();
        const remainingAmount = event.remainingAmount?.toNumber?.() ?? 0;
        const fillPct = event.filled.div(event.originalAmount).mul(100).toNumber();
        const status = fillPct > 99 ? "FILLED" : event.status === "CANCELLED_PARTIAL" ? "CANCELLED" : event.status;
        const placeInLine = status === "ACTIVE" ? event.index.sub(harvestableIndex).toNumber() : null;
        const eventIndex = event.index.toNumber();

        if (placeInLine !== null && price !== null) {
          // Calculate Pod Score for the listing
          // Use placeInLine in millions for consistent scaling with chart x-axis
          const podScore = calculatePodScore(price, placeInLine / MILLION);

          acc[1].data.push({
            x: placeInLine / MILLION,
            y: price,
            eventId,
            eventIndex,
            eventType,
            status,
            amount,
            placeInLine,
            podScore,
            remainingAmount,
          });
        }
      }

      return acc;
    },
    [
      {
        label: "Orders",
        data: [] as MarketScatterChartDataPoint[],
        color: "#5CB8A9", // teal
        pointStyle: "circle" as PointStyle,
        pointRadius: 6,
      },
      {
        label: "Listings",
        data: [] as MarketScatterChartDataPoint[],
        color: "#e0b57d", // tan (fallback)
        pointStyle: "rect" as PointStyle,
        pointRadius: 6,
      },
    ],
  );

  // Apply Pod Score coloring to listings
  // Extract all listing Pod Scores (filter out undefined values)
  const listingScores = result[1].data
    .filter((p) => (p.remainingAmount ?? 0) >= MIN_REMAINING_PODS_FOR_POD_SCORE_RANGE)
    .map((point) => point.podScore)
    .filter((score): score is number => score !== undefined);

  // Build color scaler from listing scores
  const colorScaler = buildPodScoreColorScaler(listingScores);

  // Map through listings and apply colors
  result[1].data = result[1].data.map((point) => ({
    ...point,
    color: point.podScore !== undefined ? colorScaler.toColor(point.podScore) : "#e0b57d", // Fallback color for invalid Pod Scores
  }));

  return result;
};

export function Market() {
  const { mode, id } = useParams();
  const [tab, handleChangeTab] = useState(TABLE_SLUGS[0]);
  const [isCrosshairFrozen, setIsCrosshairFrozen] = useState(false);
  const [chartKey, setChartKey] = useState(0); // Force chart re-render
  const [isNavigating, setIsNavigating] = useState(false); // Track navigation state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    clickedCoords: { x: number; y: number };
    chartBounds: DOMRect;
  } | null>(null);
  const [isContextMenuClosing, setIsContextMenuClosing] = useState(false);
  const isNavigatingRef = useRef(false);
  const isCrosshairFrozenRef = useRef(false);
  const chartRef = useRef<ScatterChartRef>(null);
  const hoverInfoRef = useRef<HTMLDivElement>(null);
  const lastPositionSideRef = useRef<{ isRight: boolean; isAbove: boolean } | null>(null);
  const navigate = useNavigate();
  const { data, isLoaded } = useAllMarket();
  const podLine = usePodLine();
  const podLineAsNumber = podLine.toNumber() / MILLION;
  // Chart rounds X max to nearest 10 (not ceil), so we need to match that for validation
  const chartXMax = Math.round((podLineAsNumber / 10) * 10);
  const harvestableIndex = useHarvestableIndex();
  const navHeight = useNavHeight();

  const [mounted, setMounted] = useState(false);
  const [selectedPlotData, setSelectedPlotData] = useState<{
    listingData: PodListingData[];
    pricePerPod: number;
  } | null>(null);

  // Selected listing/order data for fill components
  const [selectedListingData, setSelectedListingData] = useState<{
    listingId: string;
    placeInLine?: number;
  } | null>(null);
  const [selectedOrderData, setSelectedOrderData] = useState<{
    orderId: string;
  } | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 3000);
  }, []);

  // Transform selected plots to chart points
  const transformSelectedPlotsToChartPoints = useCallback(
    (
      selectedPlotData: { listingData: PodListingData[]; pricePerPod: number } | null,
    ): MarketScatterChartDataPoint[] => {
      if (!selectedPlotData) return [];

      return selectedPlotData.listingData.map((data) => {
        const placeInLine = data.index.sub(harvestableIndex).toNumber();
        const placeInLineMillions = placeInLine / MILLION;
        const podScore = calculatePodScore(selectedPlotData.pricePerPod, placeInLineMillions);

        return {
          x: placeInLineMillions,
          y: selectedPlotData.pricePerPod,
          eventId: `selected-${data.index.toHuman()}-${data.start.toHuman()}`,
          eventType: "LISTING" as const,
          status: "ACTIVE",
          amount: data.amount.toNumber(),
          placeInLine,
          podScore,
        };
      });
    },
    [harvestableIndex],
  );

  const scatterChartData: MarketScatterChartData[] = useMemo(() => {
    const baseData = shapeScatterChartData(data || [], harvestableIndex);

    // Add selected plots dataset if available
    if (!selectedPlotData || selectedPlotData.listingData.length === 0 || selectedPlotData.pricePerPod <= 0) {
      return baseData;
    }

    const selectedPlotPoints = transformSelectedPlotsToChartPoints(selectedPlotData);

    if (selectedPlotPoints.length === 0) {
      return baseData;
    }

    // Get Pod Scores from existing listings
    const existingListingScores = baseData[1].data
      .filter((p) => (p.remainingAmount ?? 0) >= MIN_REMAINING_PODS_FOR_POD_SCORE_RANGE)
      .map((point) => point.podScore)
      .filter((score): score is number => score !== undefined);

    // Build color scaler from existing listings
    const colorScaler = buildPodScoreColorScaler(existingListingScores);

    // Apply Pod Score coloring to selected plots
    const selectedPlotPointsWithColors = selectedPlotPoints.map((point) => ({
      ...point,
      color: point.podScore !== undefined ? colorScaler.toColor(point.podScore) : "#e0b57d",
    }));

    // Create selected plots dataset
    const selectedPlotsDataset: MarketScatterChartData = {
      label: "Selected Plots",
      data: selectedPlotPointsWithColors,
      color: "#e0b57d", // fallback color
      pointStyle: "rect" as PointStyle,
      pointRadius: 6,
      pointBorderColor: "#FF0000", // pinto-red-2 from tailwind config
      pointBorderWidth: 1, // 1px border
    };

    return [...baseData, selectedPlotsDataset];
  }, [data, harvestableIndex, selectedPlotData, transformSelectedPlotsToChartPoints]);

  // Generate unique key for chart when selectedPlotData changes
  const chartDataKey = useMemo(() => {
    if (!selectedPlotData || selectedPlotData.listingData.length === 0) {
      return chartKey;
    }
    // Use length, first plot index, and pricePerPod for a lightweight unique identifier
    const firstPlot = selectedPlotData.listingData[0];
    return `${chartKey}-${selectedPlotData.listingData.length}-${firstPlot.index.toHuman()}-${firstPlot.start.toHuman()}-${selectedPlotData.pricePerPod}`;
  }, [chartKey, selectedPlotData]);

  // Keep ref in sync with state and hide hover info when frozen
  useEffect(() => {
    isCrosshairFrozenRef.current = isCrosshairFrozen;
    if (isCrosshairFrozen && hoverInfoRef.current) {
      hoverInfoRef.current.style.display = "none";
    }
  }, [isCrosshairFrozen]);

  // Hide hover info on scroll with smooth fade-out animation
  useEffect(() => {
    const handleScroll = () => {
      // Hide custom hover info with smooth fade-out
      if (hoverInfoRef.current && hoverInfoRef.current.style.display !== "none") {
        // Remove fade-in animation if present
        hoverInfoRef.current.classList.remove("animate-fade-in-smooth");

        // Add fade-out animation
        hoverInfoRef.current.classList.add("animate-fade-out-smooth");
        lastPositionSideRef.current = null;

        // Hide after animation completes (0.2s as per tailwind config)
        setTimeout(() => {
          if (hoverInfoRef.current) {
            hoverInfoRef.current.style.display = "none";
            hoverInfoRef.current.classList.remove("animate-fade-out-smooth");
          }
        }, 200);
      }

      // Hide Chart.js tooltip with smooth fade
      const chartjsTooltip = document.getElementById("chartjs-tooltip");
      if (chartjsTooltip && chartjsTooltip.style.opacity !== "0") {
        chartjsTooltip.style.transition = "opacity 0.2s ease-in";
        chartjsTooltip.style.opacity = "0";
      }
    };

    // Listen to scroll events on window and chart container
    window.addEventListener("scroll", handleScroll, true); // Use capture phase to catch all scroll events
    window.addEventListener("wheel", handleScroll, { passive: true }); // Also listen to wheel events for smooth scrolling

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  const toolTipOptions: Partial<TooltipOptions> = useMemo(
    () => ({
      enabled: false,
      external: (context) => {
        const tooltipEl = document.getElementById("chartjs-tooltip");

        // Create element on first render
        if (!tooltipEl) {
          const div = document.createElement("div");
          div.id = "chartjs-tooltip";
          div.style.background = "rgba(0, 0, 0, 0.7)";
          div.style.borderRadius = "3px";
          div.style.color = "white";
          div.style.opacity = "1";
          div.style.pointerEvents = "none";
          div.style.position = "absolute";
          div.style.transform = "translate(15px)"; // Position to right of point
          div.style.transition = "opacity .2s ease";
          document.body.appendChild(div);
        } else {
          // Hide if no tooltip
          if (context.tooltip.opacity === 0) {
            tooltipEl.style.opacity = "0";
            return;
          }

          // Set Text
          if (context.tooltip.body) {
            const position = context.tooltip.dataPoints[0].element.getProps(["x", "y"], true);
            const dataPoint = context.tooltip.dataPoints[0].raw as MarketScatterChartDataPoint;
            tooltipEl.style.opacity = "1";
            tooltipEl.style.width = "250px";
            tooltipEl.style.backgroundColor = "white";
            tooltipEl.style.color = "black";
            tooltipEl.style.borderRadius = "10px";
            tooltipEl.style.border = "1px solid #D9D9D9";
            tooltipEl.style.zIndex = String(TOOLTIP_Z_INDEX);
            // Get canvas position to account for scroll offset
            const canvasPosition = context.chart.canvas.getBoundingClientRect();
            // Basically all of this is custom logic for 3 different breakpoints to either display the tooltip to the top right or bottom right of the point.
            const topOfPoint = canvasPosition.top + position.y + getPointTopOffset();
            const bottomOfPoint = canvasPosition.top + position.y + getPointBottomOffset();
            tooltipEl.style.top = (dataPoint.y > 0.8 ? bottomOfPoint : topOfPoint) + "px"; // Position relative to point y
            // end custom logic
            tooltipEl.style.left = canvasPosition.left + position.x + "px"; // Position relative to point x
            tooltipEl.style.padding = context.tooltip.options.padding + "px " + context.tooltip.options.padding + "px";
            const listingHeader = `
           <div class="flex items-center">
            <img src="${PodIcon}" class="w-4 h-4 scale-110 mr-[6px]" alt="pod icon">
            <span>${TokenValue.fromHuman(dataPoint.amount, 0).toHuman("short")} Pods Listed</span>
          </div>
          `;
            const orderHeader = `
          <div class="flex items-center">
           <img src="${PodIcon}" class="w-4 h-4 scale-110 mr-[6px]" alt="pod icon">
           <span>Order for ${TokenValue.fromHuman(dataPoint.amount, 0).toHuman("short")} Pods</span>
         </div>
         `;
            // Format Pod Score for display (only for listings)
            const formatPodScore = (score: number): string => {
              if (score >= 1000000) {
                return `${(score / 1000000).toFixed(2)}M`;
              } else if (score >= 1000) {
                return `${(score / 1000).toFixed(1)}K`;
              } else {
                return score.toFixed(2);
              }
            };

            const podScoreRow =
              dataPoint.eventType === "LISTING" && dataPoint.podScore !== undefined
                ? `<div class="flex justify-between">
                <span>Pod Score:</span>
                <span>${formatPodScore(dataPoint.podScore)}</span>
              </div>`
                : "";

            tooltipEl.innerHTML = `
            <div class="flex flex-col">
            ${dataPoint.eventType === "LISTING" ? listingHeader : orderHeader}
              <div class="flex justify-between">
                <p>Price:</p>
                <div class="flex items-center">
                  <img src="${PintoIcon}" class="w-4 h-4 scale-110 mr-[6px]" alt="pinto icon">
                  <p>${dataPoint.y}</p>
                </div>
              </div>
              <div class="flex justify-between">
                <span>Place in Line:</span>
                <span>${TokenValue.fromHuman(dataPoint.placeInLine, 0).toHuman("long")}</span>
              </div>
              ${podScoreRow}
            </div>
        `;
          }
        }
      },
    }),
    [],
  );

  // Upon initial page load only, navigate to a page other than Activity if the url is granular.
  // In general it is allowed to be on Activity tab with these granular urls, hence the empty dependency array.
  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally run on initial mount only. `mode` will be populated.
  useEffect(() => {
    if (mode === "buy") {
      handleChangeTab(TABLE_SLUGS[1]);
    } else if (mode === "sell") {
      handleChangeTab(TABLE_SLUGS[2]);
    }
  }, []);

  useEffect(() => {
    if (mode === "buy" && !id) {
      navigate("/market/pods/buy/fill", { replace: true });
    } else if (mode === "sell" && !id) {
      navigate("/market/pods/sell/create", { replace: true });
    }
  }, [id, mode, navigate]);

  // Clear preview plots and unfreeze chart when route changes away from create listing
  // Also unfreeze when switching between listing/selling pages
  useEffect(() => {
    if (mode !== "sell" || id !== "create") {
      setSelectedPlotData(null);
      // Unfreeze chart if frozen (use ref to get current state)
      if (isCrosshairFrozenRef.current) {
        chartRef.current?.unfreeze();
        setIsCrosshairFrozen(false);
      }
      // Close context menu if open
      setContextMenu(null);
    }
  }, [mode, id]);

  // Clear freezed state when switching between any pages (listing/selling)
  useEffect(() => {
    console.log("Tab changed:", tab, "isCrosshairFrozen state:", isCrosshairFrozen, "isNavigating:", isNavigating);
    // Only reset chart if not navigating (user manually changed tab)
    if (!isNavigating) {
      console.log("Unfreezing chart due to tab change");
      setIsCrosshairFrozen(false);

      // Force chart re-render to clear frozen state
      setChartKey((prev) => prev + 1);

      // Clear selected data when switching tabs
      setSelectedListingData(null);
      setSelectedOrderData(null);
    }
    // Always close context menu
    setContextMenu(null);

    // Reset navigation flag
    setIsNavigating(false);
  }, [tab]);

  // Clear freezed state when switching between Buy/Sell modes
  useEffect(() => {
    console.log("Mode changed:", mode, "isCrosshairFrozen state:", isCrosshairFrozen, "isNavigating:", isNavigating);
    // Only reset chart if not navigating (user manually changed mode)
    if (!isNavigating) {
      console.log("Unfreezing chart due to mode change");
      setIsCrosshairFrozen(false);

      // Force chart re-render to clear frozen state
      setChartKey((prev) => prev + 1);

      // Clear selected data when switching modes
      setSelectedListingData(null);
      setSelectedOrderData(null);
    }
    // Always close context menu
    setContextMenu(null);

    // Reset navigation flag
    setIsNavigating(false);
  }, [mode]);

  const handleChangeTabFactory = useCallback(
    (selection: string) => () => {
      // Track activity tab changes
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.ACTIVITY_TAB_CLICK, {
        previous_tab: tab,
        new_tab: selection,
      });

      if (selection === TABLE_SLUGS[1]) {
        setIsNavigating(true);
        navigate(`/market/pods/buy/fill`);
      } else if (selection === TABLE_SLUGS[2]) {
        setIsNavigating(true);
        navigate(`/market/pods/sell/fill`);
      }
      handleChangeTab(selection);
    },
    [navigate, tab],
  );

  const handleSecondaryTabClick = useCallback(
    (v: string) => {
      if (v === "fill") {
        handleChangeTab(mode === "buy" ? TABLE_SLUGS[1] : TABLE_SLUGS[2]);
      }
    },
    [mode],
  );

  const onHover = useCallback(
    (payload: PointHoverPayload | null) => {
      if (!hoverInfoRef.current) return;

      // Don't show hover info when crosshair is frozen (use ref for always-current value)
      if (isCrosshairFrozenRef.current) {
        hoverInfoRef.current.style.display = "none";
        return;
      }

      if (!payload) {
        // Remove fade-in animation if present
        hoverInfoRef.current.classList.remove("animate-fade-in-smooth");

        // Add fade-out animation for smooth disappearance
        hoverInfoRef.current.classList.add("animate-fade-out-smooth");
        lastPositionSideRef.current = null;

        // Hide after animation completes (0.2s as per tailwind config)
        setTimeout(() => {
          if (hoverInfoRef.current) {
            hoverInfoRef.current.style.display = "none";
            hoverInfoRef.current.classList.remove("animate-fade-out-smooth");
          }
        }, 200);
        return;
      }

      // Direct DOM manipulation - NO React state updates = NO re-renders!
      const { hoverXY, pixelXY, chartBounds } = payload;

      // Validate that hover is within chart bounds (min/max)
      // Chart rounds X max to nearest 10, use chartXMax for accurate validation
      if (hoverXY.x < 0 || hoverXY.x > chartXMax || hoverXY.y < 0 || hoverXY.y > 1) {
        hoverInfoRef.current.style.display = "none";
        return;
      }

      // Check if this is initial show (display was none)
      const wasHidden = hoverInfoRef.current.style.display === "none";

      // Update text content first
      const priceSpan = hoverInfoRef.current.querySelector("[data-price]");
      const placeSpan = hoverInfoRef.current.querySelector("[data-place]");

      if (priceSpan) {
        priceSpan.textContent = hoverXY.y.toFixed(6);
      }
      if (placeSpan) {
        placeSpan.textContent = `${hoverXY.x.toFixed(2)}M`;
      }

      // Make sure element is visible for dimension calculation (but positioned off-screen temporarily)
      hoverInfoRef.current.style.display = "flex";
      hoverInfoRef.current.style.left = "-9999px";
      hoverInfoRef.current.style.top = "-9999px";

      // Force a reflow to get accurate dimensions
      const rect = hoverInfoRef.current.getBoundingClientRect();
      const infoWidth = rect.width;
      const infoHeight = rect.height;

      // Default offsets - start at (4, 4) from cursor
      const offsetX = 4;
      const offsetY = 4;

      // Start with default position (right and above cursor)
      let left = pixelXY.x + offsetX;
      let top = pixelXY.y - offsetY - infoHeight; // Above cursor with offset

      // Use chart bounds if available, otherwise use viewport
      const viewportWidth = chartBounds?.right || window.innerWidth;
      const viewportHeight = chartBounds?.bottom || window.innerHeight;
      const minX = chartBounds?.left || 0;
      const minY = chartBounds?.top || 0;

      // Detect which edges are overflowing
      const overflowTop = top < minY + 10;
      const overflowRight = left + infoWidth > viewportWidth - 10;
      const overflowBottom = top + infoHeight > viewportHeight - 10;
      const overflowLeft = left < minX + 10;

      // Handle combinations of overflows
      if (overflowTop && overflowRight) {
        // Top-right corner: component's top-right corner at (-4, 4)
        left = pixelXY.x - infoWidth - 4;
        top = pixelXY.y + 4;
      } else if (overflowTop) {
        // Top edge only: component's top-left corner at (4, 4)
        left = pixelXY.x + 4;
        top = pixelXY.y + 4;
        // Check if also overflowing right edge while at top
        if (left + infoWidth > viewportWidth - 10) {
          left = pixelXY.x - infoWidth - 4;
        }
      } else if (overflowRight) {
        // Right edge: default to top-right corner (2nd quadrant) at (-4, -4)
        left = pixelXY.x - infoWidth - 4;
        top = pixelXY.y - infoHeight - 4; // Component's bottom-right corner at mouse

        // If not enough space above mouse, flip to below (3rd quadrant)
        if (pixelXY.y - infoHeight - 4 < minY + 10) {
          top = pixelXY.y + 4; // Component's top-right corner below mouse
        }
      } else if (overflowBottom) {
        // Bottom edge only: component's bottom-left corner at (4, -4)
        top = pixelXY.y - infoHeight - 4;
      } else if (overflowLeft) {
        // Left edge: push right
        left = minX + 10;
      }

      // Make sure it's visible
      hoverInfoRef.current.style.display = "flex";

      // Round positions
      const roundedLeft = Math.round(left);
      const roundedTop = Math.round(top);

      // Determine which side of cursor the info is on
      const isRight = roundedLeft > pixelXY.x;
      const isAbove = roundedTop < pixelXY.y;

      // Check if we flipped sides (right/left or above/below)
      const sideChanged =
        lastPositionSideRef.current &&
        (lastPositionSideRef.current.isRight !== isRight || lastPositionSideRef.current.isAbove !== isAbove);

      // Apply final position
      hoverInfoRef.current.style.left = `${roundedLeft}px`;
      hoverInfoRef.current.style.top = `${roundedTop}px`;

      // Only animate on first show or when flipping sides
      if (wasHidden || sideChanged) {
        // Update last side
        lastPositionSideRef.current = { isRight, isAbove };

        // Trigger animation
        hoverInfoRef.current.classList.remove("animate-fade-in-smooth");
        void hoverInfoRef.current.offsetHeight;
        hoverInfoRef.current.classList.add("animate-fade-in-smooth");
      }
    },
    [chartXMax],
  );

  const handleUnfreezeAndNavigate = useCallback(
    (path: string, state: any) => {
      // Mark that we're navigating so onClose doesn't unfreeze again
      isNavigatingRef.current = true;
      setIsNavigating(true);

      // Trigger closing animation
      setIsContextMenuClosing(true);

      // Wait for animation to complete before unfreezing and navigating
      setTimeout(() => {
        chartRef.current?.unfreeze();
        setIsCrosshairFrozen(false);
        setContextMenu(null);
        setIsContextMenuClosing(false);
        navigate(path, { state });

        // Reset flag after navigation
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 100);
      }, 200); // Match fade-out animation duration
    },
    [navigate],
  );

  const contextMenuOptions = useMemo(() => {
    if (!contextMenu) return [];

    return [
      {
        label: "Create Order",
        onClick: () => {
          handleUnfreezeAndNavigate("/market/pods/buy/create", {
            prefillPrice: contextMenu.clickedCoords.y,
            prefillPlaceInLine: contextMenu.clickedCoords.x,
          });
        },
      },
      {
        label: "Create Listing",
        onClick: () => {
          handleUnfreezeAndNavigate("/market/pods/sell/create", {
            prefillPrice: contextMenu.clickedCoords.y,
            prefillPlaceInLine: contextMenu.clickedCoords.x,
            prefillExpiresIn: contextMenu.clickedCoords.x,
          });
        },
      },
    ];
  }, [contextMenu, handleUnfreezeAndNavigate]);

  const onPointClick = (payload: PointClickPayload) => {
    // Ignore clicks on selected plots (they should only show hover info, not be clickable)
    if (payload.activeElement) {
      const dataPoint = payload.activeElement.dataPoint as any;
      if (dataPoint?.eventId?.startsWith("selected-")) {
        return; // Selected plots are not clickable, only hoverable
      }
    }

    // If this click unfroze the chart, close context menu with animation
    if (payload.wasUnfrozen) {
      // Trigger closing animation
      setIsContextMenuClosing(true);

      // Wait for animation to complete before closing
      setTimeout(() => {
        setContextMenu(null);
        setIsContextMenuClosing(false);
      }, 200);

      // If clicked on a pod while frozen, still navigate after unfreezing
      if (payload.activeElement) {
        const dataPoint = payload.activeElement.dataPoint as any;
        if (!dataPoint) return;

        trackSimpleEvent(ANALYTICS_EVENTS.MARKET.CHART_POINT_CLICK, {
          event_type: dataPoint?.eventType?.toLowerCase() ?? "unknown",
          event_status: dataPoint?.status?.toLowerCase() ?? "unknown",
          price_per_pod: dataPoint?.y ?? 0,
          place_in_line_millions: Math.floor(dataPoint?.x ?? -1),
          current_mode: !mode || mode === "buy" ? "buy" : "sell",
        });

        if (dataPoint.eventType === "LISTING") {
          // Set selected listing data instead of navigating
          const placeInLine = dataPoint.placeInLine;
          setSelectedListingData({
            listingId: dataPoint.eventId,
            placeInLine: placeInLine || undefined,
          });
          // Switch to buy mode and listings tab
          if (mode !== "buy") {
            setIsNavigating(true);
            navigate("/market/pods/buy/fill");
          }
          handleChangeTab(TABLE_SLUGS[1]); // Switch to listings tab
        } else {
          // Set selected order data instead of navigating
          setSelectedOrderData({
            orderId: dataPoint.eventId,
          });
          // Switch to sell mode and orders tab
          if (mode !== "sell") {
            setIsNavigating(true);
            navigate("/market/pods/sell/fill");
          }
          handleChangeTab(TABLE_SLUGS[2]); // Switch to orders tab
        }
      }
      return;
    }

    // If clicked on a data point (and not frozen), navigate to detail page
    if (payload.activeElement) {
      const dataPoint = payload.activeElement.dataPoint as any;

      if (!dataPoint) return;

      // Track chart point click event
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.CHART_POINT_CLICK, {
        event_type: dataPoint?.eventType?.toLowerCase() ?? "unknown",
        event_status: dataPoint?.status?.toLowerCase() ?? "unknown",
        price_per_pod: dataPoint?.y ?? 0,
        place_in_line_millions: Math.floor(dataPoint?.x ?? -1),
        current_mode: !mode || mode === "buy" ? "buy" : "sell",
      });

      if (dataPoint.eventType === "LISTING") {
        // Set selected listing data instead of navigating
        const placeInLine = dataPoint.placeInLine;
        setSelectedListingData({
          listingId: dataPoint.eventId,
          placeInLine: placeInLine || undefined,
        });
        // Switch to buy mode and listings tab
        if (mode !== "buy") {
          setIsNavigating(true);
          navigate("/market/pods/buy/fill");
        }
        handleChangeTab(TABLE_SLUGS[1]); // Switch to listings tab
      } else {
        // Set selected order data instead of navigating
        setSelectedOrderData({
          orderId: dataPoint.eventId,
        });
        // Switch to sell mode and orders tab
        if (mode !== "sell") {
          setIsNavigating(true);
          navigate("/market/pods/sell/fill");
        }
        handleChangeTab(TABLE_SLUGS[2]); // Switch to orders tab
      }
      return;
    }

    // If clicked on empty space, sync context menu with freeze state
    if (payload.clickedXY && payload.rawEvent.native) {
      const nativeEvent = payload.rawEvent.native as MouseEvent;

      // Check if context menu is currently open to determine action
      if (!contextMenu) {
        // No context menu open - open it (freezing)
        // Track context menu open event
        trackSimpleEvent(ANALYTICS_EVENTS.MARKET.CONTEXT_MENU_OPEN, {
          price_per_pod: payload.clickedXY.y,
          place_in_line_millions: Math.floor(payload.clickedXY.x),
          current_mode: viewMode,
        });

        setContextMenu({
          x: nativeEvent.clientX,
          y: nativeEvent.clientY,
          clickedCoords: payload.clickedXY,
          chartBounds: payload.chartBounds,
        });
        setIsContextMenuClosing(false); // Reset closing state for new menu
      } else {
        // Context menu is open - close it with animation (unfreezing)
        setIsContextMenuClosing(true);

        setTimeout(() => {
          setContextMenu(null);
          setIsContextMenuClosing(false);
        }, 200);
      }
    }
  };

  const handleMarketPodLineGraphSelect = useCallback(
    (plotIndices: string[]) => {
      if (plotIndices.length === 0) return;

      // Track analytics
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.LISTING_PLOT_SELECTED, {
        plot_count: plotIndices.length,
        source: "market_page",
      });

      // Navigate to CreateListing with plot indices (not full Plot objects to avoid serialization issues)
      navigate("/market/pods/sell/create", {
        state: { selectedPlotIndices: plotIndices },
      });
    },
    [navigate],
  );

  // Default to buy/fill when no mode is selected
  const viewMode = mode || "buy";
  const viewAction = id || (viewMode === "buy" ? "fill" : "create");

  console.log("Chart Ref", chartRef.current);

  return (
    <>
      <div className="sm:hidden mt-[100px] flex flex-col gap-4 items-center justify-center">
        <p className="text-center text-gray-500">Your screen size is too small to access the Pod Market.</p>
        <p className="hidden sm:block text-center text-gray-500">
          If you're on Desktop, zoom out on your browser to access the Pod Market.
        </p>
      </div>
      <div className="hidden sm:block">
        <div className={`flex flex-col`}>
          <Col className="gap-4 mx-4 mb-8">
            <div className="flex flex-col gap-4">
              <div className="pinto-h2 sm:pinto-h1">Market</div>
              <div className="pinto-sm sm:pinto-body-light text-pinto-light sm:text-pinto-light">
                Buy and sell Pods on the open market.
              </div>
            </div>
            <ReadMoreAccordion defaultOpen={false} inline>
              The Pod Market is a decentralized marketplace where users can trade Pods, which are protocol-native debt
              instruments that represent future Pinto tokens. When you buy Pods, you're essentially purchasing the right
              to redeem them for Pinto tokens at a fixed rate when they become harvestable. The market operates on a
              first-in-first-out (FIFO) basis, meaning the oldest Pods become harvestable first. You can place buy
              orders to acquire Pods at a specific price, or create listings to sell your existing Pods to other users.
              The scatter chart above visualizes all active orders and listings, showing their place in line and price
              per Pod. This allows you to see market depth and make informed trading decisions based on current market
              conditions and your investment strategy.
            </ReadMoreAccordion>
          </Col>
          <Separator />
          <div className="flex flex-row mt-4 ">
            <div className="flex flex-col flex-grow ml-4 border-r border-pinto-gray-2 pr-4">
              <div className="w-full h-[75vh] relative mt-4">
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                    <FrameAnimator className="-mt-5 -mb-12" size={80} />
                  </div>
                )}
                <ScatterChart
                  key={chartDataKey}
                  ref={chartRef}
                  data={scatterChartData}
                  xOptions={{ label: "Place in line", min: 0, max: chartXMax }}
                  yOptions={{ label: "Price per pod", min: 0, max: 1 }}
                  onPointClick={onPointClick}
                  onHover={onHover}
                  onFreezeChange={setIsCrosshairFrozen}
                  toolTipOptions={toolTipOptions as TooltipOptions}
                />

                {/* Gradient Legend - positioned in top-right corner */}
                <div className="absolute top-5 right-6 z-50">
                  <PodScoreGradientLegend />
                </div>
              </div>
              <div className="mb-4 pr-[12px]">
                <PodLineGraph className="h-24" onPlotGroupSelect={handleMarketPodLineGraphSelect} labelType="title" />
              </div>
              <div className="flex gap-10 ml-2.5 mt-4 mb-[1.625rem]">
                {TABLE_SLUGS.map((s, idx) => (
                  <p
                    key={s}
                    className={`pinto-h4 cursor-pointer ${s === tab ? "text-pinto-primary" : "text-pinto-light hover:text-pinto-green-3"}`}
                    onClick={handleChangeTabFactory(s)}
                  >
                    {TABLE_LABELS[idx]}
                  </p>
                ))}
              </div>
              <Separator />
              <div className="flex-grow overflow-auto scrollbar-none -ml-4 -mr-4 max-h-[40rem] overscroll-auto">
                {tab === TABLE_SLUGS[0] && <AllActivityTable />}
                {tab === TABLE_SLUGS[1] && <PodListingsTable />}
                {tab === TABLE_SLUGS[2] && <PodOrdersTable />}
                {tab === TABLE_SLUGS[3] && <FarmerActivityTable />}
              </div>
            </div>
            <div
              className="flex flex-col self-start px-4 py-4 sticky w-[384px] min-w-[384px] 3xl:w-[540px] 3xl:min-w-[540px] flex-shrink-0 overflow-auto scrollbar-none"
              style={{ top: `${navHeight - 8}px` }}
            >
              <Card className="w-full h-full">
                <div className="flex flex-col gap-4 p-4">
                  <MarketModeSelect onSecondarySelectionChange={handleSecondaryTabClick} />
                  <div className="flex flex-col gap-4">
                    {viewMode === "buy" && viewAction === "create" && <CreateOrder />}
                    {viewMode === "buy" && viewAction === "fill" && (
                      <FillListing
                        selectedListingId={selectedListingData?.listingId}
                        selectedPlaceInLine={selectedListingData?.placeInLine}
                      />
                    )}
                    {viewMode === "sell" && viewAction === "create" && (
                      <CreateListing onSelectionChange={setSelectedPlotData} />
                    )}
                    {viewMode === "sell" && viewAction === "fill" && (
                      <FillOrder selectedOrderId={selectedOrderData?.orderId} />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Hover info - rendered once, updated via direct DOM manipulation for performance */}
      <div
        ref={hoverInfoRef}
        className="fixed z-40 text-xs px-3 py-2 flex-col gap-1 text-pinto-pod-bronze pointer-events-none"
        style={{ display: "none" }}
      >
        <div>
          <span>Price per Pod:</span> <span data-price>0.000</span>
        </div>
        <div>
          <span>Place in line:</span> <span data-place>0.0M</span>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          clickedCoords={contextMenu.clickedCoords}
          chartBounds={contextMenu.chartBounds}
          options={contextMenuOptions}
          isClosing={isContextMenuClosing}
          onClose={() => {
            // Only unfreeze if NOT navigating (closed via Escape/click outside/scroll)
            // If navigating, handleUnfreezeAndNavigate already handles unfreeze
            if (!isNavigatingRef.current) {
              // Trigger closing animation
              setIsContextMenuClosing(true);

              // Wait for animation to complete before unfreezing
              setTimeout(() => {
                if (isCrosshairFrozen) {
                  chartRef.current?.unfreeze();
                  setIsCrosshairFrozen(false);
                }
                setContextMenu(null);
                setIsContextMenuClosing(false);
              }, 200); // Match fade-out animation duration
            }
          }}
        />
      )}
    </>
  );
}
