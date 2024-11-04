import { RefObject, useEffect, useState } from 'react';

type Point = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    startIndex: number;
    endIndex: number;
  };

  type EdgePoints = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };  

interface ConnectingLineProps {
    refs: RefObject<HTMLElement>[];
    straight?: boolean;
    dotted?: boolean;
    margin?: number;
    straightLineOffset?: number;
    normalColor?: string;
    hoverColor?: string;
    isHovered?: boolean;
    startPositionY?: number;  // Default to 0.5 for center
    endPositionY?: number;    // Default to 0.5 for center
};

export default function ConnectingLine({ 
  refs = [],
  straight = false, 
  dotted = false,
  margin = 0,
  straightLineOffset = 10,
  normalColor = "black",
  hoverColor = "#3b82f6",
  isHovered = false,
  startPositionY = 0.5,
  endPositionY = 0.5
}: ConnectingLineProps) {
    const [paths, setPaths] = useState<Point[]>([]);
    const [svgPosition, setSvgPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

    const findEdgePoints = (
      startRect: DOMRect, 
      endRect: DOMRect, 
      startPositionY: number = 0.5,
      endPositionY: number = 0.5
    ): EdgePoints => {
      const startCenterX = startRect.left + startRect.width / 2;
      const startCenterY = startRect.top + startRect.height / 2;
      const endCenterX = endRect.left + endRect.width / 2;
      const endCenterY = endRect.top + endRect.height / 2;
    
      const angle = Math.atan2(endCenterY - startCenterY, endCenterX - startCenterX);
      const isMoreHorizontal = Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle));
      const isEndToRight = endCenterX > startCenterX;
      
      const horizontalPoints = {
        startX: isEndToRight ? startRect.right + margin : startRect.left - margin,
        startY: startRect.top + (startRect.height * startPositionY),
        endX: isEndToRight ? endRect.left - margin : endRect.right + margin,
        endY: endRect.top + (endRect.height * endPositionY)  // Using endPositionY
      };
    
      const verticalPoints = {
        startX: startCenterX,
        startY: startCenterY > endCenterY ? startRect.top - margin : startRect.bottom + margin,
        endX: endCenterX,
        endY: startCenterY > endCenterY ? endRect.bottom + margin : endRect.top - margin
      };
    
      return isMoreHorizontal ? horizontalPoints : verticalPoints;
    };

    const getPathsBetweenPoints = (
      startX: number, 
      startY: number, 
      endX: number, 
      endY: number,
      startIndex: number,
      endIndex: number
    ): Point[] => {
      if (straight) {
        const isEndToRight = endX > startX;
        const straightStartX = isEndToRight 
          ? startX + straightLineOffset 
          : startX - straightLineOffset;
        const straightEndX = isEndToRight
          ? endX - straightLineOffset
          : endX + straightLineOffset;
  
        return [
          {
            x1: startX,
            y1: startY,
            x2: straightStartX,
            y2: startY,
            startIndex,
            endIndex
          },
          {
            x1: straightStartX,
            y1: startY,
            x2: straightEndX,
            y2: endY,
            startIndex,
            endIndex
          },
          {
            x1: straightEndX,
            y1: endY,
            x2: endX,
            y2: endY,
            startIndex,
            endIndex
          }
        ];
      }
  
      const midX = startX + (endX - startX) / 2;
  
      return [
        {
          x1: startX,
          y1: startY,
          x2: midX,
          y2: startY,
          startIndex,
          endIndex
        },
        {
          x1: midX,
          y1: startY,
          x2: midX,
          y2: endY,
          startIndex,
          endIndex
        },
        {
          x1: midX,
          y1: endY,
          x2: endX,
          y2: endY,
          startIndex,
          endIndex
        }
      ];
    };
  
    const isValidRef = (ref: RefObject<HTMLElement>): boolean => {
      return ref?.current instanceof HTMLElement;
    };
  
    const calculateSVGBounds = (rects: DOMRect[]): void => {
      const minX = Math.min(...rects.map(r => r.left));
      const minY = Math.min(...rects.map(r => r.top));
      const maxX = Math.max(...rects.map(r => r.right));
      const maxY = Math.max(...rects.map(r => r.bottom));
  
      setSvgPosition({
        top: minY,
        left: minX,
        width: maxX - minX,
        height: maxY - minY
      });
    };
  
    const updateLinePosition = (): void => {
      const hasValidRefs = refs.length >= 2 && refs.every(isValidRef);
      if (!hasValidRefs) return;

      requestAnimationFrame(() => {
        const allPaths: Point[] = [];
        const allRects: DOMRect[] = [];
        
        const connections = refs.length - 1;
        for (let i = 0; i < connections; i++) {
          const startElement = refs[i].current;
          const endElement = refs[i + 1].current;
  
          if (!startElement || !endElement) continue;
  
          const startRect = startElement.getBoundingClientRect();
          const endRect = endElement.getBoundingClientRect();
          
          allRects.push(startRect, endRect);
          
          const { startX, startY, endX, endY } = findEdgePoints(
            startRect, 
            endRect, 
            startPositionY,
            endPositionY
          );
          const pathSegments = getPathsBetweenPoints(startX, startY, endX, endY, i, i + 1);
          allPaths.push(...pathSegments);
        }

          calculateSVGBounds(allRects);
          setPaths(allPaths);
      });
  };

  useEffect(() => {
      const handleResize = (): void => {
          updateLinePosition();
      };

      const handleScroll = (): void => {
          updateLinePosition();
      };

      // Create ResizeObserver for each ref
      const observers: ResizeObserver[] = [];

      refs.forEach((ref) => {
          if (ref.current) {
              const observer = new ResizeObserver(() => {
                  updateLinePosition();
              });

              observer.observe(ref.current);
              observers.push(observer);
          }
      });

      // Initial position
      updateLinePosition();

      // Event listeners
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('scroll', handleScroll, true);
          observers.forEach(observer => observer.disconnect());
      };
  }, [refs, straight, margin, straightLineOffset]);

    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50
        }}
      >
        <svg 
          style={{
            position: 'absolute',
            top: `${svgPosition.top}px`,
            left: `${svgPosition.left}px`,
            width: `${svgPosition.width}px`,
            height: `${svgPosition.height}px`,
          }}
        >
          {paths.map((path, index) => (
            <line
              key={index}
              x1={path.x1 - svgPosition.left}
              y1={path.y1 - svgPosition.top}
              x2={path.x2 - svgPosition.left}
              y2={path.y2 - svgPosition.top}
              stroke={isHovered ? hoverColor : normalColor}
              strokeWidth={1}
              strokeDasharray={dotted ? "6 4" : "none"}
              className="transition-all duration-300 ease-in-out"
            />
          ))}
        </svg>
      </div>
    );
};