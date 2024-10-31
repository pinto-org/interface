import { ClassValue } from "clsx";
import React from "react";

import { FontSize, FontVariant, FontWeight, TextAlign, textConfig } from "@/utils/theme";
import { cn } from "@/utils/utils";

const { theme, variantConfig, methods } = textConfig;

// Define a generic type for polymorphic props
type AsProp<C extends React.ElementType = "div"> = {
  as?: C;
};

// Get props for the specified element type, excluding ones we'll define
type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

// Combine custom props with the props of the specified element type
type PolymorphicComponentProp<C extends React.ElementType, Props = {}> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithRef<C>, PropsToOmit<C, Props>>;

// Base Text props without the polymorphic behavior
interface TextBaseProps {
  variant?: FontVariant;
  size?: FontSize;
  weight?: FontWeight;
  align?: TextAlign;
}

// Full Text component props with polymorphic behavior
export type TextProps<C extends React.ElementType = "div"> = PolymorphicComponentProp<C, TextBaseProps>;

export const deriveTextClassValues = (props: Partial<TextBaseProps>) => {
  const variant = props.variant ?? "sm";
  const size = props.size ?? variantConfig.fontSize[variant] ?? "sm";
  const weight = props.weight ?? variantConfig.fontWeight[variant] ?? "default";
  const letterSpacing = variantConfig.letterSpacing[variant] ?? "";

  const classNames: ClassValue[] = [
    theme.size[size],
    theme.lineHeight[size],
    theme.weight[weight],
    theme.letterSpacing[letterSpacing],
    methods.align(props.align),
  ];

  return classNames;
};

const Text = React.forwardRef(
  <C extends React.ElementType = "div">(
    { as, className, variant, size, weight, align, ...props }: TextProps<C>,
    ref?: React.ComponentPropsWithRef<C>["ref"],
  ) => {
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        {...props}
        className={cn(deriveTextClassValues({ variant, size, weight, align }), "text-black", className)}
      />
    );
  },
);

export default Text;
