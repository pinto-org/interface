import { cn } from "@/utils/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

export interface IPageContainer extends React.HTMLAttributes<HTMLDivElement> {}

const PageContainer = ({ ...props }: IPageContainer) => {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col w-full box-border items-center",
        "pt-2 px-4 pb-8", // mobile
        "sm:px-8 sm:pt-5", // above mobile
        props.className,
      )}
    >
      <div className={cn("flex flex-col w-full min-w-0", "sm:max-w-[1132px]")}>{props.children}</div>
    </div>
  );
};

export default PageContainer;
