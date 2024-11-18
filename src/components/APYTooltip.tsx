import pintoIcon from "@/assets/tokens/PINTO.png";
import IconImage from "./ui/IconImage";
import Text from "./ui/Text";

export default function APYTooltip() {
  return (
    <div className="flex flex-col gap-6 w-[500px] px-3 py-[18px]">
      <Text variant={"body"} className="inline-flex gap-1 items-center">
        <IconImage src={pintoIcon} size={6} /> Pinto yield, variable APY
      </Text>
      <Text variant={"body"} className="text-pinto-gray-5 self-stretch">
        The variable Pinto APY uses an exponential moving average of Pinto earned by Stalkholders over the most recent
        24H, 7D, and 30D periods to estimate a future rate of return, accounting for Stalk growth.
      </Text>
    </div>
  );
}
