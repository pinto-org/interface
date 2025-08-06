import EmptyTable from "@/components/EmptyTable";
import PlotsTable from "@/components/PlotsTable";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { useFarmerField } from "@/state/useFarmerField";
import React, { memo } from "react";

interface ViewMyPodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasPods: boolean;
}

export const ViewMyPodsDialog = memo(({ open, onOpenChange, hasPods }: ViewMyPodsDialogProps) => {
  // Access farmer field data to check if we have fresh cached data
  const farmerField = useFarmerField();
  const hasData = farmerField.plots.length > 0;
  const isDataStale = farmerField.isLoading;

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialog.Content className="max-w-4xl max-h-[80vh] flex flex-col will-change-transform">
        <ResponsiveDialog.Header className="border-b pb-4 flex-shrink-0">
          <ResponsiveDialog.Title className="pinto-h3 font-normal">
            My Pods
            {isDataStale && hasData && (
              <span className="ml-2 text-sm text-pinto-gray-4 font-normal">(updating...)</span>
            )}
          </ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <div className="flex-1 overflow-y-auto pt-4 min-h-0">
          {/* Show cached data immediately or loading state if no cached data */}
          {hasPods || hasData ? <PlotsTable showClaimable disableHover /> : <EmptyTable type="plots-field" />}
        </div>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
});
