import { ReactNode, useEffect, useRef, useState } from "react";

type AnchorPoint =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface HelperLinkLineProps {
  fromTarget: string;
  toTarget: string;
  strokeWidth?: number;
  dotted?: boolean;
  dashArray?: string;
  component?: ReactNode;
  componentOffset?: number;
  sourceAnchor?: AnchorPoint;
  targetAnchor?: AnchorPoint;
  sourceOffset?: number;
  targetOffset?: number;
  isHovered?: boolean;
  fixed?: boolean;
  straightLength?: number;
  source90Degree?: boolean;
  target90Degree?: boolean;
  perpLength?: number;
  lineAngle?: number; // Angle in degrees for the entire line
  componentRotateWithLine?: boolean; // Whether the component should rotate with the line
  shimmer?: boolean;
}

interface Dimensions {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

const HelperLinkLine = ({
  fromTarget,
  toTarget,
  strokeWidth = 2,
  dotted = false,
  dashArray = "4 4",
  component,
  componentOffset = 16,
  sourceAnchor = "center",
  targetAnchor = "center",
  sourceOffset = 0,
  targetOffset = 0,
  isHovered = false,
  fixed = false,
  straightLength = 20,
  source90Degree = false,
  target90Degree = false,
  perpLength = 20,
  shimmer = false,
}: HelperLinkLineProps) => {
  const [path, setPath] = useState<string>("");
  const [dimensions, setDimensions] = useState<Dimensions>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const componentRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

  const applyOffset = (point: Point, anchor: AnchorPoint, offset: number): Point => {
    switch (anchor) {
      case "top":
      case "top-left":
      case "top-right":
        return { ...point, y: point.y - offset };
      case "bottom":
      case "bottom-left":
      case "bottom-right":
        return { ...point, y: point.y + offset };
      case "left":
        return { ...point, x: point.x - offset };
      case "right":
        return { ...point, x: point.x + offset };
      default: // center - no offset
        return point;
    }
  };

  const calculate90DegreePath = (point: Point, end: Point, anchor: AnchorPoint): Point => {
    switch (anchor) {
      case "top-left": {
        return {
          x: point.x - perpLength,
          y: point.y - perpLength,
        };
      }
      case "top-right": {
        return {
          x: point.x + perpLength,
          y: point.y - perpLength,
        };
      }
      case "bottom-left": {
        return {
          x: point.x - perpLength,
          y: point.y + perpLength,
        };
      }
      case "bottom-right": {
        return {
          x: point.x + perpLength,
          y: point.y + perpLength,
        };
      }
      case "top": {
        return { x: point.x, y: point.y - perpLength };
      }
      case "bottom": {
        return { x: point.x, y: point.y + perpLength };
      }
      case "left": {
        return { x: point.x - perpLength, y: point.y };
      }
      case "right": {
        return { x: point.x + perpLength, y: point.y };
      }
      default: {
        const dx = end.x - point.x;
        const dy = end.y - point.y;
        if (Math.abs(dx) > Math.abs(dy)) {
          return { x: point.x + Math.sign(dx) * perpLength, y: point.y };
        } else {
          return { x: point.x, y: point.y + Math.sign(dy) * perpLength };
        }
      }
    }
  };

  const getAnchorPoint = (rect: DOMRect, anchor: AnchorPoint, containerRect: DOMRect): Point => {
    const adjustedLeft = rect.left - (fixed ? 0 : containerRect.left);
    const adjustedTop = rect.top - (fixed ? 0 : containerRect.top);

    const points: Record<AnchorPoint, Point> = {
      "top-left": {
        x: adjustedLeft,
        y: adjustedTop,
      },
      "top-right": {
        x: adjustedLeft + rect.width,
        y: adjustedTop,
      },
      "bottom-left": {
        x: adjustedLeft,
        y: adjustedTop + rect.height,
      },
      "bottom-right": {
        x: adjustedLeft + rect.width,
        y: adjustedTop + rect.height,
      },
      top: {
        x: adjustedLeft + rect.width / 2,
        y: adjustedTop,
      },
      right: {
        x: adjustedLeft + rect.width,
        y: adjustedTop + rect.height / 2,
      },
      bottom: {
        x: adjustedLeft + rect.width / 2,
        y: adjustedTop + rect.height,
      },
      left: {
        x: adjustedLeft,
        y: adjustedTop + rect.height / 2,
      },
      center: {
        x: adjustedLeft + rect.width / 2,
        y: adjustedTop + rect.height / 2,
      },
    };
    return points[anchor];
  };

  const calculatePath = (start: Point, end: Point): string => {
    const points: Point[] = [start];

    if (source90Degree) {
      const sourcePerp = calculate90DegreePath(start, end, sourceAnchor);
      points.push(sourcePerp);
    }

    if (target90Degree) {
      const targetPerp = calculate90DegreePath(end, start, targetAnchor);
      points.push(targetPerp);
    }

    points.push(end);

    if (points.length > 2) {
      const midIndex = Math.floor(points.length / 2);
      const beforeMid = points[midIndex - 1];
      const afterMid = points[midIndex];
      const middlePoint = {
        x: (beforeMid.x + afterMid.x) / 2,
        y: (beforeMid.y + afterMid.y) / 2,
      };
      points.splice(midIndex, 0, middlePoint);
    }

    return points.reduce((path, point, index) => {
      return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
    }, "");
  };

  const updateConnector = () => {
    const sourceElement = document.querySelector(`[data-action-target="${fromTarget}"]`);
    const targetElement = document.querySelector(`[data-action-target="${toTarget}"]`);

    if (!sourceElement || !targetElement) return false;

    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const containerRect = fixed
      ? new DOMRect(0, 0, window.innerWidth, window.innerHeight)
      : sourceElement.closest(".relative")?.getBoundingClientRect() || new DOMRect();

    if (!containerRect) return false;

    const sourcePoint = getAnchorPoint(sourceRect, sourceAnchor, containerRect);
    const targetPoint = getAnchorPoint(targetRect, targetAnchor, containerRect);

    const adjustedSourcePoint = applyOffset(sourcePoint, sourceAnchor, sourceOffset);
    const adjustedTargetPoint = applyOffset(targetPoint, targetAnchor, targetOffset);

    const padding = strokeWidth * 2;
    const extraSpace = Math.max(source90Degree || target90Degree ? perpLength : 0, straightLength);

    const minX = Math.min(adjustedSourcePoint.x, adjustedTargetPoint.x);
    const minY = Math.min(adjustedSourcePoint.y, adjustedTargetPoint.y);
    const maxX = Math.max(adjustedSourcePoint.x, adjustedTargetPoint.x);
    const maxY = Math.max(adjustedSourcePoint.y, adjustedTargetPoint.y);

    const left = minX - padding - extraSpace;
    const top = minY - padding - extraSpace;
    const width = maxX - minX + padding * 2 + extraSpace * 2;
    const height = maxY - minY + padding * 2 + extraSpace * 2;

    setDimensions({
      top,
      left,
      width: Math.max(width, 1),
      height: Math.max(height, 1),
    });

    const pathStartX = adjustedSourcePoint.x - left;
    const pathStartY = adjustedSourcePoint.y - top;
    const pathEndX = adjustedTargetPoint.x - left;
    const pathEndY = adjustedTargetPoint.y - top;

    const newPath = calculatePath({ x: pathStartX, y: pathStartY }, { x: pathEndX, y: pathEndY });

    setPath(newPath);
    return true;
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
      updateTimerRef.current = setTimeout(updateConnector, 100); // Debounce updates
    });

