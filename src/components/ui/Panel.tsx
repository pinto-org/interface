import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/Drawer";
import useIsMobile from "@/hooks/display/useIsMobile";
import useIsTablet from "@/hooks/display/useIsTablet";
import { cn } from "@/utils/utils";
import { useMemo } from "react";
import { renderAnnouncement } from "../AnnouncementBanner";
import { Card } from "./Card";

interface IBaseSidebar {
  isOpen: boolean;
  side: "left" | "right";
  fitHeight?: boolean;
}

export interface ISidebar extends React.ComponentProps<typeof Card>, IBaseSidebar {}

export const Sidebar = ({ isOpen, side, className, fitHeight = true, ...props }: ISidebar) => {
  const translateClass = useMemo(() => {
    if (side === "left") {
      return isOpen ? `translate-x-6` : `-translate-x-full`;
    }
    return isOpen ? `translate-x-6` : `translate-x-full`;
  }, [isOpen, side]);

  const heightClasses = fitHeight ? `top-4 max-h-[calc(100vh-${renderAnnouncement ? 8 : 6}rem)] h-fit` : "";

  return (
    <Card
      {...props}
      className={cn(
        `absolute box-border transition-all overflow-clip z-[51]`,
        heightClasses,
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
  screenReaderTitle?: string;
}

const Panel = ({
  trigger,
  isOpen,
  side,
  fitHeight,
  toggle,
  panelProps,
  drawerProps,
  screenReaderTitle = "Panel",
  ...props
}: IPanel) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer {...drawerProps} open={isOpen} onOpenChange={() => toggle()}>
        <DrawerTrigger>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="sr-only">{screenReaderTitle}</DrawerTitle>
          {props.children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <>
      {trigger}
      <>
        <Sidebar isOpen={isOpen} side={side} fitHeight={fitHeight} {...panelProps}>
          {props.children}
        </Sidebar>
      </>
    </>
  );
};

export default Panel;

export const TabletPanel = ({
  trigger,
  isOpen,
  side,
  fitHeight,
  toggle,
  panelProps,
  drawerProps,
  ...props
}: IPanel) => {
  const isTablet = useIsTablet();

  if (isTablet) {
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
        <Sidebar isOpen={isOpen} side={side} fitHeight={fitHeight} {...panelProps}>
          {props.children}
        </Sidebar>
      </>
    </>
  );
};
