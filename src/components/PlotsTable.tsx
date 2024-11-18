import plotIcon from "@/assets/protocol/Plot.svg";
import podIcon from "@/assets/protocol/Pod.png";
import { TokenValue } from "@/classes/TokenValue";
import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex } from "@/state/useFieldData";
import { formatter, truncateHex } from "@/utils/format";
import { Plot } from "@/utils/types";
import { useNavigate } from "react-router-dom";
import CheckmarkCircle from "./CheckmarkCircle";
import { RightArrowIcon } from "./Icons";
import { Table, TableBody, TableCell, TableRow } from "./ui/Table";
import Text from "./ui/Text";
import { ToggleGroupItem } from "./ui/ToggleGroup";

interface PlotRowProps {
  plot: Plot;
  harvestableIndex: TokenValue;
  useToggle?: boolean;
  isSelected?: boolean;
  showClaimable?: boolean;
}

const PlotRow = ({ plot, harvestableIndex, useToggle, isSelected, showClaimable }: PlotRowProps) => {
  const placeInLine = plot.index.sub(harvestableIndex);
  const isHarvesting = placeInLine.lt(0);
  const harvestablePods = placeInLine.abs();
  const nonHarvestablePods = plot.pods.sub(plot.harvestablePods);

  const navigate = useNavigate();

  if (showClaimable) {
    return (
      <TableRow
        className="h-[4.5rem] bg-pinto-green-1 hover:bg-pinto-green-1 items-center hover:cursor-pointer"
        data-action-target="claimable-rewards"
        onClick={() => navigate("/field?action=harvest")}
      >
        <TableCell className="text-pinto-green-2 items-center">
          <div className="flex items-center gap-1.5">
            <div className="h-8 w-8 bg-pinto-green-4 rounded-full flex justify-center items-center text-white rotate-90">
              <RightArrowIcon color="currentColor" />
            </div>
            <Text variant="body-light" color="green4">
              Claimable
            </Text>
          </div>
        </TableCell>
        <TableCell className="text-pinto-green-2 text-right">
          <div className="inline-flex items-center">
            <Text variant="body-light" color="green4">
              {formatter.number(harvestablePods)} Harvestable Pods
            </Text>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow
      onClick={() => {
        !useToggle && navigate("/field");
      }}
      className="h-[4.5rem] bg-transparent items-center hover:bg-pinto-green-1/50 hover:cursor-pointer"
    >
      <TableCell className="text-black font-[400]">
        <div className="gap-2 flex items-center">
          {useToggle && <CheckmarkCircle isSelected={isSelected} />}
          <img src={plotIcon} className="h-6 w-6" alt="Plot" />
          <Text variant="body-light">Plot {truncateHex(plot.idHex)}</Text>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="inline-flex items-center gap-1.5">
          <img src={podIcon} className="h-6 w-6" alt="Pods" />
          <Text variant="body-light">{formatter.number(nonHarvestablePods)} Pods</Text>
          <Text variant="body-light" color="light">
            {` at `}
          </Text>
          <Text variant="body-light">
            {formatter.number(isHarvesting ? TokenValue.ZERO : placeInLine)}
            {" in the Pod Line"}
          </Text>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function PlotsTable({
  selected,
  useToggle,
  showClaimable,
}: {
  selected?: string[];
  useToggle?: boolean;
  showClaimable?: boolean;
}) {
  const farmerField = useFarmerField();
  const harvestableIndex = useHarvestableIndex();

  const hasHarvestablePods = farmerField.plots.some((plot) => plot.harvestablePods.gt(0));

  // Only filter out plots that have ALL pods harvestable
  const plotsToShow = farmerField.plots.filter((plot) => !showClaimable || plot.pods.sub(plot.harvestablePods).gt(0));

  const harvestablePlot = hasHarvestablePods ? farmerField.plots.find((plot) => plot.harvestablePods.gt(0)) : undefined;

  return (
    <Table>
      <TableBody className="[&_tr:first-child]:border-t [&_tr:last-child]:border-b">
        {hasHarvestablePods &&
          showClaimable &&
          harvestablePlot &&
          (useToggle ? (
            <ToggleGroupItem
              value={harvestablePlot.index.toHuman()}
              aria-label={`Select Plot ${harvestablePlot.index.toHuman()}`}
              key={`toggle_${harvestablePlot.index.toHuman()}`}
              asChild
            >
              <PlotRow
                plot={harvestablePlot}
                harvestableIndex={harvestableIndex}
                useToggle
                isSelected={selected?.includes(harvestablePlot.index.toHuman())}
                showClaimable
              />
            </ToggleGroupItem>
          ) : (
            <PlotRow
              plot={harvestablePlot}
              harvestableIndex={harvestableIndex}
              key={`plot_${harvestablePlot.index.toHuman()}`}
              showClaimable
            />
          ))}
        {plotsToShow.map((plot) => {
          if (useToggle) {
            return (
              <ToggleGroupItem
                value={plot.index.toHuman()}
                aria-label={`Select Plot ${plot.index.toHuman()}`}
                key={`toggle_${plot.index.toHuman()}`}
                asChild
              >
                <PlotRow
                  plot={plot}
                  harvestableIndex={harvestableIndex}
                  useToggle
                  isSelected={selected?.includes(plot.index.toHuman())}
                />
              </ToggleGroupItem>
            );
          }
          return <PlotRow plot={plot} harvestableIndex={harvestableIndex} key={`plot_${plot.index.toHuman()}`} />;
        })}
      </TableBody>
    </Table>
  );
}
