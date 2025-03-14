import { cn } from "@/utils/utils";
import clsx from "clsx";
import { renderAnnouncement } from "../AnnouncementBanner";

export const pageHeightVariants = {
  withAnnouncement: clsx("h-[calc(100vh - 108px)] h-[calc(100vh - 160px)]"),
  withoutAnnouncement: clsx("h-[calc(100vh - 72px)] h-[calc(100vh - 124px)]"),
};

export default function PageFullScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col w-full sm:items-center sm:justify-center h-full relative z-[1]")}>{children}</div>
  );
}
