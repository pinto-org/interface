import claimableIcon from "@/assets/protocol/Claimable.png";
import plotIcon from "@/assets/protocol/Plot.svg";
import podIcon from "@/assets/protocol/Pod.png";
import { TokenValue } from "@/classes/TokenValue";
import { useFarmerField } from "@/state/useFarmerField";
import { useFieldData } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { Plot } from "@/utils/types";
import React from "react";
import CheckmarkCircle from "./CheckmarkCircle";
import { Table, TableBody, TableCell, TableRow } from "./ui/Table";
import Text from "./ui/Text";
import { ToggleGroupItem } from "./ui/ToggleGroup";

interface PlotRowProps {
  plot: Plot;
  harvestableIndex: TokenValue;
  useToggle?: boolean;
  isSelected?: boolean | undefined;
  showClaimable?: boolean;
}

const PlotRow = React.forwardRef<HTMLTableRowElement, PlotRowProps & React.HTMLAttributes<HTMLTableRowElement>>(
  ({ plot, harvestableIndex, useToggle, isSelected, showClaimable, ...props }, ref) => {
    const placeInLine = plot.index.sub(harvestableIndex);
    const isHarvesting = placeInLine.lt(0);
    const harvestablePods = placeInLine.abs();
    if (showClaimable) {
      return (
        <TableRow
          className="h-[4.5rem] bg-pinto-green-1 hover:bg-pinto-green-1 items-center"
          data-action-target="claimable-rewards"
          ref={ref}
          {...props}
        >
          <TableCell className="text-pinto-green-2 items-center">
            <div className="flex items-center gap-1.5 -ml-2">
              <img src={claimableIcon} className="h-8 w-8" alt="Claimable Tokens" />
              <Text variant="body-light">Plot {plot.index.blockchainString}</Text>
            </div>
          </TableCell>
          <TableCell className="text-pinto-green-2 text-right pr-0">
            <div className="inline-flex items-center">
              <Text variant="body-light">{formatter.number(harvestablePods)} Harvestable Pods</Text>
            </div>
          </TableCell>
        </TableRow>
      );
    }
    return (
      <TableRow
        ref={ref}
        {...props}
        className={`h-[4.5rem] bg-transparent items-center ${useToggle ? "hover:bg-pinto-green-1/50 hover:cursor-pointer" : ""}`}
      >
        <TableCell className="text-black font-[400]">
          <div className="gap-2 flex items-center -ml-2">
            {useToggle && <CheckmarkCircle isSelected={isSelected} />}
            <img src={plotIcon} className="h-6 w-6" alt="Plot" />
            <Text variant="body-light">Plot {plot.index.blockchainString}</Text>
          </div>
        </TableCell>
        <TableCell className="text-right pr-0">
          <div className="inline-flex items-center gap-1.5">
            <img src={podIcon} className="h-6 w-6" alt="Pods" />
            <Text variant="body-light">{`${formatter.number(plot.pods)} Pods`}</Text>
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
  },
);

export default function PlotsTable({
  selected,
  useToggle,
  showClaimable,
}: { selected?: string[]; useToggle?: boolean; showClaimable?: boolean }) {
  const farmerField = useFarmerField();
  const fieldData = useFieldData();

  const hasHarvestablePods = farmerField.plots.some((plot) => plot.harvestablePods.gt(0));

  return (
    <Table>
      <TableBody className="[&_tr:first-child]:border-t [&_tr:last-child]:border-b">
        {hasHarvestablePods &&
          showClaimable &&
          (useToggle ? (
            <ToggleGroupItem
              value={farmerField.plots[0].index.toHuman()}
              aria-label={`Select Plot ${farmerField.plots[0].index.toHuman()}`}
              key={`toggle_${farmerField.plots[0].index.toHuman()}`}
              asChild
            >
              <PlotRow
                plot={farmerField.plots[0]}
                harvestableIndex={fieldData.harvestableIndex}
                useToggle
                isSelected={selected?.includes(farmerField.plots[0].index.toHuman())}
                showClaimable
              />
            </ToggleGroupItem>
          ) : (
            <PlotRow
              plot={farmerField.plots[0]}
              harvestableIndex={fieldData.harvestableIndex}
              key={`plot_${farmerField.plots[0].index.toHuman()}`}
              showClaimable
            />
          ))}
        {farmerField.plots.map((plot) => {
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
                  harvestableIndex={fieldData.harvestableIndex}
                  useToggle
                  isSelected={selected?.includes(plot.index.toHuman())}
                />
              </ToggleGroupItem>
            );
          }
          return (
            <PlotRow plot={plot} harvestableIndex={fieldData.harvestableIndex} key={`plot_${plot.index.toHuman()}`} />
          );
        })}
      </TableBody>
    </Table>
  );
}
