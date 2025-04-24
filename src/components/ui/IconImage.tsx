import { cn } from "@/utils/utils";
import { ChevronUpIcon } from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import clsx from "clsx";
import React from "react";

export interface IconImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /**
   * size in rem
   */
  size: number;
  /**
   * mobile size in rem
   */
  mobileSize?: number;
  /**
   *
   */
  src: string | React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
  /**
   * amount to nudge the icon up. defaults to 0.
   * number in px
   */
  nudge?: keyof typeof nudgeProps;
}

const sizeClasses = {
  3: "h-3 w-3 min-h-3 min-w-3", // 12px
  4: "h-4 w-4 min-h-4 min-w-4", // 16px
  5: "h-5 w-5 min-h-5 min-w-5", // 20px
  6: "h-6 w-6 min-h-6 min-w-6", // 24px
  7: "h-7 w-7 min-h-7 min-w-7", // 28px
  8: "h-8 w-8 min-h-8 min-w-8", // 32px
  9: "h-9 w-9 min-h-9 min-w-9", // 36px
  10: "h-10 w-10 min-h-10 min-w-10", // 40px
  11: "h-11 w-11 min-h-11 min-w-11", // 44px
  12: "h-12 w-12 min-h-12 min-w-12", // 48px
  14: "h-14 w-14 min-h-14 min-w-14", // 56px
  16: "h-16 w-16 min-h-16 min-w-16", // 64px
} as const;

const smSizeClasses = {
  3: "sm:h-3 sm:w-3 min-h-3 min-w-3",
  4: "sm:h-4 sm:w-4 min-h-4 min-w-4",
  5: "sm:h-5 sm:w-5 min-h-5 min-w-5",
  6: "sm:h-6 sm:w-6 min-h-6 min-w-6",
  7: "sm:h-7 sm:w-7 min-h-7 min-w-7",
  8: "sm:h-8 sm:w-8 min-h-8 min-w-8",
  9: "sm:h-9 sm:w-9 min-h-9 min-w-9",
  10: "sm:h-10 sm:w-10 min-h-10 min-w-10",
  11: "sm:h-11 sm:w-11 min-h-11 min-w-11",
  12: "sm:h-12 sm:w-12 min-h-12 min-w-12",
  14: "sm:h-14 sm:w-14 min-h-14 min-w-14",
  16: "sm:h-16 sm:w-16 min-h-16 min-w-16",
} as const;

const makeIconImageClassName = (s: number, ms?: number) => {
  const mobileClass = sizeClasses[ms ?? (s as keyof typeof sizeClasses)] || "";
  const desktopClass = smSizeClasses[s as keyof typeof smSizeClasses] || "";

  return `${mobileClass} ${desktopClass}`;
};

const nudgeProps = {
  [-6]: clsx("relative bottom-[-0.375rem]"), // -6px
  [-5]: clsx("relative bottom-[-0.3125rem]"), // -5px
  [-4]: clsx("relative bottom-[-0.25rem]"), // -4px
  [-3]: clsx("relative bottom-[-0.1875rem]"), // -3px
  [-2]: clsx("relative bottom-[-0.125rem]"), // -2px
  [-1]: clsx("relative bottom-[-0.0625rem]"), // -1px
  0: clsx(""), // 0px
  1: clsx("relative bottom-[0.0625rem]"), // 1px
  2: clsx("relative bottom-[0.125rem]"), // 2px
  3: clsx("relative bottom-[0.1875rem]"), // 3px
  4: clsx("relative bottom-[0.25rem]"), // 4px
  5: clsx("relative bottom-[0.3125rem]"), // 5px
  6: clsx("relative bottom-[0.375rem]"), // 6px
};

const IconImage = ({ size = 6, mobileSize, src, nudge = 0, ...props }: IconImageProps) => {
  if (typeof src === "string") {
    return (
      <img
        {...props}
        src={src}
        className={cn(makeIconImageClassName(size, mobileSize), "flex-shrink-0", nudgeProps[nudge], props.className)}
        alt={props.alt} // Have this here to prevent ally linter from complaining
      />
    );
  }

  const Icon = src;
  return (
    <Icon
      className={cn(makeIconImageClassName(size, mobileSize), "flex-shrink-0", nudgeProps[nudge], props.className)}
    />
  );
};

export default IconImage;
