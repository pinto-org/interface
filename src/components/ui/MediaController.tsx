import { cn } from "@/utils/utils";

interface MediaControllerProps extends React.HTMLAttributes<HTMLDivElement> {
  md?: React.ReactNode; // tablet content (700px - 1099px)
  lg?: React.ReactNode; // desktop content (≥ 1100px)
}

const MediaController = ({ children, md, lg, ...props }: MediaControllerProps) => {
  return (
    <>
      {/* Mobile Content (children) */}
      <div className={cn("block md:hidden lg:hidden", props.className)} {...props}>
        {children}
      </div>
      {/* Tablet Content (if provided, otherwise show desktop content) */}
      <div className={cn("hidden md:block lg:hidden", props.className)} {...props}>
        {md || lg || children}
      </div>
      {/* Desktop Content */}
      <div className={cn("hidden lg:block", props.className)} {...props}>
        {lg || md || children}
      </div>
    </>
  );
};

export default MediaController;
