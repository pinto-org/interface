import { generateID } from "@/utils/utils";
import { atom, useAtom } from "jotai";
import { HTMLAttributes, ReactNode, useRef, useState } from "react";
import HelperLinkLine from "./HelperLinkLine";
import ResizeVisibilityWrapper from "./ResizeVisibilityWrapper";

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

interface HelperLinkProps extends HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
  text?: string;
  component?: ReactNode;
  dataTarget: string;
  hoverColor?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  sourceAnchor?: AnchorPoint;
  targetAnchor?: AnchorPoint;
  strokeWidth?: number;
  dotted?: boolean;
  sourceOffset?: number;
  targetOffset?: number;
  fixed?: boolean;
  straightLength?: number;
  source90Degree?: boolean;
  target90Degree?: boolean;
  perpLength?: number;
  lineAngle?: number;
  componentRotateWithLine?: boolean;
  lineShimmer?: boolean;
}

export const hoveredIdAtom = atom<string>("");

export default function HelperLink({
  onClick,
  text,
  component,
  dataTarget,
  className = "",
  onMouseEnter,
  onMouseLeave,
  sourceAnchor = "center",
  targetAnchor = "center",
  strokeWidth = 1,
  dotted = false,
  sourceOffset = 8,
  targetOffset = 8,
  fixed = false,
  straightLength = 20,
  source90Degree = false,
  target90Degree = false,
  perpLength = 20,
  lineAngle,
  componentRotateWithLine = false,
  lineShimmer = false,
  ...props
}: HelperLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredId, setHoveredId] = useAtom(hoveredIdAtom);

  const id = generateID("helper-link");

  // Create a stable ID reference that persists across renders
  const hoverIdRef = useRef<string>("");
  if (hoverIdRef.current === "") {
    hoverIdRef.current = generateID("helper-link");
  }

  const hoverId = hoverIdRef.current;

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoveredId(hoverId);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoveredId("");
    onMouseLeave?.();
  };

  const isVisible = hoveredId === "" || hoveredId === hoverId;

  // Render either the custom component or the default Text component
  const renderContent = () => {
    if (component) {
      return (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={onClick}
          className={`cursor-pointer ${className} w-6 overflow-visible`}
          data-action-target={id}
          {...props}
        >
          {component}
        </div>
      );
    }

    return (
      <div
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`text-pinto-green-4 w-6 whitespace-nowrap hover:text-pinto-green-5 transition-colors hover:underline cursor-pointer pinto-body-light ${className}`}
        data-action-target={id}
        {...props}
      >
        {text}
      </div>
    );
  };

  return (
    <div className={`hidden transition-opacity lg:block ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <ResizeVisibilityWrapper>
        {renderContent()}
        <HelperLinkLine
          fromTarget={id}
          toTarget={dataTarget}
          strokeWidth={strokeWidth}
          isHovered={isHovered}
          sourceAnchor={sourceAnchor}
          targetAnchor={targetAnchor}
          dotted={dotted}
          sourceOffset={sourceOffset}
          targetOffset={targetOffset}
          fixed={fixed}
          straightLength={straightLength}
          source90Degree={source90Degree}
          target90Degree={target90Degree}
          perpLength={perpLength}
          shimmer={lineShimmer}
        />
      </ResizeVisibilityWrapper>
    </div>
  );
}
