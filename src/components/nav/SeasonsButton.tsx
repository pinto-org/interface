import chevronDown from "@/assets/misc/ChevronDown.svg";
import sunIcon from "@/assets/protocol/Sun.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import Panel from "@/components/ui/Panel";
import { useDiamondEvalulationParameters } from "@/state/useDiamondEvaluationParameters";
import useFieldSnapshots from "@/state/useFieldSnapshots";
import useSiloSnapshots from "@/state/useSiloSnapshots";
import { useSeason } from "@/state/useSunData";
import useSupplySnapshots from "@/state/useSupplySnapshots";
import { formatter } from "@/utils/format";
import { textConfig } from "@/utils/theme";
import { cn, isDev } from "@/utils/utils";
import clsx from "clsx";
import { HTMLAttributes, useMemo } from "react";
import TooltipSimple from "../TooltipSimple";
import { Button } from "../ui/Button";
import { CardContent, CardHeader } from "../ui/Card";
import IconImage from "../ui/IconImage";
import { ScrollArea, ScrollBar } from "../ui/ScrollArea";
import { Separator } from "../ui/Separator";
import { Skeleton } from "../ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";

interface SeasonsButtonPanel {
  season: number;
  fieldSnapshots: ReturnType<typeof useFieldSnapshots>;
  siloSnapshots: ReturnType<typeof useSiloSnapshots>;
  supplySnapshots: ReturnType<typeof useSupplySnapshots>;
  evaluationParams: ReturnType<typeof useDiamondEvalulationParameters>;
  hasFloodOrRain: boolean;
}

const deriveTextStyles = textConfig.methods.variant;
const deriveTextColor = textConfig.methods.color;

const smTextStyles = clsx(...deriveTextStyles("sm"), deriveTextColor("secondary"));

