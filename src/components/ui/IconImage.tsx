import { cn } from "@/utils/utils";
import { ChevronUpIcon } from "@radix-ui/react-icons";
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
  src: string | typeof ChevronUpIcon;
  /**
   * amount to nudge the icon up. defaults to 0.
   * number in px
   */
  nudge?: keyof typeof nudgeProps;
}

const makeIconImageClassName = (s: number, ms?: number) => {
  const base = ms ?? s;
  const className = `h-${base} w-${base} min-w-${base} min-h-${base} max-h-${base} max-w-${base}`;

  return `${className} sm:h-${s} sm:w-${s} sm:min-w-${s} sm:min-h-${s} sm:max-h-${s} sm:max-w-${s}`;
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
