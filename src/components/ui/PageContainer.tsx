import { cn } from "@/utils/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const pageContainerVariants = cva("flex flex-col w-full min-w-0", {
  variants: {
    variant: {
      md: "sm:max-w-[896px]",
      lg: "sm:max-w-[1132px]",
      xl: "sm:max-w-[1550px]",
      full: "w-full sm:max-w-[100%]",
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
        "flex flex-col w-full items-center",
        "pt-2 px-4 pb-8", // mobile
        "sm:px-8 sm:pt-5 sm:pb-20", // above mobile
      )}
    >
      <div className={cn(pageContainerVariants({ variant }), props.className)}>{props.children}</div>
    </div>
  );
};

export default PageContainer;
