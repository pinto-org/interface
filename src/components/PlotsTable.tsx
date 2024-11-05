import plotIcon from "@/assets/protocol/Plot.svg";
import podIcon from "@/assets/protocol/Pod.png";
import { TokenValue } from "@/classes/TokenValue";
import { useFarmerField } from "@/state/useFarmerField";
import { useFieldData } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import { Plot } from "@/utils/types";
import React from "react";
import CheckmarkCircle from "./CheckmarkCircle";
import { CheckmarkIcon } from "./Icons";
import { Table, TableBody, TableCell, TableRow } from "./ui/Table";
import Text from "./ui/Text";
import { ToggleGroupItem } from "./ui/ToggleGroup";

interface PlotRowProps {
  plot: Plot;
  harvestableIndex: TokenValue;
  useToggle?: boolean;
  isSelected?: boolean | undefined;
}

const PlotRow = React.forwardRef<HTMLTableRowElement, PlotRowProps & React.HTMLAttributes<HTMLTableRowElement>>(
  ({ plot, harvestableIndex, useToggle, isSelected, ...props }, ref) => {
    return (
      <TableRow
        ref={ref}
        {...props}
        className="h-[4.5rem] bg-transparent items-center hover:bg-pinto-green-1/50 hover:cursor-pointer"
      >
        <TableCell className="text-black font-[400]">
          <div className="gap-2 flex items-center -ml-2">
            {useToggle && <CheckmarkCircle isSelected={isSelected} />}
            <img src={plotIcon} className="h-6 w-6" alt="Plot" />
            <Text variant="body-light">Plot {plot.id}</Text>
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
              {formatter.number(plot.index.sub(harvestableIndex))}
              {" in the Pod Line"}
            </Text>
          </div>
        </TableCell>
      </TableRow>
    );
  },
);

export default function PlotsTable({ selected, useToggle }: { selected?: string[]; useToggle?: boolean }) {
  const farmerField = useFarmerField();
  const fieldData = useFieldData();

  return (
    <Table>
      <TableBody className="[&_tr:first-child]:border-t [&_tr:last-child]:border-b">
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
