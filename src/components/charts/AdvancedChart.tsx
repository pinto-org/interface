import { navbarPanelAtom } from "@/state/app/navBar.atoms";
import { ChartSetup, useChartSetupData } from "@/state/useChartSetupData";
import useSeasonsData from "@/state/useSeasonsData";
import { useSeason } from "@/state/useSunData";
import { cn, safeJSONParse, safeJSONStringify } from "@/utils/utils";
import { atom, useAtom } from "jotai";
import { IRange, Time, UTCTimestamp } from "lightweight-charts";
import { useEffect, useMemo, useRef, useState } from "react";
import CalendarButton from "../CalendarButton";
import { PlusIcon } from "../Icons";
import LoadingSpinner from "../LoadingSpinner";
import { Button } from "../ui/Button";
import TVChart, { TVChartFormattedData } from "./TVChart";

export const MIN_ADV_SEASON = 7;

// Stores selected charts
export const selectedChartsAtom = atom<number[]>([0]);
// Stores season inputs for market performance charts
export const chartSeasonInputsAtom = atom<Record<string, number>>({});

function saveChartsToStorage(selection: number[], chartSetupData: ChartSetup[]) {
  const selectedIds = selection.map((selectedChartIndex) => chartSetupData[selectedChartIndex].id);
  localStorage.setItem("advancedChartSelectedCharts", safeJSONStringify(selectedIds));
}

function saveChartInputDataToStorage(chartSeasonInputs: Record<string, number>) {
  localStorage.setItem("advancedChartSeasonInputs", safeJSONStringify(chartSeasonInputs));
}

function loadChartsFromStorage(chartSetupData: ChartSetup[]) {
  const storedIds = localStorage.getItem("advancedChartSelectedCharts");
  const selectedIds = safeJSONParse<string[], undefined>(storedIds, undefined);
  if (!selectedIds) {
    return undefined;
  }
  const result = chartSetupData.reduce<number[]>((output, setupData, index) => {
    if (selectedIds.includes(setupData.id)) {
      output.push(index);
    }
    return output;
  }, []);
  return result;
}

function loadChartInputDataFromStorage() {
  const stored = localStorage.getItem("advancedChartSeasonInputs");
  return { seasons: safeJSONParse<Record<string, number>, Record<string, number>>(stored, {}) };
}

