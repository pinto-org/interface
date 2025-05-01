import useIsMobile from "@/hooks/display/useIsMobile";
import { ComponentProps, createContext, forwardRef, useContext } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./Popover";

type PopoverRootProps = ComponentProps<typeof Popover>;
type DrawerRootProps = ComponentProps<typeof Drawer>;

interface ResponsivePopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  popoverProps?: Omit<PopoverRootProps, "open" | "onOpenChange">;
  drawerProps?: Omit<DrawerRootProps, "open" | "onOpenChange" | "fadeFromIndex">;
}

const ResponsivePopoverContext = createContext(false);

const ResponsivePopover = ({
  open,
  onOpenChange,
  children,
  popoverProps = {},
  drawerProps = {},
}: ResponsivePopoverProps) => {
  const isDesktop = !useIsMobile();

  return (
    <ResponsivePopoverContext.Provider value={isDesktop}>
      {isDesktop ? (
        <Popover open={open} onOpenChange={onOpenChange} {...popoverProps}>
          {children}
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange} {...drawerProps}>
          {children}
        </Drawer>
      )}
    </ResponsivePopoverContext.Provider>
  );
};

const Trigger = forwardRef<HTMLButtonElement, ComponentProps<typeof PopoverTrigger>>((props, ref) => {
  const isDesktop = useContext(ResponsivePopoverContext);
  const Component = isDesktop ? PopoverTrigger : DrawerTrigger;
  return <Component ref={ref} {...props} />;
});
Trigger.displayName = "ResponsivePopover.Trigger";

interface ContentProps extends ComponentProps<typeof PopoverContent> {
  popoverProps?: ComponentProps<typeof PopoverContent>;
  drawerProps?: ComponentProps<typeof DrawerContent>;
  drawerHeader?: React.ReactNode;
  drawerTitle?: React.ReactNode;
  drawerDescription?: React.ReactNode;
  drawerFooter?: React.ReactNode;
}

const Content = forwardRef<HTMLDivElement, ContentProps>(
  (
    {
      popoverProps = {},
      drawerProps = {},
      drawerHeader,
      drawerTitle,
      drawerDescription,
      drawerFooter,
      children,
      ...props
    },
    ref,
  ) => {
    const isDesktop = useContext(ResponsivePopoverContext);

    if (isDesktop) {
      return (
        <PopoverContent ref={ref} {...props} {...popoverProps}>
          {children}
        </PopoverContent>
      );
    }

    return (
      <DrawerContent ref={ref} {...drawerProps}>
        {drawerHeader || drawerTitle || drawerDescription ? (
          <DrawerHeader>
            {drawerTitle && <DrawerTitle>{drawerTitle}</DrawerTitle>}
            {drawerDescription && <DrawerDescription>{drawerDescription}</DrawerDescription>}
            {drawerHeader}
          </DrawerHeader>
        ) : null}
        {children}
        {drawerFooter && <DrawerFooter>{drawerFooter}</DrawerFooter>}
      </DrawerContent>
    );
  },
);
Content.displayName = "ResponsivePopover.Content";

const Close = forwardRef<HTMLButtonElement, ComponentProps<typeof DrawerClose>>((props, ref) => {
  const isDesktop = useContext(ResponsivePopoverContext);

  if (!isDesktop) {
    return <DrawerClose ref={ref} {...props} />;
  }

  // PopoverClose doesn't exist, so we just return the children or null
  return props.children ? <>{props.children}</> : null;
});
Close.displayName = "ResponsivePopover.Close";

const Anchor = PopoverAnchor;

ResponsivePopover.Trigger = Trigger;
ResponsivePopover.Content = Content;
ResponsivePopover.Close = Close;
ResponsivePopover.Anchor = Anchor;

export { ResponsivePopover };
