import React from "react";

interface PartialSelectionOverlayProps {
  startPercent: number;
  endPercent: number;
  borderRadius: string;
}

function PartialSelectionOverlayComponent({ startPercent, endPercent, borderRadius }: PartialSelectionOverlayProps) {
  const width = Math.max(endPercent - startPercent, 0);
  return (
    <div
      className="absolute bg-pinto-green-1 pointer-events-none"
      style={{
        left: `${startPercent}%`,
        width: `${width}%`,
        height: "100%",
        top: "0%",
        borderTopLeftRadius: startPercent <= 0.1 ? borderRadius : "0",
        borderBottomLeftRadius: startPercent <= 0.1 ? borderRadius : "0",
        borderTopRightRadius: endPercent >= 99.9 ? borderRadius : "0",
        borderBottomRightRadius: endPercent >= 99.9 ? borderRadius : "0",
      }}
    />
  );
}

export const PartialSelectionOverlay = React.memo(PartialSelectionOverlayComponent);


