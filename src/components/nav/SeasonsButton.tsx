import chevronDown from "@/assets/misc/ChevronDown.svg";
import sunIcon from "@/assets/protocol/Sun.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import Panel from "@/components/ui/Panel";
import Text from "@/components/ui/Text";
import useFieldSnapshots from "@/state/useFieldSnapshots";
import useSiloSnapshots from "@/state/useSiloSnapshots";
import { useSunData } from "@/state/useSunData";
import { textConfig } from "@/utils/theme";
import { cn } from "@/utils/utils";
import clsx from "clsx";
import { HTMLAttributes } from "react";
import { ExternalLinkIcon } from "../Icons";
import TooltipSimple from "../TooltipSimple";
import { Button } from "../ui/Button";
import { CardContent, CardHeader } from "../ui/Card";
import IconImage from "../ui/IconImage";
import { Separator } from "../ui/Separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";

interface SeasonsButtonPanel {
  sunData: ReturnType<typeof useSunData>;
  fieldSnapshots: ReturnType<typeof useFieldSnapshots>;
  siloSnapshots: ReturnType<typeof useSiloSnapshots>;
}

const deriveTextStyles = textConfig.methods.variant;
const deriveTextColor = textConfig.methods.color;

const smTextStyles = clsx(...deriveTextStyles("sm"), deriveTextColor("secondary"));

// TODO: Add rest of silo adjustments

const PanelContent = ({ sunData, fieldSnapshots, siloSnapshots }: SeasonsButtonPanel) => {
  return (
    <>
      <CardHeader className="p-0">
        <div className="flex flex-row w-full justify-between p-6 box-border gap-2">
          <div className="flex flex-col gap-2">
            <Text variant="body" className="inline-flex gap-2 items-center">
              <IconImage size={6} src={sunIcon} />
              Season {sunData.current}
            </Text>
            <Text variant="sm" color="light">
              Seasons are how Pinto keeps time. Each Season is about 1 hour.
            </Text>
            <Text variant="sm" color="light">
              Pinto adjusts the supply and various incentives every Season to facilitate price stability.
            </Text>
          </div>
          <Button asChild variant={"outline"} rounded="full" className="self-center bg-white" size="md">
            <Text
              variant="sm"
              as="a"
              href={`/explorer`}
              target={"_blank"}
              rel="noreferrer"
              color="secondary"
              className="gap-2"
            >
              View more data
              <ExternalLinkIcon color="currentColor" width={16} height={16} />
            </Text>
          </Button>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader className="[&_tr]:border-0">
            <TableRow className="h-14 border-0">
              <TableHead className={cn("w-[15%] p-4", smTextStyles)}>Season</TableHead>
              <TableHead className={cn("text-right w-[25%]", smTextStyles)}>Pinto Supply</TableHead>
              <TableHead className={cn("text-right w-[25%]", smTextStyles)}>Silo Adjustments</TableHead>
              <TableHead className={cn("text-right w-[35%] p-4", smTextStyles)} colSpan={2}>
                Field Adjustments
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fieldSnapshots?.map((snapshot, i) => {
              const mints = siloSnapshots
                ? snapshot.season === siloSnapshots[i]?.season
                  ? siloSnapshots[i]?.deltaBeanMints
                  : TokenValue.ZERO
                : TokenValue.ZERO;
              return (
                <TableRow key={`${snapshot.season}_${i}`} className="h-[4.5rem] bg-white hover:bg-white border-0">
                  {/**
                   * Season
                   */}
                  <TableCell className={cn("pl-4 items-center", smTextStyles)}>{snapshot.season}</TableCell>
                  {/**
                   * Pinto Supply
                   */}
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <Text className={`inline-flex gap-1 items-center ${mints.gt(0) ? "text-pinto-green-2" : ""}`}>
                        {mints.gt(0) && <span>+</span>}
                        <IconImage size={4} src={pintoIcon} />
                        <span>{Number(mints.toHuman()).toFixed(0)}</span>
                      </Text>
                      <Text variant="xs" color="light">
                        New Pinto
                      </Text>
                    </div>
                  </TableCell>
                  {/**
                   * Silo Adjustments
                   */}
                  {/* TODO: */}
                  <TableCell className="text-black font-[400] text-[1rem] text-right">-</TableCell>
                  <TableCell className={cn("text-right pr-4", smTextStyles)}>
                    <div className="flex flex-row gap-4 justify-end">
                      <div className="flex flex-col w-[60%]">
                        {`${snapshot.deltaSoil.gt(0) ? "+ " : snapshot.deltaSoil.lt(0) ? "- " : ""}${Number(snapshot.deltaSoil.abs().toHuman()).toFixed(0)}`}
                        <span className="inline-flex gap-0.5 items-center justify-end">
                          <Text as="span" variant="xs" color="light">
                            New Soil
                          </Text>
                          <TooltipSimple
                            variant="gray"
                            content={
                              <>
                                <Text align="left">Soil is the total number of Pinto that can be lent (Sown).</Text>
                                <Text align="left" color="light">
                                  When the Pinto price is less than $1, the amount of Soil issued is set to the amount
                                  of excess Pinto.
                                </Text>
                              </>
                            }
                          />
                        </span>
                      </div>
                      <div className="flex flex-col w-[50%]">
                        <span className="inline-flex gap-2 justify-end">
                          {`${snapshot.temperature.toFixed(0)}% `}
                          <span className="text-pinto-gray-4">
                            {`(${snapshot.deltaTemperature > 0 ? "+" : snapshot.deltaTemperature < 0 ? "-" : ""}${snapshot.deltaTemperature.toFixed(0)}%)`}
                          </span>
                        </span>
                        <Text variant="xs" color="light" className="inline-flex gap-0.5 items-center justify-end">
                          Max Temperature
                          <TooltipSimple
                            variant="gray"
                            content={
                              <>
                                <Text align="left">Temperature is the interest rate for lending (Sowing) Pinto .</Text>
                                <Text color="light" align="left">
                                  Sown Pinto are burned, reducing the Pinto supply.
                                </Text>
                              </>
                            }
                          />
                        </Text>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </>
  );
};

export interface ISeasonsButton extends HTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  togglePanel: () => void;
}

export default function SeasonsButton({ isOpen = false, togglePanel, ...props }: ISeasonsButton) {
  const sunData = useSunData();
  const fieldSnapshots = useFieldSnapshots();
  const siloSnapshots = useSiloSnapshots();

  return (
    <Panel
      top={5}
      isOpen={isOpen}
      side="left"
      panelProps={{
        className: "max-w-panel-seasons w-panel-seasons",
      }}
      trigger={
        <Button
          variant="outline-secondary"
          onClick={() => togglePanel()}
          noShrink
          rounded="full"
          {...props}
          className={cn(`flex flex-row gap-2 ${isOpen && "border-pinto-green"}`, props.className)}
        >
          <IconImage src={sunIcon} size={6} />
          <div className="hidden sm:block">Season {sunData.current}</div>
          <IconImage src={chevronDown} size={4} mobileSize={2.5} />
        </Button>
      }
      toggle={togglePanel}
    >
      <PanelContent sunData={sunData} fieldSnapshots={fieldSnapshots} siloSnapshots={siloSnapshots} />
    </Panel>
  );
}