    const sourceElement = document.querySelector(`[data-action-target="${fromTarget}"]`);
    const targetElement = document.querySelector(`[data-action-target="${toTarget}"]`);

    if (sourceElement) resizeObserver.observe(sourceElement);
    if (targetElement) resizeObserver.observe(targetElement);

    // Observe the viewport as well
    resizeObserver.observe(document.body);

    const handleResize = () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
      updateTimerRef.current = setTimeout(updateConnector, 100); // Debounce updates
    };

    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [fromTarget, toTarget]);

  if (!path) return null;

  return (
    <div
      style={{
        position: fixed ? "fixed" : "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {component && (
        <div
          ref={componentRef}
          style={{
            position: fixed ? "fixed" : "absolute",
            top: dimensions.top + dimensions.height / 2,
            left: dimensions.left - componentOffset,
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
          position: fixed ? "fixed" : "absolute",
          top: dimensions.top,
          left: dimensions.left,
          width: dimensions.width,
          height: dimensions.height,
          overflow: "visible",
        }}
        className={`transition-colors ${isHovered ? "text-pinto-green-5" : "text-pinto-green-4"}`}
      >
        <defs>
          <linearGradient
            id={`shimmer-${fromTarget}-${toTarget}`}
            x1="0%"
            y1="0%"
            x2="200%"
            y2="0%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#246645" />
            <stop offset="16.66%" stopColor="#00c767" stopOpacity="0.8" />
            <stop offset="33.33%" stopColor="#246645" />
            <stop offset="50%" stopColor="#00c767" stopOpacity="0.8" />
            <stop offset="66.66%" stopColor="#246645" />
            <stop offset="83.33%" stopColor="#00c767" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#246645" />
            <animate attributeName="x1" values="-300%;100%;" dur="5s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
        <path
          d={path}
          stroke={shimmer ? `url(#shimmer-${fromTarget}-${toTarget})` : "currentColor"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={dotted ? dashArray : undefined}
          strokeLinecap="round"
          style={{ vectorEffect: "non-scaling-stroke" }}
        />
      </svg>
    </div>
  );
};

export default HelperLinkLine;
