import { cn } from "@/utils/utils";
import clsx from "clsx";

export interface IconImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
  mobileSize?: number;
}

const makeIconImageClassName = (size: number, mobileSize?: number) => {
  const className = `h-${size} w-${size} min-w-${size} min-h-${size} max-h-${size} max-w-${size} flex-shrink-0`;
  if (mobileSize) {
    const mobileClassName = `sm:h-${mobileSize} sm:w-${mobileSize} sm:min-w-${mobileSize} sm:min-h-${mobileSize} sm:max-h-${mobileSize} sm:max-w-${mobileSize}`;
    return clsx(className, mobileClassName);
  }
  return className;
};

const IconImage = ({ size: _size = 6, mobileSize = 2, ...props }: IconImageProps) => {
  const size = _size;
  return (
    <img
      className={makeIconImageClassName(size, mobileSize)}
      {...props}
      alt={props.alt} // Have this here to prevent ally linter from complaining
    />
  );
};

export default IconImage;
