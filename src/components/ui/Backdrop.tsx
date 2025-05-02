import useIsMobile from "@/hooks/display/useIsMobile";
import clsx from "clsx";

export type BackdropProps = {
  active: boolean;
  noBlur?: boolean;
  disableOnMobile?: boolean;
  transitionDuration?: number;
  onClick: () => void;
};

const Backdrop = ({
  active,
  noBlur = false,
  disableOnMobile = false,
  transitionDuration = 50,
  onClick,
}: BackdropProps) => {
  const isMobile = useIsMobile();

  if (isMobile && disableOnMobile) {
    return null;
  }

  return <div onClick={onClick} className={backdropStyles.style(active, noBlur, transitionDuration)} />;
};

export const backdropStyles = {
  style: (active: boolean, noBlur: boolean, duration: number = 150) =>
    clsx(
      `fixed top-0 left-0 w-full h-dvh scale-y-[2.0]`,
      `duration-${duration} transition-all ${active ? `${!noBlur && "backdrop-blur-[2px] bg-white/50"} pointer-events-auto z-[3]` : "pointer-events-none z-[-2]"}`,
      "transform-gpu",
    ),
};

export default Backdrop;
