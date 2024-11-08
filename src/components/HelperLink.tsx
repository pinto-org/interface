import { generateID } from "@/utils/utils";
import { color } from "framer-motion";
import { HTMLAttributes, ReactNode, useState } from "react";
import HelperLinkLine from "./HelperLinkLine";
import Text from "./ui/Text";

interface HelperLinkProps extends HTMLAttributes<HTMLDivElement> {
  onClick: () => void;
  // Allow either text string or a React component
  text?: string;
  component?: ReactNode;
  dataTarget: string; //  Must be supplied
  hoverColor?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  sourceAnchor?: "top" | "right" | "bottom" | "left" | "center";
  targetAnchor?: "top" | "right" | "bottom" | "left" | "center";
  strokeWidth?: number;
  dotted?: boolean;
  sourceOffset?: number;
  targetOffset?: number;
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
        className={`text-pinto-gray-3 hover:text-pinto-green-4 transition-colors cursor-pointer ${className}`}
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
      />
    </>
  );
}
