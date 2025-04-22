import { TableCell } from "@/components/ui/Table";
import { seasonColumns } from "@/pages/explorer/SeasonsExplorer";
import TooltipSimple from "../TooltipSimple";
import { TwoColumnCell } from "./TwoColumnCell";
export enum SeasonsTableCellType {
  Default = "default",
  TwoColumn = "twoColumn",
}

export interface SeasonsTableCellProps {
  cellType?: SeasonsTableCellType;
  columnKey: string;
  notApplicable?: boolean;
  value?: any;
  subValue?: any;
  className?: string;
  hoverContent?: any;
  hiddenFields: string[];
}

export const SeasonsTableCell = ({
  cellType = SeasonsTableCellType.Default,
  columnKey,
  notApplicable = false,
  value,
  subValue,
  className = "text-right",
  hoverContent,
  hiddenFields,
}: SeasonsTableCellProps) => {
  if (hiddenFields.includes(columnKey)) return null;
  const column = seasonColumns.find((c) => c.id === columnKey);
  const additionalClasses = column?.classes;
  const displayValue = notApplicable ? "N/A" : value;
  const displaySubValue = notApplicable ? "N/A" : subValue;

  switch (cellType) {
    case SeasonsTableCellType.TwoColumn:
      return (
        <TwoColumnCell
          className={`${className} ${additionalClasses}`}
          columnKey={columnKey}
          value={displayValue}
          subValue={displaySubValue}
          hoverContent={hoverContent}
        />
      );
    default:
      return hoverContent ? (
        <TableCell className={`${className} ${additionalClasses} group`}>
          <div className="flex items-center justify-end gap-2">
            <div className="opacity-0 group-hover:opacity-100">{hoverContent}</div>
            {displayValue}
          </div>
        </TableCell>
      ) : (
        <TableCell className={`${className} ${additionalClasses}`}>{displayValue}</TableCell>
      );
  }
};
