import { useEffect, useRef, useState } from "react";

export type AnchorPoint = "top" | "bottom" | "left" | "right" | "center";

interface ConnectingLineProps {
  sourceRef: React.RefObject<HTMLElement>;
  targetRef: React.RefObject<HTMLElement>;
  dataTarget?: string;
  strokeWidth?: number;
  diagonal?: boolean;
  sourceAnchor?: AnchorPoint;
  targetAnchor?: AnchorPoint;
  offset?: number;
  isHovered?: boolean;
}

interface Dimensions {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function ConnectingLine({
  sourceRef,
  targetRef,
  dataTarget,
  strokeWidth = 1,
  diagonal = false,
  sourceAnchor = "center",
  targetAnchor = "center",
  offset = 0,
  isHovered = false,
}: ConnectingLineProps) {
  const [path, setPath] = useState("");
  const [dimensions, setDimensions] = useState<Dimensions>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const getAnchorPoint = (rect: DOMRect, anchor: AnchorPoint, containerRect: DOMRect) => {
    const points = {
      top: {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - offset,
      },
      bottom: {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.bottom - containerRect.top + offset,
      },
      left: {
        x: rect.left - containerRect.left - offset,
        y: rect.top - containerRect.top + rect.height / 2,
      },
      right: {
        x: rect.right - containerRect.left + offset,
        y: rect.top - containerRect.top + rect.height / 2,
      },
      center: {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
      },
    };
    return points[anchor];
  };

  useEffect(() => {
    function updateConnector() {
      if (!sourceRef.current) return;

      // Get target element either from ref or data attribute
      const targetElement = targetRef
        ? targetRef.current
        : document.querySelector(`[data-action-target="${dataTarget}"]`);

      if (!targetElement) return;

      const containerElement = sourceRef.current.closest(".action-container");
      if (!containerElement) return;

      const containerRect = containerElement.getBoundingClientRect();
      const sourceRect = sourceRef.current.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();

      // Get anchor points
      const source = getAnchorPoint(sourceRect, sourceAnchor, containerRect);
      const destination = getAnchorPoint(targetRect, targetAnchor, containerRect);

      // Set dimensions relative to container
      const top = Math.min(source.y, destination.y);
      const left = Math.min(source.x, destination.x);
      const width = Math.abs(destination.x - source.x);
      const height = Math.abs(destination.y - source.y);

      setDimensions({
        top,
        left,
        width: Math.max(width, 1),
        height: Math.max(height, 1),
      });

      // Calculate path coordinates relative to SVG viewbox
      const pathStartX = source.x - left;
      const pathStartY = source.y - top;
      const pathEndX = destination.x - left;
      const pathEndY = destination.y - top;

      if (diagonal) {
        setPath(`M ${pathStartX} ${pathStartY} L ${pathEndX} ${pathEndY}`);
      } else {
        // For non-diagonal paths, determine which anchor points are being used
        // to decide the path layout
        let path = "";

        if (sourceAnchor === "right" && targetAnchor === "left") {
          // If connecting right to left, use a three-segment path
          const midX = pathStartX + (pathEndX - pathStartX) / 2;
          path = `M ${pathStartX} ${pathStartY} 
                 L ${midX} ${pathStartY} 
                 L ${midX} ${pathEndY} 
                 L ${pathEndX} ${pathEndY}`;
        } else if (sourceAnchor === "bottom" && targetAnchor === "top") {
          // If connecting bottom to top, extend the vertical line
          path = `M ${pathStartX} ${pathStartY} 
                 L ${pathStartX} ${pathEndY}`;
        } else {
          // For all other cases, ensure the horizontal segment extends fully
          const midY = pathStartY + (pathEndY - pathStartY) / 2;
          path = `M ${pathStartX} ${pathStartY} 
                 L ${pathStartX} ${midY} 
                 L ${pathEndX} ${midY} 
                 L ${pathEndX} ${pathEndY}`;
        }
        setPath(path);
      }
    }

    updateConnector();

    const resizeObserver = new ResizeObserver(updateConnector);
    const scrollContainer = sourceRef.current?.closest(".relative");

    if (scrollContainer) {
      resizeObserver.observe(scrollContainer);
      scrollContainer.addEventListener("scroll", updateConnector);
    }

    return () => {
      if (scrollContainer) {
        resizeObserver.disconnect();
        scrollContainer.removeEventListener("scroll", updateConnector);
      }
    };
  }, [diagonal, sourceRef, targetRef, sourceAnchor, targetAnchor, offset]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      <svg
        className={`absolute ${isHovered ? "text-pinto-green-4" : "text-pinto-gray-3"} transition-colors`}
        style={{
          top: dimensions.top,
          left: dimensions.left,
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        <path
          d={path}
          stroke={"currentColor"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ vectorEffect: "non-scaling-stroke" }}
        />
      </svg>
    </div>
  );
}
