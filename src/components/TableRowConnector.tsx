import { generateID } from "@/utils/utils";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { ReactNode, useEffect, useRef, useState } from "react";
import { hoveredIdAtom } from "./HelperLink";
import { ChevronRightIcon } from "./Icons";
import ResizeVisibilityWrapper from "./ResizeVisibilityWrapper";

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
  componentOffsetHeight = 20,
  mode = "connect",
}: TableRowConnectorProps) => {
  const [hoveredId, setHoveredId] = useAtom(hoveredIdAtom);

  // Create a stable ID reference that persists across renders
  const idRef = useRef<string>("");
  if (idRef.current === "") {
    idRef.current = generateID("helper-link");
  }

  const id = idRef.current;

  const handleMouseEnter = () => {
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    setHoveredId("");
  };

  const isVisible = hoveredId === "" || hoveredId === id;

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
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

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

  const updateConnector = () => {
    const sourceElement = fromTarget ? document.querySelector(`[data-action-target="${fromTarget}"]`) : null;
    const targetElement = document.querySelector(`[data-action-target="${toTarget}"]`);
    const containerElement = targetElement?.closest(".relative");

    if (!targetElement || !containerElement) return false;

    const containerRect = containerElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    if (mode === "singleLine") {
      const targetY = targetRect.top - containerRect.top + targetRect.height / 2;
      const targetX = targetRect.left - containerRect.left - offset;
      const startX = targetX - extensionLength;

      setDimensions({
        top: targetY - capHeight / 2,
        left: startX,
        width: extensionLength + componentOffset,
        height: capHeight,
      });

      const pathEndX = extensionLength - offset;
      const line = `M 0 ${capHeight / 2} L ${pathEndX} ${capHeight / 2}`;
      const endCap = `M ${pathEndX} ${capHeight / 2 - capHeight / 2} L ${pathEndX} ${capHeight / 2 + capHeight / 2}`;
      const fullPath = line;

      setPath({ startCap: "", line, endCap, fullPath });
      return true;
    }

    if (!sourceElement) return false;

    const sourceRect = sourceElement.getBoundingClientRect();
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

    // Adjusted line path to maintain connection with end caps
    const startCap = `M ${pathStartX} ${pathStartY - capHeight / 2} L ${pathStartX} ${pathStartY + capHeight / 2}`;
    const line = `M ${pathStartX} ${pathStartY} L ${offset} ${pathStartY} L ${offset} ${pathEndY} L ${pathStartX} ${pathEndY}`;
    const endCap = `M ${pathStartX} ${pathEndY - capHeight / 2} L ${pathStartX} ${pathEndY + capHeight / 2}`;
    const fullPath = `${line}`;

    setPath({ startCap, line, endCap, fullPath });
    return true;
  };

  useEffect(() => {
    const initialSuccess = updateConnector();

    if (!initialSuccess) {
      let attempts = 0;
      const maxAttempts = 10;
      const attemptUpdate = () => {
        if (attempts >= maxAttempts) return;
        if (updateConnector()) {
          clearTimeout(timeoutRef.current);
        } else {
          attempts++;
          timeoutRef.current = setTimeout(attemptUpdate, Math.min(100 * 2 ** attempts, 3000));
        }
      };
      attemptUpdate();
    }

    // Observe both the table and the target element for changes
    const targetElement = document.querySelector(`[data-action-target="${toTarget}"]`);
    const tableElement = targetElement?.closest("table");
    const sourceElement = fromTarget ? document.querySelector(`[data-action-target="${fromTarget}"]`) : null;

    resizeObserverRef.current = new ResizeObserver(() => {
      requestAnimationFrame(updateConnector);
    });

    if (tableElement) resizeObserverRef.current.observe(tableElement);
    if (targetElement) resizeObserverRef.current.observe(targetElement);
    if (sourceElement) resizeObserverRef.current.observe(sourceElement);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fromTarget, toTarget, mode, extensionLength, capHeight, offset, componentWidth]);

  return (
    <ResizeVisibilityWrapper>
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`contrast-0 hover:contrast-100 hover:opacity-100 transition-all hidden lg:block ${isVisible ? "opacity-50" : "opacity-0"}`}
      >
        {component && (
          <div
            ref={componentRef}
            style={{
              position: "absolute",
              top:
                dimensions.top +
                dimensions.height / 2 +
                ((componentRef.current?.offsetHeight || 0) - componentOffsetHeight) / 2,
              left: dimensions.left - componentWidth - componentOffset,
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
            overflow: "visible",
          }}
          className="transition-all"
        >
          <defs>
            <linearGradient id="myGradient" gradientTransform="rotate(90)">
              <stop offset="25%" stopColor={isUpward ? endCapColor : startCapColor || color} />
              <stop offset="75%" stopColor={isUpward ? startCapColor : endCapColor || color} />
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
            initial={{ offsetDistance: "1%", color: mode === "connect" ? startCapColor : endCapColor }}
            animate={{
              offsetDistance: mode === "singleLine" ? "95%" : "99%",
              color: [
                mode === "connect" ? startCapColor : endCapColor, // 0%
                mode === "connect" ? startCapColor : endCapColor, // 35%
                endCapColor, // 75%
              ],
            }}
            transition={{
              color: {
                times: [0, 0.35, 0.75], // Single change at 35% progress
                duration: mode === "connect" ? 4 : 2,
                ease: "easeInOut",
                repeat: Infinity,
              },
              offsetDistance: {
                duration: mode === "connect" ? 4 : 2,
                ease: "easeInOut",
                repeat: Infinity,
              },
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
    </ResizeVisibilityWrapper>
  );
};

export default TableRowConnector;
