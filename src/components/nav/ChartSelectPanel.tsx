import IconImage from "@/components/ui/IconImage";
import { navbarPanelAtom } from "@/state/app/navBar.atoms";
import { useChartSetupData } from "@/state/useChartSetupData";
import { cn } from "@/utils/utils";
import { useAtom } from "jotai";
import { memo, useEffect, useMemo, useState } from "react";
import { SearchIcon } from "../Icons";
import { selectedChartsAtom } from "../charts/AdvancedChart";
import { Input } from "../ui/Input";
import { ScrollArea } from "../ui/ScrollArea";
import { Separator } from "../ui/Separator";

const ChartSelectPanel = memo(() => {
  const { data: chartSetupData, chartColors } = useChartSetupData();
  const dataTypes = ["Pinto", "Silo", "Field"];

  const [panelState, _] = useAtom(navbarPanelAtom);
  const [selectedCharts, setSelected] = useAtom(selectedChartsAtom);
  const isOpen = panelState.openPanel === "chart-select";

  const [searchInput, setSearchInput] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [internalSelected, setInternalSelected] = useState(selectedCharts);

  const currentlySelected = internalSelected.length;
  const maxChartsSelected = chartColors.length;

  function typeToggle(type: string) {
    const index = selectedTypes.indexOf(type);
    if (index === -1) {
      const newSelection = [...selectedTypes];
      newSelection.push(type);
      setSelectedTypes(newSelection);
    } else {
      const newSelection = [...selectedTypes];
      newSelection.splice(index, 1);
      setSelectedTypes(newSelection);
    }
  }

  function handleSelection(selection: number) {
    const selectedItems = [...internalSelected];
    const indexInSelection = selectedItems.findIndex((selectionIndex) => selection === selectionIndex);
    const isSelected = indexInSelection > -1;
    isSelected ? selectedItems.splice(indexInSelection, 1) : selectedItems.push(selection);
    if (selectedItems.length > maxChartsSelected) return;
    setInternalSelected(selectedItems);
  }

  // Update internal selection when panel opens
  useEffect(() => {
    if (isOpen) {
      setInternalSelected([...selectedCharts]);
    }
  }, [isOpen, selectedCharts]);

  // Save selections when panel closes
  useEffect(() => {
    if (!isOpen) {
      setSelected(internalSelected);
    }
  }, [isOpen, internalSelected, setSelected]);

  const filteredData = useMemo(() => {
    if ((!searchInput || searchInput === "") && selectedTypes.length === 0) {
      return chartSetupData;
    } else {
      const inputFilter = searchInput.split(/(\s+)/).filter((output) => output.trim().length > 0);
      const stringFilter = chartSetupData.filter((option) =>
        inputFilter.every((filter) => option.name.toLowerCase().includes(filter.toLowerCase())),
      );
      return selectedTypes.length > 0
        ? stringFilter.filter((option) => selectedTypes.includes(option.type))
        : stringFilter;
    }
  }, [chartSetupData, searchInput, selectedTypes]);

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
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            startIcon={<SearchIcon className="ml-2" />}
          />
        </div>
        <Separator />
        <div className="flex flex-row">
          {/*
          {dataTypes.map((dataType) => {
            const isSelected = selectedTypes.includes(dataType);
            return (
              <Button key={`selectDialog${dataType}`} onClick={() => typeToggle(dataType)}>
                {dataType}
              </Button>
            );
          })}
            */}
        </div>
        <div className="overflow-clip">
          <ScrollArea className="flex flex-col h-[calc(100dvh-17.5rem)]">
            {filteredData.map((data, index) => {
              const indexInSelection = internalSelected.findIndex((selectionIndex) => data.index === selectionIndex);
              const isSelected = indexInSelection > -1;
              return (
                <div
                  key={`chartSelectList${data.id}`}
                  className={cn(
                    "flex flex-row items-center gap-3 my-0.5 justify-between hover:cursor-pointer hover:bg-pinto-gray-2/20 py-2 px-6 transition-colors",
                    isSelected && "bg-pinto-gray-2/70 hover:bg-pinto-gray-2/50",
                  )}
                  onClick={() => handleSelection(data.index)}
                >
                  <IconImage src={data.icon} size={9} />
                  <div className="flex flex-col basis-full gap-1">
                    <div className="pinto-body-light">{data.name}</div>
                    <div className="pinto-sm-light text-pinto-gray-4">{data.shortDescription}</div>
                  </div>
                  {data.type !== "Pinto" && (
                    <div className="flex justify-self-end pinto-sm-light text-pinto-gray-4">{data.type}</div>
                  )}
                </div>
              );
            })}
          </ScrollArea>
        </div>
      </div>
    </>
  );
});

export default ChartSelectPanel;
