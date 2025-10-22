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
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Adjust position if menu would overflow chart or viewport
  useEffect(() => {
    if (!menuRef.current || !headerRef.current) return;

    const menuRect = menuRef.current.getBoundingClientRect();
    const headerRect = headerRef.current.getBoundingClientRect();
    const paddingX = 20;
    const paddingY = 50;

    // Use chart bounds if provided, otherwise use viewport
    const bounds = chartBounds || {
      left: 0,
      right: window.innerWidth,
      top: 0,
      bottom: window.innerHeight,
    };

    // Calculate adjusted X position
    let adjustedX = x;
    const maxWidth = Math.max(menuRect.width, headerRect.width);

    if (x + maxWidth > bounds.right - paddingX) {
      adjustedX = bounds.right - maxWidth - paddingX;
    }
    if (adjustedX < bounds.left + paddingX) {
      adjustedX = bounds.left + paddingX;
    }

    // Calculate adjusted Y position for menu
    let adjustedMenuTop = y + 8; // original top + gap
    if (adjustedMenuTop + menuRect.height > bounds.bottom - paddingY) {
      adjustedMenuTop = bounds.bottom - menuRect.height - paddingY;
    }
    if (adjustedMenuTop < bounds.top + paddingY) {
      adjustedMenuTop = bounds.top + paddingY;
    }

    // Apply adjustments
    if (adjustedX !== x) {
      headerRef.current.style.left = `${adjustedX}px`;
      menuRef.current.style.left = `${adjustedX}px`;
    }

    if (adjustedMenuTop !== y + 8) {
      menuRef.current.style.top = `${adjustedMenuTop}px`;
      // Adjust header bottom accordingly
      const headerBottom = window.innerHeight - (adjustedMenuTop - 8);
      headerRef.current.style.bottom = `${headerBottom}px`;
    }
  }, [x, y, chartBounds]);

  return (
    <>
      <div
        ref={headerRef}
        className="fixed z-50 text-xs px-3 py-2 flex flex-col gap-1 text-pinto-pod-bronze"
        style={{ left: x, bottom: `calc(100vh - ${y}px)` }}
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
        className="fixed z-50 min-w-[200px] bg-white border border-gray-300 rounded-lg shadow-md"
        style={{ left: x, top: `calc(${y}px + 8px)` }}
      >
        {options.map((option, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={option.label}
            className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg ${
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
              <span className="font-medium">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};
