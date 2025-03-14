import React from "react";

import useIsMobile from "@/hooks/display/useIsMobile";
import { ITextBase, textConfig } from "@/utils/theme";
import { cn } from "@/utils/utils";
import IconImage from "./IconImage";

// Define a generic type for polymorphic props
type AsProp<C extends React.ElementType = "div"> = {
  as?: C;
};

// Get props for the specified element type, excluding ones we'll define
type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

// Combine custom props with the props of the specified element type
type PolymorphicComponentProp<C extends React.ElementType, Props = {}> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithRef<C>, PropsToOmit<C, Props>>;

// Extend ITextBase to include mobile variants
export interface IText extends Omit<ITextBase, "variant" | "size" | "weight"> {
  variant?: ITextBase["variant"];
  mobileVariant?: ITextBase["variant"];
  size?: ITextBase["size"];
  mobileSize?: ITextBase["size"];
  weight?: ITextBase["weight"];
  mobileWeight?: ITextBase["weight"];
  noLineHeight?: boolean;
}

// Full Text component props with polymorphic behavior
export type TextProps<C extends React.ElementType = "div"> = PolymorphicComponentProp<C, ITextBase>;

const Text = React.forwardRef(
  <C extends React.ElementType = "div">(
    {
      as,
      variant,
      mobileVariant,
      size,
      mobileSize,
      weight,
      mobileWeight,
      align,
      color,
      noLineHeight,
      beforeIcon,
      loadingWidth,
      ...props
    }: TextProps<C>,
    ref?: React.ComponentPropsWithRef<C>["ref"],
  ) => {
    const Component = as || "div";

    const isMobile = useIsMobile();

    const _variant = isMobile && mobileVariant ? mobileVariant : variant;
    const _size = isMobile && mobileSize ? mobileSize : size;
    const _weight = isMobile && mobileWeight ? mobileWeight : weight;

    return (
      <Component
        ref={ref}
        {...props}
        className={cn(
          textConfig.methods.textClass({ variant: _variant, size: _size, weight: _weight, align, color }),
          noLineHeight ? `${textConfig.methods.noLineHeight(_variant)}` : textConfig.methods.lineHeight(_variant),
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
