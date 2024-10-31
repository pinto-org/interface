import React from "react";
import { cn } from "@/utils/utils";
import { ChevronUpIcon, ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";

export interface IconImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  size: number;
  mobileSize?: number;
  src: string | typeof ChevronUpIcon;
}

const makeIconImageClassName = (s: number, ms?: number) => {
  const base = ms ?? s;
  const className = `h-${base} w-${base} min-w-${base} min-h-${base} max-h-${base} max-w-${base}`;

  return `${className} sm:h-${s} sm:w-${s} sm:min-w-${s} sm:min-h-${s} sm:max-h-${s} sm:max-w-${s}`;
};

const IconImage = ({ size = 6, mobileSize, src, ...props }: IconImageProps) => {
  if (typeof src === "string") {
    return (
      <img
        {...props}
        src={src}
        className={cn(makeIconImageClassName(size, mobileSize), props.className, "flex-shrink-0")}
        alt={props.alt} // Have this here to prevent ally linter from complaining
      />
    );
  }

  const Icon = src;
  return <Icon className={cn(makeIconImageClassName(size, mobileSize), props.className, "flex-shrink-0")} />;
};

export default IconImage;
