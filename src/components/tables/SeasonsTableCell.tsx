import { TableCell } from "@/components/ui/Table";
import { seasonColumns } from "@/pages/explorer/SeasonsExplorer";
import { TwoColumnCell } from "./TwoColumnCell";
import TooltipSimple from "../TooltipSimple";
export enum SeasonsTableCellType {
  Default = "default",
  TwoColumn = "twoColumn",
}

export interface SeasonsTableCellProps {
  cellType?: SeasonsTableCellType;
  columnKey: string;
  value?: any;
  subValue?: any;
  className?: string;
  hoverContent?: any;
  hiddenFields: string[];
}

export const SeasonsTableCell = ({
  cellType = SeasonsTableCellType.Default,
  columnKey,
  value,
  subValue,
  className = "text-right",
  hoverContent,
  hiddenFields,
}: SeasonsTableCellProps) => {
  if (hiddenFields.includes(columnKey)) return null;
  const column = seasonColumns.find(c => c.id === columnKey);
  const additionalClasses = column?.classes;

  switch (cellType) {
    case SeasonsTableCellType.TwoColumn:
      return <TwoColumnCell className={`${className} ${additionalClasses}`} value={value} subValue={subValue} hoverContent={hoverContent} hiddenFields={hiddenFields} />;
    default:
      return hoverContent ? (
        <TableCell className={`${className} ${additionalClasses} group`}>
          <div className="flex items-center justify-end gap-2">
            <div className="opacity-0 group-hover:opacity-100">{hoverContent}</div>
            {value}
          </div>
        </TableCell>
      ) : (
        <TableCell className={`${className} ${additionalClasses}`}>{value}</TableCell>
      );
  }
}; 