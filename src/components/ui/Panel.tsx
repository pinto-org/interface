import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import useIsMobile from "@/hooks/display/useIsMobile";
import { cn } from "@/utils/utils";
import { Card } from "./Card";

interface TransitionConfig {
  from: number;
  to: number;
}

export interface ISidebar extends React.ComponentProps<typeof Card> {
  top: number;
  isOpen: boolean;
  left?: TransitionConfig;
  right?: TransitionConfig;
  width?: number;
}

export const Sidebar = ({ top, isOpen, left, right, width, ...props }: ISidebar) => {
  if (!left && !right) {
    return null;
  }

  return (
    <Card
      {...props}
      className={cn(
        `fixed flex flex-col top-[${top}rem] transition-all w-[min(${width}rem, calc(100vw - 6rem))] overflow-clip h-[calc(100vh-6rem)] z-[51]`,
        right && `${isOpen ? `right-[${right.to}rem]` : `-right-[${Math.abs(right.from)}rem]`} ml-6`,
        left && `${isOpen ? `left-[${left.to}rem]` : `-left-[${Math.abs(left.from)}rem]`} mr-6`,
        props.className,
      )}
    >
      {props.children}
    </Card>
  );
};

interface IPanel extends ISidebar {
  trigger: React.ReactNode;
  children: React.ReactNode;
  toggle: () => void;
}

const Panel = ({ trigger, top, isOpen, left, right, width, toggle, ...props }: IPanel) => {
  const isMobile = useIsMobile();

  return !isMobile ? (
    <>
      {trigger}
      <Sidebar top={top} isOpen={isOpen} left={left} right={right} width={width}>
        {props.children}
      </Sidebar>
    </>
  ) : (
    <Drawer open={isOpen} onOpenChange={toggle}>
      <DrawerTrigger>{trigger}</DrawerTrigger>
      <DrawerContent>{props.children}</DrawerContent>
    </Drawer>
  );
};

export default Panel;
