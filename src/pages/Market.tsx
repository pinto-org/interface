import PodIcon from "@/assets/protocol/Pod.png";
import PintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import FrameAnimator from "@/components/LoadingSpinner";
import ScatterChart from "@/components/charts/ScatterChart";
import { Separator } from "@/components/ui/Separator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { useAllMarket } from "@/state/market/useAllMarket";
import { useHarvestableIndex, usePodLine } from "@/state/useFieldData";
import { trackSimpleEvent } from "@/utils/analytics";
import { ActiveElement, ChartEvent, PointStyle, TooltipOptions } from "chart.js";
import { Chart } from "chart.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AllActivityTable } from "./market/AllActivityTable";
import { FarmerActivityTable } from "./market/FarmerActivityTable";
import MarketModeSelect from "./market/MarketModeSelect";
import { PodListingsTable } from "./market/PodListingsTable";
import { PodOrdersTable } from "./market/PodOrdersTable";
import CreateListing from "./market/actions/CreateListing";
import CreateOrder from "./market/actions/CreateOrder";
import FillListing from "./market/actions/FillListing";
import FillOrder from "./market/actions/FillOrder";

const TABLE_SLUGS = ["activity", "listings", "orders", "my-activity"];
const TABLE_LABELS = ["Activity", "Listings", "Orders", "My Activity"];

const getPointTopOffset = () => {
  if (window.innerWidth > 1600) {
    return 90;
  } else if (window.innerWidth > 1100) {
    return 80;
  } else {
    return 40;
  }
};

const getPointBottomOffset = () => {
  if (window.innerWidth > 1600) {
    return 175;
  } else if (window.innerWidth > 1100) {
    return 130;
  } else {
    return 90;
  }
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
};

type MarketScatterChartData = {
  label: "Orders" | "Listings";
  data: MarketScatterChartDataPoint[];
  color: string;
  pointStyle: PointStyle;
  pointRadius: number;
};

