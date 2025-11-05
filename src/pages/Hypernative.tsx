import { cn } from "@/utils/utils";
import clsx from "clsx";

export default function Hypernative() {
  return (
    <div className="w-screen h-screen">
      <div className={styles.container}>
        <div>
          <img src={"./pinto-logo.png"} className="w-36 h-36" />
        </div>
        <p className={cn(styles.title, "pb-4")}>Pinto is temporarily paused</p>
        <p className={styles.contents}>
          Hypernative's automatic protections were activated, disabling functionality and preventing any risk to the
          system.
        </p>
        <p className={styles.contents}>
          <span className="text-pinto-primary font-medium">All funds are safe.</span> The Pinto and Hypernative team are
          actively investigating and working to restore functionality as soon as possible.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: clsx("absolute inset-0 flex flex-col items-center justify-center px-10 gap-4"),
  title: clsx("pinto-h3 text-center"),
  contents: clsx("pinto-body sm:pinto-h4 text-pinto-light sm:text-pinto-light text-center"),
} as const;
