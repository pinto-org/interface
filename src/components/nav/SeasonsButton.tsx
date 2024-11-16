import chevronDown from "@/assets/misc/ChevronDown.svg";
import sunIcon from "@/assets/protocol/Sun.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import Panel from "@/components/ui/Panel";
import Text from "@/components/ui/Text";
import { LibCases } from "@/lib/LibCases";
import useFieldSnapshots from "@/state/useFieldSnapshots";
import useSiloSnapshots from "@/state/useSiloSnapshots";
import { useSeason } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { textConfig } from "@/utils/theme";
import { cn } from "@/utils/utils";
import clsx from "clsx";
import { HTMLAttributes } from "react";
import TooltipSimple from "../TooltipSimple";
import { Button } from "../ui/Button";
import { CardContent, CardHeader } from "../ui/Card";
import IconImage from "../ui/IconImage";
import { ScrollArea } from "../ui/ScrollArea";
import { Separator } from "../ui/Separator";
import { Table, TableBody, TableCell, TableFixed, TableHead, TableHeader, TableRow } from "../ui/Table";

interface SeasonsButtonPanel {
  season: number;
  fieldSnapshots: ReturnType<typeof useFieldSnapshots>;
  siloSnapshots: ReturnType<typeof useSiloSnapshots>;
}

const deriveTextStyles = textConfig.methods.variant;
const deriveTextColor = textConfig.methods.color;

const smTextStyles = clsx(...deriveTextStyles("sm"), deriveTextColor("secondary"));