const shapeScatterChartData = (data: any[], harvestableIndex: TokenValue): MarketScatterChartData[] => {
  return (
    data?.reduce(
      (acc, event) => {
        // Skip Fill Orders
        if ("toFarmer" in event) {
          return acc;
        }

        let amount: number | null = null;
        let status = "";
        let placeInLine: number | null = null;
        let eventIndex: number | null = null;
        const price = event.pricePerPod.toNumber();
        const eventId = event.id;
        const eventType: "ORDER" | "LISTING" = event.type as "ORDER" | "LISTING";

        if ("beanAmount" in event) {
          // Handle Orders
          amount = event.beanAmount.div(event.pricePerPod).toNumber();
          const fillPct = event.beanAmountFilled.div(event.beanAmount).mul(100).toNumber();
          status = fillPct > 99 ? "FILLED" : event.status === "CANCELLED_PARTIAL" ? "CANCELLED" : event.status;
          placeInLine = event.maxPlaceInLine.toNumber();

          if (status === "ACTIVE" && placeInLine !== null && price !== null) {
            acc[0].data.push({
              x: placeInLine / 1_000_000,
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
          amount = event.originalAmount.toNumber();
          const fillPct = event.filled.div(event.originalAmount).mul(100).toNumber();
          status = fillPct > 99 ? "FILLED" : event.status === "CANCELLED_PARTIAL" ? "CANCELLED" : event.status;
          placeInLine = status === "ACTIVE" ? event.index.sub(harvestableIndex).toNumber() : null;
          eventIndex = event.index.toNumber();

          if (placeInLine !== null && price !== null) {
            acc[1].data.push({
              x: placeInLine / 1_000_000,
              y: price,
              eventId,
              eventIndex,
              eventType,
              status,
              amount,
              placeInLine,
            });
          }
        }

        return acc;
      },
      [
        {
          label: "Orders",
          data: [] as MarketScatterChartDataPoint[],
          color: "#40b0a6", // teal
          pointStyle: "circle" as PointStyle,
          pointRadius: 6,
        },
        {
          label: "Listings",
          data: [] as MarketScatterChartDataPoint[],
          color: "#e0b57d", // tan
          pointStyle: "rect" as PointStyle,
          pointRadius: 6,
        },
      ],
    ) || []
  );
};

export function Market() {
  const { mode, id } = useParams();
  const [tab, handleChangeTab] = useState(TABLE_SLUGS[0]);
  const navigate = useNavigate();
  const { data, isLoaded } = useAllMarket();
  const podLine = usePodLine();
  const podLineAsNumber = podLine.toNumber() / 1000000;
  const harvestableIndex = useHarvestableIndex();

  const scatterChartData: MarketScatterChartData[] = useMemo(
    () => shapeScatterChartData(data || [], harvestableIndex),
    [data, harvestableIndex],
  );

  const toolTipOptions: Partial<TooltipOptions> = {
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
        div.style.transform = "translate(25px)"; // Position to right of point
        div.style.transition = "all .1s ease";
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
          tooltipEl.style.zIndex = "1";
          // Basically all of this is custom logic for 3 different breakpoints to either display the tooltip to the top right or bottom right of the point.
          const topOfPoint = position.y + getPointTopOffset();
          const bottomOfPoint = position.y + getPointBottomOffset();
          tooltipEl.style.top = dataPoint.y > 0.8 ? bottomOfPoint : topOfPoint + "px"; // Position relative to point y
          // end custom logic
          tooltipEl.style.left = position.x + "px"; // Position relative to point x
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
            </div>
        `;
        }
      }
    },
  };

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

  const handleChangeTabFactory = useCallback(
    (selection: string) => () => {
      // Track activity tab changes
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.ACTIVITY_TAB_CLICK, {
        previous_tab: tab,
        new_tab: selection,
      });

      if (selection === TABLE_SLUGS[1]) {
        navigate(`/market/pods/buy/fill`);
      } else if (selection === TABLE_SLUGS[2]) {
        navigate(`/market/pods/sell/fill`);
      }
      handleChangeTab(selection);
    },
    [navigate, tab],
  );

  const handleSecondaryTabClick = useCallback(
    (v: string) => {
      if (v === "fill") {
        handleChangeTab(!mode || mode === "buy" ? TABLE_SLUGS[1] : TABLE_SLUGS[2]);
      }
    },
    [mode],
  );

  const onPointClick = (event: ChartEvent, activeElements: ActiveElement[], chart: Chart) => {
    const dataPoint = scatterChartData[activeElements[0].datasetIndex].data[activeElements[0].index] as any;

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
      navigate(`/market/pods/buy/${dataPoint.eventIndex.toString().replace(".", "")}`);
    } else {
      navigate(`/market/pods/sell/${dataPoint.eventId.replace(".", "")}`);
    }
  };

  const viewMode = !mode || mode === "buy" ? "buy" : "sell";
  const fillView = !!id;

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
          <div className="flex flex-row border-t border-pinto-gray-2 mt-4 ">
            <div className="flex flex-col flex-grow ml-4 border-r border-pinto-gray-2 pr-4">
              <div className="w-full h-[75vh] relative mt-4">
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                    <FrameAnimator className="-mt-5 -mb-12" size={80} />
                  </div>
                )}
                <ScatterChart
                  data={scatterChartData}
                  xOptions={{ label: "Place in line", min: 0, max: podLineAsNumber }}
                  yOptions={{ label: "Price per pod", min: 0, max: 100 }}
                  onPointClick={onPointClick}
                  toolTipOptions={toolTipOptions as TooltipOptions}
                />
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
            <div className="flex flex-col gap-4 self-start px-4 py-4 h-full w-[384px] min-w-[384px] 3xl:w-[540px] 3xl:min-w-[540px] flex-shrink-0 overflow-auto scrollbar-none">
              <div>
                <MarketModeSelect onSecondarySelectionChange={handleSecondaryTabClick} />
                {viewMode === "buy" && !fillView && <CreateOrder />}
                {viewMode === "buy" && fillView && <FillListing />}
                {viewMode === "sell" && !fillView && <CreateListing />}
                {viewMode === "sell" && fillView && <FillOrder />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
