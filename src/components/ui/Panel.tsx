import { cn } from "@/utils/utils";
import { Card } from "./Card";

interface TransitionConfig {
  from: number;
  to: number;
}

export interface IPanel extends React.ComponentProps<typeof Card> {
  top: number;
  isOpen: boolean;
  left?: TransitionConfig;
  right?: TransitionConfig;
  width?: number;
}

const Panel = ({ children, top, isOpen, left, right, width, ...props }: IPanel) => {
  if (!left && !right) {
    return null;
  }

  return (
    <Card
      {...props}
      className={cn(
        `absolute top-[${top}rem] transition-all w-[min(${width}rem, calc(100vw - 6rem))] overflow-clip h-[calc(100vh-6rem)] z-[51]`,
        right && `${isOpen ? `right-[${right.to}rem]` : `-right-[${Math.abs(right.from)}rem]`} ml-6`,
        left && `${isOpen ? `left-[${left.to}rem]` : `-left-[${Math.abs(left.from)}rem]`} mr-6`,
        props.className,
      )}
    >
      {children}
    </Card>
  );
};

export default Panel;
