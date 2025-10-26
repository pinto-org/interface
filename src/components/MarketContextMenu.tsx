import { type ReactNode, useEffect, useRef } from "react";

export interface ContextMenuOption {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  className?: string;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  options: ContextMenuOption[];
  clickedCoords: { x: number; y: number };
  chartBounds?: DOMRect;
}

export const ContextMenu = ({ x, y, onClose, options, clickedCoords, chartBounds }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't handle click outside - let the chart's unfreeze logic handle closing
    // Only handle Escape key for manual close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Position menu using same logic as hover info
  useEffect(() => {
    if (!menuRef.current || !headerRef.current) return;

    const menuRect = menuRef.current.getBoundingClientRect();
    const headerRect = headerRef.current.getBoundingClientRect();
    const menuWidth = menuRect.width;
    const menuHeight = menuRect.height;
    const headerHeight = headerRect.height;
    const totalHeight = headerHeight + 8 + menuHeight; // header + gap + menu

    // Use chart bounds if provided, otherwise use viewport
    const bounds = chartBounds || {
      left: 0,
      right: window.innerWidth,
      top: 0,
      bottom: window.innerHeight,
    };

    const offsetX = 4;
    const offsetY = 4;

    // Start with default position (right and above cursor)
    let left = x + offsetX;
    let top = y - offsetY - totalHeight; // Header's top edge

    // Detect which edges are overflowing
    const overflowTop = top < bounds.top + 10;
    const overflowRight = left + menuWidth > bounds.right - 10;
    const overflowBottom = top + totalHeight > bounds.bottom - 10;
    const overflowLeft = left < bounds.left + 10;

    // Handle combinations of overflows (same logic as hover info)
    if (overflowTop && overflowRight) {
      // Top-right corner: component's top-right corner at (-4, 4)
      left = x - menuWidth - 4;
      top = y + 4;
    } else if (overflowTop) {
      // Top edge only: component's top-left corner at (4, 4)
      left = x + 4;
      top = y + 4;
      // Check if also overflowing right edge while at top
      if (left + menuWidth > bounds.right - 10) {
        left = x - menuWidth - 4;
      }
    } else if (overflowRight) {
      // Right edge: default to top-right corner (2nd quadrant) at (-4, -4)
      left = x - menuWidth - 4;
      top = y - totalHeight - 4; // Component's bottom-right corner at mouse
      
      // If not enough space above mouse, flip to below (3rd quadrant)
      if (y - totalHeight - 4 < bounds.top + 10) {
        top = y + 4; // Component's top-right corner below mouse
      }
    } else if (overflowBottom) {
      // Bottom edge only: component's bottom-left corner at (4, -4)
      top = y - totalHeight - 4;
    } else if (overflowLeft) {
      // Left edge: push right
      left = bounds.left + 10;
    }

    // Apply positions
    headerRef.current.style.left = `${left}px`;
    headerRef.current.style.top = `${top}px`;
    headerRef.current.style.bottom = 'auto';
    
    menuRef.current.style.left = `${left}px`;
    menuRef.current.style.top = `${top + headerHeight + 8}px`;
  }, [x, y, chartBounds]);

  return (
    <>
      <div
        ref={headerRef}
        className="fixed z-50 text-xs px-3 py-2 flex flex-col gap-1 text-pinto-pod-bronze"
        style={{ left: x, top: y }}
      >
        <div>
          <span>Price per Pod:</span> <span>{clickedCoords.y.toFixed(6)}</span>
        </div>
        <div>
          <span>Place in line:</span> <span>{clickedCoords.x.toFixed(2)}M</span>
        </div>
      </div>
      <div
        ref={menuRef}
        className="fixed z-50 min-w-[160px] bg-white border border-pinto-gray-2 rounded-[0.75rem] shadow-md p-0.5"
        style={{ left: x, top: y }}
      >
        {options.map((option, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={option.label}
            className={`w-full px-4 py-2.5 text-left text-sm text-pinto-gray-4 font-medium rounded-[0.75rem] transition-all hover:bg-pinto-green-1 hover:text-pinto-green active:bg-pinto-green-1 active:text-pinto-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              option.className || ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              option.onClick();
              onClose();
            }}
          >
            <div className="flex items-center gap-3">
              {option.icon && <div className="flex-shrink-0">{option.icon}</div>}
              <span>{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};
