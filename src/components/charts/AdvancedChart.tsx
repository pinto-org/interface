import { navbarPanelAtom } from "@/state/app/navBar.atoms";
import { ChartSetup, useChartSetupData } from "@/state/useChartSetupData";
import useSeasonsDataChart from "@/state/useSeasonsDataChart";
import { useSeason } from "@/state/useSunData";
import { cn, safeJSONParse, safeJSONStringify } from "@/utils/utils";
import { atom, useAtom } from "jotai";
import { IRange, Time, UTCTimestamp } from "lightweight-charts";
import { useEffect, useMemo, useState } from "react";
import CalendarButton from "../CalendarButton";
import { PlusIcon } from "../Icons";
import LoadingSpinner from "../LoadingSpinner";
import { Button } from "../ui/Button";
import TVChart, { TVChartFormattedData } from "./TVChart";

export const selectedChartsAtom = atom<number[]>([0]);

function saveChartsToStorage(selection: number[], chartSetupData: ChartSetup[]) {
  const selectedIds = selection.map((selectedChartIndex) => chartSetupData[selectedChartIndex].id);
  localStorage.setItem("advancedChartSelectedCharts", safeJSONStringify(selectedIds));
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

export const AdvancedChart = () => {
  const { data: chartSetupData } = useChartSetupData();
  const currentSeason = useSeason();

  const storedSetting1 = localStorage.getItem("advancedChartTimePeriod");
  const storedTimePeriod = safeJSONParse<IRange<Time>, undefined>(storedSetting1, undefined);

  const storedSelectedCharts = useMemo(() => {
    return loadChartsFromStorage(chartSetupData);
  }, [chartSetupData]);

  const [timePeriod, setTimePeriod] = useState<IRange<Time> | undefined>(storedTimePeriod);
  const [selectedCharts, setSelectedCharts] = useAtom(selectedChartsAtom);
  const [panelState, setPanelState] = useAtom(navbarPanelAtom);

  useEffect(() => {
    if (storedSelectedCharts && storedSelectedCharts.length > 0) {
      setSelectedCharts(storedSelectedCharts);
    }
  }, [storedSelectedCharts, setSelectedCharts]);

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

  useEffect(() => {
    saveChartsToStorage(selectedCharts, chartSetupData);
  }, [selectedCharts, chartSetupData]);

  // By adjusting fromSeason here, we can avoid fetching data
  // that might break the chart
  const seasonsData = useSeasonsDataChart(7, currentSeason);

  const filtered = useMemo(() => {
    const output: TVChartFormattedData[][] = [];
    if (selectedCharts.length === 0) return output;
    selectedCharts.forEach((selection, selectedIndex) => {
      const selectedChart = chartSetupData[selection];
      const _output: TVChartFormattedData[] = [];
      seasonsData.data.forEach((seasonData, index) => {
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
      const elem = document.getElementById("pinto-navbar");
      if (!elem) return;
      const windowHeight = window.innerHeight;
      const headerOffset = elem.getBoundingClientRect().height;
      const newHeight = windowHeight - headerOffset;
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
    <div className="flex flex-col -mb-8 gap-4 sm:-mb-20 sm:gap-6">
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row">
          <div className="hidden sm:flex flex-row">
            {
              /*
               * When the user has more than 4 charts selected, we hide the
               * individual deselect buttons for a single button that says
               * "4/5/6 Selected" in order to prevent the buttons from
               * overflowing the page
               */
              selectedCharts.length < 5 &&
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
            {/*
             * When the user has more than 4 charts selected, we hide the
             * individual deselect buttons for a single button that says
             * "4/5/6 Selected" in order to prevent the buttons from
             * overflowing the page
             */}
            <span className="hidden sm:inline-block">
              {selectedCharts.length < 5 ? "Add Chart" : `${selectedCharts.length} Selected`}
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
        <TVChart selected={selectedCharts} formattedData={filtered} height={height} timePeriod={timePeriod} />
      ) : (
        <div className="flex justify-center items-center h-[200px] w-full">Click the Add Chart button to begin</div>
      )}
    </div>
  );
};
