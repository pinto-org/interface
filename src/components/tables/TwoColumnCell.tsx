import { TableCell } from "@/components/ui/Table";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { TooltipContent, TooltipPortal } from "@radix-ui/react-tooltip";

interface TwoColumnCellProps {
  className: string;
  value: any;
  subValue: any;
  hoverContent?: any;
  hiddenFields: string[];
}

export const TwoColumnCell = ({
  className,
  value,
  subValue,
  hoverContent,
  hiddenFields,
}: TwoColumnCellProps): JSX.Element | null => {
  if (hiddenFields.includes(value)) return null;
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