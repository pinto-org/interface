import { deriveTextStyles } from "@/utils/theme";
import { Prettify } from "@/utils/types.generic";
import { cn } from "@/utils/utils";
import { InfoCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";

const infoProps = clsx("bg-pinto-gray-1 border border-pinto-gray-2 rounded-lg");
const warningProps = clsx("bg-pinto-red-1 border border-pinto-red-2 text-pinto-red-2 rounded-lg");

const warningVariants = cva(
  `flex flex-row items-center p-4 gap-2 text-black ${deriveTextStyles("sm-light")} rounded-xl`,
  {
    variants: {
      variant: {
        info: infoProps,
        warning: warningProps,
      },
    },
  },
);

type WarningVariantProps = VariantProps<typeof warningVariants>;

const variantToIcon = {
  info: InfoCircledIcon,
  warning: ExclamationTriangleIcon,
};

export type WarningProps = React.HTMLAttributes<HTMLDivElement> & Prettify<WarningVariantProps>;

const Warning = ({ children, variant = "info", className, ...props }: WarningProps) => {
  const Icon = variant ? variantToIcon[variant] : InfoCircledIcon;

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
      <Icon color={"currentColor"}  className="w-6 h-6" />
      {children}
    </div>
  );
};

export default Warning;
