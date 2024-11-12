import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronRightIcon } from "./Icons";

interface TableRowConnectorProps {
  fromTarget?: string;
  toTarget: string;
  color?: string;
  extensionLength?: number;
  strokeWidth?: number;
  capHeight?: number;
  offset?: number;
  dotted?: boolean;
  dashArray?: string;
  startCapColor?: string;
  endCapColor?: string;
  component?: ReactNode;
  componentOffset?: number;
  componentOffsetHeight?: number;
  showArrow?: boolean;
  animationDuration?: number;
  mode?: "connect" | "singleLine";
}

interface Dimensions {
  top: number;
  left: number;
  width: number;
  height: number;
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
  dashArray = "4 4",
  startCapColor = "#246645",
  endCapColor = "#246645",
  component,
  componentOffset = 16,
  componentOffsetHeight,
  mode = "connect",
}: TableRowConnectorProps) => {
  const [path, setPath] = useState<{ startCap: string; line: string; endCap: string; fullPath: string }>({
    startCap: "",
    line: "",
    endCap: "",
    fullPath: "",
  });
  const [dimensions, setDimensions] = useState<Dimensions>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const componentRef = useRef<HTMLDivElement | null>(null);
  const [componentWidth, setComponentWidth] = useState(0);
  const [isUpward, setIsUpward] = useState(false);

  useEffect(() => {
    const currentRef = componentRef.current;
    if (currentRef) {
      const observer = new ResizeObserver((entries) => {
        setComponentWidth(entries[0].contentRect.width);
      });
      observer.observe(currentRef);
      return () => observer.disconnect();
    }
  }, [component]);

  useEffect(() => {
    function updateConnector() {
      const targetRow = document.querySelector(`[data-action-target="${toTarget}"]`);
      if (!targetRow) return;

      const tableContainer = targetRow.closest(".relative");
      if (!tableContainer) return;

      const containerRect = tableContainer.getBoundingClientRect();
      const targetRect = targetRow.getBoundingClientRect();

      if (mode === "singleLine") {
        const targetY = targetRect.top - containerRect.top + targetRect.height / 2;
        const targetX = targetRect.left - containerRect.left - offset;
        const startX = targetX - extensionLength;

        // Match dimensions with connect mode
        setDimensions({
          top: targetY - capHeight / 2,
          left: startX,
          width: extensionLength + componentOffset,
          height: capHeight,
        });

        const pathEndX = extensionLength - offset;

        // Draw the horizontal line from left to right
        const line = `M 0 ${capHeight / 2} L ${pathEndX} ${capHeight / 2}`;

        // Match endcap dimensions with connect mode
        const endCap = `
          M ${pathEndX} ${capHeight / 2 - capHeight / 2}
          L ${pathEndX} ${capHeight / 2 + capHeight / 2}
        `;

        // Full path for animation
        const fullPath = `M 0 ${capHeight / 2} L ${pathEndX} ${capHeight / 2}`;

        setPath({
          startCap: "",
          line,
          endCap,
          fullPath,
        });

        return;
      }

      // Original connect mode logic
      const sourceRow = document.querySelector(`[data-action-target="${fromTarget}"]`);
      if (!sourceRow) return;

      const sourceRect = sourceRow.getBoundingClientRect();
      const sourceY = sourceRect.top - containerRect.top + sourceRect.height / 2;
      const targetY = targetRect.top - containerRect.top + targetRect.height / 2;

      setIsUpward(targetY < sourceY);

      const startX = sourceRect.left - containerRect.left - offset;
      const adjustedLeft = startX - extensionLength;

      const top = Math.min(sourceY, targetY) - capHeight / 2;
      const height = Math.abs(targetY - sourceY) + capHeight;

      setDimensions({
        top,
        left: adjustedLeft,
        width: extensionLength + componentOffset,
        height,
      });

      const pathStartX = extensionLength - offset;
      const pathStartY = sourceY - top;
      const pathEndY = targetY - top;

      const startCap = `
        M ${pathStartX} ${pathStartY - capHeight / 2}
        L ${pathStartX} ${pathStartY + capHeight / 2}
      `;

      const line = `M ${pathStartX} ${pathStartY} L ${offset} ${pathStartY} L ${offset} ${pathEndY} L ${pathStartX} ${pathEndY}`;

      const endCap = `
        M ${pathStartX} ${pathEndY - capHeight / 2}
        L ${pathStartX} ${pathEndY + capHeight / 2}
      `;

      const fullPath = `M ${pathStartX} ${pathStartY} L ${offset} ${pathStartY} L ${offset} ${pathEndY} L ${pathStartX} ${pathEndY}`;

      setPath({ startCap, line, endCap, fullPath });
    }

    updateConnector();

    const resizeObserver = new ResizeObserver(updateConnector);
    const targetElement = document.querySelector(`[data-action-target="${toTarget}"]`);

    if (targetElement) {
      resizeObserver.observe(targetElement);
    }

    if (mode === "connect" && fromTarget) {
      const sourceElement = document.querySelector(`[data-action-target="${fromTarget}"]`);
      if (sourceElement) {
        resizeObserver.observe(sourceElement);
      }
    }

    return () => resizeObserver.disconnect();
  }, [fromTarget, toTarget, extensionLength, capHeight, offset, componentWidth, component, componentOffset, mode]);

  // Handle component mounting to the DOM
  const ComponentWrapper = component ? (
    <div
      ref={componentRef}
      style={{
        position: "absolute",
        top:
          dimensions.top +
          dimensions.height / 2 -
          (componentOffsetHeight || (componentRef.current?.offsetHeight ?? 0)) / 2,
        left: dimensions.left - (componentRef.current?.offsetWidth ?? 0) - componentOffset,
        zIndex: 11,
        pointerEvents: "auto",
      }}
    >
      {component}
    </div>
  ) : null;

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
      className="contrast-0 opacity-50 hover:contrast-100 hover:opacity-100 transition-all"
    >
      {ComponentWrapper}
      <svg
        style={{
          position: "absolute",
          top: dimensions.top,
          left: dimensions.left,
          width: dimensions.width,
          height: dimensions.height,
        }}
        className="transition-all"
      >
        <defs>
          <linearGradient id="myGradient" gradientTransform={`rotate(${isUpward ? "-90" : "90"})`}>
            <stop offset="25%" stopColor={startCapColor || color} />
            <stop offset="75%" stopColor={endCapColor || color} />
          </linearGradient>
        </defs>
        {mode === "connect" && path.startCap && (
          <path d={path.startCap} stroke={startCapColor || color} strokeWidth={strokeWidth} fill="none" />
        )}
        {path.line && (
          <path
            d={path.line}
            stroke={mode === "connect" ? "url('#myGradient')" : endCapColor || color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={dotted ? dashArray : undefined}
          />
        )}
        {path.endCap && <path d={path.endCap} stroke={endCapColor || color} strokeWidth={strokeWidth} fill="none" />}
      </svg>
      <div
        style={{
          position: "absolute",
          top: dimensions.top,
          left: dimensions.left,
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        <motion.div
          initial={{ offsetDistance: "0%", color: mode === "connect" ? startCapColor : endCapColor }}
          animate={{
            offsetDistance: "100%",
            color: endCapColor,
          }}
          transition={{
            duration: mode === "connect" ? 4 : 2,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 16,
            height: 16,
            offsetPath: `path('${path.fullPath}')`,
            scale: 1.5,
          }}
        >
          <ChevronRightIcon color="currentColor" className="left-2" />
        </motion.div>
      </div>
    </div>
  );
};

export default TableRowConnector;
