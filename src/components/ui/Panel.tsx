import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import useIsMobile from "@/hooks/display/useIsMobile";
import { cn } from "@/utils/utils";
import { useMemo } from "react";
import { Card } from "./Card";

interface IBaseSidebar {
  top: number;
  isOpen: boolean;
  side: "left" | "right";
}

export interface ISidebar extends React.ComponentProps<typeof Card>, IBaseSidebar {}

export const Sidebar = ({ top, isOpen, side, className, ...props }: ISidebar) => {
  const translateClass = useMemo(() => {
    if (side === "left") {
      return isOpen ? `translate-x-6` : `-translate-x-full`;
    }
    return isOpen ? `translate-x-6` : `translate-x-full`;
  }, [isOpen, side]);

  return (
    <Card
      {...props}
      className={cn(
        `absolute box-border top-[${top}rem] transition-all overflow-clip h-[calc(100vh-6rem)] z-[51]`,
        side === "left" ? `left-0 transform ${translateClass} mr-12` : `right-0 transform ${translateClass} ml-12`,
        className,
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
  panelProps?: React.ComponentProps<typeof Card>;
  drawerProps?: React.ComponentProps<typeof Drawer>;
}

const Panel = ({ trigger, top, isOpen, side, toggle, panelProps, drawerProps, ...props }: IPanel) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer {...drawerProps} open={isOpen} onOpenChange={() => toggle()}>
        <DrawerTrigger>{trigger}</DrawerTrigger>
        <DrawerContent>{props.children}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <>
      {trigger}
      <>
        <Sidebar top={top} isOpen={isOpen} side={side} {...panelProps}>
          {props.children}
        </Sidebar>
      </>
    </>
  );
};

export default Panel;
