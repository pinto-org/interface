import { HTMLAttributes } from "react";
import { CheckmarkIcon } from "./Icons";

interface CheckmarkCircleProps extends HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean;
  size?: number;
}

export default function CheckmarkCircle({
  isSelected = false,
  size = 24,
  className = "",
  ...props
}: CheckmarkCircleProps) {
  // Calculate icon size (typically 2/3 of container size)
  const iconSize = Math.floor((size * 2) / 3);

  // Standard Tailwind sizes
  const sizeMap: Record<number, string> = {
    16: "w-4 h-4",
    20: "w-5 h-5",
    24: "w-6 h-6",
    28: "w-7 h-7",
    32: "w-8 h-8",
    36: "w-9 h-9",
    40: "w-10 h-10",
    48: "w-12 h-12",
  };

  // Use style prop for custom sizes that don't match Tailwind classes
  const customSizeRem = size / 16;
  const customSizeStyle = !sizeMap[size] ? { width: `${customSizeRem}rem`, height: `${customSizeRem}rem` } : undefined;

  const iconSizeRem = `${iconSize / 16}rem`;

  return (
    <div
      className={`
        border rounded-full flex flex-shrink-0 items-center justify-center
        ${isSelected ? "border-pinto-green-4 bg-pinto-green-1 text-pinto-green-4" : "border-pinto-gray-2 bg-transparent"}
        ${sizeMap[size] || ""}
        ${className}
      `}
      style={customSizeStyle}
      {...props}
    >
      {isSelected && <CheckmarkIcon color="currentColor" width={iconSizeRem} height={iconSizeRem} />}
    </div>
  );
}
