import { motion } from "framer-motion";
import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

interface TableRowConnectorProps {
  fromTarget: string;
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
  showArrow?: boolean;
  animationDuration?: number;
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

  const componentRef = useRef<HTMLDivElement>(null);
  const [componentWidth, setComponentWidth] = useState(0);

  const [isUpward, setIsUpward] = useState(false);

  useEffect(() => {
    if (componentRef.current) {
      const observer = new ResizeObserver((entries) => {
        setComponentWidth(entries[0].contentRect.width);
      });
      observer.observe(componentRef.current);
      return () => observer.disconnect();
    }
  }, [component]);

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

      const sourceY = sourceRect.top - containerRect.top + sourceRect.height / 2;
      const targetY = targetRect.top - containerRect.top + targetRect.height / 2;

      // Determine if the line is pointing upward
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
      const pathEndX = offset;
      const pathStartY = sourceY - top;
      const pathEndY = targetY - top;

      const startCap = `
        M ${pathStartX} ${pathStartY - capHeight / 2}
        L ${pathStartX} ${pathStartY + capHeight / 2}
      `;

      const line = `M ${pathStartX} ${pathStartY} L ${pathEndX} ${pathStartY} L ${pathEndX} ${pathEndY} L ${pathStartX} ${pathEndY}`;

      const endCap = `
        M ${pathStartX} ${pathEndY - capHeight / 2}
        L ${pathStartX} ${pathEndY + capHeight / 2}
      `;

      // Create full path for arrow animation
      const fullPath = `M ${pathStartX} ${pathStartY} L ${pathEndX} ${pathStartY} L ${pathEndX} ${pathEndY} L ${pathStartX} ${pathEndY}`;

      setPath({ startCap, line, endCap, fullPath });
    }

    updateConnector();
  }, [fromTarget, toTarget, extensionLength, capHeight, offset, componentWidth, component, componentOffset]);

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
      className={"contrast-0 opacity-50 hover:contrast-100 hover:opacity-100 transition-all"}
    >
      {component && (
        <div
          ref={componentRef}
          style={{
            position: "absolute",
            top: dimensions.top + dimensions.height / 2 - (componentRef.current?.offsetHeight || 0) / 2,
            left: dimensions.left - (componentRef.current?.offsetWidth || 0) - componentOffset,
            transform: "translateY(-50%)",
            zIndex: 11,
            pointerEvents: "auto",
          }}
        >
          {component}
        </div>
      )}
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
        <path d={path.startCap} stroke={startCapColor || color} strokeWidth={strokeWidth} fill="none" />
        <path
          d={path.line}
          stroke={"url('#myGradient')"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={dotted ? dashArray : undefined}
        />
        <path d={path.endCap} stroke={endCapColor || color} strokeWidth={strokeWidth} fill="none" />
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
          initial={{ offsetDistance: "0%", color: startCapColor }}
          animate={{
            offsetDistance: "100%",
            color: endCapColor,
          }}
          transition={{
            duration: 4,
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
