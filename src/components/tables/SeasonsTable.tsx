import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import eyeballCrossed from "@/assets/misc/eyeball-crossed.svg";
import IconImage from "@/components/ui/IconImage";
import { SeasonsTableData } from "@/state/useSeasonsData";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { TooltipContent, TooltipPortal } from "@radix-ui/react-tooltip";
import { seasonColumns, SortColumn } from "@/pages/explorer/SeasonsExplorer";
import { TokenValue } from "@/classes/TokenValue";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { areEqual, ListChildComponentProps, VariableSizeList } from "react-window";
import useIsMobile from "@/hooks/display/useIsMobile";
import { calculateCropScales, convertDeltaDemandToPercentage, convertDeltaDemandToPercentage } from "@/utils/convert";
import { caseIdToDescriptiveText } from "@/utils/utils";

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

const nonHideableFields = ["season"];

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
  const isMobile = useIsMobile();
  const [height, setHeight] = useState(500);
  const paginationPadding = isMobile ? 62 : 64


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
    const offset = isMobile ? 225 : 575//tableRef.current?.offsetHeight || 0;
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
        <TableRow noHoverMute className="z-[1] [&>*]:text-pinto-gray-5">
          {seasonColumns.map(({ id, name, classes }) => {
            if (hiddenFields.includes(id)) return null;
            return (
              <TableHead className={`sticky top-0 z-[1] ${classes}`} key={id}>
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
