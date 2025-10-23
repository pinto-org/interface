import { cn } from "@/utils/utils";
import { cva } from "class-variance-authority";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ClassNameValue } from "tailwind-merge";

const fadeVariants = cva("pointer-events-none absolute z-10", {
  variants: {
    direction: {
      left: "top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-gray-50 to-transparent",
      right: "top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent",
      top: "top-0 left-0 right-0 h-12 bg-gradient-to-b from-gray-50 to-transparent",
      bottom: "bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent",
    },
  },
  defaultVariants: {
    direction: "bottom",
  },
});

type FadeDirection = "top" | "left" | "bottom" | "right";

interface UseFadeOpacityOptions {
  direction?: FadeDirection;
  maxHeightRem?: number;
  bufferRem?: number;
  scrollBuffer?: number;
  fadeClassName?: ClassNameValue;
  isBGGradient?: boolean;
}

interface FadeOpacityProps extends React.ComponentProps<"div"> {
  direction?: FadeDirection;
  maxHeightRem?: number;
  bufferRem?: number;
  scrollBuffer?: number;
  fadeClassName?: ClassNameValue;
  isBGGradient?: boolean;
}

const BASE_FONT_SIZE = 16;

const getFontSize = () => {
  const el = window.getComputedStyle(document.documentElement);
  const fsValue = el.getPropertyValue("font-size");

  try {
    const fs = fsValue.split("px");
    return Number(fs[0]);
  } catch (_) {
    return BASE_FONT_SIZE;
  }
};

const useGlobalFontSize = () => {
  const [fontSize, setFontSize] = useState(getFontSize());

  useEffect(() => {
    const handleChange = () => {
      setFontSize(getFontSize());
    };

    handleChange();
    window.addEventListener("resize", handleChange);
    return () => window.removeEventListener("resize", handleChange);
  }, []);

  return fontSize;
};

const useFadeOpacity = <T extends HTMLElement = HTMLDivElement>({
  direction = "bottom",
  maxHeightRem = 30,
  bufferRem = 1,
  scrollBuffer = 1,
  fadeClassName,
  isBGGradient = false,
}: UseFadeOpacityOptions = {}) => {
  const [shouldFade, setShouldFade] = useState(false);
  const containerRef = useRef<T | null>(null);
  const fontSize = useGlobalFontSize();

  const checkScrollNeeded = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const height = el.clientHeight;
    const width = el.clientWidth;
    const scrollHeight = el.scrollHeight;
    const scrollWidth = el.scrollWidth;
    const scrollTop = el.scrollTop;
    const scrollLeft = el.scrollLeft;

    // Check if there's enough space to show fade
    const isVertical = direction === "bottom" || direction === "top";
    const hasSpace = isVertical
      ? height / fontSize > maxHeightRem - bufferRem
      : width / fontSize > maxHeightRem - bufferRem;

    if (!hasSpace) {
      setShouldFade(false);
      return;
    }

    let shouldShow = false;
    switch (direction) {
      case "bottom":
        shouldShow = scrollTop + height < scrollHeight - scrollBuffer;
        break;
      case "top":
        shouldShow = scrollTop > scrollBuffer;
        break;
      case "right":
        shouldShow = scrollLeft + width < scrollWidth - scrollBuffer;
        break;
      case "left":
        shouldShow = scrollLeft > scrollBuffer;
        break;
    }

    setShouldFade(shouldShow);
  }, [direction, scrollBuffer, fontSize, maxHeightRem, bufferRem]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScrollNeeded();
    el.addEventListener("scroll", checkScrollNeeded);
    return () => el.removeEventListener("scroll", checkScrollNeeded);
  }, [checkScrollNeeded]);

  const fadeElements = shouldFade ? (
    <div
      className={cn(
        fadeVariants({ direction }),
        isBGGradient ? "bg-from-[rgba(241, 248, 140, 0.4)]" : "",
        fadeClassName,
      )}
    />
  ) : null;

  return {
    containerRef,
    fadeElements,
  };
};

const FadeOpacity = React.forwardRef<HTMLDivElement, FadeOpacityProps>(
  (
    {
      children,
      direction = "bottom",
      className,
      maxHeightRem = 30,
      bufferRem = 1,
      scrollBuffer = 1,
      fadeClassName,
      isBGGradient = false,
      ...props
    },
    ref,
  ) => {
    const { containerRef, fadeElements } = useFadeOpacity({
      direction,
      maxHeightRem,
      bufferRem,
      scrollBuffer,
      fadeClassName,
      isBGGradient,
    });

    return (
      <div className="relative" ref={ref} {...props}>
        <div ref={containerRef} className={cn("overflow-auto", className)}>
          {children}
        </div>
        {fadeElements}
      </div>
    );
  },
);

FadeOpacity.displayName = "FadeOpacity";

export { useFadeOpacity };
export default FadeOpacity;
