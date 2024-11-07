import { deriveTextStyles } from "@/utils/theme";
import { Prettify } from "@/utils/types.generic";
import { cn } from "@/utils/utils";
import { VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import { InfoOutlinedIcon } from "../Icons";

const infoProps = clsx("bg-pinto-gray-1 border-pinto-gray-2");

const warningVariants = cva(`flex flex-row items-center p-4 gap-2 text-black ${deriveTextStyles("sm-light")}`, {
  variants: {
    variant: {
      info: infoProps,
    },
  },
});

type WarningVariantProps = VariantProps<typeof warningVariants>;

const variantToIcon = {
  info: InfoOutlinedIcon,
};

export type WarningProps = React.HTMLAttributes<HTMLDivElement> & Prettify<WarningVariantProps>;

const Warning = ({ children, variant, className, ...props }: WarningProps) => {
  const Icon = variantToIcon[variant ?? "info"];
  return (
    <div
      {...props}
      className={cn(
        warningVariants({
          variant,
        }),
        className,
      )}
    >
      <Icon width={24} height={24} color={"black"} />
      {children}
    </div>
  );
};

export default Warning;
