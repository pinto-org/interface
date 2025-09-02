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

interface ModifyConvertUpOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderModified?: () => void;
  existingOrder: ConvertUpOrderbookEntry;
  getStrategyProps?: any;
}

export default function ModifyConvertUpOrderDialog({
  open,
  onOpenChange,
  onOrderModified,
  existingOrder,
  getStrategyProps,
}: ModifyConvertUpOrderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modify ConvertUp Order</DialogTitle>
            <DialogDescription>Modify your existing ConvertUp order. This feature is coming soon.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center text-pinto-gray-4">
              <p className="text-sm">ConvertUp order modification is not yet implemented.</p>
              <p className="text-xs mt-2">
                For now, you can cancel this order and create a new one with updated parameters.
              </p>
            </div>

            {/* TODO: Add form fields for modifying ConvertUp orders */}
            {/* This should include:
              - Total Convert BDV
              - Min/Max BDV per execution
              - Price range (min/max)
              - Bonus threshold
              - Capacity requirement
              - Operator tip
              - Token strategy
          */}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm text-pinto-gray-4 hover:text-pinto-primary transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
