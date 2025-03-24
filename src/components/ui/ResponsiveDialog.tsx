import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import useIsMobile from "@/hooks/display/useIsMobile";
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
  createContext,
  forwardRef,
  useContext,
} from "react";

const ResponsiveDialogContext = createContext(false);

type DialogRootProps = ComponentProps<typeof Dialog>;
type DrawerRootProps = ComponentProps<typeof Drawer>;

interface ResponsiveDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  dialogProps?: Omit<DialogRootProps, "open" | "onOpenChange">;
  drawerProps?: Omit<DrawerRootProps, "open" | "onOpenChange" | "fadeFromIndex">;
}

const ResponsiveDialog = ({
  open,
  onOpenChange,
  dialogProps = {},
  drawerProps = {},
  children,
}: ResponsiveDialogProps) => {
  const isDesktop = !useIsMobile();

  return (
    <ResponsiveDialogContext.Provider value={isDesktop}>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange} {...dialogProps}>
          {children}
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange} {...drawerProps}>
          {children}
        </Drawer>
      )}
    </ResponsiveDialogContext.Provider>
  );
};

type DialogComponentType<T> = ForwardRefExoticComponent<PropsWithoutRef<T> & RefAttributes<HTMLElement>>;
type ResponsiveProps<T> = ComponentPropsWithoutRef<DialogComponentType<T>>;

const Trigger = forwardRef<HTMLButtonElement, ResponsiveProps<typeof DialogTrigger>>((props, ref) => {
  const isDesktop = useContext(ResponsiveDialogContext);
  const Component = isDesktop ? DialogTrigger : DrawerTrigger;
  return <Component ref={ref} {...props} />;
});
Trigger.displayName = "ResponsiveDialog.Trigger";

type ContentProps = React.PropsWithChildren<ComponentPropsWithoutRef<typeof DialogContent>>;

const Content = forwardRef<HTMLDivElement, ContentProps>((props, ref) => {
  const isDesktop = useContext(ResponsiveDialogContext);
  const Component = isDesktop ? DialogContent : DrawerContent;
  return <Component ref={ref} {...props} />;
});
Content.displayName = "ResponsiveDialog.Content";

const Header = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const isDesktop = useContext(ResponsiveDialogContext);
  const Component = isDesktop ? DialogHeader : DrawerHeader;
  return <Component className={className} {...props} />;
};
Header.displayName = "ResponsiveDialog.Header";

const Footer = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const isDesktop = useContext(ResponsiveDialogContext);
  const Component = isDesktop ? DialogFooter : DrawerFooter;
  return <Component className={className} {...props} />;
};
Footer.displayName = "ResponsiveDialog.Footer";

const Title = forwardRef<HTMLHeadingElement, ResponsiveProps<typeof DialogTitle>>((props, ref) => {
  const isDesktop = useContext(ResponsiveDialogContext);
  const Component = isDesktop ? DialogTitle : DrawerTitle;
  return <Component ref={ref} {...props} />;
});
Title.displayName = "ResponsiveDialog.Title";

const Description = forwardRef<HTMLParagraphElement, ResponsiveProps<typeof DialogDescription>>((props, ref) => {
  const isDesktop = useContext(ResponsiveDialogContext);
  const Component = isDesktop ? DialogDescription : DrawerDescription;
  return <Component ref={ref} {...props} />;
});
Description.displayName = "ResponsiveDialog.Description";

const Close = forwardRef<HTMLButtonElement, ResponsiveProps<typeof DialogClose>>((props, ref) => {
  const isDesktop = useContext(ResponsiveDialogContext);
  const Component = isDesktop ? DialogClose : DrawerClose;
  return <Component ref={ref} {...props} />;
});
Close.displayName = "ResponsiveDialog.Close";

ResponsiveDialog.Trigger = Trigger;
ResponsiveDialog.Content = Content;
ResponsiveDialog.Header = Header;
ResponsiveDialog.Footer = Footer;
ResponsiveDialog.Title = Title;
ResponsiveDialog.Description = Description;
ResponsiveDialog.Close = Close;

export { ResponsiveDialog };
