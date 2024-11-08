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

  // Function to calculate the offset point based on the anchor and offset distance
  const calculateOffsetPoint = (
    point: { x: number; y: number },
    anchor: AnchorPoint,
    targetPoint: { x: number; y: number },
    offset: number,
  ) => {
    if (offset === 0) return point;

    // Calculate direction vector
    const dx = targetPoint.x - point.x;
    const dy = targetPoint.y - point.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction vector
    const normalizedDx = dx / length;
    const normalizedDy = dy / length;

    // Move point along the direction vector by offset distance
    return {
      x: point.x + normalizedDx * offset,
      y: point.y + normalizedDy * offset,
    };
  };

  const getAnchorPoint = (rect: DOMRect, anchor: AnchorPoint, containerRect: DOMRect) => {
    const points = {
      top: {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top,
      },
      right: {
        x: rect.right - containerRect.left,
        y: rect.top - containerRect.top + rect.height / 2,
      },
      bottom: {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.bottom - containerRect.top,
      },
      left: {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top + rect.height / 2,
      },
      center: {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
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

    // If either element has zero dimensions, they're probably not fully rendered
    if (sourceRect.width === 0 || sourceRect.height === 0 || targetRect.width === 0 || targetRect.height === 0)
      return false;

    // Find the container's position to make coordinates relative
    const container = sourceElement.closest(".relative");
    if (!container) return false;
    const containerRect = container.getBoundingClientRect();

    // Get anchor points
    const sourcePoint = getAnchorPoint(sourceRect, sourceAnchor, containerRect);
    const targetPoint = getAnchorPoint(targetRect, targetAnchor, containerRect);

    // Calculate offset points
    const adjustedSourcePoint = calculateOffsetPoint(sourcePoint, sourceAnchor, targetPoint, sourceOffset);
    const adjustedTargetPoint = calculateOffsetPoint(targetPoint, targetAnchor, sourcePoint, targetOffset);

    // Add padding to prevent line clipping
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

    // Create path using adjusted points
    const pathStartX = adjustedSourcePoint.x - left;
    const pathStartY = adjustedSourcePoint.y - top;
    const pathEndX = adjustedTargetPoint.x - left;
    const pathEndY = adjustedTargetPoint.y - top;

    // Simple straight line
    const newPath = `M ${pathStartX} ${pathStartY} L ${pathEndX} ${pathEndY}`;
    setPath(newPath);

    return true;
  };

  useEffect(() => {
    // Initial attempt to update
    const initialSuccess = updateConnector();

    // If initial update fails, set up monitoring
    if (!initialSuccess) {
      // Function to attempt updates with exponential backoff
      let attempts = 0;
      const maxAttempts = 10; // Maximum number of attempts
      const attemptUpdate = () => {
        if (attempts >= maxAttempts) return;

        if (updateConnector()) {
          // Success - clear any pending timers
          if (updateTimerRef.current) {
            clearTimeout(updateTimerRef.current);
            updateTimerRef.current = null;
          }
        } else {
          // Schedule next attempt with exponential backoff
          attempts++;
          const delay = Math.min(100 * 2 ** attempts, 3000); // Cap at 3 seconds
          updateTimerRef.current = setTimeout(attemptUpdate, delay);
        }
      };

      // Start monitoring DOM changes
      observerRef.current = new MutationObserver((mutations) => {
        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
        }
        updateTimerRef.current = setTimeout(attemptUpdate, 100);
      });

      // Observe the entire document for changes
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Start first attempt
      attemptUpdate();
    }

    // Set up resize observer once elements are found
    const resizeObserver = new ResizeObserver(() => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
      updateTimerRef.current = setTimeout(updateConnector, 100);
    });

    // Observe both source and target elements if they exist
    const sourceElement = document.querySelector(`[data-action-target="${fromTarget}"]`);
    const targetElement = document.querySelector(`[data-action-target="${toTarget}"]`);

    if (sourceElement) resizeObserver.observe(sourceElement);
    if (targetElement) resizeObserver.observe(targetElement);

    // Cleanup
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
        <div
          ref={componentRef}
          style={{
            position: "absolute",
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
          position: "absolute",
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
