import ConnectingLine from "@/components/ConnectingLine";
import { Button } from "@/components/ui/Button";
import { createRef, forwardRef, useEffect, useRef, useState } from "react";
import Text from "./ui/Text";

type Position = "left" | "right" | "top" | "bottom";

interface ConnectingLineSettings {
  straight?: boolean;
  dotted?: boolean;
  margin?: number;
  normalColor?: string;
  hoverColor?: string;
  isHovered?: boolean;
}

interface ActionButtonProps {
  text: string;
  onClick: () => void;
  targetData: string | string[];
  position: Position;
  offsetX: number;
  offsetY: number;
  lineSettings?: ConnectingLineSettings;
}

const calculateButtonPosition = (
  targetRect: DOMRect,
  buttonRect: DOMRect | undefined,
  position: Position,
  offsetX: number,
  offsetY: number,
) => {
  if (!buttonRect) return { top: 0, left: 0 };

  switch (position) {
    case "left":
      return {
        top: targetRect.top + (targetRect.height - buttonRect.height) / 2 + offsetY,
        left: targetRect.left - buttonRect.width - offsetX,
      };
    case "right":
      return {
        top: targetRect.top + (targetRect.height - buttonRect.height) / 2 + offsetY,
        left: targetRect.right + offsetX,
      };
    case "top":
      return {
        top: targetRect.top - buttonRect.height - offsetY,
        left: targetRect.left + (targetRect.width - buttonRect.width) / 2 + offsetX,
      };
    case "bottom":
      return {
        top: targetRect.bottom + offsetY,
        left: targetRect.left + (targetRect.width - buttonRect.width) / 2 + offsetX,
      };
    default:
      return { top: 0, left: 0 };
  }
};

const getConnectorPositions = (position: Position, targetIndex: number) => {
  switch (position) {
    case "left":
      return { startPositionY: 0.5, endPositionY: 0.5 };
    case "right":
      return { startPositionY: 0.5, endPositionY: 0.5 };
    case "top":
      return {
        startPositionY: targetIndex === 0 ? 0.8 : 1,
        endPositionY: 0,
      };
    case "bottom":
      return {
        startPositionY: targetIndex === 0 ? 0.2 : 0,
        endPositionY: 1,
      };
  }
};

const defaultLineSettings: ConnectingLineSettings = {
  straight: true,
  dotted: false,
  margin: 0,
  normalColor: "#246645",
  hoverColor: "#246645",
};

export const ActionButton = forwardRef<HTMLDivElement, ActionButtonProps>(
  ({ text, onClick, targetData, position, offsetX = 32, offsetY = 32, lineSettings = {} }, forwardedRef) => {
    const [isHovered, setIsHovered] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

    const buttonRef = useRef<HTMLDivElement | null>(null);
    const targetRefs = useRef<Array<React.RefObject<HTMLElement>>>(
      Array.isArray(targetData) ? targetData.map(() => createRef<HTMLElement>()) : [createRef<HTMLElement>()],
    );

    // Merge default and custom line settings, allowing hover state override
    const finalLineSettings = {
      ...defaultLineSettings,
      ...lineSettings,
      // Only use component's hover state if isHovered wasn't explicitly set in lineSettings
      isHovered: "isHovered" in lineSettings ? lineSettings.isHovered : isHovered,
    };

    const updatePosition = () => {
      // Convert targetData to array of selectors
      const dataSelectors = Array.isArray(targetData) ? targetData : [targetData];

      // Find elements using data attributes
      const targets = dataSelectors.map((dataAttr) =>
        document.querySelector<HTMLElement>(`[data-action-target="${dataAttr}"]`),
      );

      const primaryTarget = targets[0];
      if (!primaryTarget) return;

      const targetRect = primaryTarget.getBoundingClientRect();
      const buttonRect = buttonRef.current?.getBoundingClientRect();

      const newPosition = calculateButtonPosition(targetRect, buttonRect, position, offsetX, offsetY);
      setButtonPosition({
        top: newPosition.top + window.scrollY,
        left: newPosition.left + window.scrollX,
      });

      // Update target refs
      targets.forEach((target, index) => {
        if (target && targetRefs.current[index]) {
          Object.defineProperty(targetRefs.current[index], "current", {
            value: target,
            writable: true,
          });
        }
      });
    };

    useEffect(() => {
      updatePosition();

      const handleUpdate = () => {
        requestAnimationFrame(updatePosition);
      };

      window.addEventListener("resize", handleUpdate);
      window.addEventListener("scroll", handleUpdate);

      // Update position when content potentially affects layout
      const observer = new MutationObserver(handleUpdate);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      return () => {
        window.removeEventListener("resize", handleUpdate);
        window.removeEventListener("scroll", handleUpdate);
        observer.disconnect();
      };
    }, [targetData, position, offsetX, offsetY]);

    return (
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
        <div
          ref={(el) => {
            buttonRef.current = el;
            if (typeof forwardedRef === "function") {
              forwardedRef(el);
            } else if (forwardedRef) {
              forwardedRef.current = el;
            }
          }}
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            absolute rounded-full font-[400] text-[1.25rem]
            transition-all duration-200 transform
          `}
          style={{
            top: buttonPosition.top,
            left: buttonPosition.left,
            zIndex: 50,
            pointerEvents: "auto",
          }}
        >
          {text}
        </div>

        {buttonRef.current &&
          targetRefs.current.map(
            (targetRef, index) =>
              targetRef.current && (
                <ConnectingLine
                  key={index}
                  refs={[buttonRef, targetRef]}
                  {...finalLineSettings}
                  {...getConnectorPositions(position, index)}
                />
              ),
          )}
      </div>
    );
  },
);

ActionButton.displayName = "ActionButton";
