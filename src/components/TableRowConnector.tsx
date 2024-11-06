import { ReactNode, useEffect, useState } from "react";

interface TableRowConnectorProps {
  fromTarget: string;
  toTarget: string;
  color?: string;
  extensionLength?: number;
  strokeWidth?: number;
  capHeight?: number;
  offset?: number; // Offset from row
  dotted?: boolean; // Enable dotted line
  dashArray?: string; // Custom dash array pattern
  startCapColor?: string;
  endCapColor?: string;
  component?: ReactNode;
}

const TableRowConnector = ({
  fromTarget,
  toTarget,
  color = "#246645",
  extensionLength = 20,
  strokeWidth = 2,
  capHeight = 72,
  offset = 2,
  dotted = false,
  dashArray = "4 4", // Default dash pattern
  startCapColor = "#246645",
  endCapColor = "#246645",
  component,
}: TableRowConnectorProps) => {
  const [path, setPath] = useState<{ startCap: string; line: string; endCap: string }>({
    startCap: "",
    line: "",
    endCap: "",
  });
  const [dimensions, setDimensions] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function updateConnector() {
      const sourceRow = document.querySelector(`[data-action-target="${fromTarget}"]`);
      const targetRow = document.querySelector(`[data-action-target="${toTarget}"]`);
      if (!sourceRow || !targetRow) return;

      const tableContainer = sourceRow.closest(".relative");
      if (!tableContainer) return;

      const containerRect = tableContainer.getBoundingClientRect();
      const sourceRect = sourceRow.getBoundingClientRect();
      const targetRect = targetRow.getBoundingClientRect();

      // Calculate positions relative to the container, accounting for offsets
      const sourceY = sourceRect.top - containerRect.top + sourceRect.height / 2;
      const targetY = targetRect.top - containerRect.top + targetRect.height / 2;
      const startX = sourceRect.left - containerRect.left - offset;

      // Adjust SVG dimensions to account for caps and offsets
      const top = Math.min(sourceY, targetY) - capHeight / 2;
      const height = Math.abs(targetY - sourceY) + capHeight;

      setDimensions({
        top,
        left: startX - extensionLength,
        width: extensionLength + 10,
        height,
      });

      // Calculate x positions accounting for offsets
      const pathStartX = extensionLength - offset;
      const pathEndX = offset;
      const pathStartY = sourceY - top;
      const pathEndY = targetY - top;

      // Create the path with vertical caps and offsets
      const startCap = `
        M ${pathStartX} ${pathStartY - capHeight / 2}
        L ${pathStartX} ${pathStartY + capHeight / 2}
      `;

      const line = `
        M ${pathStartX} ${pathStartY}
        L ${pathEndX} ${pathStartY}
        L ${pathEndX} ${pathEndY}
        L ${pathStartX} ${pathEndY}
      `;

      const endCap = `
        M ${pathStartX} ${pathEndY - capHeight / 2}
        L ${pathStartX} ${pathEndY + capHeight / 2}
      `;

      setPath({ startCap: startCap, line: line, endCap: endCap });
    }

    updateConnector();

    window.addEventListener("resize", updateConnector);
    window.addEventListener("scroll", updateConnector);

    const observer = new MutationObserver(updateConnector);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      window.removeEventListener("resize", updateConnector);
      window.removeEventListener("scroll", updateConnector);
      observer.disconnect();
    };
  }, [fromTarget, toTarget, extensionLength, capHeight, offset]);

  if (!path) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {component && (
        <div style={{ position: "relative", top: dimensions.top * 2, left: dimensions.width }}>{component}</div>
      )}
      <svg
        style={{
          position: "absolute",
          top: dimensions.top,
          left: dimensions.left,
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        <defs>
          <linearGradient id="myGradient" gradientTransform="rotate(90)">
            <stop offset="25%" stop-color={startCapColor || color} />
            <stop offset="75%" stop-color={endCapColor || color} />
          </linearGradient>
        </defs>
        <path
          d={path.startCap}
          stroke={startCapColor || color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={undefined}
        />
        <path
          d={path.line}
          stroke={"url('#myGradient')"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={dotted ? dashArray : undefined}
        />
        <path
          d={path.endCap}
          stroke={endCapColor || color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={undefined}
        />
      </svg>
    </div>
  );
};

export default TableRowConnector;
