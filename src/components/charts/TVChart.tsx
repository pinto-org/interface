import useIsMobile from "@/hooks/display/useIsMobile";
import { useChartSetupData } from "@/state/useChartSetupData";
import { hexToRgba } from "@/utils/utils";
import {
  ChartOptions,
  CreatePriceLineOptions,
  DeepPartial,
  IChartApi,
  IRange,
  ISeriesApi,
  LineSeries,
  MouseEventParams,
  PriceScaleMode,
  TickMarkType,
  Time,
  createChart,
} from "lightweight-charts";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { GearIcon } from "../Icons";
import { ResponsivePopover } from "../ui/ResponsivePopover";

export type TVChartFormattedData = {
  time: Time;
  value: number;
  customValues: { season: number };
};

export type TVChartProps = {
  /**
   * Series of timestampped values to be charted.
   * Must be in ascending order.
   */
  formattedData?: TVChartFormattedData[][];
  /**
   * Draw $1 peg line?
   */
  drawPegLine?: boolean;
  /**
   * Time period to automatically set the chart to.
   */
  timePeriod?: IRange<Time>;
  /**
   * Ids of the currently selected charts.
   */
  selected: number[];
  /**
   * Height in pixels
   */
  height?: number;
};

function getTimezoneCorrectedTime(utcTime: Date, tickMarkType: TickMarkType) {
  let timestamp: number;
  if (utcTime instanceof Date) {
    timestamp = utcTime.getTime() / 1000;
  } else {
    timestamp = utcTime;
  }
  const correctedTime = new Date(timestamp * 1000);
  let options = {};
  switch (tickMarkType) {
    case TickMarkType.Year:
      options = {
        year: "numeric",
      };
      break;
    case TickMarkType.Month:
      options = {
        month: "short",
      };
      break;
    case TickMarkType.DayOfMonth:
      options = {
        day: "2-digit",
      };
      break;
    case TickMarkType.Time:
      options = {
        hour: "2-digit",
        minute: "2-digit",
      };
      break;
    default:
      options = {
        hour: "2-digit",
        minute: "2-digit",
        seconds: "2-digit",
      };
  }
  return correctedTime.toLocaleString("en-GB", options);
}

function setTimePeriod(chart: MutableRefObject<IChartApi | undefined>, timePeriod: IRange<Time> | undefined) {
  if (!chart.current) return;
  const from = timePeriod?.from;
  const to = timePeriod?.to;

  if (!from) {
    chart.current.timeScale().fitContent();
  } else if (from && to) {
    const newFrom = new Date(from.valueOf() as number);
    const newTo = new Date(to.valueOf() as number);
    chart.current.timeScale().setVisibleRange({
      from: Math.floor(newFrom.valueOf() / 1000) as Time,
      to: Math.floor(newTo.valueOf() / 1000) as Time,
    });
  } else if (from) {
    const newFrom = new Date(from.valueOf() as number);
    const newTo = new Date(from.valueOf() as number);
    chart.current.timeScale().setVisibleRange({
      from: Math.floor(newFrom.valueOf() / 1000) as Time,
      to: Math.floor(newTo.valueOf() / 1000) as Time,
    });
  }
}

const headerOffset = 200;

