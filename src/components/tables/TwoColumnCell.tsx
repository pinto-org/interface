import { TableCell } from "@/components/ui/Table";
import { cn } from "@/utils/utils";

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
    <TableCell className={cn(className, "group")}>
      <div className="flex items-center justify-end gap-2">
        <div className="opacity-0 group-hover:opacity-100">{hoverContent}</div>
        {cellContent}
      </div>
    </TableCell>
  ) : (
    <TableCell className={className}>{cellContent}</TableCell>
  );
}; 