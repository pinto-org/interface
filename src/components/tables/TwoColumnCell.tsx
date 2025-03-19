import { TableCell } from "@/components/ui/Table";
import TooltipSimple from "../TooltipSimple";

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
      <TooltipSimple
        content={hoverContent}
        variant="unstyled"
        rawTriggerClassName="hidden sm:inline-block"
        clickable
      >
        {cellContent}
      </TooltipSimple>
    </TableCell>
  ) : (
    <TableCell className={className}>{cellContent}</TableCell>
  );
}; 