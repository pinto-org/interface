import { useMorning } from "@/state/useSunData";
import { cn } from "@/utils/utils";
import clsx from "clsx";
import { forwardRef } from "react";
import GradientCard from "./ui/GradientCard";

type Props = React.HTMLAttributes<HTMLDivElement>;

const cardWrapperClass = clsx("rounded-xl bg-morning-light flex flex-col items-center justify-center w-full");

const MorningCard = forwardRef<HTMLDivElement, Props>(({ children, className, ...props }, ref) => {
  return (
    <GradientCard {...props} variant="morning" className={className} ref={ref}>
      {children}
    </GradientCard>
  );
});

export default MorningCard;

interface OnlyMorningCardProps extends Props {
  /**
   * Only show the morning card wrapper if it is only morning.
   */
  onlyMorning?: boolean;
}

export const OnlyMorningCard = forwardRef<HTMLDivElement, OnlyMorningCardProps>(
  ({ children, className, onlyMorning = true, ...props }, ref) => {
    const { isMorning } = useMorning();

    if (onlyMorning && !isMorning) {
      return (
        <div
          {...props}
          ref={ref}
          className={cn(cardWrapperClass, "bg-pinto-off-white border-pinto-gray-2 border", className)}
        >
          {children}
        </div>
      );
    }

    return (
      <MorningCard {...props} ref={ref} className={className}>
        {children}
      </MorningCard>
    );
  },
);
