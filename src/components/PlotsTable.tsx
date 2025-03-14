import plotIcon from "@/assets/protocol/Plot.svg";
import podIcon from "@/assets/protocol/Pod.png";
import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { PODS } from "@/constants/internalTokens";
import useIsMobile from "@/hooks/display/useIsMobile";
import { useFarmerField } from "@/state/useFarmerField";
import { useHarvestableIndex } from "@/state/useFieldData";
import { formatter, truncateHex } from "@/utils/format";
import { Plot } from "@/utils/types";
import { CornerBottomLeftIcon } from "@radix-ui/react-icons";
import { HTMLMotionProps } from "framer-motion";
import React, { forwardRef, HTMLAttributes, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CheckmarkCircle from "./CheckmarkCircle";
import { RightArrowIcon } from "./Icons";
import IconImage from "./ui/IconImage";
import { Table, TableBody, TableCell, TableRow } from "./ui/Table";
import { ToggleGroupItem } from "./ui/ToggleGroup";

type PlotRowProps = HTMLMotionProps<"tr"> &
  React.HTMLAttributes<HTMLTableRowElement> & {
    plot: Plot;
    harvestableIndex: TokenValue;
    numHarvestable?: TokenValue;
    useToggle?: boolean;
    isSelected?: boolean;
    showClaimable?: boolean;
    disableHover?: boolean;
    isMobile: boolean;
  };

const PlotRow = forwardRef<HTMLTableRowElement, PlotRowProps>(
  (
    {
      plot,
      harvestableIndex,
      numHarvestable,
      useToggle,
      isSelected,
      showClaimable,
      disableHover,
      isMobile,
      className,
      ...props
    },
    ref,
  ) => {
    const placeInLine = plot.index.sub(harvestableIndex);
    const isHarvesting = placeInLine.lt(0);
    const nonHarvestablePods = plot.unharvestablePods;

    const navigate = useNavigate();

    if (showClaimable) {
      return (
        <TableRow
          className="h-[4.5rem] bg-pinto-green-1 hover:bg-pinto-green-1 items-center hover:cursor-pointer"
          data-action-target="claimable-rewards"
          onClick={() => navigate("/field?action=harvest")}
          ref={ref}
          {...props}
        >
          <TableCell className="items-center px-2">
            <div className="flex items-center gap-1.5">
              <div className="h-8 w-8 bg-pinto-green-4 rounded-full flex justify-center items-center text-white rotate-90">
                <RightArrowIcon color="currentColor" />
              </div>
              <div className="pinto-sm sm:pinto-body-light text-pinto-green-4 sm:text-pinto-green-4">Harvestable</div>
            </div>
          </TableCell>
          <TableCell className="text-right px-2">
            <div className="inline-flex items-center">
              <div className="pinto-sm sm:pinto-body-light text-pinto-green-4 sm:text-pinto-green-4">
                {formatter.token(numHarvestable, PODS)} Claimable
              </div>
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
        className={`h-[4.5rem] bg-transparent items-center ${!disableHover ? "hover:bg-pinto-green-1/50 hover:cursor-pointer" : ""}`}
        ref={ref}
        {...props}
      >
        <TableCell className="text-black font-[400] pr-0">
          {/* Desktop */}
          <div className="hidden sm:flex gap-1">
            {useToggle && <CheckmarkCircle isSelected={isSelected} />}
            <div className="flex flex-col items-start">
              <div className="hidden sm:flex sm:items-center sm:gap-1.5">
                <img src={podIcon} className="h-6 w-6" alt="Pods" />
                <div className="pinto-sm sm:pinto-body-light">
                  {formatter.number(nonHarvestablePods, {
                    minValue: 0.01,
                  })}{" "}
                  Pods
                </div>
                {plot.source === "MARKET" ? (
                  <div className="pinto-body-light text-pinto-light">(purchased from Pod Market)</div>
                ) : plot.source === "TRANSFER" && plot.preTransferOwner ? (
                  <div className="pinto-body-light text-pinto-light">
                    (transferred from {truncateHex(plot.preTransferOwner, 6, 4)})
                  </div>
                ) : null}
              </div>
              {plot.beansPerPod ? (
                <div className="flex items-left gap-1 text-pinto-light pinto-sm">
                  <CornerBottomLeftIcon
                    className="h-4 w-4 ml-2 mt-1"
                    style={{
                      stroke: "url(#cornerGradient)",
                    }}
                  />
                  <svg height="0" width="0">
                    <defs>
                      <linearGradient id="cornerGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#B99476" />
                        <stop offset="100%" stopColor="#5AA897" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex gap-1 -ml-1 mt-2">
                    <IconImage size={4} src={pintoIcon} />
                    <div>
                      {(plot.preTransferSource ?? plot.source) === "MARKET" ? (
                        <span className="inline-flex items-center gap-1">
                          {"Purchased with "}
                          <span className="text-black">
                            {`${formatter.number(plot.pods.mul(plot.beansPerPod), { minValue: 0.01 })} Pinto`}
                          </span>
                          <span className="block sm:hidden md:block lg:hidden min-[1300px]:block">
                            {" at an effective Temp of "}
                          </span>
                          <span className="hidden sm:block md:hidden lg:block min-[1300px]:hidden">{"@"}</span>
                          <span className="text-black">
                            {`${formatter.number((1 / plot.beansPerPod.toNumber()) * 100 - 100, {
                              minValue: 0.01,
                            })}%`}
                          </span>
                        </span>
                      ) : (
                        <span>
                          <span className="text-black">
                            {formatter.number(plot.pods.mul(plot.beansPerPod), { minValue: 0.01 })}
                          </span>
                          {" Pinto Sown at "}
                          <span className="text-black">
                            {`${formatter.number((1 / plot.beansPerPod.toNumber()) * 100 - 100, {
                              minValue: 0.01,
                            })}%`}
                          </span>
                          {" Temp"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-pinto-light pinto-sm">Temperature data unavailable for this Plot</div>
              )}
            </div>
          </div>
          {/* Mobile */}
          <div className="flex-col sm:hidden items-center gap-1 text-xs">
            <div className="flex sm:flex sm:items-center sm:gap-1.5">
              <img src={podIcon} className="h-4 w-4 mr-1 mt-1" alt="Pods" />
              <div className="text-base">
                {formatter.number(nonHarvestablePods, {
                  minValue: 0.01,
                })}{" "}
                Pods
              </div>
            </div>
            {plot.beansPerPod ? (
              <div className="flex flex-col">
                <div className="flex items-left gap-1 text-pinto-light text-xs mt-0.5">
                  <CornerBottomLeftIcon
                    className="h-3 w-3 ml-1.5"
                    style={{
                      stroke: "url(#cornerGradient)",
                    }}
                  />
                  <svg height="0" width="0">
                    <defs>
                      <linearGradient id="cornerGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#B99476" />
                        <stop offset="100%" stopColor="#5AA897" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex gap-1 -ml-1 mt-0.5">
                    <IconImage size={3} src={pintoIcon} />
                    <div>
                      <span className="text-black text-xs">
                        {formatter.number(plot.pods.mul(plot.beansPerPod), { minValue: 0.01 })}
                      </span>
                      {" at "}
                      <span className="text-black text-xs">
                        {`${formatter.number((1 / plot.beansPerPod.toNumber()) * 100 - 100, {
                          minValue: 0.01,
                        })}%`}
                      </span>
                    </div>
                  </div>
                </div>
                {plot.source === "MARKET" ? (
                  <div className="text-pinto-light text-xs ml-2">Purchased on Pod Market</div>
                ) : plot.source === "TRANSFER" && plot.preTransferOwner ? (
                  <div className="text-pinto-light text-xs ml-2">
                    Transferred from {truncateHex(plot.preTransferOwner, 6, 4)}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-pinto-light text-xs">Temperature data unavailable for this Plot</div>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right pl-0">
          <div className="inline-flex items-center gap-1.5">
            <div className="hidden sm:block pinto-body-light text-pinto-light">{` at `}</div>
            <div className="pinto-sm sm:pinto-body-light inline-flex gap-1">
              {placeInLine.gt(999999) && isMobile
                ? placeInLine.toHuman("ultraShort")
                : formatter.number(isHarvesting ? TokenValue.ZERO : placeInLine.eq(0) ? 0.001 : placeInLine, {
                    minValue: 0.01,
                  })}
              <span className="block sm:hidden md:block lg:hidden min-[1350px]:block text-pinto-light">
                in the Pod Line
              </span>
              <span className="hidden sm:block md:hidden lg:block min-[1350px]:hidden text-pinto-light">in Line</span>
            </div>
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
  disableHover,
}: {
  selected?: string[];
  useToggle?: boolean;
  showClaimable?: boolean;
  disableHover?: boolean;
}) {
  const farmerField = useFarmerField();
  const harvestableIndex = useHarvestableIndex();
  const isMobile = useIsMobile();

  const hasHarvestablePods = farmerField.plots.some((plot) => plot.harvestablePods.gt(0));
  // Show only plots that have non-harvestable pods
  const plotsToShow = farmerField.plots.filter((plot) => plot.unharvestablePods?.gt(0));

  // Update the harvestable plot logic to only use it for the claimable row
  const harvestablePlot = hasHarvestablePods
    ? {
        ...(farmerField.plots.find((plot) => plot.harvestablePods.gt(0)) || farmerField.plots[0]),
        // For the claimable row, we only want to show harvestable pods
        pods: farmerField.plots.reduce((sum, plot) => sum.add(plot.harvestablePods), TokenValue.ZERO),
      }
    : undefined;

  const numHarvestable = useMemo(() => {
    return farmerField.plots.reduce((sum, plot) => {
      const harvestable = plot.harvestablePods ? plot.harvestablePods : plot.harvestablePods;
      return sum.add(harvestable);
    }, TokenValue.ZERO);
  }, [farmerField.plots]);

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
                isMobile={isMobile}
              />
            </ToggleGroupItem>
          ) : (
            <PlotRow
              plot={harvestablePlot}
              harvestableIndex={harvestableIndex}
              key={`plot_${harvestablePlot.index.toHuman()}`}
              numHarvestable={numHarvestable}
              showClaimable
              isMobile={isMobile}
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
                  isMobile={isMobile}
                />
              </ToggleGroupItem>
            );
          }
          return (
            <PlotRow
              plot={plot}
              harvestableIndex={harvestableIndex}
              key={`plot_${plot.index.toHuman()}`}
              disableHover={disableHover}
              isMobile={isMobile}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}