const TVChart = ({ formattedData, height = 500, timePeriod, selected }: TVChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi>();

  const isMobile = useIsMobile();

  const { data: chartSetupData, chartColors } = useChartSetupData();

  const [lastDataPoint, setLastDataPoint] = useState<any>();
  const [firstDataPoint, setFirstDataPoint] = useState<any>();
  const [dataPoint, setDataPoint] = useState<any>();
  // Track initialization state
  const [isInitialized, setIsInitialized] = useState(false);

  const dataSeries = useRef<ISeriesApi<"Line">[]>([]);

  const size = "full";

  // Price Scale Settings Menu
  const [leftPriceScaleMode, setLeftPriceScaleMode] = useState<PriceScaleMode>(0);
  const [rightPriceScaleMode, setRightPriceScaleMode] = useState<PriceScaleMode>(0);
  const priceScaleModes = ["Normal", "Logarithmic", "Percentage", "Indexed to 100"];

  // Set second price scale type
  const chartAxisTypes = useMemo(
    () => selected.map((chartId) => chartSetupData[chartId]?.valueAxisType),
    [selected, chartSetupData],
  );
  const secondPriceScale = useMemo(() => new Set(chartAxisTypes).size > 1, [chartAxisTypes]);

  // Create chart instance only once
  useEffect(() => {
    if (!chartContainerRef.current || chart.current) return;

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        fontFamily: "Pinto",
        background: { color: "rgba(0, 0, 0, 0)" },
        textColor: hexToRgba("#9C9C9C"),
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: hexToRgba("#D9D9D9"), visible: true },
        horzLines: { color: hexToRgba("#D9D9D9"), visible: false },
      },
      crosshair: {
        vertLine: {
          labelBackgroundColor: hexToRgba("#C4C4C4"),
        },
        horzLine: {
          labelBackgroundColor: hexToRgba("#C4C4C4"),
        },
      },
      localization: {
        timeFormatter: (timestamp: number) =>
          new Date(timestamp * 1000).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderVisible: true,
        visible: size === "full",
        minBarSpacing: 0.001,
        tickMarkFormatter: (time: Date, tickMarkType: TickMarkType) => getTimezoneCorrectedTime(time, tickMarkType),
        borderColor: hexToRgba("#D9D9D9"),
      },
      rightPriceScale: {
        borderVisible: true,
        mode: 0,
        visible: true,
        borderColor: hexToRgba("#D9D9D9"),
        textColor: hexToRgba("#9C9C9C"),
      },
      leftPriceScale: {
        borderVisible: true,
        mode: 0,
        visible: false,
        borderColor: hexToRgba("#D9D9D9"),
        textColor: hexToRgba("#9C9C9C"),
      },
      width: chartContainerRef.current.clientWidth,
      height: height - headerOffset,
    };

    chart.current = createChart(chartContainerRef.current, chartOptions);

    const handleResize = () => {
      if (chart.current && chartContainerRef.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: height - headerOffset,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chart.current) {
        chart.current.remove();
        chart.current = undefined;
      }
      dataSeries.current = [];
    };
  }, []); // Run only once on mount

  // Setup series when selected charts or chart configuration changes
  useEffect(() => {
    if (!chart.current || !chartContainerRef.current) return;

    // Clear previous series
    dataSeries.current.forEach((series) => chart.current?.removeSeries(series));
    dataSeries.current = [];

    // Handle second price scale
    chart.current.applyOptions({
      leftPriceScale: {
        mode: leftPriceScaleMode,
        visible: size === "full" && secondPriceScale,
      },
      rightPriceScale: {
        mode: rightPriceScaleMode,
      },
    });

    // Create new series
    const numberOfCharts = selected.length;
    const priceScaleIds: string[] = [];

    if (numberOfCharts > 0) {
      let pegLineDrawn = false;
      for (let i = 0; i < numberOfCharts; i += 1) {
        if (!chartSetupData[selected[i]]) continue;

        const chartSetup = chartSetupData[selected[i]];
        let scaleId = "";
        const findScale = priceScaleIds.findIndex((value) => value === chartSetup.valueAxisType);

        if (findScale > -1) {
          scaleId = findScale > 1 ? chartSetup.valueAxisType : findScale === 0 ? "right" : "left";
        } else {
          if (priceScaleIds.length === 0) {
            priceScaleIds[0] = chartSetup.valueAxisType;
            scaleId = "right";
          } else if (priceScaleIds.length === 1) {
            priceScaleIds[1] = chartSetup.valueAxisType;
            scaleId = "left";
          } else {
            scaleId = chartSetup.valueAxisType;
          }
        }

        dataSeries.current[i] = chart.current.addSeries(LineSeries, {
          color: chartColors[i].lineColor,
          lineWidth: 2,
          priceScaleId: scaleId,
          priceFormat: {
            type: "custom",
            formatter: chartSetupData[selected[i]].shortTickFormatter,
          },
        });

        chart.current.applyOptions({
          crosshair: {
            horzLine: {
              color: chartColors[0].lineColor,
              labelBackgroundColor: chartColors[0].lineColor,
            },
            vertLine: {
              color: chartColors[0].lineColor,
              labelBackgroundColor: chartColors[0].lineColor,
            },
          },
        });

        if (chartSetup.valueAxisType === "PINTO_price" && !pegLineDrawn) {
          const pegLine: CreatePriceLineOptions = {
            price: 1,
            color: hexToRgba("#00C767"),
            lineWidth: 1,
            lineStyle: 3, // LineStyle.Dashed
            axisLabelVisible: true,
            title: "Price Target",
          };
          dataSeries.current[i].createPriceLine(pegLine);
          pegLineDrawn = true;
        }
      }
    }

    setIsInitialized(true);
  }, [selected, secondPriceScale, chartColors, leftPriceScaleMode, rightPriceScaleMode]);

  // Handle time period changes
  useEffect(() => {
    if (!lastDataPoint || !isInitialized) return;
    setTimePeriod(chart, timePeriod);
  }, [timePeriod, isInitialized]);

  // Set data and subscribe to events
  useEffect(() => {
    if (!chart.current || !formattedData || !isInitialized) return;

    const crosshairMoveHandler = (param: MouseEventParams) => {
      const hoveredTimestamp = param.time ? new Date((param.time?.valueOf() as number) * 1000) : null;
      const hoveredValues: number[] = [];
      let hoveredSeason = 0;

      dataSeries.current.forEach((series) => {
        const seriesValueBefore = series.dataByIndex(param.logical?.valueOf() as number, -1);
        const seriesValueAfter = series.dataByIndex(param.logical?.valueOf() as number, 1);
        //@ts-ignore
        hoveredValues.push(seriesValueBefore && seriesValueAfter ? seriesValueBefore?.value : 0);
        hoveredSeason = Math.max(hoveredSeason, (seriesValueBefore?.customValues?.season as number) || 0);
      });

      if (!param.time) {
        setDataPoint(undefined);
      } else {
        setDataPoint({
          time: param.time
            ? hoveredTimestamp?.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
            : null,
          value: param.time ? hoveredValues : null,
          season: param.time ? hoveredSeason : null,
          timestamp: param.time?.valueOf() as number,
        });
      }
    };

    const timeRangeChangeHandler = (param: IRange<Time> | null) => {
      if (!param || !formattedData) return;

      const lastTimestamp = new Date((param.to.valueOf() as number) * 1000);
      const lastValues = selected.map((_, i) => formattedData[i]?.find((value) => value.time === param.to)?.value);
      const lastSeasons = selected.map(
        (_, i) => formattedData[i]?.find((value) => value.time === param.to)?.customValues?.season || 0,
      );
      const lastSeason = Math.max(...lastSeasons.filter((s) => !Number.isNaN(s)));

      setLastDataPoint({
        time: lastTimestamp?.toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
        value: lastValues,
        season: lastSeason,
        timestamp: param.to.valueOf(),
      });
    };

    // Set data for each series
    const numberOfCharts = selected?.length || 0;
    let dataWasSet = false;

    for (let i = 0; i < numberOfCharts; i += 1) {
      if (!formattedData[i] || !Array.isArray(formattedData[i]) || formattedData[i].length === 0) continue;

      try {
        if (dataSeries.current[i]) {
          // Ensure data is valid before setting it
          const validData = formattedData[i].filter(
            (item) => item && typeof item.time !== "undefined" && typeof item.value !== "undefined",
          );

          if (validData.length > 0) {
            dataSeries.current[i].setData(validData);
            dataWasSet = true;
          }
        }
      } catch (error) {
        console.error("Error setting data for series", i, error);
      }
    }

    // Get initial data point values
    function getDataPoint(mode: string) {
      if (!formattedData) return undefined;

      let _time = 0;
      const _value: number[] = [];
      let _season = 0;

      selected.forEach((_, i) => {
        const selectedData = formattedData[i];
        if (!selectedData || selectedData.length === 0) return;

        const dataIndex = mode === "last" ? selectedData.length - 1 : 0;
        if (!selectedData[dataIndex]) return;

        _time = Math.max(_time, selectedData[dataIndex]?.time?.valueOf() as number);
        _season = Math.max(_season, selectedData[dataIndex]?.customValues?.season || 0);
        _value.push(selectedData[dataIndex]?.value);
      });

      if (_time === 0) return undefined;

      return {
        time: new Date(_time * 1000)?.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" }),
        value: _value,
        season: _season,
        timestamp: _time,
      };
    }

    // Set initial points only if we have valid data
    if (dataWasSet) {
      const lastPoint = getDataPoint("last");
      const firstPoint = getDataPoint("first");

      if (lastPoint) setLastDataPoint(lastPoint);
      if (firstPoint) setFirstDataPoint(firstPoint);

      // Ensure time scale is properly set
      if (timePeriod) {
        // Apply time period
        setTimePeriod(chart, timePeriod);
      } else {
        // Default to fitting all content
        chart.current.timeScale().fitContent();
      }
    }

    // Subscribe to events
    chart.current.subscribeCrosshairMove(crosshairMoveHandler);
    chart.current.timeScale().subscribeVisibleTimeRangeChange(timeRangeChangeHandler);

    return () => {
      chart.current?.unsubscribeCrosshairMove(crosshairMoveHandler);
      chart.current?.timeScale().unsubscribeVisibleTimeRangeChange(timeRangeChangeHandler);
    };
  }, [formattedData, selected, isInitialized]);

  // Handle height changes
  useEffect(() => {
    if (chart.current && chartContainerRef.current) {
      // Apply the new height directly to both the container and the chart
      chartContainerRef.current.style.height = `${height - headerOffset}px`;
      chart.current.applyOptions({
        height: height - headerOffset,
      });
      chart.current.timeScale().fitContent(); // Re-fit content after size change
    }
  }, [height]);

  return (
    <>
      <div className="relative h-full">
        <div className="mb-4">
          <div
            className={`relative flex ${isMobile && selected.length > 2 ? "flex-col" : "flex-row"} p-0 z-10 ${isMobile && selected.length > 2 ? "gap-0.5" : "gap-8"}`}
          >
            {selected.map((chartId, index) => {
              if (!chartSetupData[chartId]) return;
              const tooltipTitle = chartSetupData[chartId].tooltipTitle;
              const tooltipHoverText = chartSetupData[chartId].tooltipHoverText;
              const beforeFirstSeason =
                dataPoint && firstDataPoint ? dataPoint.timestamp < firstDataPoint[index]?.timestamp : false;
              const value = beforeFirstSeason
                ? 0
                : dataPoint
                  ? dataPoint?.value[index]
                  : lastDataPoint
                    ? lastDataPoint?.value[index]
                    : undefined;
              if (!isMobile || selected.length < 3) {
                return (
                  <div key={`selectedTVChart${chartId}`} className={`flex flex-col gap-2`}>
                    <div
                      className={`${
                        selected.length > 1 ? "border-l-[2.5px]" : "border-l-0"
                      } ${selected.length > 1 ? "pl-3" : "pl-0"}`}
                      style={{ borderColor: chartColors[index].lineColor }}
                    >
                      <div className="flex flex-row">
                        <div className="flex">
                          <div className="pinto-body-light text-pinto-gray-4">{tooltipTitle}</div>
                          {/*
                          {tooltipHoverText && (
                            <div
                              className="tooltip"
                              data-tip={tooltipHoverText}
                              data-placement={isMobile ? "top" : "right"}
                            >
                              <div className="text-secondary inline mb-2 text-[11px]">HELP</div>
                            </div>
                            
                          )}
                            */}
                        </div>
                      </div>
                      <div className="pinto-h3 text-black">
                        {value ? chartSetupData[chartId].tickFormatter(value) : "-"}
                      </div>
                    </div>
                    {index === 0 && (
                      <>
                        <p className="pinto-sm font-thin text-pinto-gray-4">
                          Season {dataPoint?.season ?? lastDataPoint?.season ?? 0}
                        </p>
                        <p className="pinto-sm font-thin text-pinto-gray-4">
                          {dataPoint?.time ?? lastDataPoint?.time ?? 0}
                        </p>
                      </>
                    )}
                  </div>
                );
              }

              return (
                <div key={`selectedChartV2Mobile${index}`} className="flex flex-row flex-grow">
                  <div
                    className={`flex flex-grow ${
                      selected.length > 1 ? "border-l-[2.5px]" : "border-l-0"
                    } ${selected.length > 1 ? "pl-1" : "pl-0"}`}
                    style={{ borderColor: chartColors[index].lineColor }}
                  >
                    <div className="flex flex-grow">
                      <div className="flex flex-grow">
                        <p className="pinto-sm-light text-pinto-gray-4">{tooltipTitle}</p>
                        {/*
                        {tooltipHoverText && (
                          <div
                            className="tooltip"
                            data-tip={tooltipHoverText}
                            data-placement={isMobile ? "top" : "right"}
                          >
                            <div className="text-secondary inline mb-2 text-[11px]">HELP</div>
                          </div>
                        )}
                          */}
                      </div>
                      <div className="text-base pinto-sm-bold justify-items-end">
                        {value ? chartSetupData[chartId].tickFormatter(value) : "-"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {isMobile && selected.length > 2 && (
            <div className="flex flex-row justify-between pinto-sm-light text-pinto-gray-4">
              <span>Season {dataPoint?.season ?? lastDataPoint?.season ?? 0}</span>
              <span>{dataPoint?.time ?? lastDataPoint?.time ?? 0}</span>
            </div>
          )}
        </div>
        <div ref={chartContainerRef} id="container" style={{ height: height - 200 }} />
      </div>
    </>
  );
};
export default TVChart;
