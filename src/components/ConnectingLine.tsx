import { RefObject, useEffect, useState } from 'react';

type Point = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };

  type EdgePoints = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };  
  
  type DOMRectWithCenter = {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
  };

interface ConnectingLineProps {
    refs: RefObject<HTMLElement>[];
    straight?: boolean;
    dotted?: boolean;
    margin?: number;
    straightLineOffset?: number;
};

export default function ConnectingLine({ 
  refs = [],
  straight = false, 
  dotted = false,
  margin = 0,
  straightLineOffset = 10
}: ConnectingLineProps) {
    const [paths, setPaths] = useState<Point[]>([]);
    const [svgPosition, setSvgPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

    const findEdgePoints = (startRect: DOMRect, endRect: DOMRect): EdgePoints => {
      const startCenterX = startRect.left + startRect.width / 2;
      const startCenterY = startRect.top + startRect.height / 2;
      const endCenterX = endRect.left + endRect.width / 2;
      const endCenterY = endRect.top + endRect.height / 2;
  
      const isEndToRight = endCenterX > startCenterX;
      
      const startX = isEndToRight 
        ? startRect.right + margin
        : startRect.left - margin;
        
      const startY = startCenterY;
      
      const endX = isEndToRight 
        ? endRect.left - margin
        : endRect.right + margin;
        
      const endY = endCenterY;
  
      return { startX, startY, endX, endY };
    };
  
    const getPathsBetweenPoints = (startX: number, startY: number, endX: number, endY: number): Point[] => {
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
            y2: startY
          },
          {
            x1: straightStartX,
            y1: startY,
            x2: straightEndX,
            y2: endY
          },
          {
            x1: straightEndX,
            y1: endY,
            x2: endX,
            y2: endY
          }
        ];
      }
  
      const midX = startX + (endX - startX) / 2;
  
      return [
        {
          x1: startX,
          y1: startY,
          x2: midX,
          y2: startY
        },
        {
          x1: midX,
          y1: startY,
          x2: midX,
          y2: endY
        },
        {
          x1: midX,
          y1: endY,
          x2: endX,
          y2: endY
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
        
        const { startX, startY, endX, endY } = findEdgePoints(startRect, endRect);
        const pathSegments = getPathsBetweenPoints(startX, startY, endX, endY);
        allPaths.push(...pathSegments);
      }
  
      calculateSVGBounds(allRects);
      setPaths(allPaths);
    };
  
    useEffect(() => {
      const handleResize = (): void => {
        updateLinePosition();
      };
  
      const handleScroll = (): void => {
        updateLinePosition();
      };
  
      updateLinePosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }, [refs, straight, margin, straightLineOffset]);
  
    const lineStyle = {
      stroke: "black",
      strokeWidth: 1,
      strokeDasharray: dotted ? "6 4" : "none"
    } as const;
  
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
              {...lineStyle}
              className="transition-all duration-300 ease-in-out"
            />
          ))}
        </svg>
      </div>
    );
};