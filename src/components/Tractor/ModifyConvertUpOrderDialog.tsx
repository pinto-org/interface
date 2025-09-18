import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/Dialog";
import { ConvertUpOrderbookEntry } from "@/lib/Tractor/convertUp/tractor-convert-up-types";
import ModifyConvertUpOrderForm from "./ModifyConvertUpOrderForm";

interface ModifyConvertUpOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderModified?: () => void;
  existingOrder: ConvertUpOrderbookEntry;
}

export default function ModifyConvertUpOrderDialog({
  open,
  onOpenChange,
  onOrderModified,
  existingOrder,
}: ModifyConvertUpOrderDialogProps) {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 backdrop-blur-[2px] bg-white/50" />
        <DialogContent className="max-w-[35rem] p-6 max-h-[80vh] overflow-y-auto">
          <ModifyConvertUpOrderForm
            existingOrder={existingOrder}
            onOpenChange={onOpenChange}
            onOrderModified={onOrderModified}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
