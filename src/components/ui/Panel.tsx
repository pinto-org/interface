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
}

export interface ISidebar extends React.ComponentProps<typeof Card>, IBaseSidebar {}

export const Sidebar = ({ isOpen, side, className, ...props }: ISidebar) => {
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
        `absolute box-border top-[${top}rem] transition-all overflow-clip h-[calc(100vh-${renderAnnouncement ? 8 : 6}rem)] z-[51]`,
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
        <Sidebar isOpen={isOpen} side={side} {...panelProps}>
          {props.children}
        </Sidebar>
      </>
    </>
  );
};

export default Panel;

export const TabletPanel = ({ trigger, isOpen, side, toggle, panelProps, drawerProps, ...props }: IPanel) => {
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
        <Sidebar isOpen={isOpen} side={side} {...panelProps}>
          {props.children}
        </Sidebar>
      </>
    </>
  );
};
