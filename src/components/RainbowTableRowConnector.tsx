import { generateID } from "@/utils/utils";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { ReactNode, useEffect, useRef, useState } from "react";
import { hoveredIdAtom } from "./HelperLink";
import { ChevronRightIcon } from "./Icons";
import ResizeVisibilityWrapper from "./ResizeVisibilityWrapper";
import { Token } from "@/utils/types";

interface RainbowTableRowConnectorProps {
  fromTokens: Token[]; // Multiple source tokens
  toTarget: string; // Single target element ID
  extensionLength?: number;
  strokeWidth?: number;
  capHeight?: number;
  offset?: number;
  dotted?: boolean;
  dashArray?: string;
  component?: ReactNode;
  componentOffset?: number;
  componentOffsetHeight?: number;
}

interface Dimensions {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface RainbowPath {
  token: Token;
  color: string;
  path: string;
  fromY: number;
  toY: number;
}

// Rainbow colors for the connections
const RAINBOW_COLORS = [
  "#ff0000", // Red
  "#ff7f00", // Orange  
  "#ffff00", // Yellow
  "#00ff00", // Green
  "#0000ff", // Blue
  "#4b0082", // Indigo
  "#9400d3", // Violet
  "#ff1493", // Deep Pink
  "#00ffff", // Cyan
  "#ff69b4", // Hot Pink
];

const RainbowTableRowConnector = ({
  fromTokens,
  toTarget,
  extensionLength = 20,
  strokeWidth = 2,
  capHeight = 68,
  offset = 2,
  dotted = false,
  dashArray = "4 4",
  component,
  componentOffset = 16,
  componentOffsetHeight = 20,
}: RainbowTableRowConnectorProps) => {
  const [hoveredId, setHoveredId] = useAtom(hoveredIdAtom);

  // Create a stable ID reference that persists across renders
  const idRef = useRef<string>("");
  if (idRef.current === "") {
    idRef.current = generateID("rainbow-helper-link");
  }

  const id = idRef.current;

  const handleMouseEnter = () => {
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    setHoveredId("");
  };

  const isVisible = hoveredId === "" || hoveredId === id;

  const [rainbowPaths, setRainbowPaths] = useState<RainbowPath[]>([]);
  const [dimensions, setDimensions] = useState<Dimensions>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const componentRef = useRef<HTMLDivElement | null>(null);
  const [componentWidth, setComponentWidth] = useState(0);
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
    const targetElement = document.querySelector(`[data-action-target="${toTarget}"]`);
    const containerElement = targetElement?.closest(".relative");

    if (!targetElement || !containerElement) return false;

    const containerRect = containerElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const targetY = targetRect.top - containerRect.top + targetRect.height / 2;
    const targetX = targetRect.left - containerRect.left - offset;

    const paths: RainbowPath[] = [];
    let minY = Infinity;
    let maxY = -Infinity;
    let leftmostX = Infinity;

    // Process each source token
    fromTokens.forEach((token, index) => {
      const sourceElement = document.querySelector(`[data-action-target="token-row-${token.address}"]`);
      if (!sourceElement) return;

      const sourceRect = sourceElement.getBoundingClientRect();
      const sourceY = sourceRect.top - containerRect.top + sourceRect.height / 2;
      const sourceX = sourceRect.left - containerRect.left - offset;

      minY = Math.min(minY, sourceY, targetY);
      maxY = Math.max(maxY, sourceY, targetY);
      leftmostX = Math.min(leftmostX, sourceX);

      // Get rainbow color for this token
      const color = RAINBOW_COLORS[index % RAINBOW_COLORS.length];

      // Create path from source to target with a slight curve for visual appeal
      const pathStartX = extensionLength - offset;
      const pathStartY = sourceY - minY;
      const pathEndY = targetY - minY;

      // Create curved path for visual rainbow effect
      const midX = pathStartX * 0.7; // Control point for curve
      const curvePath = `M ${pathStartX} ${pathStartY} Q ${midX} ${(pathStartY + pathEndY) / 2} ${offset} ${pathEndY}`;

      paths.push({
        token,
        color,
        path: curvePath,
        fromY: pathStartY,
        toY: pathEndY,
      });
    });

    if (paths.length === 0) return false;

    // Calculate container dimensions
    const containerTop = minY - capHeight / 2;
    const containerHeight = maxY - minY + capHeight;
    const containerLeft = leftmostX - extensionLength;
    const containerWidth = extensionLength + componentOffset;

    setDimensions({
      top: containerTop,
      left: containerLeft,
      width: containerWidth,
      height: containerHeight,
    });

    // Adjust path coordinates relative to container
    const adjustedPaths = paths.map(path => ({
      ...path,
      fromY: path.fromY - containerTop + capHeight / 2,
      toY: path.toY - containerTop + capHeight / 2,
    }));

    setRainbowPaths(adjustedPaths);
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

    // Observe both the table and elements for changes
    const targetElement = document.querySelector(`[data-action-target="${toTarget}"]`);
    const tableElement = targetElement?.closest("table");

    resizeObserverRef.current = new ResizeObserver(() => {
      requestAnimationFrame(updateConnector);
    });

    if (tableElement) resizeObserverRef.current.observe(tableElement);
    if (targetElement) resizeObserverRef.current.observe(targetElement);
    
    // Observe all source elements
    fromTokens.forEach((token) => {
      const sourceElement = document.querySelector(`[data-action-target="token-row-${token.address}"]`);
      if (sourceElement) resizeObserverRef.current?.observe(sourceElement);
    });

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fromTokens, toTarget, extensionLength, capHeight, offset, componentWidth]);

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
            {/* Create gradient for each rainbow path */}
            {rainbowPaths.map((pathData, index) => (
              <linearGradient key={`gradient-${index}`} id={`rainbowGradient-${index}`} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={pathData.color} />
                <stop offset="100%" stopColor={pathData.color} stopOpacity="0.8" />
              </linearGradient>
            ))}
          </defs>
          
          {/* Render rainbow paths */}
          {rainbowPaths.map((pathData, index) => (
            <g key={`path-${index}`}>
              {/* Start cap */}
              <line
                x1={extensionLength - offset}
                y1={pathData.fromY - capHeight / 4}
                x2={extensionLength - offset}
                y2={pathData.fromY + capHeight / 4}
                stroke={pathData.color}
                strokeWidth={strokeWidth}
              />
              
              {/* Main curved path */}
              <path
                d={pathData.path}
                stroke={`url(#rainbowGradient-${index})`}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={dotted ? dashArray : undefined}
              />
              
              {/* End cap */}
              <line
                x1={offset}
                y1={pathData.toY - capHeight / 4}
                x2={offset}
                y2={pathData.toY + capHeight / 4}
                stroke={pathData.color}
                strokeWidth={strokeWidth}
              />
            </g>
          ))}
        </svg>

        {/* Animated chevrons along each path */}
        <div
          style={{
            position: "absolute",
            top: dimensions.top,
            left: dimensions.left,
            width: dimensions.width,
            height: dimensions.height,
          }}
        >
          {rainbowPaths.map((pathData, index) => (
            <motion.div
              key={`chevron-${index}`}
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "95%" }}
              transition={{
                duration: 3 + index * 0.2, // Stagger the animation
                ease: "easeInOut",
                repeat: Infinity,
                delay: index * 0.3, // Progressive delay for rainbow effect
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 16,
                height: 16,
                offsetPath: `path('${pathData.path}')`,
                scale: 1.2,
                color: pathData.color,
              }}
            >
              <ChevronRightIcon color="currentColor" className="drop-shadow-sm" />
            </motion.div>
          ))}
        </div>
      </div>
    </ResizeVisibilityWrapper>
  );
};

export default RainbowTableRowConnector;