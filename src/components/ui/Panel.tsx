import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import useIsMobile from "@/hooks/display/useIsMobile";
import { cn } from "@/utils/utils";
import { useMemo } from "react";
import { Card } from "./Card";

export interface ISidebar extends React.ComponentProps<typeof Card> {
  top: number;
  isOpen: boolean;
  side: "left" | "right";
  width?: number;
}

export const Sidebar = ({ top, isOpen, side, width, ...props }: ISidebar) => {
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
        `absolute top-[${top}rem] w-[min(${width}rem, calc(100vw-6rem))] transition-all overflow-clip h-[calc(100vh-6rem)] z-[51]`,
        side === "left" ? `left-0 transform ${translateClass} mr-6` : `right-0 transform ${translateClass} ml-6`,
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

const Panel = ({ trigger, top, isOpen, side, width, toggle, ...props }: IPanel) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={() => toggle()}>
        <DrawerTrigger>{trigger}</DrawerTrigger>
        <DrawerContent>{props.children}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <>
      {trigger}
      <>
        <Sidebar top={top} isOpen={isOpen} side={side} width={width}>
          {props.children}
        </Sidebar>
      </>
    </>
  );
};

export default Panel;
