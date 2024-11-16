import { cn } from "@/utils/utils";

export default function PageFullScreen({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col w-screen h-screen items-center justify-center pt-2 px-4 pb-8 sm:px-8 sm:pt-5 sm:pb-20",
        "w-screen h-[calc(100vh-72px)] top-[72px] sm:h-[calc(100vh-124px)] sm:top-[124px]",
      )}
    >
      {children}
    </div>
  );
}
