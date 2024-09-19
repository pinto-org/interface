import { ReactNode } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/Tooltip"
  
  interface ParentComponentProps {
    children: ReactNode;
    content: ReactNode;
    props?: [x: string];
  }

export default function TooltipSimple({children, content, ...props}: ParentComponentProps) {

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
              {children}
          </TooltipTrigger>
          <TooltipContent {...props}>
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
};