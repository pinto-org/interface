import IconImage from "@/components/ui/IconImage";
import { navbarPanelAtom } from "@/state/app/navBar.atoms";
import { useChartSetupData } from "@/state/useChartSetupData";
import { useSeason } from "@/state/useSunData";
import { useDebouncedEffect } from "@/utils/useDebounce";
import { cn } from "@/utils/utils";
import { useAtom } from "jotai";
import { isEqual } from "lodash";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "../Icons";
import { MIN_ADV_SEASON, chartSeasonInputsAtom, selectedChartsAtom } from "../charts/AdvancedChart";
import { Input } from "../ui/Input";
import { ScrollArea } from "../ui/ScrollArea";
import { Separator } from "../ui/Separator";

const ChartSelectPanel = memo(() => {
  const { data: chartSetupData, chartColors } = useChartSetupData();
  const currentSeason = useSeason();

  const [panelState, _] = useAtom(navbarPanelAtom);
  const [selectedCharts, setSelected] = useAtom(selectedChartsAtom);
  const [chartSeasonInputs, setChartSeasonInputs] = useAtom(chartSeasonInputsAtom);
  const isOpen = panelState.openPanel === "chart-select";

  const [searchInput, setSearchInput] = useState("");
  const [internalSelected, setInternalSelected] = useState(selectedCharts);
  const [internalSeasonInputs, setInternalSeasonInputs] = useState(chartSeasonInputs);
  const [rawSeasonInputs, setRawSeasonInputs] = useState<Record<string, number>>({});
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  const currentlySelected = internalSelected.length;
  const maxChartsSelected = chartColors.length;

  const filteredData = useMemo(() => {
    if (!searchInput || searchInput === "") {
      return chartSetupData;
    } else {
      const inputFilter = searchInput.split(/(\s+)/).filter((output) => output.trim().length > 0);
      return chartSetupData.filter((option) =>
        inputFilter.every((filter) => option.name.toLowerCase().includes(filter.toLowerCase())),
      );
    }
  }, [chartSetupData, searchInput]);

  const groupedData = useMemo(() => {
    const groups: Record<string, typeof filteredData> = {};
    filteredData.forEach((item) => {
      groups[item.type] ??= [];
      groups[item.type].push(item);
    });
    return groups;
  }, [filteredData]);

  // Expand all types when searching
  useEffect(() => {
    if (searchInput) {
      const allTypes = new Set(Object.keys(groupedData));
      setExpandedTypes(allTypes);
    }
  }, [searchInput, groupedData]);

  const updateSearchInput = useCallback(
    (searchText: string) => {
      setSearchInput(searchText);
      if (searchText === "") {
        setExpandedTypes(new Set());
      } else {
        const allTypes = new Set(Object.keys(groupedData));
        setExpandedTypes(allTypes);
      }
    },
    [groupedData],
  );

  const toggleType = (type: string) => {
    setExpandedTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const handleSelection = useCallback(
    (selection: number) => {
      const selectedItems = [...internalSelected];
      const indexInSelection = selectedItems.findIndex((selectionIndex) => selection === selectionIndex);
      const isSelected = indexInSelection > -1;

      if (isSelected) {
        // When deselecting, also clear the season input for this chart
        const chartData = chartSetupData.find((chart) => chart.index === selection);
        if (chartData) {
          setInternalSeasonInputs((prev) => {
            const updated = { ...prev };
            delete updated[chartData.id];
            return updated;
          });
        }
        selectedItems.splice(indexInSelection, 1);
      } else {
        // When selecting, initialize season input to min value
        const chartData = chartSetupData.find((chart) => chart.index === selection);
        if (chartData && chartData.inputOptions === "SEASON") {
          setInternalSeasonInputs((prev) => ({
            ...prev,
            [chartData.id]: MIN_ADV_SEASON,
          }));
        }
        selectedItems.push(selection);
      }

      if (selectedItems.length > maxChartsSelected) return;
      setInternalSelected(selectedItems);
    },
    [internalSelected, maxChartsSelected, chartSetupData],
  );

  // Update internal selection when panel opens
  useEffect(() => {
    if (isOpen) {
      setInternalSelected([...selectedCharts]);
      setInternalSeasonInputs({ ...chartSeasonInputs });
    }
  }, [isOpen, selectedCharts, chartSeasonInputs]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only rerun on internal input change
  useEffect(() => {
    if (!isEqual(internalSeasonInputs, rawSeasonInputs)) {
      // Initialize raw inputs from the stored values
      const rawInputs: Record<string, number> = {};
      Object.entries(internalSeasonInputs).forEach(([chartId, value]) => {
        rawInputs[chartId] = value;
      });
      setRawSeasonInputs(rawInputs);
    }
  }, [internalSeasonInputs]);

  // Save selections and season inputs when panel closes
  useEffect(() => {
    if (!isOpen) {
      setSelected(internalSelected);
      setChartSeasonInputs(internalSeasonInputs);
    }
  }, [isOpen, internalSelected, internalSeasonInputs, setSelected, setChartSeasonInputs]);

  const handleSeasonInputChange = useCallback((chartId: string, value: string) => {
    setRawSeasonInputs((prev) => ({
      ...prev,
      [chartId]: Number(value),
    }));
  }, []);

  useDebouncedEffect(
    () => {
      const clampedInputs = {};
      for (const chartId in rawSeasonInputs) {
        clampedInputs[chartId] = Math.max(MIN_ADV_SEASON, Math.min(currentSeason, rawSeasonInputs[chartId]));
      }
      setInternalSeasonInputs(clampedInputs);
    },
    [rawSeasonInputs, currentSeason],
    500,
  );

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-row justify-between items-center">
            <span className="pinto-h4">Compare Data</span>
            <span className="pinto-sm-light text-pinto-gray-4">
              {currentlySelected}/{maxChartsSelected} Selected
            </span>
          </div>
          <Input
            type="text"
            className="bg-pinto-gray-1 placeholder:text-pinto-gray-4 border-pinto-gray-2"
            placeholder="Search"
            onChange={(e) => updateSearchInput(e.target.value)}
            startIcon={<SearchIcon className="ml-2" />}
          />
        </div>
        <Separator />
        <div className="overflow-clip">
          <ScrollArea className="flex flex-col h-[calc(100dvh-17.5rem)]">
            {Object.entries(groupedData).map(([type, items]) => (
              <div key={type} className="flex flex-col">
                <div
                  className="flex flex-row items-center gap-3 justify-between hover:cursor-pointer hover:bg-pinto-gray-2/20 py-3 pl-3 pr-4 transition-colors"
                  onClick={() => toggleType(type)}
                >
                  <div className="flex items-center gap-2">
                    <ChevronDownIcon
                      className={cn("w-4 h-4 transition-transform", expandedTypes.has(type) ? "rotate-180" : "")}
                    />
                    <span className="pinto-body-light">{type}</span>
                  </div>
                  <span className="pinto-sm-light text-pinto-gray-4">{items.length} items</span>
                </div>
                <div className="flex flex-col">
                  {items.map((data) => {
                    const indexInSelection = internalSelected.findIndex(
                      (selectionIndex) => data.index === selectionIndex,
                    );
                    const isSelected = indexInSelection > -1;
                    return (
                      (expandedTypes.has(type) || isSelected) && (
                        <div
                          key={`${type}-chartSelectList-${data.id}`}
                          className={cn(
                            "hover:cursor-pointer hover:bg-pinto-gray-2/20 py-2 px-6",
                            isSelected && "bg-pinto-gray-2/70 hover:bg-pinto-gray-2/50",
                          )}
                          onClick={() => handleSelection(data.index)}
                        >
                          <div
                            key={`chartSelectList${data.id}`}
                            className="flex flex-row items-center gap-3 my-0.5 justify-between transition-colors"
                          >
                            <IconImage src={data.icon} size={9} />
                            <div className="flex flex-col basis-full gap-1">
                              <div className="pinto-body-light">{data.name}</div>
                              <div className="pinto-sm-light text-pinto-gray-4">{data.shortDescription}</div>
                            </div>
                          </div>
                          {isSelected && data.inputOptions === "SEASON" && (
                            <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <label className="pinto-sm-light text-pinto-primary whitespace-nowrap">
                                Starting Season:
                              </label>
                              <Input
                                type="number"
                                min={MIN_ADV_SEASON}
                                max={currentSeason}
                                value={rawSeasonInputs[data.id] || ""}
                                onChange={(e) => handleSeasonInputChange(data.id, e.target.value)}
                                className="w-[70px] rounded-[0.5rem] bg-pinto-gray-1 border-pinto-gray-2 text-sm px-2 py-0 h-8"
                              />
                            </div>
                          )}
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </>
  );
});

export default ChartSelectPanel;
