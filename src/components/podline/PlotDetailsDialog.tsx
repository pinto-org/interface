import { TokenValue } from "@/classes/TokenValue";
import { ResponsiveDialog } from "@/components/ui/ResponsiveDialog";
import { PINTO } from "@/constants/tokens";
import { formatter } from "@/utils/format";
import { Plot } from "@/utils/types";
import { ArrowUpIcon, CalendarIcon, ClockIcon, IdCardIcon, TargetIcon } from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import React, { memo } from "react";

interface PlotDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plot: Plot | null;
}

export const PlotDetailsDialog = memo(({ open, onOpenChange, plot }: PlotDetailsDialogProps) => {
  if (!plot) return null;

  const isHarvestable = plot.harvestablePods?.gt(0) ?? false;
  const isPartiallyHarvestable = (plot.harvestablePods?.gt(0) ?? false) && (plot.unharvestablePods?.gt(0) ?? false);
  const temperature = plot.beansPerPod ? (1 / plot.beansPerPod.toNumber()) * 100 - 100 : undefined;
  const createdDate = plot.createdAt ? DateTime.fromSeconds(plot.createdAt) : null;

  const getSourceDisplayName = (source?: string) => {
    switch (source) {
      case "SOW":
        return "Sowed";
      case "MARKET":
        return "Market Purchase";
      case "TRANSFER":
        return "Transfer";
      default:
        return source || "Unknown";
    }
  };

  const getStatusColor = () => {
    if (isHarvestable && !isPartiallyHarvestable) return "bg-green-100 text-green-800";
    if (isPartiallyHarvestable) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusText = () => {
    if (isHarvestable && !isPartiallyHarvestable) return "Fully Harvestable";
    if (isPartiallyHarvestable) return "Partially Harvestable";
    return "In Line";
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialog.Content className="max-w-md">
        <ResponsiveDialog.Header className="border-b pb-4">
          <ResponsiveDialog.Title className="pinto-h3 font-normal flex items-center gap-2">
            <TargetIcon className="w-5 h-5 text-pinto-green-4" />
            Plot Details
          </ResponsiveDialog.Title>
        </ResponsiveDialog.Header>

        <div className="pt-4 space-y-4">
          {/* Status Badge */}
          <div className="flex justify-center">
            <div className={`${getStatusColor()} px-3 py-1 rounded-full text-sm font-medium`}>{getStatusText()}</div>
          </div>

          {/* Pod Information */}
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="pinto-sm font-medium text-pinto-gray-5 mb-3">Pod Information</h4>

              <div className="grid grid-cols-2 gap-3 pinto-xs">
                <div>
                  <div className="text-pinto-gray-4 mb-1">Total Pods</div>
                  <div className="font-medium">{formatter.number(plot.pods)} Pods</div>
                </div>

                {plot.harvestablePods?.gt(0) && (
                  <div>
                    <div className="text-pinto-gray-4 mb-1">Harvestable</div>
                    <div className="font-medium text-green-600">{formatter.number(plot.harvestablePods)} Pods</div>
                  </div>
                )}

                {plot.unharvestablePods?.gt(0) && (
                  <div>
                    <div className="text-pinto-gray-4 mb-1">In Line</div>
                    <div className="font-medium text-amber-600">{formatter.number(plot.unharvestablePods)} Pods</div>
                  </div>
                )}

                <div>
                  <div className="text-pinto-gray-4 mb-1">Plot Index</div>
                  <div className="font-medium">{formatter.number(plot.index)}</div>
                </div>
              </div>
            </div>

            {/* Economic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="pinto-sm font-medium text-pinto-gray-5 mb-3">Economic Details</h4>

              <div className="space-y-2 pinto-xs">
                {temperature !== undefined && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pinto-gray-4">
                      <ArrowUpIcon className="w-4 h-4" />
                      <span>Temperature</span>
                    </div>
                    <div className="font-medium">{formatter.pct(temperature / 100)}</div>
                  </div>
                )}

                {plot.beansPerPod && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pinto-gray-4">
                      <span>Pinto per Pod</span>
                    </div>
                    <div className="font-medium">{formatter.number(plot.beansPerPod)} PINTO</div>
                  </div>
                )}

                {plot.season && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pinto-gray-4">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Season</span>
                    </div>
                    <div className="font-medium">#{plot.season}</div>
                  </div>
                )}

                {plot.source && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pinto-gray-4">
                      <IdCardIcon className="w-4 h-4" />
                      <span>Source</span>
                    </div>
                    <div className="font-medium">{getSourceDisplayName(plot.source)}</div>
                  </div>
                )}

                {createdDate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pinto-gray-4">
                      <ClockIcon className="w-4 h-4" />
                      <span>Created</span>
                    </div>
                    <div className="font-medium">{createdDate.toLocaleString(DateTime.DATE_MED)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions hint */}
            {isHarvestable && (
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="pinto-xs text-green-700">
                  This plot is harvestable! Visit the Field to harvest your pods.
                </p>
              </div>
            )}
          </div>
        </div>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
});

PlotDetailsDialog.displayName = "PlotDetailsDialog";
