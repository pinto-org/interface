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
      lgAlt: "lg:w-[65%] 2xl:w-[70%] lg:min-w-[700px] lg:max-w-[1132px]",
      xlAlt: "lg:w-[95%] 2xl:w-[90%] lg:min-w-[700px] lg:max-w-[1550px]",
      xlAltField: "lg:min-w-[700px] lg:max-w-[1300px] min-[1550px]:w-[90%] min-[1550px]:max-w-[1650px]",
      xlAltSwap: "sm:max-w-[560px] min-[1601px]:max-w-[700px]",
    },
  },
});

export interface IPageContainer
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof pageContainerVariants> {
  bottomMarginOnMobile?: boolean;
}

const PageContainer = ({ variant = "lg", bottomMarginOnMobile = false, ...props }: IPageContainer) => {
  return (
    <div>
      <div
        {...props}
        className={cn(
          "relative",
          "flex flex-col w-full items-center",
          "pt-2 px-4 pb-4", // mobile
          "sm:px-8 sm:pt-5 sm:pb-20 sm:mt-10", // above mobile
          bottomMarginOnMobile ? "mb-[75px] sm:mb-0" : "mb-0"
        )}
      >
        <div className={cn(pageContainerVariants({ variant }), props.className)}>{props.children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
