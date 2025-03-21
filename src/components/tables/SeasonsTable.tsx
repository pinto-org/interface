import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import eyeballCrossed from "@/assets/misc/eyeball-crossed.svg";
import IconImage from "@/components/ui/IconImage";
import { SeasonsTableData } from "@/state/useSeasonsData";
import { seasonColumns } from "@/pages/explorer/SeasonsExplorer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { areEqual, ListChildComponentProps, VariableSizeList } from "react-window";
import useIsMobile from "@/hooks/display/useIsMobile";
import { calculateCropScales, convertDeltaDemandToPercentage } from "@/utils/convert";
import { caseIdToDescriptiveText } from "@/utils/utils";
import { SeasonsTableCell, SeasonsTableCellType } from "./SeasonsTableCell";

interface SeasonsTableProps {
  seasonsData: SeasonsTableData[];
  hiddenFields: string[];
  hideColumn: (id: string) => void;
}

export const nonHideableFields = ['season']
const paginationPadding = 50;


export const SeasonsTable = ({ seasonsData, hiddenFields, hideColumn }: SeasonsTableProps) => {

  const tableRef = useRef<HTMLTableElement>(null);
  const isMobile = useIsMobile();
  const [height, setHeight] = useState(500);

  const calculatedWidth = useMemo(() => {
    return seasonColumns.reduce((acc, column) => {
      if (hiddenFields.includes(column.id)) return acc;
      return acc + column.width
    }, 0);
  }, [hiddenFields]);

  const calculateHeight = () => {
    const elem = document.getElementById('pinto-navbar')
    if (!elem) {
      return;
    }
    const windowHeight = window.innerHeight;
    const headerOffset = elem?.getBoundingClientRect().height
    let columnDropdownOffset;
    if (window.screen.width < 768) {
      columnDropdownOffset = 105;
    } else if (window.screen.width < 1600) {
      columnDropdownOffset = 80;
    } else {
      columnDropdownOffset = 120;
    }
    const newHeight = windowHeight - headerOffset - paginationPadding - columnDropdownOffset
    setHeight(newHeight)
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
              <TableHead className={`sticky top-0 z-[1] ${classes} group ${!nonHideableFields.includes(id) ? 'cursor-pointer' : ''}`} key={id} onClick={() => hideColumn(id)}>
                {!nonHideableFields.includes(id) ? (
                  <div className="flex items-center justify-end gap-2">
                    <IconImage className="cursor-pointer opacity-0 group-hover:opacity-100" src={eyeballCrossed} size={4} />
                    <span>{name}</span>
                  </div>
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
          className="overscroll-auto mb-[50px]"
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