const PanelContent = ({ season, fieldSnapshots, siloSnapshots }: SeasonsButtonPanel) => {
  return (
    <>
      <CardHeader className="p-0">
        <div className="flex flex-row w-full justify-between p-6 box-border gap-2">
          <div className="flex flex-col gap-2">
            <Text variant="body" className="inline-flex gap-2 items-center">
              <IconImage size={6} src={sunIcon} />
              Season {season}
            </Text>
            <Text variant="sm" color="light">
              Seasons are how Pinto keeps time. Each Season is about 1 hour.
            </Text>
            <Text variant="sm" color="light">
              Pinto adjusts the supply and various incentives every Season to facilitate price stability.
            </Text>
          </div>
          {/*
          <Button asChild variant={"outline"} rounded="full" className="self-center bg-white" size="md">
            <Text
              variant="sm"
              as="a"
              href={`/explorer/seasons`}
              target={"_blank"}
              rel="noreferrer"
              color="secondary"
              className="gap-2"
            >
              View more data
              <ExternalLinkIcon color="currentColor" width={16} height={16} />
            </Text>
          </Button>
          */}
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="px-4 overflow-clip">
        <ScrollArea className="h-[calc(100vh-15rem)] -mx-4">
          <Table className="border-separate border-spacing-4 -mt-4">
            <TableHeader className="[&_tr]:border-0 bg-transparent">
              <TableRow className="border-0 bg-transparent">
                <TableHead className={cn("w-[12.5%] p-0", smTextStyles)}>Season</TableHead>
                <TableHead className={cn("text-right w-[25%] p-0", smTextStyles)}>Pinto Supply</TableHead>
                <TableHead className={cn("text-right w-[25%] p-0", smTextStyles)}>Silo Adjustments</TableHead>
                <TableHead className={cn("text-right w-[37.5%] p-0", smTextStyles)} colSpan={2}>
                  Field Adjustments
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fieldSnapshots.data?.map((snapshot, i) => {
                const mints = siloSnapshots
                  ? snapshot.season === siloSnapshots[i]?.season
                    ? siloSnapshots[i]?.deltaBeanMints
                    : TokenValue.ZERO
                  : TokenValue.ZERO;
                const nextSnapshot = fieldSnapshots.data[i + 1];
                const cropRatio = TokenValue.fromBigInt(
                  LibCases.evaluateWithCaseId(BigInt(snapshot.caseId)).bean2MaxLPGPPerBdv,
                  18,
                );
                const previousCropRatio = nextSnapshot?.caseId
                  ? TokenValue.fromBigInt(
                      LibCases.evaluateWithCaseId(BigInt(nextSnapshot.caseId)).bean2MaxLPGPPerBdv,
                      18,
                    )
                  : cropRatio;
                return (
                  <TableRow key={`${snapshot.season}_${i}`} className="h-[2.5rem] bg-transparent border-0">
                    {/**
                     * Season
                     */}
                    <TableCell className={cn("items-center p-0", smTextStyles)}>{snapshot.season}</TableCell>
                    {/**
                     * Pinto Supply
                     */}
                    <TableCell className="text-right p-0">
                      <div className="flex flex-col items-end">
                        <Text className={`inline-flex gap-1 items-center ${mints.gt(0) ? "text-pinto-green-4" : ""}`}>
                          {mints.gt(0) && <span>+</span>}
                          <IconImage size={4} src={pintoIcon} />
                          <span>{formatter.noDec(mints)}</span>
                        </Text>
                        <Text variant="xs" color="light">
                          New Pinto
                        </Text>
                      </div>
                    </TableCell>
                    {/**
                     * Silo Adjustments
                     */}
                    <TableCell className="text-black font-[400] text-[1rem] text-right p-0">
                      <div className="flex flex-col items-end">
                        <Text className="inline-flex gap-2 justify-end">
                          {formatter.twoDec(cropRatio)}
                          <span className="text-pinto-gray-4">
                            {`(${formatter.twoDec(cropRatio.sub(previousCropRatio), { showPositiveSign: true })})`}
                          </span>
                        </Text>
                        <Text variant="xs" color="light" className="inline-flex gap-0.5 items-center justify-end">
                          Crop Ratio
                          <TooltipSimple
                            variant="gray"
                            content={"The ratio of Seeds per PDV reward for Pinto relative to at least 1 LP token."}
                          />
                        </Text>
                      </div>
                    </TableCell>
                    <TableCell className={cn("text-right p-0", smTextStyles)}>
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
                                    When the Pinto price is less than $1, the amount of Soil issued is equal to the
                                    amount of excess Pinto.
                                  </Text>
                                </>
                              }
                            />
                          </span>
                        </div>
                        <div className="flex flex-col w-[50%]">
                          <span className="inline-flex gap-2 justify-end">
                            {formatter.pct(snapshot.temperature, { minDecimals: 0, maxDecimals: 0 })}
                            <span className="text-pinto-gray-4">
                              {`(${formatter.pct(snapshot.deltaTemperature, {
                                minDecimals: 0,
                                maxDecimals: 0,
                                showPositiveSign: true,
                              })})`}
                            </span>
                          </span>
                          <Text variant="xs" color="light" className="inline-flex gap-0.5 items-center justify-end">
                            Max Temperature
                            <TooltipSimple
                              variant="gray"
                              content={
                                <>
                                  <Text align="left">
                                    Temperature is the interest rate for lending (Sowing) Pinto .
                                  </Text>
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
        </ScrollArea>
      </CardContent>
    </>
  );
};

export interface ISeasonsButton extends HTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  togglePanel: () => void;
}

export default function SeasonsButton({ isOpen = false, togglePanel, ...props }: ISeasonsButton) {
  const season = useSeason();
  const fieldSnapshots = useFieldSnapshots();
  const siloSnapshots = useSiloSnapshots();

  return (
    <Panel
      top={5}
      isOpen={isOpen}
      side="left"
      panelProps={{
        className: "max-w-panel-seasons w-panel-seasons overflow-x-visible",
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
          <div className="hidden sm:block">Season {season}</div>
          <IconImage src={chevronDown} size={4} mobileSize={2.5} />
        </Button>
      }
      toggle={togglePanel}
    >
      <PanelContent season={season} fieldSnapshots={fieldSnapshots} siloSnapshots={siloSnapshots} />
    </Panel>
  );
}
