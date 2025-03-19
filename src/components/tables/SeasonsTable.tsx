import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import eyeballCrossed from "@/assets/misc/eyeball-crossed.svg";
import IconImage from "@/components/ui/IconImage";
import { SeasonsTableData } from "@/state/useSeasonsData";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { TooltipContent, TooltipPortal } from "@radix-ui/react-tooltip";
import { seasonColumns, SortColumn } from "@/pages/explorer/SeasonsExplorer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { areEqual, ListChildComponentProps, VariableSizeList } from "react-window";
import useIsMobile from "@/hooks/display/useIsMobile";
import { calculateCropScales, convertDeltaDemandToPercentage } from "@/utils/convert";
import { caseIdToDescriptiveText } from "@/utils/utils";
import { SeasonsTableCell, SeasonsTableCellType } from "./SeasonsTableCell";
import TooltipSimple from "../TooltipSimple";

interface SeasonsTableProps {
  seasonsData: SeasonsTableData[];
  hiddenFields: string[];
  hideColumn: (id: string) => void;
}

export const nonHideableFields = ['season']

export const SeasonsTable = ({ seasonsData, hiddenFields, hideColumn }: SeasonsTableProps) => {

  const tableRef = useRef<HTMLTableElement>(null);
  const isMobile = useIsMobile();
  const [height, setHeight] = useState(500);
  const paginationPadding = isMobile ? 62 : 64

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
    setHeight(Math.max(newHeight - paginationPadding, 600))
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
          {seasonColumns.map(({ id }) => {
            return (
              <SeasonsTableCell key={id} columnKey={id} value={id === 'season' ? data.season : 'N/A'} hiddenFields={hiddenFields} />
            )
          })}
        </TableRow>
      )
    }
    return (
      <TableRow key={data.season} style={style} noHoverMute>
        <SeasonsTableCell className="text-left" columnKey="season" value={data.season} hiddenFields={hiddenFields} />
        <SeasonsTableCell
          columnKey="instantDeltaP"
          value={`${data.instDeltaB.toNumber() > 0 ? "+" : ""}${data.instDeltaB.toHuman("short")}`}
          hiddenFields={hiddenFields}
        />
        <SeasonsTableCell
          columnKey="twaDeltaP"
          value={`${data.twaDeltaB.toNumber() > 0 ? "+" : ""}${data.twaDeltaB.toHuman("short")}`}
          hiddenFields={hiddenFields}
        />
        <SeasonsTableCell
          columnKey="pintoSupply"
          value={`${data.deltaBeans.toNumber() > 0 ? "+" : ""}${data.deltaBeans.toHuman("short")}`}
          hiddenFields={hiddenFields}
        />
        <SeasonsTableCell
          columnKey="totalSoil"
          value={data.issuedSoil.toHuman("short")}
          hiddenFields={hiddenFields}
        />
        <SeasonsTableCell
          cellType={SeasonsTableCellType.TwoColumn}
          columnKey="soilSown"
          value={data.deltaSownBeans.toHuman("short")}
          subValue={`Total: ${data.sownBeans.toHuman("short")}`}
          hiddenFields={hiddenFields}
        />
        <SeasonsTableCell
          columnKey="timeSown"
          value={data.blocksToSoldOutSoil}
          hiddenFields={hiddenFields}
        />
        <SeasonsTableCell
          columnKey="price"
          value={`$${data.price.toNumber().toFixed(4)}`}
          hiddenFields={hiddenFields}
        />
        <SeasonsTableCell
          cellType={SeasonsTableCellType.TwoColumn}
          columnKey="twaPrice"
          value={`$${data.twaPrice.toHuman("short")}`}
          subValue={caseIdToDescriptiveText(data.caseId, "price")}
          hiddenFields={hiddenFields}
        />
        <SeasonsTableCell
          cellType={SeasonsTableCellType.TwoColumn}
          columnKey="l2sr"
          value={`${data.l2sr.toHuman("short")}%`}
          subValue={caseIdToDescriptiveText(data.caseId, "l2sr")}
          hiddenFields={hiddenFields}
        />
        <SeasonsTableCell
          cellType={SeasonsTableCellType.TwoColumn}
          columnKey="podRate"
          value={`${data.podRate.toHuman("short")}%`}
          subValue={caseIdToDescriptiveText(data.caseId, "pod_rate")}
          hiddenFields={hiddenFields}
        />
        <SeasonsTableCell
          cellType={SeasonsTableCellType.TwoColumn}
          columnKey="deltaDemand"
          value={convertDeltaDemandToPercentage(data.deltaPodDemand.toNumber())}
          subValue={caseIdToDescriptiveText(data.caseId, 'soil_demand')}
          hiddenFields={hiddenFields}
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
          }
          hiddenFields={hiddenFields}
        />
        <SeasonsTableCell
          columnKey="cropRatio"
          value={`${cropRatio}%`}
          hiddenFields={hiddenFields}
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
          hiddenFields={hiddenFields}
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
              <TableHead className={`sticky top-0 z-[1] ${classes}`} key={id} onClick={() => hideColumn(id)}>
                {!nonHideableFields.includes(id) ? (
                  <TooltipSimple
                    variant="unstyled"
                    rawTriggerClassName="hidden sm:inline-block cursor-pointer"
                    content={<IconImage className="cursor-pointer" src={eyeballCrossed} size={4} />}
                    side="left"
                    align="end"
                    sideOffset={4}
                  >
                    <span className="self-end">{name}</span>
                  </TooltipSimple>
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
          className="overscroll-auto sm:mb-16 mb-0"
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
