import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import eyeballCrossed from "@/assets/misc/eyeball-crossed.svg";
import IconImage from "@/components/ui/IconImage";
import { SeasonsTableData } from "@/state/useSeasonsData";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { TooltipContent, TooltipPortal } from "@radix-ui/react-tooltip";
import { seasonColumns, SortColumn } from "@/pages/explorer/SeasonsExplorer";
import { Separator } from "@/components/ui/Separator";
import { TokenValue } from "@/classes/TokenValue";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { areEqual, ListChildComponentProps, VariableSizeList } from "react-window";

enum SeasonsTableCellType {
  Default = "default",
  TwoColumn = "twoColumn",
}

interface SeasonsTableCellProps {
  cellType?: SeasonsTableCellType;
  columnKey: string;
  value?: any;
  subValue?: any;
  className?: string;
  hoverContent?: any;
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
const DeltaDemandChart = () => {
  const lowerBound = 15000;
  const upperBound = 15000;
  const secondLowerBound = 24000;
  const secondUpperBound = 24000;
  return (
    <div className="w-[600px] bg-white rounded-md p-6 border border-pinto-gray-2">
      <span>Demand for Soil is increasing</span>
      <div className="flex text-sm mt-2 gap-1 items-center">
        <div className="rounded-full w-3 h-3 bg-pinto-green-4" />
        <span>Season 998</span>
        <span className="text-pinto-gray-4">(33% Temp)</span>
        <span>-</span>
        <span className="text-pinto-gray-4">Amount Sown:</span>
        <span>
          {lowerBound}/{upperBound}
        </span>
        <span className="text-pinto-gray-4">(100%)</span>
      </div>
      <div className="flex text-sm mt-2 gap-1 items-center">
        <div className="rounded-full w-3 h-3 bg-pinto-morning-yellow-1" />
        <span>Season 999</span>
        <span className="text-pinto-gray-4">(32% Temp)</span>
        <span>-</span>
        <span className="text-pinto-gray-4">Amount Sown:</span>
        <span>
          {secondLowerBound}/{secondUpperBound}
        </span>
        <span className="text-pinto-gray-4">(100%)</span>
      </div>
      <div className="w-full h-[200px] bg-pinto-gray-1 rounded-md mt-2">Super Slick Chart here</div>
      <Separator className="my-4" />
      <div className="flex flex-col">
        <span className="text-base">Demand for Soil</span>
        <span className="text-xl">Increasing</span>
        <span className="text-base mt-4 text-pinto-gray-4">Soil - 1 Sown a Season 998: XX:20</span>
        <span className="text-base text-pinto-gray-4">Soil - 1 Sown a Season 997: XX:25</span>
      </div>
    </div>
  );
};
const TwoColumnCell = ({
  className,
  value,
  subValue,
  hoverContent,
}: { className: string; value: any; subValue: any; hoverContent?: any }): JSX.Element => {
  const cellContent = (
    <div className="flex flex-col items-end">
      <span>{value}</span>
      <span className="text-xs break-keep text-pinto-gray-4">{subValue}</span>
    </div>
  );
  return hoverContent ? (
    <TableCell className={className}>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>{cellContent}</TooltipTrigger>
          <TooltipPortal>
            <TooltipContent className="z-50 overflow-hidden" side="right" sideOffset={4}>
              {hoverContent}
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  ) : (
    <TableCell className={className}>{cellContent}</TableCell>
  );
};

const calculateCropScales = (value: number, isRaining: boolean) => {
  const minInput = 0;
  const maxInput = 1e18 * 100; // value is 1-100 not 0.0 -  1.0
  const maxOutput = 100;

  // Calculate crop scalar
  const scalarMinOutput = 0;
  const scalarValue = scalarMinOutput + ((value - minInput) * (maxOutput - scalarMinOutput)) / (maxInput - minInput);
  const cropScalar = (Math.min(Math.max(scalarValue, scalarMinOutput), maxOutput)).toFixed(1);

  // Calculate crop ratio
  const ratioMinOutput = isRaining ? 33 : 50;
  const ratioValue = ratioMinOutput + ((value - minInput) * (maxOutput - ratioMinOutput)) / (maxInput - minInput);
  const cropRatio = Math.min(Math.max(ratioValue, ratioMinOutput), maxOutput).toFixed(1);

  return {
    cropScalar,
    cropRatio,
  };
};

const convertDeltaDemandToPercentage = (deltaDemand: number) => {
  if (deltaDemand === 0) return "0%";
  if (deltaDemand === 1e18) return "100%";
  if (deltaDemand === 1e36) return "∞%";

  // Scale the value between 0-100%
  const scaledValue = (deltaDemand / 1e18) * 100;
  return `${TokenValue.fromHuman(scaledValue, 0).toHuman("short")}%`;
}

const caseIdToDescriptiveText = (caseId: number, column: "price" | "soil_demand" | "pod_rate" | "l2sr") => {
  switch (column) {
    case "price":
      if ((caseId % 36) % 9 < 3) return "P < $1.00";
      else if ((caseId % 36) % 9 < 6) return "P > $1.00";
      //(caseId % 36 < 9)
      else return "P > Q";
    case "soil_demand":
      if (caseId % 3 === 0) return "Decreasing";
      else if (caseId % 3 === 1) return "Steady";
      else return "Increasing";
    case "pod_rate":
      if ((caseId % 36) / 9 === 0) return "Excessively Low";
      else if ((caseId % 36) / 9 === 1) return "Reasonably Low";
      else if ((caseId % 36) / 9 === 2) return "Reasonably High";
      else return "Excessively High";
    case "l2sr":
      if (caseId / 36 === 0) {
        return "Extremely Low";
      } else if (caseId / 36 === 1) {
        return "Reasonably Low";
      } else if (caseId / 36 === 2) {
        return "Reasonably High";
      } else {
        return "Extremely High";
      }
  }
};

const nonHideableFields = ["season"];
const paginationPadding = 64

interface SeasonsTableProps {
  seasonsData: SeasonsTableData[];
  hiddenFields: string[];
  hideColumn: (id: string) => void;
  toggleColumn: (id: string) => void;
  sortedColumn: SortColumn;
  setSortedColumn: (column: SortColumn) => void;
}

// const getRotationClassNameForColumn = (column: SortColumn, id: string) => {
//   if (column.column === id) {
//     return column.dir === 'asc' ? 'rotate-90' : '-rotate-90';
//   }
//   return '-rotate-90';
// }

// const getRotationForColumn = (column: SortColumn, id: string) => {
//   // desc is default, otherwise flip the direction
//   if (column.column === id) {
//     return column.dir === 'asc' ? 'desc' : 'asc';
//   }
//   return 'desc';
// }

export const SeasonsTable = ({ seasonsData, hiddenFields, hideColumn, sortedColumn, setSortedColumn }: SeasonsTableProps) => {

  const tableRef = useRef<HTMLTableElement>(null);
  const [height, setHeight] = useState(500);

  const SeasonsTableCell = ({
    cellType = SeasonsTableCellType.Default,
    columnKey,
    value,
    subValue,
    className = "text-right",
    hoverContent,
  }: SeasonsTableCellProps) => {
    if (hiddenFields.includes(columnKey)) return null;
    const column = seasonColumns.find(c => c.id === columnKey);
    const additionalClasses = column?.classes;
    switch (cellType) {
      case SeasonsTableCellType.TwoColumn:
        return <TwoColumnCell className={`${className} ${additionalClasses}`} value={value} subValue={subValue} hoverContent={hoverContent} />;
      default:
        return hoverContent ? (
          <TableCell className={`${className} ${additionalClasses}`}>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>{value}</TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent className="z-50 overflow-hidden" side="right" sideOffset={4}>
                    {hoverContent}
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
        ) : (
          <TableCell className={`${className} ${additionalClasses}`}>{value}</TableCell>
        );
    }
  };

  const calculatedWidth = useMemo(() => {
    return seasonColumns.reduce((acc, column) => {
      if (hiddenFields.includes(column.id)) return acc;
      return acc + column.width
    }, 0);
  }, [hiddenFields]);

  const calculateHeight = () => {
    const offset = 575//tableRef.current?.offsetHeight || 0;
    if (!offset) {
      return;
    }
    const windowHeight = window.innerHeight;
    const newHeight = windowHeight - offset
    setHeight(Math.max(newHeight - paginationPadding, 500))
  }

  useEffect(() => {
    window.addEventListener('resize', calculateHeight);
    return () => {
      window.removeEventListener('resize', calculateHeight);
    }
  }, [])

  useEffect(() => {
    calculateHeight();
  }, [seasonsData])

  const RenderRow = React.memo(({ index, style }: ListChildComponentProps<SeasonsTableData>) => {
    const data = seasonsData[index];
    const { cropScalar, cropRatio } = calculateCropScales(data.beanToMaxLpGpPerBdvRatio, data.raining);
    const deltaCropScalar = (data.deltaBeanToMaxLpGpPerBdvRatio / 1e18).toFixed(1);
    // Hide the first 3 seasons because the data is crazy as the system wasn't yet initialized
    if (data.season <= 3) {
      return (
        <TableRow key={data.season} style={style} noHoverMute>
          {seasonColumns.map(({ id, name, classes }) => {
            return (
              <SeasonsTableCell key={id} columnKey={id} value={id === 'season' ? data.season : 'N/A'} />
            )
          })}
        </TableRow>
      )
    }
    return (
      <TableRow key={data.season} style={style} noHoverMute>
        <SeasonsTableCell className="text-left" columnKey="season" value={data.season} />
        <SeasonsTableCell
          columnKey="instantDeltaP"
          value={`${data.instDeltaB.toNumber() > 0 ? "+" : ""}${data.instDeltaB.toHuman("short")}`}
        />
        <SeasonsTableCell
          columnKey="twaDeltaP"
          value={`${data.twaDeltaB.toNumber() > 0 ? "+" : ""}${data.twaDeltaB.toHuman("short")}`}
        />
        <SeasonsTableCell
          columnKey="pintoSupply"
          value={`${data.deltaBeans.toNumber() > 0 ? "+" : ""}${data.deltaBeans.toHuman("short")}`}
        />
        <SeasonsTableCell
          columnKey="totalSoil"
          value={data.issuedSoil.toHuman("short")}
        />
        <SeasonsTableCell
          cellType={SeasonsTableCellType.TwoColumn}
          columnKey="soilSown"
          value={data.deltaSownBeans.toHuman("short")}
          subValue={`Total: ${data.sownBeans.toHuman("short")}`}
        />
        <SeasonsTableCell
          columnKey="timeSown"
          value={data.blocksToSoldOutSoil}
        />
        <SeasonsTableCell
          columnKey="price"
          value={`$${data.price.toNumber().toFixed(4)}`}
        />
        <SeasonsTableCell
          cellType={SeasonsTableCellType.TwoColumn}
          columnKey="twaPrice"
          value={`$${data.twaPrice.toHuman("short")}`}
          subValue={caseIdToDescriptiveText(data.caseId, "price")}
        />
        <SeasonsTableCell
          cellType={SeasonsTableCellType.TwoColumn}
          columnKey="l2sr"
          value={`${data.l2sr.toHuman("short")}%`}
          subValue={caseIdToDescriptiveText(data.caseId, "l2sr")}
        />
        <SeasonsTableCell
          cellType={SeasonsTableCellType.TwoColumn}
          columnKey="podRate"
          value={`${data.podRate.toHuman("short")}%`}
          subValue={caseIdToDescriptiveText(data.caseId, "pod_rate")}
        />
        <SeasonsTableCell
          cellType={SeasonsTableCellType.TwoColumn}
          columnKey="deltaDemand"
          value={convertDeltaDemandToPercentage(data.deltaPodDemand.toNumber())}
          subValue={caseIdToDescriptiveText(data.caseId, 'soil_demand')}
        // hoverContent={
        //   <DeltaDemandChart />
        // }
        />
        <SeasonsTableCell
          columnKey="cropScalar"
          value={
            <>
              <span>{cropScalar}&nbsp;</span>
              <span className="text-pinto-gray-4">
                ({Number(deltaCropScalar) > 0 ? "+" : ""}
                {deltaCropScalar})
              </span>
            </>
          } />
        <SeasonsTableCell
          columnKey="cropRatio"
          value={`${cropRatio}%`}
        />
        <SeasonsTableCell
          cellType={SeasonsTableCellType.TwoColumn}
          columnKey="temperature"
          value={
            <>
              <span>{data.temperature.toFixed(1)}%&nbsp;</span>
              <span className="text-pinto-gray-4">
                ({data.deltaTemperature > 0 ? "+" : ""}
                {data.deltaTemperature.toFixed(1)}%)
              </span>
            </>
          }
          subValue={"Temperature"}
        />
      </TableRow>
    );
  }, areEqual);

  return (
    <Table overscroll className="table-fixed w-[0px]" ref={tableRef}>
      <TableHeader>
        <TableRow noHoverMute className="bg-gradient-light z-[1] [&>*]:text-pinto-gray-5">
          {seasonColumns.map(({ id, name, classes, width }) => {
            if (hiddenFields.includes(id)) return null;
            const widthClass = `w-[${width}px]`;
            return (
              <TableHead className={`sticky top-0 z-[1] ${classes} ${widthClass}`} key={id}>
                {!nonHideableFields.includes(id) ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger >
                        <span>{name}</span>
                      </TooltipTrigger>
                      <TooltipPortal>
                        <TooltipContent className="z-50 overflow-hidden flex" side="left" sideOffset={4}>
                          {/* <IconImage
                            className={`cursor-pointer ${getRotationClassNameForColumn(sortedColumn, id)}`}
                            onClick={() => setSortedColumn({ column: id, dir: getRotationForColumn(sortedColumn, id) })}
                            src={leftArrowIcon}
                            size={4} /> */}
                          <IconImage className="cursor-pointer" onClick={() => hideColumn(id)} src={eyeballCrossed} size={4} />
                        </TooltipContent>
                      </TooltipPortal>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span>{name}</span>
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {!seasonsData.length && (
          <TableRow key="Empty">
            <TableCell colSpan={seasonColumns.length}>Currently No Data to show</TableCell>
          </TableRow>
        )}
        <VariableSizeList
          className="overscroll-auto"
          height={height}
          itemCount={seasonsData.length}
          itemSize={() => 50}
          width={calculatedWidth}
          overscanCount={4}
        >
          {RenderRow}
        </VariableSizeList>
      </TableBody>
    </Table >
  );
};
