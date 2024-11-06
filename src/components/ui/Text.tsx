import React from "react";

import { ITextBase, textConfig } from "@/utils/theme";
import { cn } from "@/utils/utils";
import clsx from "clsx";
import IconImage, { IconImageProps } from "./IconImage";

// Define a generic type for polymorphic props
type AsProp<C extends React.ElementType = "div"> = {
  as?: C;
};

// Get props for the specified element type, excluding ones we'll define
type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

// Combine custom props with the props of the specified element type
type PolymorphicComponentProp<C extends React.ElementType, Props = {}> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithRef<C>, PropsToOmit<C, Props>>;

export interface IText extends ITextBase {
  noLineHeight?: boolean;
}

// Full Text component props with polymorphic behavior
export type TextProps<C extends React.ElementType = "div"> = PolymorphicComponentProp<C, ITextBase>;

const Text = React.forwardRef(
  <C extends React.ElementType = "div">(
    { as, variant, size, weight, align, color, noLineHeight, beforeIcon, ...props }: TextProps<C>,
    ref?: React.ComponentPropsWithRef<C>["ref"],
  ) => {
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        {...props}
        className={cn(
          textConfig.methods.textClass({ variant, size, weight, align, color }),
          noLineHeight ? `${textConfig.methods.noLineHeight(variant)}` : textConfig.methods.lineHeight(variant),
          props.className,
        )}
      >
        {beforeIcon && <IconImage src={beforeIcon.src} size={beforeIcon.size} />}
        {props.children}
      </Component>
    );
  },
);

export default Text;
