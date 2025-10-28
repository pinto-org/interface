import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/Dialog";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import { ConvertUpOrderProvider } from "./ConvertUp";
import { ConvertUpOrderFormController } from "./ConvertUpOrderForm";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface ModifyConvertUpOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderModified?: () => void;
  existingOrder: ConvertUpOrderbookEntry;
}

// ============================================================================
// Main Dialog Component
// ============================================================================

export default function ModifyConvertUpOrderDialog({
  open,
  onOpenChange,
  onOrderModified,
  existingOrder,
}: ModifyConvertUpOrderDialogProps) {
  if (!open) return null;

  return (
    // modal false to prevent operator tip popover from not registering input events
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 backdrop-blur-[2px] bg-white/50" />
        <DialogContent className="max-w-[35rem] p-6 max-h-[80vh] flex flex-col">
          <DialogHeader className="hidden">
            <DialogTitle>Convert Up Order Modification</DialogTitle>
            <DialogDescription className="pinto-sm-light text-pinto-light pt-2">
              Update your existing Convert Up order. The current order will be cancelled and a new one will be created
              with your updated conditions.
            </DialogDescription>
          </DialogHeader>
          <ConvertUpOrderProvider
            mode="modify"
            existingOrder={existingOrder}
            onOpenChange={onOpenChange}
            onOrderModified={onOrderModified}
          >
            <ConvertUpOrderFormController />
          </ConvertUpOrderProvider>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
