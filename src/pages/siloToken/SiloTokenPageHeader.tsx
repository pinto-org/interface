import copyIcon from "@/assets/misc/Copy.svg";
import etherscanIcon from "@/assets/misc/Etherscan.png";
import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import APYTooltip from "@/components/APYTooltip";
import { ExternalLinkIcon } from "@/components/Icons";
import InlineStats from "@/components/InlineStats";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { SiloTokenYield } from "@/state/useSiloAPYs";
import { useSeason } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { SiloTokenData, Token } from "@/utils/types";
import { exists } from "@/utils/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useChainId, useConfig } from "wagmi";

const SiloTokenPageHeader = ({
  token,
  isMobile,
  showSymbol,
  linkTo,
}: { token: Token; isMobile: boolean; showSymbol?: boolean; linkTo?: string }) => {
  const config = useConfig();
  const chainId = useChainId();

  const currentChain = config.chains.find((chain) => chain.id === chainId);
  const blockExplorer = currentChain?.blockExplorers?.default.url ?? "https://basescan.org";

  function AuxButtons() {
    return (
      <div className="inline-flex gap-2">
        <Button
          variant="outline"
          rounded="full"
          size="icon"
          noPadding
          onClick={() => {
            navigator.clipboard.writeText(token.address);
            toast.success("Address copied to clipboard");
          }}
        >
          <IconImage src={copyIcon} size={isMobile ? 5 : 6} alt="copy address" />
        </Button>
        {token.isLP && (
          <Button asChild variant={"outline"} noPadding rounded="full" size="icon">
            <Link
              to={`https://pinto.exchange/#/wells/${chainId}/${token.address}`}
              target={"_blank"}
              className="text-pinto-gray-5 hover:cursor-pointer transition-all"
              rel="noreferrer"
            >
              <ExternalLinkIcon width={isMobile ? "1.25rem" : "1.5rem"} height={isMobile ? "1.25rem" : "1.5rem"} />
            </Link>
          </Button>
        )}
        <Button asChild variant={"outline"} rounded="full" noPadding size="icon">
          <Link to={`${blockExplorer}/address/${token.address}`} target={"_blank"} rel="noreferrer">
            <IconImage src={etherscanIcon} size={isMobile ? 5 : 6} alt="go to basescan" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-2 sm:gap-4">
      <div className="flex flex-row justify-between">
        <Button variant={"outline"} rounded="full" noPadding size="icon">
          <Link to={linkTo ?? "/silo"}>
            <img src={backArrowIcon} alt="go to previous page" className="h-6 w-6 sm:h-8 sm:w-8" />
          </Link>
        </Button>
        <div className="sm:hidden">
          <AuxButtons />
        </div>
      </div>
      <div className="inline-flex items-center flex-wrap gap-3">
        <div className="inline-flex gap-3 items-center whitespace-nowrap">
          <IconImage src={token.logoURI} size={12} alt={token.name} />
          <div className="pinto-h2 sm:pinto-h1">{showSymbol ? token.symbol : token.name}</div>
        </div>
        <div className="hidden sm:block">
          <AuxButtons />
        </div>
      </div>
    </div>
  );
};

export interface SiloTokenPageSubHeaderProps {
  isMobile: boolean;
  apys?: Partial<SiloTokenYield>;
  siloTokenData?: SiloTokenData;
  description?: string;
}

export const SiloTokenPageSubHeader = ({ siloTokenData, description, apys, isMobile }: SiloTokenPageSubHeaderProps) => {
  const season = useSeason();
  const stalkRewards = siloTokenData?.rewards.stalk;
  const seedRewards = siloTokenData?.rewards.seeds;

  const ema24 = apys?.ema24;
  const ema168 = apys?.ema168;
  const ema720 = apys?.ema720;
  const ema2160 = apys?.ema2160;

  const stats = [
    {
      label: "24H:",
      value: ema24 ? formatter.pct(ema24 * 100) : "-",
      notApplicable: season <= 24,
      rawValue: ema24,
    },
    {
      label: "7D:",
      value: ema168 ? formatter.pct(ema168 * 100) : "-",
      notApplicable: season <= 168,
      rawValue: ema168,
    },
    {
      label: "30D:",
      value: ema720 ? formatter.pct(ema720 * 100) : "-",
      notApplicable: season <= 720,
      rawValue: ema720,
    },
    {
      label: "90D:",
      value: ema2160 ? formatter.pct(ema2160 * 100) : "-",
      notApplicable: season <= 720,
      rawValue: ema2160,
    },
  ];

  return (
    <>
      <div className="flex flex-col self-start sm:flex-row items-center gap-4 sm:gap-0 sm:self-auto sm:justify-between">
        {exists(description) ? (
          <div className="pinto-body-light text-pinto-light">{description}</div>
        ) : (
          <div className="flex flex-col gap-2 text-left place-self-start">
            <div className="pinto-sm font-thin sm:font-regular">Current Deposit Rewards</div>
            <div className="flex flex-row gap-3">
              <div className="inline-flex gap-1 items-center">
                <IconImage src={stalkIcon} size={6} alt="Stalk" />
                <div className="pinto-body sm:pinto-h4">{formatter.noDec(stalkRewards)} Stalk</div>
              </div>
              <div className="inline-flex gap-1 items-center">
                <IconImage src={seedsIcon} size={6} alt="Seeds" />
                <div className="pinto-body sm:pinto-h4">{formatter.twoDec(seedRewards)} Seeds</div>
              </div>
            </div>
          </div>
        )}
        {/*<TooltipSimple content={<APYTooltip />}> */}
        <div className="flex flex-col place-self-start sm:flex-row sm:items-center justify-end gap-2 sm:gap-4 lg:gap-6">
          <div
            className={`pinto-sm-light text-pinto-green-4 text-left sm:text-right ${stats[0].notApplicable ? "opacity-50" : ""}`}
          >
            Variable APY
          </div>
          <InlineStats variant={isMobile ? "sm-alt" : "sm"} mode={"apy"} stats={stats} />
        </div>
        {/* </TooltipSimple> */}
      </div>
    </>
  );
};

export default SiloTokenPageHeader;