const PanelContent = ({
  season,
  fieldSnapshots,
  siloSnapshots,
  supplySnapshots,
  evaluationParams,
  hasFloodOrRain,
}: SeasonsButtonPanel) => {
  const { getEvaluationParametersWithSeason } = evaluationParams;

  const cropRatios = useMemo(() => {
    const ratios: {
      ratio: TokenValue;
      delta: TokenValue;
    }[] = [];

    if (!getEvaluationParametersWithSeason) {
      return ratios;
    }

    const orderedSnapshots = [...siloSnapshots.data].reverse();
    const orderedSupplySnapshots = [...supplySnapshots.data].reverse();
    const orderedFieldSnapshots = [...fieldSnapshots.data].reverse();

    orderedSnapshots.forEach((snapshot, i) => {
      const seasonalParams = getEvaluationParametersWithSeason(snapshot.season);
      const max = TokenValue.fromBigInt(seasonalParams.maxBeanMaxLpGpPerBdvRatio, 18);
      const _min = TokenValue.fromBigInt(seasonalParams.minBeanMaxLpGpPerBdvRatio, 18);
      const _minRain = TokenValue.fromBigInt(seasonalParams.rainingMinBeanMaxLpGpPerBdvRatio, 18);

      const twaDeltaPBeans = orderedSupplySnapshots[i]?.rewardBeans ?? TokenValue.ZERO;
      const isRaining = twaDeltaPBeans.gt(0) && orderedFieldSnapshots[i]?.podRate.lt(5);

      const min = isRaining && snapshot.season >= 175 ? _minRain : _min;

      const range = max.sub(min);
      const currentRatio = min.add(range.mul(snapshot.beanToMaxLpGpPerBdvRatio));

      if (i === 0) {
        ratios.push({
          ratio: currentRatio,
          delta: TokenValue.ZERO,
        });
      } else {
        const prevRatio = ratios[i - 1].ratio;
        const delta = currentRatio.sub(prevRatio);

        let newDeltaPct = delta;

        if (currentRatio.eq(prevRatio)) {
          newDeltaPct = TokenValue.ZERO;
        } else if (currentRatio.eq(max)) {
          newDeltaPct = prevRatio.eq(max) ? TokenValue.ZERO : delta;
        } else if (currentRatio.eq(min)) {
          newDeltaPct = prevRatio.eq(min) ? TokenValue.ZERO : delta;
        }

        ratios.push({
          ratio: currentRatio,
          delta: newDeltaPct,
        });
      }
    });

    return [...ratios].reverse();
  }, [siloSnapshots.data, supplySnapshots.data, fieldSnapshots.data]);

  return (
    <>
      <CardHeader className="p-0">
        <div className="flex flex-row w-full justify-between p-4 box-border gap-2">
          <div className="flex flex-col gap-2">
            <div className="pinto-body inline-flex gap-2 items-center">
              <IconImage size={6} src={sunIcon} />
              Season {season}
            </div>
            <div className="pinto-sm text-pinto-light">
              Seasons are how Pinto keeps time. Each Season is about 1 hour.
            </div>
            <div className="pinto-sm text-pinto-light hidden sm:block">
              Pinto adjusts the supply and various incentives every Season to facilitate low volatility.
            </div>
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
              <ExternalLinkIcon color="currentColor" width={"1rem"} height={"1rem"} />
            </Text>
           </Button>
           */}
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="px-4 overflow-clip">
        <ScrollArea className="h-[calc(100dvh-17.5rem)] -mx-4">
          <Table
            className={`border-separate border-spacing-x-3 border-spacing-y-8 -mt-8 ${hasFloodOrRain ? "w-[max(800px,calc(100vw-48px))]" : "w-[max(620px,calc(100vw-48px))]"} sm:w-full`}
          >
            <TableHeader className="[&_tr]:border-0 bg-transparent">
              <TableRow className="border-0 bg-transparent">
                <TableHead className={cn("w-[10%] p-0", smTextStyles)}>Season</TableHead>
                <TableHead className={cn("text-right w-[17.5%] p-0", smTextStyles)}>Pinto Supply</TableHead>
                {hasFloodOrRain && <TableHead className={cn("text-left w-[20%] p-0")}> </TableHead>}
                <TableHead className={cn("text-right w-[17.5%] p-0", smTextStyles)}>Silo Adjustments</TableHead>
                <TableHead className={cn("text-right w-[32.5%] p-0", smTextStyles)} colSpan={2}>
                  Field Adjustments
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fieldSnapshots.data?.map((snapshot, i) => {
                const mints = siloSnapshots.data[i]?.deltaBeanMints ?? TokenValue.ZERO;
                const totalMint =
                  supplySnapshots.data[i]?.rewardBeans.add(
                    supplySnapshots.data[i]?.floodSiloBeans.add(supplySnapshots.data[i]?.floodFieldBeans),
                  ) ?? TokenValue.ZERO;

                const floodBeans =
                  supplySnapshots.data[i]?.floodSiloBeans.add(supplySnapshots.data[i]?.floodFieldBeans) ??
                  TokenValue.ZERO;
                const twaDeltaPBeans = supplySnapshots.data[i]?.rewardBeans ?? TokenValue.ZERO;

                return (
                  <TableRow key={`${snapshot.season}_${i}`} className="h-[2.5rem] bg-transparent border-0">
                    {/**
                     * Season
                     */}
                    <TableCell className={cn("items-center p-0")}>
                      <div className="flex flex-row gap-x-1 items-center">
                        <div className="pinto-xs">{snapshot.season}</div>
                        {floodBeans.gt(0) ? (
                          <div className="pinto-xs text-pinto-green-4 flex flex-row gap-x-1">
                            (Flood)
                            <TooltipSimple
                              variant="green"
                              content={
                                <div className="pinto-sm leading-2">
                                  At the beginning of a Season where it continues to Rain and the total ΔP {">"} 0, it
                                  Floods.
                                  <br />
                                  During a Flood, the protocol mints additional Pinto and sells them directly in
                                  whitelisted liquidity pools. <br /> Proceeds from the sale are distributed to
                                  Stalkholders based on Stalk holdings when it began to Rain.
                                </div>
                              }
                            />
                          </div>
                        ) : (
                          twaDeltaPBeans.gt(0) &&
                          snapshot.podRate.lt(5) && (
                            <div className="pinto-xs text-pinto-green-4 flex flex-row gap-x-1">
                              (Rain)
                              <TooltipSimple
                                variant="green"
                                content={
                                  <div className="pinto-sm">
                                    At the beginning of a Season where TWAΔP {">"} 0 and Pod Rate {"<"} 3%, it is
                                    Raining.
                                  </div>
                                }
                              />
                            </div>
                          )
                        )}
                      </div>
                    </TableCell>
                    {/**
                     * Pinto Supply
                     */}
                    <TableCell className="p-0 relative">
                      {/* The first column content */}
                      <div className="flex flex-col items-end gap-y-0.5">
                        <div
                          className={`inline-flex gap-1 items-center pinto-sm ${mints.gt(0) ? "text-pinto-green-4" : ""}`}
                        >
                          {mints.gt(0) && <span>+</span>}
                          <IconImage size={4} src={pintoIcon} />
                          <span>{formatter.noDec(totalMint)}</span>
                        </div>
                        <div className="pinto-xs text-pinto-light">New Pinto</div>
                      </div>
                    </TableCell>
                    {/**
                     * Flood Data
                     */}
                    {hasFloodOrRain && (
                      <TableCell className="p-0 relative">
                        {!floodBeans.eq(TokenValue.ZERO) && (
                          <div className="flex flex-row gap-x-3">
                            <Separator orientation="vertical" className="h-8 bg-pinto-green-1" />
                            <div className="flex flex-col gap-y-0.5">
                              <div className="pinto-xs text-pinto-green-4 flex flex-row items-center gap-x-1">
                                <IconImage size={3} src={pintoIcon} />
                                {formatter.noDec(floodBeans)}: Flood
                              </div>
                              <div className="pinto-xs text-pinto-green-4 flex flex-row items-center gap-x-1">
                                <IconImage size={3} src={pintoIcon} />
                                {formatter.noDec(twaDeltaPBeans)}: TWAΔP
                              </div>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    )}
                    {/**
                     * Silo Adjustments
                     */}
                    <TableCell className="text-black font-[400] text-[1rem] text-right p-0">
                      <div className="flex flex-col items-end gap-y-0.5">
                        <div className="pinto-sm inline-flex gap-2 justify-end">
                          {formatter.pct(cropRatios?.[i]?.ratio, { minDecimals: 2, maxDecimals: 2 })}
                          <span className="text-pinto-gray-4">
                            {`(${formatter.pct(cropRatios?.[i]?.delta, {
                              showPositiveSign: true,
                              showPlusOnZero: true,
                              minDecimals: 2,
                              maxDecimals: 2,
                            })})`}
                          </span>
                        </div>
                        <div className="pinto-xs text-pinto-light inline-flex gap-0.5 items-center justify-end">
                          Crop Ratio
                          <TooltipSimple
                            variant="gray"
                            content={
                              <div>
                                The Crop Ratio represents the comparative Seed reward between Pinto and the LP token
                                with the most Seeds. <br /> For example, if the Crop Ratio is 50%, the Seed reward for
                                Pinto is half the reward of the LP token with the most <br /> Seeds. The Crop Ratio can
                                vary between 50% and 150%.
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </TableCell>
                    {/* field adjustments */}
                    <TableCell className={cn("text-right p-0", smTextStyles)}>
                      <div className="flex flex-row gap-2 sm:gap-2 justify-end">
                        <div className="flex flex-col w-[30%] gap-y-0.5">
                          <div className="pinto-sm flex justify-end">{formatter.noDec(snapshot.issuedSoil)}</div>
                          <span className="inline-flex gap-0.5 items-center justify-end">
                            <span className="pinto-xs text-pinto-light">Total Soil</span>
                            <TooltipSimple
                              variant="gray"
                              content={
                                <>
                                  <div className="pinto-sm text-left">
                                    Soil is the total number of Pinto that can be lent (Sown).
                                  </div>
                                  <div className="pinto-sm text-left text-pinto-light">
                                    When the Pinto price is less than $1, the amount of Soil issued is roughly equal to
                                    the amount of excess Pinto.
                                  </div>
                                </>
                              }
                            />
                          </span>
                        </div>
                        <div className="flex flex-col w-[50%] gap-y-0.5 ml-4 sm:ml-2">
                          <span className="inline-flex gap-2 justify-end">
                            <div className="pinto-sm flex justify-end">
                              {formatter.pct(snapshot.temperature, {
                                minDecimals: 2,
                                maxDecimals: 2,
                              })}
                            </div>
                            <div className="pinto-sm text-pinto-light">
                              {`(${formatter.pct(snapshot.deltaTemperature, {
                                minDecimals: 2,
                                maxDecimals: 2,
                                showPositiveSign: true,
                                showPlusOnZero: true,
                              })})`}
                            </div>
                          </span>
                          <div className="pinto-xs text-pinto-light inline-flex gap-0.5 items-center justify-end">
                            Max Temperature
                            <TooltipSimple
                              variant="gray"
                              content={
                                <>
                                  <div className="pinto-sm text-left">
                                    Temperature is the interest rate for lending (Sowing) Pinto .
                                  </div>
                                  <div className="pinto-sm text-pinto-light text-left">
                                    Sown Pinto are burned, reducing the Pinto supply.
                                  </div>
                                </>
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
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
  const newPintoSupplySnapshots = useSupplySnapshots();
  const evaluationParams = useDiamondEvalulationParameters();

  const hasFloodOrRain = !!newPintoSupplySnapshots.data.find(
    (seasonData) => seasonData.floodFieldBeans.gt(0) || seasonData.floodSiloBeans.gt(0),
  );

  return (
    <Panel
      isOpen={isOpen}
      side="left"
      panelProps={{
        className: `${hasFloodOrRain ? "max-w-panel-seasons w-panel-seasons" : "max-w-panel-seasons-sm w-panel-seasons-sm"} mt-4`,
      }}
      trigger={
        <Button
          variant="outline-secondary"
          onClick={() => togglePanel()}
          noShrink
          rounded="full"
          {...props}
          className={cn(`flex flex-row gap-0.5 sm:gap-2 ${isOpen && "border-pinto-green"}`, props.className)}
        >
          <IconImage src={sunIcon} size={6} />
          {season === 0 ? (
            <div className="hidden sm:block">
              <Skeleton className="w-14 h-6" />
            </div>
          ) : (
            <div className="hidden sm:block">Season {season}</div>
          )}
          <IconImage src={chevronDown} size={4} mobileSize={2.5} />
        </Button>
      }
      toggle={() => togglePanel()}
    >
      <PanelContent
        season={season}
        fieldSnapshots={fieldSnapshots}
        siloSnapshots={siloSnapshots}
        supplySnapshots={newPintoSupplySnapshots}
        hasFloodOrRain={hasFloodOrRain}
        evaluationParams={evaluationParams}
      />
    </Panel>
  );
}
