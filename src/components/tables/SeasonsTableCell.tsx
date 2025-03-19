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
        <TableCell className={`${className} ${additionalClasses}`}>
          <TooltipSimple
            content={hoverContent}
            variant="unstyled"
            rawTriggerClassName="hidden sm:inline-block cursor-pointer"
          >
            {value}
          </TooltipSimple>
        </TableCell>
      ) : (
        <TableCell className={`${className} ${additionalClasses}`}>{value}</TableCell>
      );
  }
}; 