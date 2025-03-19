import { TableCell } from "@/components/ui/Table";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { TooltipContent, TooltipPortal } from "@radix-ui/react-tooltip";
import { seasonColumns } from "@/pages/explorer/SeasonsExplorer";
import { TwoColumnCell } from "./TwoColumnCell";

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