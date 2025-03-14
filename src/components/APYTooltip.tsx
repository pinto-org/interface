import pintoIcon from "@/assets/tokens/PINTO.png";
import { TokenValue } from "@/classes/TokenValue";
import { useSiloYieldsQuery } from "@/state/useSiloAPYs";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import IconImage from "./ui/IconImage";

export default function APYTooltip() {
  const apyData = useSiloYieldsQuery();
  const mainToken = useTokenData().mainToken;

  const apyInfo = [
    {
      label: "24H:",
      value: TokenValue.fromBlockchain(apyData.data?.ema[24].beansPerSeason || 0, mainToken.decimals),
    },
    {
      label: "7D:",
      value: TokenValue.fromBlockchain(apyData.data?.ema[168].beansPerSeason || 0, mainToken.decimals),
    },
    {
      label: "30D:",
      value: TokenValue.fromBlockchain(apyData.data?.ema[720].beansPerSeason || 0, mainToken.decimals),
    },
    {
      label: "90D:",
      value: TokenValue.fromBlockchain(apyData.data?.ema[2160].beansPerSeason || 0, mainToken.decimals),
    },
  ];

  const has24h = Number(apyData.data?.ema[24].beansPerSeason) > 0;
  const has7d = Number(apyData.data?.ema[168].beansPerSeason) > 0;
  const has30d = Number(apyData.data?.ema[720].beansPerSeason) > 0;

  return (
    <div className="flex flex-col gap-6 w-[31.25rem] px-3 py-[1.125rem]">
      <div className="pinto-body inline-flex gap-1 items-center">
        <IconImage src={pintoIcon} size={6} /> Pinto yield, variable APY
      </div>
      <div className="pinto-body text-pinto-gray-5 self-stretch leading-2">
        {`The variable Pinto APY uses an exponential moving average of Pinto earned by Stalkholders over the most recent
        ${has24h ? "24H, 7D and 30D" : has7d ? "7D and 30D" : has30d ? "30D" : "90D"} ${has24h || has7d ? "periods" : "period"} to estimate a future rate of return, accounting for Stalk growth.`}
      </div>
      <div className="pinto-sm text-pinto-light flex flex-row justify-between">
        <span>Avg Earned Pinto:</span>
        <div className="flex flex-row gap-4">
          {apyInfo.map((data, i) => {
            if (data.value.eq(0)) return;
            if (data.label === "90D:" && apyInfo[i - 1].value.gt(0)) return;

            return (
              <div key={`tooltip-apy-${data.label}-${i}`} className="flex flex-row gap-1">
                <span>{data.label}</span>
                <span>{Number(data.value.toHuman()).toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
