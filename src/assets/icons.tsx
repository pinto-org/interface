import { cn } from "@/utils/utils";

export interface IconProps {
	size?: number;
	color?: string;
	className?: string;
}

export const BurgerIcon = (props: IconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke={props.color ?? "#000"}
			className={cn(props.className, `size-[${props.size ?? 6}]`)}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
			/>
		</svg>
	);
};
