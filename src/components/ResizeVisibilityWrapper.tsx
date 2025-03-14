import { ReactNode, useEffect, useRef, useState } from "react";

interface ResizeVisibilityProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}
/*
 * A wrapper component that temporarily hides its children during window resize events.
 * This can help prevent visual jank or layout shifts during resize operations.
 */
export default function ResizeVisibilityWrapper({ children, delay = 100, className }: ResizeVisibilityProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(false);
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    handleVisibility();
    window.addEventListener("resize", handleVisibility);

    return () => {
      window.removeEventListener("resize", handleVisibility);
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${isVisible ? "opacity-100 duration-300" : "opacity-0 duration-0"} ${className}`}
    >
      {children}
    </div>
  );
}
