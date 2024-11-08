import { HTMLAttributes, ReactNode, RefObject, useEffect, useRef, useState } from "react";
import ConnectingLine, { AnchorPoint } from "./ConnectingLine";
import Text from "./ui/Text";

interface ActionButtonProps extends HTMLAttributes<HTMLDivElement> {
  onClick: () => void;
  // Allow either text string or a React component
  text?: string;
  component?: ReactNode;
  targetRef?: RefObject<HTMLElement> | undefined; // At least one of these must be supplied
  dataTarget?: string; // At least one of these must be supplied
  color?: string;
  hoverColor?: string;
  diagonal?: boolean;
  sourceAnchor?: AnchorPoint;
  targetAnchor?: AnchorPoint;
  offset?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function ActionButton({
  onClick,
  text,
  component,
  targetRef,
  dataTarget,
  className = "",
  diagonal = false,
  sourceAnchor = "bottom", // Line starts from bottom of source
  targetAnchor = "top", // Line ends at top of target
  offset = 8, // 8px spacing between line and components
  onMouseEnter,
  onMouseLeave,
  ...props
}: ActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  if (!targetRef?.current) {
    return null;
  }

  // Render either the custom component or the default Text component
  const renderContent = () => {
    if (component) {
      return (
        <div
          ref={buttonRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={onClick}
          className={`cursor-pointer ${className}`}
        >
          {component}
        </div>
      );
    }

    return (
      <Text
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        variant="body-light"
        className={`text-pinto-gray-3 hover:text-pinto-green-4 transition-colors cursor-pointer ${className}`}
      >
        {text}
      </Text>
    );
  };

  return (
    <>
      {renderContent()}
      <ConnectingLine
        sourceRef={buttonRef}
        targetRef={targetRef}
        dataTarget={dataTarget}
        sourceAnchor={sourceAnchor}
        targetAnchor={targetAnchor}
        offset={offset}
        isHovered={isHovered}
        diagonal={diagonal}
      />
    </>
  );
}
