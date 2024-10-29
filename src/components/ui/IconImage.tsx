import { cn } from "@/utils/utils";

export interface IconImageProps
	extends React.ImgHTMLAttributes<HTMLImageElement> {
	size?: number;
}

const IconImage = ({ size = 6, ...props }: IconImageProps) => {
	return (
		<img className={cn(`h-${size} w-${size}`, props.className)} {...props} />
	);
};

export default IconImage;
