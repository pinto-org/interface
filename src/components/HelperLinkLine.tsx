import { ReactNode, useEffect, useRef, useState } from "react";

type AnchorPoint = "top" | "right" | "bottom" | "left" | "center";

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
  fixed?: boolean; // New prop to support fixed positioning
}

interface Dimensions {
  top: number;
  left: number;
  width: number;
  height: number;
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
  fixed = false, // Default to false for backward compatibility
}: HelperLinkLineProps) => {
  const [path, setPath] = useState<string>("");
  const [dimensions, setDimensions] = useState<Dimensions>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const componentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateOffsetPoint = (
    point: { x: number; y: number },
    anchor: AnchorPoint,
    targetPoint: { x: number; y: number },
    offset: number,
  ) => {
    if (offset === 0) return point;

    const dx = targetPoint.x - point.x;
    const dy = targetPoint.y - point.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    const normalizedDx = dx / length;
    const normalizedDy = dy / length;

    return {
      x: point.x + normalizedDx * offset,
      y: point.y + normalizedDy * offset,
    };
  };

  const getAnchorPoint = (rect: DOMRect, anchor: AnchorPoint, containerRect: DOMRect) => {
    const points = {
      top: {
        x: rect.left - (fixed ? 0 : containerRect.left) + rect.width / 2,
        y: rect.top - (fixed ? 0 : containerRect.top),
      },
      right: {
        x: rect.right - (fixed ? 0 : containerRect.left),
        y: rect.top - (fixed ? 0 : containerRect.top) + rect.height / 2,
      },
      bottom: {
        x: rect.left - (fixed ? 0 : containerRect.left) + rect.width / 2,
        y: rect.bottom - (fixed ? 0 : containerRect.top),
      },
      left: {
        x: rect.left - (fixed ? 0 : containerRect.left),
        y: rect.top - (fixed ? 0 : containerRect.top) + rect.height / 2,
      },
      center: {
        x: rect.left - (fixed ? 0 : containerRect.left) + rect.width / 2,
        y: rect.top - (fixed ? 0 : containerRect.top) + rect.height / 2,
      },
    };
    return points[anchor];
  };

  const updateConnector = () => {
    const sourceElement = document.querySelector(`[data-action-target="${fromTarget}"]`);
    const targetElement = document.querySelector(`[data-action-target="${toTarget}"]`);

    if (!sourceElement || !targetElement) return false;

    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    if (sourceRect.width === 0 || sourceRect.height === 0 || targetRect.width === 0 || targetRect.height === 0)
      return false;

    // For fixed positioning, use viewport coordinates
    const containerRect = fixed
      ? new DOMRect(0, 0, window.innerWidth, window.innerHeight)
      : sourceElement.closest(".relative")?.getBoundingClientRect() || new DOMRect();

    if (!containerRect) return false;

    // For fixed positioning, use viewport-relative coordinates
    const sourcePoint = getAnchorPoint(sourceRect, sourceAnchor, containerRect);
    const targetPoint = getAnchorPoint(targetRect, targetAnchor, containerRect);

    const adjustedSourcePoint = calculateOffsetPoint(sourcePoint, sourceAnchor, targetPoint, sourceOffset);
    const adjustedTargetPoint = calculateOffsetPoint(targetPoint, targetAnchor, sourcePoint, targetOffset);

    const padding = strokeWidth * 2;
    const left = Math.min(adjustedSourcePoint.x, adjustedTargetPoint.x) - padding;
    const top = Math.min(adjustedSourcePoint.y, adjustedTargetPoint.y) - padding;
    const width = Math.abs(adjustedTargetPoint.x - adjustedSourcePoint.x) + padding * 2;
    const height = Math.abs(adjustedTargetPoint.y - adjustedSourcePoint.y) + padding * 2;

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

    const newPath = `M ${pathStartX} ${pathStartY} L ${pathEndX} ${pathEndY}`;
    setPath(newPath);

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
          if (updateTimerRef.current) {
            clearTimeout(updateTimerRef.current);
            updateTimerRef.current = null;
          }
        } else {
          attempts++;
          const delay = Math.min(100 * 2 ** attempts, 3000);
          updateTimerRef.current = setTimeout(attemptUpdate, delay);
        }
      };

      observerRef.current = new MutationObserver((mutations) => {
        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
        }
        updateTimerRef.current = setTimeout(updateConnector, 100);
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });

      attemptUpdate();
    }

    const resizeObserver = new ResizeObserver(() => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
      updateTimerRef.current = setTimeout(updateConnector, 100);
    });

    const sourceElement = document.querySelector(`[data-action-target="${fromTarget}"]`);
    const targetElement = document.querySelector(`[data-action-target="${toTarget}"]`);

    if (sourceElement) resizeObserver.observe(sourceElement);
    if (targetElement) resizeObserver.observe(targetElement);

    // Add scroll event listener for fixed positioning
    if (fixed) {
      const handleScroll = () => {
        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
        }
        updateTimerRef.current = setTimeout(updateConnector, 50);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
      resizeObserver.disconnect();
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
        className={`transition-colors ${isHovered ? "text-pinto-green-4" : "text-pinto-gray-3"}`}
      >
        <path
          d={path}
          stroke={"currentColor"}
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
