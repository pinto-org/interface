import { cn } from "@/utils/utils";
import { ClassValue } from "clsx";
import React from "react";
import { ReactDivProps } from "./types";
import {
	FontVariant,
	TextAlign,
	FontSize,
	FontWeight,
	textConfig,
} from "@/utils/theme";

const { theme, config, methods } = textConfig;

export interface TextProps {
	variant?: FontVariant;
	size?: FontSize;
	weight?: FontWeight;
	align?: TextAlign;
}

export const deriveTextClassValues = ({
	variant = "sm",
	size,
	weight,
	align,
}: Partial<TextProps>) => {
	const classNames: ClassValue[] = [
		theme.size[size ?? config.fontSize[variant] ?? "sm"],
		theme.weight[weight ?? config.fontWeight[variant] ?? "default"],
		theme.letterSpacing[config.letterSpacing[variant] ?? ""],
		methods.align(align),
	];

	return classNames;
};

const Text = React.forwardRef<HTMLDivElement, TextProps & ReactDivProps>(
	(props, ref) => (
		<div
			ref={ref}
			className={cn(...deriveTextClassValues(props), props.className)}
		>
			{props.children}
		</div>
	),
);

export default Text;
