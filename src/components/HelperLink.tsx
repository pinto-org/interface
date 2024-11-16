import { generateID } from "@/utils/utils";
import { HTMLAttributes, ReactNode, useState } from "react";
import HelperLinkLine from "./HelperLinkLine";
import Text from "./ui/Text";

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
}

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
  ...props
}: HelperLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const id = generateID("helper-link");

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  // Render either the custom component or the default Text component
  const renderContent = () => {
    if (component) {
      return (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={onClick}
          className={`cursor-pointer ${className}`}
          data-action-target={id}
          {...props}
        >
          {component}
        </div>
      );
    }

    return (
      <Text
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        variant="body-light"
        className={`text-pinto-gray-3 w-6 whitespace-nowrap hover:text-pinto-green-4 transition-colors cursor-pointer ${className}`}
        data-action-target={id}
        {...props}
      >
        {text}
      </Text>
    );
  };

  return (
    <>
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
      />
    </>
  );
}
