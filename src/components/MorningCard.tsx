import { forwardRef } from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

const MorningCard = forwardRef<HTMLDivElement, Props>(({ children, className, ...props }, ref) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Outer Div: Gradient Border */}
      <div className="rounded-xl bg-morning-border p-[1px]">
        {/* Middle Div: Background Overlay to Handle Color Discrepancy */}
        <div className="rounded-xl bg-gradient-light">
          {/* Inner Div: Actual Content Area */}
          <div className="rounded-xl bg-morning-light flex items-center justify-center w-full h-full">
            <div {...props} className={className} ref={ref}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MorningCard;
