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
  isClosing?: boolean;
}

export const ContextMenu = ({
  x,
  y,
  onClose,
  options,
  clickedCoords,
  chartBounds,
  isClosing = false,
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't handle click outside - let the chart's unfreeze logic handle closing
    // Only handle Escape key for manual close and scroll to unfreeze
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleScroll = () => {
      // Close context menu and unfreeze on scroll
      onClose();
    };

    document.addEventListener("keydown", handleEscape);
    // Listen to wheel event for mouse wheel scroll
    document.addEventListener("wheel", handleScroll, { passive: true });
    // Listen to scroll on window with capture to catch all scroll events (including keyboard scroll)
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("wheel", handleScroll);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose]);

  // Position tooltip text (header) - keep existing logic
  useEffect(() => {
    if (!headerRef.current) return;

    const headerRect = headerRef.current.getBoundingClientRect();
    const headerWidth = headerRect.width;
    const headerHeight = headerRect.height;

    // Use chart bounds if provided, otherwise use viewport
    const bounds = chartBounds || {
      left: 0,
      right: window.innerWidth,
      top: 0,
      bottom: window.innerHeight,
    };

    const offsetX = 4;
    const offsetY = 4;

    // Start with default position (1st quadrant: top-right of cursor)
    let headerLeft = x + offsetX;
    let headerTop = y - offsetY - headerHeight;

    // Detect which edges are overflowing for header
    const overflowTop = headerTop < bounds.top + 10;
    const overflowRight = headerLeft + headerWidth > bounds.right - 10;
    const overflowBottom = headerTop + headerHeight > bounds.bottom - 10;
    const overflowLeft = headerLeft < bounds.left + 10;

    // Handle combinations of overflows (existing tooltip logic)
    if (overflowTop && overflowRight) {
      // Top-right corner: move to 4th quadrant (below cursor, left side)
      headerLeft = x - headerWidth - 4;
      headerTop = y + 4;
    } else if (overflowTop) {
      // Top edge only: move to 4th quadrant (below cursor)
      headerLeft = x + 4;
      headerTop = y + 4;
      // Check if also overflowing right edge while at top
      if (headerLeft + headerWidth > bounds.right - 10) {
        headerLeft = x - headerWidth - 4;
      }
    } else if (overflowRight) {
      // Right edge: move to 2nd quadrant (top-left of cursor)
      headerLeft = x - headerWidth - 4;
      headerTop = y - headerHeight - 4;

      // If not enough space above mouse, flip to 3rd quadrant (below cursor, left side)
      if (headerTop < bounds.top + 10) {
        headerTop = y + 4;
      }
    } else if (overflowBottom) {
      // Bottom edge only: move up
      headerTop = y - headerHeight - 4;
    } else if (overflowLeft) {
      // Left edge: push right
      headerLeft = bounds.left + 10;
    }

    // Apply header positions
    headerRef.current.style.left = `${headerLeft}px`;
    headerRef.current.style.top = `${headerTop}px`;
    headerRef.current.style.bottom = "auto";
  }, [x, y, chartBounds]);

  // Position menu buttons independently based on quadrant logic
  useEffect(() => {
    if (!menuRef.current || !headerRef.current) return;

    const menuRect = menuRef.current.getBoundingClientRect();
    const headerRect = headerRef.current.getBoundingClientRect();
    const menuWidth = menuRect.width;
    // Use actual height or estimated height if not yet rendered (2 buttons * ~44px each + container padding)
    const menuHeight = menuRect.height || 92;
    const headerLeft = headerRect.left;
    const headerTop = headerRect.top;
    const headerWidth = headerRect.width;
    const headerHeight = headerRect.height;

    // Use chart bounds if provided, otherwise use viewport
    const bounds = chartBounds || {
      left: 0,
      right: window.innerWidth,
      top: 0,
      bottom: window.innerHeight,
    };

    const buttonOffsetX = 12; // Horizontal offset from cursor for buttons (0.75rem)
    const buttonOffsetY = 8; // Vertical offset from cursor for buttons (0.5rem)
    const gap = 4; // Gap between tooltip and buttons when in same quadrant
    const bottomMargin = 40; // Minimum margin from bottom before flipping (accounts for chart padding/legend)

    // Determine where the tooltip actually is relative to cursor
    const tooltipIsRightOfCursor = headerLeft >= x;
    const tooltipIsAboveCursor = headerTop + headerHeight <= y;
    const tooltipIsBelowCursor = headerTop >= y;

    let menuLeft: number;
    let menuTop: number;

    // Case 1: Tooltip is above cursor (1st or 2nd quadrant)
    if (tooltipIsAboveCursor) {
      // Try to place buttons below cursor (4th or 3rd quadrant) - different quadrant
      if (tooltipIsRightOfCursor) {
        // Tooltip in 1st quadrant -> buttons in 4th quadrant
        menuLeft = x + buttonOffsetX;
        menuTop = y + buttonOffsetY;
      } else {
        // Tooltip in 2nd quadrant -> buttons in 3rd quadrant
        menuLeft = x - buttonOffsetX - menuWidth;
        menuTop = y + buttonOffsetY;
      }

      // Check if buttons fit below cursor (with bottom margin: base 10px + 16px extra)
      const wouldOverflow = menuTop + menuHeight > bounds.bottom - 10 - bottomMargin;
      if (wouldOverflow) {
        // Not enough space below, place buttons above tooltip (aligned with tooltip)
        menuLeft = headerLeft + 8; // Align with tooltip, shifted 8px right
        menuTop = headerTop - gap - menuHeight;

        // If still doesn't fit, place above cursor
        if (menuTop < bounds.top + 10) {
          menuTop = y - buttonOffsetY - menuHeight;
        }
      }
    }
    // Case 2: Tooltip is below cursor (3rd or 4th quadrant)
    else if (tooltipIsBelowCursor) {
      // Place buttons below text container in same quadrant with reduced gap
      // Shift 8px to the right for visual alignment
      menuLeft = headerLeft + 8;
      menuTop = headerTop + headerHeight + gap;

      // Check if buttons fit (with bottom margin: base 10px + 16px extra)
      const wouldOverflow = menuTop + menuHeight > bounds.bottom - 10 - bottomMargin;
      if (wouldOverflow) {
        // Not enough space below tooltip, place buttons above cursor instead
        menuTop = y - buttonOffsetY - menuHeight;

        // If still doesn't fit above, place above tooltip
        if (menuTop < bounds.top + 10) {
          menuTop = headerTop - gap - menuHeight;
        }
      }
    }
    // Case 3: Tooltip is at cursor level (rare edge case)
    else {
      // Default to right/below cursor
      menuLeft = x + buttonOffsetX;
      menuTop = y + buttonOffsetY;

      // Check horizontal alignment with tooltip
      if (headerLeft > x) {
        menuLeft = headerLeft;
      } else if (headerLeft + headerWidth < x) {
        menuLeft = headerLeft + headerWidth - menuWidth;
      }
    }

    // Final boundary checks - ensure 16px margin from bottom (matching text container style: -10 - 16)
    if (menuTop < bounds.top + 10) {
      menuTop = bounds.top + 10;
    }
    if (menuTop + menuHeight > bounds.bottom - 10 - bottomMargin) {
      menuTop = bounds.bottom - 10 - bottomMargin - menuHeight;
    }
    if (menuLeft < bounds.left + 10) {
      menuLeft = bounds.left + 10;
    }
    if (menuLeft + menuWidth > bounds.right - 10) {
      menuLeft = bounds.right - 10 - menuWidth;
    }

    // Apply menu positions and width
    // Width is narrower by offset difference (buttonOffsetX 12px - textOffsetX 4px = 8px)
    const offsetDifference = buttonOffsetX + 4;
    menuRef.current.style.left = `${menuLeft}px`;
    menuRef.current.style.top = `${menuTop}px`;
    menuRef.current.style.width = `${headerWidth - offsetDifference}px`;
  }, [x, y, chartBounds]);

  return (
    <>
      <div
        ref={headerRef}
        className={`fixed z-50 text-xs px-3 py-2 flex flex-col gap-1 text-pinto-pod-bronze ${isClosing && "animate-fade-out-smooth"}`}
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
        className={`fixed z-50 bg-white border border-pinto-gray-2 rounded-[0.75rem] shadow-md p-0.5 ${isClosing ? "animate-fade-out-smooth" : "animate-fade-in-smooth"}`}
        style={{ left: x, top: y }}
      >
        {options.map((option, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={option.label}
            className={`w-full px-3 py-2 text-left text-sm text-pinto-gray-4 font-medium rounded-[0.75rem] transition-all hover:bg-pinto-green-1 hover:text-pinto-green active:bg-pinto-green-1 active:text-pinto-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
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

/**
 * COORDINATE SYSTEM & QUADRANT MODEL
 * ====================================
 *
 * This component uses a Cartesian-style quadrant system to intelligently position
 * the context menu and tooltip relative to the cursor position.
 *
 * QUADRANT LAYOUT (relative to cursor):
 *
 *     2nd Quadrant  |  1st Quadrant
 *     (top-left)    |  (top-right)     ← Preferred default for tooltip
 *   ----------------+-----------------
 *     3rd Quadrant  |  4th Quadrant
 *     (bottom-left) |  (bottom-right)  ← Preferred default for buttons
 *                   ↑
 *                cursor (x, y)
 *
 * POSITIONING STRATEGY:
 *
 * 1. TOOLTIP (Header):
 *    - Default: 1st quadrant (top-right of cursor)
 *    - Falls back to other quadrants based on viewport/chart boundaries
 *    - Prioritizes visibility and readability
 *
 * 2. BUTTONS (Menu):
 *    - Prefer different quadrant from tooltip to avoid overlap
 *    - If tooltip is above (1st/2nd quadrant) → buttons go below (4th/3rd quadrant)
 *    - If tooltip is below (3rd/4th quadrant) → buttons stack below tooltip with gap
 *    - Includes bottom margin (40px) to avoid chart legends and padding
 *
 * 3. OVERFLOW HANDLING:
 *    - Detects overflow in all directions (top, right, bottom, left)
 *    - Flips to appropriate quadrant when space is limited
 *    - Maintains minimum 10px padding from boundaries
 *    - Chart-aware: respects chartBounds when provided
 *
 * EDGE CASES HANDLED:
 *
 * 1. Corner Overflow (Top-Right):
 *    - When both top and right edges overflow → flip to 4th quadrant (bottom-left)
 *    - Ensures tooltip remains visible in tight corner spaces
 *
 * 2. Compound Edge Overflow:
 *    - Top overflow while checking right → conditionally flip horizontal alignment
 *    - Right overflow with insufficient space above → cascade to 3rd quadrant
 *    - Prevents tooltip from being pushed outside bounds in multiple directions
 *
 * 3. Tooltip at Cursor Level (Rare):
 *    - When tooltip ends up horizontally aligned with cursor (neither above nor below)
 *    - Falls back to default right/below positioning
 *    - Adjusts horizontal alignment based on tooltip's actual position
 *
 * 4. Button Overflow Cascading:
 *    - When buttons can't fit below cursor → try above tooltip
 *    - When buttons can't fit above tooltip → try above cursor
 *    - Final boundary check ensures buttons stay within viewport even if logic fails
 *
 * 5. Bottom Margin Enforcement:
 *    - Adds 40px extra margin from bottom to avoid chart legends/padding
 *    - Prevents buttons from overlapping with chart UI elements
 *    - Takes precedence in overflow calculations
 *
 * 6. Missing Chart Bounds:
 *    - Falls back to viewport dimensions (window.innerWidth/innerHeight)
 *    - Ensures component works both inside and outside chart contexts
 *
 * 7. Dynamic Element Sizing:
 *    - Uses getBoundingClientRect() for actual rendered dimensions
 *    - Falls back to estimated heights (92px for menu) during initial render
 *    - Prevents positioning glitches before elements are measured
 *
 * 8. Final Boundary Clamping:
 *    - After all quadrant logic, applies hard limits to prevent any overflow
 *    - Clamps positions to stay within [bounds + 10px] margins
 *    - Last resort to ensure visibility even in extreme edge cases
 *
 * OFFSET VALUES:
 *    - Tooltip: offsetX=4px, offsetY=4px
 *    - Buttons: buttonOffsetX=12px, buttonOffsetY=8px
 *    - Gap between components: 4px
 *    - Bottom margin for buttons: 40px (accounts for chart UI elements)
 *    - Minimum boundary padding: 10px (all edges)
 */
