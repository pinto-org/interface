import animatedSpinner from "@/assets/misc/animated-spinner.svg";
import React from "react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner = React.memo(({ size = 40, className = "" }: LoadingSpinnerProps) => {
  return (
    <div
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    >
      <img src={animatedSpinner} alt="Loading spinner" className="w-full h-full object-contain" />
    </div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
