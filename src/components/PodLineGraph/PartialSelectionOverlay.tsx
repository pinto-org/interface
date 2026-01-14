import React from "react";

interface PartialSelectionOverlayProps {
  startPercent: number;
  endPercent: number;
}

const OVERLAY_Z_INDEX = 10;

function PartialSelectionOverlayComponent({ startPercent, endPercent }: PartialSelectionOverlayProps) {
  // Early return if invalid range
  if (startPercent >= endPercent) return null;

  const width = endPercent - startPercent;

  return (
    <div
      className="absolute inset-y-0 bg-pinto-yellow-active pointer-events-none"
      style={{
        left: `${startPercent}%`,
        width: `${width}%`,
        zIndex: OVERLAY_Z_INDEX,
      }}
    />
  );
}

export const PartialSelectionOverlay = React.memo<PartialSelectionOverlayProps>(PartialSelectionOverlayComponent);