export const AdvancedChart = () => {
  const { data: chartSetupData } = useChartSetupData();
  const currentSeason = useSeason();

  const storedSetting1 = localStorage.getItem("advancedChartTimePeriod");
  const storedTimePeriod = safeJSONParse<IRange<Time>, undefined>(storedSetting1, undefined);

  const [timePeriod, setTimePeriod] = useState<IRange<Time> | undefined>(storedTimePeriod);
  const [selectedCharts, setSelectedCharts] = useAtom(selectedChartsAtom);
  const [chartSeasonInputs, setChartSeasonInputs] = useAtom(chartSeasonInputsAtom);
  const [panelState, setPanelState] = useAtom(navbarPanelAtom);

  useEffect(() => {
    saveChartsToStorage(selectedCharts, chartSetupData);
    saveChartInputDataToStorage(chartSeasonInputs);
  }, [selectedCharts, chartSetupData, chartSeasonInputs]);

  // By adjusting fromSeason here, we can avoid fetching data
  // that might break the chart
  const seasonsData = useSeasonsData(MIN_ADV_SEASON, currentSeason, {
    seasonSync: true,
    marketPerformanceStartSeasons: chartSeasonInputs,
  });

  const storedSelectedCharts = useMemo(() => {
    return loadChartsFromStorage(chartSetupData);
  }, [chartSetupData]);

  const storedChartInputData = useMemo(() => {
    return loadChartInputDataFromStorage();
  }, []);

  // Set values from storage on initial load
  useEffect(() => {
    if (storedSelectedCharts && storedSelectedCharts.length > 0) {
      setSelectedCharts(storedSelectedCharts);
    }
  }, [storedSelectedCharts, setSelectedCharts]);

  useEffect(() => {
    if (storedChartInputData.seasons) {
      setChartSeasonInputs(storedChartInputData.seasons);
    }
  }, [storedChartInputData.seasons, setChartSeasonInputs]);

  const [collapseChartButtons, setCollapseChartButtons] = useState(false);
  const selectedChartsRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Width is recalculated upon selectedCharts changing
  useEffect(() => {
    if (!selectedChartsRef.current) {
      return;
    }

    // Check for cumulative button width exceeding its container
    const observer = new ResizeObserver((entries) => {
      const maxWidth = entries[0].contentRect.width;
      const buttonsWidth = Array.from(selectedChartsRef.current?.children || []).reduce(
        (total, button) => total + button.getBoundingClientRect().width,
        0,
      );
      setCollapseChartButtons(buttonsWidth > maxWidth * 0.95);
    });
    observer.observe(selectedChartsRef.current);

    return () => {
      observer.disconnect();
    };
  }, [selectedCharts, collapseChartButtons, seasonsData.isFetching]);

  function handleDeselectChart(selectionIndex: number) {
    const newSelection = [...selectedCharts];
    newSelection.splice(selectionIndex, 1);
    setSelectedCharts(newSelection);
  }

  const togglePanel = () => {
    if (panelState.openPanel === "chart-select") {
      setPanelState({
        ...panelState,
        backdropVisible: false,
        openPanel: undefined,
        walletPanel: {
          ...panelState.walletPanel,
          showClaim: false,
          showTransfer: false,
        },
      });
    } else {
      setPanelState({
        ...panelState,
        backdropMounted: true,
        backdropVisible: true,
        openPanel: "chart-select",
        walletPanel: {
          ...panelState.walletPanel,
          showClaim: false,
          showTransfer: false,
        },
      });
    }
  };

  const filtered = useMemo(() => {
    const output: TVChartFormattedData[][] = [];
    if (selectedCharts.length === 0) return output;
    selectedCharts.forEach((selection, _selectedIndex) => {
      const selectedChart = chartSetupData[selection];
      const _output: TVChartFormattedData[] = [];
      seasonsData.data.forEach((seasonData, _index) => {
        // Verify a datapoint is available for this season (some data, like tractor, is not since season 1)
        if (selectedChart.priceScaleKey in seasonData) {
          const formatValue = selectedChart.valueFormatter;
          const dataPoint = {
            value: formatValue(seasonData[selectedChart.priceScaleKey]),
            time: new Date(seasonData.timestamp).getTime() as UTCTimestamp,
            customValues: {
              season: seasonData.season,
            },
          };
          _output.push(dataPoint);
        }
      });
      output.push(_output.reverse());
    });
    return output;
  }, [selectedCharts, chartSetupData, seasonsData.data]);

  // Handle height
  const [height, setHeight] = useState(500);

  useEffect(() => {
    const calculateHeight = () => {
      const navbar = document.getElementById("pinto-navbar");
      const footer = document.getElementById("pinto-footer");
      if (!navbar || !footer) return;
      const windowHeight = window.innerHeight;
      const headerOffset = navbar.getBoundingClientRect().height;
      const footerOffset = footer.getBoundingClientRect().height;
      const newHeight = windowHeight - headerOffset - footerOffset;
      setHeight(newHeight);
    };

    calculateHeight();

    window.addEventListener("resize", calculateHeight);
    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  if (seasonsData.isFetching) {
    return (
      <div className="flex flex-row justify-center">
        <LoadingSpinner size={300} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-row gap-4 justify-between">
        <div ref={selectedChartsRef} className="flex flex-row flex-1">
          <div
            className={cn(
              "hidden sm:flex flex-row",
              // Container is made invisible but not removed, so its width can still be calculated
              collapseChartButtons && "invisible absolute pointer-events-none h-0 overflow-hidden",
            )}
          >
            {
              /*
               * ResizeObserver replaces the individual deselect buttons with a single button that says
               * "4/5/6 Selected" in order to prevent the buttons from overflowing the page
               */

              selectedCharts.map(
                (selection, index) =>
                  chartSetupData[selection] && (
                    <Button
                      variant="outline"
                      size="default"
                      rounded="full"
                      key={`selectedChart${selection}`}
                      className="flex flex-row gap-2 mr-4 shadow-none bg-white text-pinto-gray-5 hover:text-pinto-gray-5"
                      onClick={() => handleDeselectChart(index)}
                    >
                      <span>{chartSetupData[selection].name}</span>
                      <span className="w-4 h-4">×</span>
                    </Button>
                  ),
              )
            }
          </div>
          <Button
            variant="outline"
            size="default"
            rounded="full"
            onClick={togglePanel}
            noShrink
            className={cn(
              `flex flex-row gap-2 bg-pinto-green-1 text-pinto-green-3 border-pinto-green-3 hover:bg-pinto-green-2/30 shadow-none hover:text-pinto-green-3`,
            )}
          >
            <span className="hidden sm:inline-block">
              {!collapseChartButtons ? "Add Chart" : `${selectedCharts.length} Selected`}
            </span>
            <span className="sm:hidden">
              {selectedCharts.length === 0 ? "Add Chart" : `${selectedCharts.length} Selected`}
            </span>
            <PlusIcon color={"currentColor"} width={14} height={14} />
          </Button>
        </div>
        <CalendarButton setTimePeriod={setTimePeriod} />
      </div>
      {selectedCharts.length > 0 ? (
        <TVChart
          selected={selectedCharts}
          formattedData={filtered}
          height={height}
          timePeriod={timePeriod}
          seasonInputs={chartSeasonInputs}
        />
      ) : (
        <div className="flex justify-center items-center h-[200px] w-full">Click the Add Chart button to begin</div>
      )}
    </div>
  );
};
