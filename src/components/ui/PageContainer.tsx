import { cn } from "@/utils/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const pageContainerVariants = cva("flex flex-col w-full min-w-0", {
  variants: {
    variant: {
      lg: "sm:max-w-[1132px]",
      xl: "sm:max-w-[1550px]",
    },
  },
});

export interface IPageContainer
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageContainerVariants> {}

const PageContainer = ({ variant = "lg", ...props }: IPageContainer) => {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col w-full box-border items-center",
        "pt-2 px-4 pb-8", // mobile
        "sm:px-8 sm:pt-5", // above mobile
      )}
    >
      <div className={cn(pageContainerVariants({ variant }), props.className)}>{props.children}</div>
    </div>
  );
};

export default PageContainer;
