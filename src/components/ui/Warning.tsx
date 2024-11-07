import { deriveTextStyles } from "@/utils/theme";
import { Prettify } from "@/utils/types.generic";
import { cn } from "@/utils/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";

const infoProps = clsx("bg-pinto-gray-1 border border-pinto-gray-2");

const warningVariants = cva(
  `flex flex-row items-center p-4 gap-2 text-black ${deriveTextStyles("sm-light")} rounded-xl`,
  {
    variants: {
      variant: {
        // add more as needed
        info: infoProps,
      },
    },
  },
);

type WarningVariantProps = VariantProps<typeof warningVariants>;

const variantToIcon = {
  info: InfoCircledIcon,
};

export type WarningProps = React.HTMLAttributes<HTMLDivElement> & Prettify<WarningVariantProps>;

const Warning = ({ children, variant = "info", className, ...props }: WarningProps) => {
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
      <Icon color="currentColor" className="w-6 h-6" />
      {children}
    </div>
  );
};

export default Warning;
