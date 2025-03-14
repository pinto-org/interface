import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import { TV } from "@/classes/TokenValue";
import AccordionGroup, { IBaseAccordionContent } from "@/components/AccordionGroup";
import LabelValue from "@/components/LabelValue";
import MobileActionBar from "@/components/MobileActionBar";
import TextSkeleton from "@/components/TextSkeleton";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { SEEDS, STALK } from "@/constants/internalTokens";
import useIsMobile from "@/hooks/display/useIsMobile";
import { useProtocolIntegrationLinks } from "@/hooks/useProtocolIntegrations";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { usePriceData } from "@/state/usePriceData";
import { useSiloWrappedDepositsAPYs } from "@/state/useSiloWrappedDepositsAPYs";
import { useSiloWrappedTokenExchangeRateQuery, useSiloWrappedTokenTotalSupply } from "@/state/useSiloWrappedTokenData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { CornerBottomLeftIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";
import SiloActions from "./silo/SiloActions";
import SiloTokenPageHeader, { SiloTokenPageSubHeader } from "./siloToken/SiloTokenPageHeader";
import SiloedTokenCharts from "./wrap/SiloedTokenCharts";
import { useSeasonalPrice, useSeasonalWrappedDepositExchangeRate } from "@/state/seasonal/seasonalDataHooks";
import { useSeason } from "@/state/useSunData";
import { useMemo } from "react";

export default function SiloWrappedSiloToken({ token }: { token: Token }) {
  // URL Params
  const [params] = useSearchParams();
  const currentAction = params.get("action");

  const navigate = useNavigate();

  // Queries | Hooks
  const { deposits, isLoading: depositsLoading } = useFarmerSiloNew(token.address);
  const exchangeRate = useSiloWrappedTokenExchangeRateQuery();
  const totalSupply = useSiloWrappedTokenTotalSupply();
  const priceData = usePriceData();
  const balances = useFarmerBalances();
  const isMobile = useIsMobile();

  const apys = useSiloWrappedDepositsAPYs();

  // Display State
  const overviewStatsLoading = depositsLoading || exchangeRate.isLoading || totalSupply.isLoading;
  const balancesLoading = balances.isLoading || priceData.loading;

  const showContents = !isMobile || (!currentAction && isMobile);

  return (
    <PageContainer variant="xlAlt" bottomMarginOnMobile>
      <div className="flex flex-col w-full gap-4 sm:gap-8 justify-start items-start">
        {showContents && <SiloTokenPageHeader token={token} isMobile={isMobile} showSymbol={true} linkTo="/overview" />}
        <div className="flex flex-col w-full lg:flex-row gap-9 sm:gap-16">
          <div className="flex flex-col flex-shrink-1 w-full">
            <div className="flex flex-col w-full gap-12 sm:gap-14 items-start">
              <div className="flex flex-col w-full gap-6">
                {showContents && (
                  <>
                    <SiloTokenPageSubHeader
                      isMobile={isMobile}
                      apys={apys.data?.current}
                      description={token.description}
                    />
                    <Separator />
                  </>
                )}
                <div className="pt-0 sm:pt-8">
                  {currentAction && isMobile && (
                    <Button variant={"outline"} rounded="full" noPadding className="h-9 w-9 sm:h-12 sm:w-12 mb-4">
                      <Link to={`/wrap`}>
                        <img src={backArrowIcon} alt="go to previous page" className="h-6 w-6 sm:h-8 sm:w-8" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-12">
              <BalanceSection
                token={token}
                tokenPrices={priceData.tokenPrices}
                farmerBalances={balances.balances}
                loading={balancesLoading}
              />
              <div className={!showContents ? "hidden" : ""}>
                <SiloedTokenCharts />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 w-full lg:max-w-[384px] 3xl:max-w-[518px] 3xl:min-w-[425px] lg:-mt-2s mb-14 sm:mb-0">
            <div
              className={cn(
                "p-4 rounded-[1rem] bg-pinto-off-white border-pinto-gray-2 border",
                !(!isMobile || (currentAction && isMobile)) && "hidden",
              )}
            >
              <SiloActions token={token} />
            </div>
            <IntegrationLinks token={token} />
            <SiloedTokenOverviewStats
              token={token}
              deposits={deposits}
              exchangeRate={exchangeRate.data}
              totalSupply={totalSupply.data}
              loading={overviewStatsLoading}
            />
          </div>
        </div>
        <div
          className={cn(
            "flex flex-col w-full",
            // responsive widths. Easier way to do this? 4.5rem === gap-9
            "lg:max-w-[calc(100%-384px-4.5rem)] 3xl:max-w-[calc(100%-518px-4.5rem)]",
            !showContents ? "hidden" : "",
          )}
        >
          <AccordionGroup items={FAQ_ITEMS} groupTitle="Frequently Asked Questions" />
        </div>
        {!currentAction && (
          <MobileActionBar>
            <Button
              onClick={() => navigate(`/wrap?action=wrap`)}
              rounded={"full"}
              variant={"outline-secondary"}
              className="pinto-sm-bold text-sm flex-1 flex h-full"
            >
              Wrap
            </Button>
            <Button
              onClick={() => navigate(`/wrap?action=unwrap`)}
              rounded={"full"}
              variant={"outline-secondary"}
              className="pinto-sm-bold text-sm flex-1 flex h-full"
            >
              Unwrap
            </Button>
          </MobileActionBar>
        )}
      </div>
    </PageContainer>
  );
}

// ================================ SUB COMPONENTS ================================

interface IBalanceSectionProps {
  token: Token;
  tokenPrices: ReturnType<typeof usePriceData>["tokenPrices"];
  farmerBalances: ReturnType<typeof useFarmerBalances>["balances"];
  loading: boolean;
}

const useDelta24SeasonPrice = ({ token, deltaSeason }: { token: Token, deltaSeason: number }) => {
  const season = useSeason();

  // use the lookback params as the chart
  const priceQuery = useSeasonalPrice(Math.max(0, deltaSeason), season);
  const exchangeQuery = useSeasonalWrappedDepositExchangeRate(Math.max(0, deltaSeason), season);

  const isLoading = priceQuery.isLoading || exchangeQuery.isLoading || season < 0;

  const usd = useMemo(() => {
    if (!priceQuery.data || !exchangeQuery.data || deltaSeason < 0) return undefined;
    const deltaSeasonsPrice = priceQuery.data.find((d) => d.season === deltaSeason);
    const deltaSeasonsExchangeRate = exchangeQuery.data.find((d) => d.season === deltaSeason);
    if (!deltaSeasonsPrice || !deltaSeasonsExchangeRate) return undefined;

    const deltaSeasonsPriceUSD = deltaSeasonsPrice.value * deltaSeasonsExchangeRate.value;
    return TV.fromHuman(deltaSeasonsPriceUSD, 6);
  }, [priceQuery.data, exchangeQuery.data, deltaSeason]);

  return { data: usd, isLoading }
}

const BalanceSection = ({ token, tokenPrices, farmerBalances, loading }: IBalanceSectionProps) => {
  const account = useAccount();
  const season = useSeason();

  const delta24Seasons = season - 24;

  const { data: delta24SeasonsPriceUSD, isLoading: delta24SeasonsPriceLoading } = useDelta24SeasonPrice({ token, deltaSeason: delta24Seasons })

  const usdPrice = tokenPrices.get(token)?.instant;
  const balance = farmerBalances.get(token)?.total;

  const totalUSD = usdPrice?.mul(balance ?? TV.ZERO) ?? TV.ZERO;
  const delta24SeasonsTotalUSD = delta24SeasonsPriceUSD?.mul(balance ?? TV.ZERO) ?? TV.ZERO;

  const deltaPct = delta24SeasonsTotalUSD?.gt(0) && totalUSD?.gt(0)
    ? totalUSD.sub(delta24SeasonsTotalUSD)?.div(delta24SeasonsTotalUSD)?.mul(100)
    : undefined;

  const Icon = deltaPct?.gt(0) ? ArrowUpIcon : ArrowDownIcon;

  const isLoading = loading || account.isConnecting || delta24SeasonsPriceLoading;

  return (
    <div className="flex flex-col gap-2">
      <div className="pinto-sm font-thin sm:font-regular">My {token.symbol} Balance</div>
      <div className="flex flex-row gap-2">
        <div className="inline-flex flex-row items-center pinto-h3 gap-2">
          <IconImage src={token.logoURI} size={9} alt={token.symbol} />
          <TextSkeleton loading={isLoading} height="h3" className="w-20">
            {formatter.token(balance, token)}
          </TextSkeleton>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <TextSkeleton loading={isLoading} height="sm" className="w-20">
          <div className="pinto-sm-light text-pinto-secondary">{formatter.usd(totalUSD)}</div>
        </TextSkeleton>
        <TextSkeleton loading={isLoading} height="sm" className="w-20">
          {deltaPct && balance?.gt(0) ? (
            <>
              <Separator orientation="vertical" className="h-full" />
              <div
                className={cn(
                  "flex flex-row items-center pinto-sm-light text-pinto-primary",
                  deltaPct.gt(0) && "text-pinto-green-4",
                  deltaPct.lt(0) && "text-pinto-error",
                )}
              >
                <span>24h: {formatter.pct(deltaPct)}</span>
                <Icon
                  height="1rem"
                  width="1rem"
                  className={cn(!deltaPct || deltaPct.eq(0) ? "hidden" : "")}
                  color={deltaPct.gt(0) ? "#387f5c" : "#FF0000"}
                />
              </div>
            </>
          ) : null}
        </TextSkeleton>
      </div>
    </div>
  );
};

const IntegrationLinks = ({ token }: { token: Token }) => {
  const integrations = useProtocolIntegrationLinks();

  if (!integrations) return null;

  return (
    <>
      {Object.entries(integrations).map(([name, integration]) => {
        return (
          <div
            key={`protocol-integration-${name}`}
            className="flex flex-row items-center justify-between p-4 box-border rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border"
          >
            <div className="pinto-sm-light text-pinto-light">
              {typeof integration.ctaMessage === "function" ? integration.ctaMessage(token) : integration.ctaMessage}
            </div>
            <Button asChild variant="outline-secondary" className="rounded-[12px] min-w-min">
              <Link to={integration.url} target="_blank" rel="noopener noreferrer">
                <div className="flex flex-row items-center gap-2 pinto-sm-light">
                  <IconImage src={integration.logoURI} size={6} alt="Cream Finance" />
                  <span>Visit {integration.protocol}</span>
                </div>
              </Link>
            </Button>
          </div>
        );
      })}
    </>
  );
};

interface ISiloedTokenOverviewStats {
  token: Token;
  deposits: ReturnType<typeof useFarmerSiloNew>["deposits"];
  exchangeRate: ReturnType<typeof useSiloWrappedTokenExchangeRateQuery>["data"];
  totalSupply: ReturnType<typeof useSiloWrappedTokenTotalSupply>["data"];
  loading: boolean;
}

const noWrapRowCn = clsx("flex flex-row items-center flex-nowrap whitespace-nowrap");

const SiloedTokenOverviewStats = ({
  token,
  deposits,
  exchangeRate,
  totalSupply,
  loading,
}: ISiloedTokenOverviewStats) => {
  const { mainToken, siloWrappedToken } = useTokenData();

  const depositsData = deposits?.get(mainToken);

  const rate = exchangeRate ? TV.fromHuman(1, exchangeRate.decimals).div(exchangeRate) : TV.ZERO;

  const totalDeposited = depositsData?.amount ?? TV.ZERO;
  const totalStalk = depositsData?.stalk.total ?? TV.ZERO;
  const totalSeed = depositsData?.seeds ?? TV.ZERO;

  return (
    <div className="flex flex-col gap-4">
      <LabelValue title="Exchange Rate">
        <TextSkeleton loading={loading} height="sm" className="w-60">
          <div className={cn(noWrapRowCn, "gap-2")}>
            <span className={cn(noWrapRowCn, "gap-1")}>
              <IconImage src={siloWrappedToken.logoURI} size={4} alt={siloWrappedToken.name} />
              <span>1.00 {siloWrappedToken.symbol}</span>
            </span>
            <span>=</span>
            <span className={cn(noWrapRowCn, "gap-1")}>
              <IconImage src={mainToken.logoURI} size={4} alt={mainToken.name} />
              <span>
                {formatter.xDec(rate, 4)} {mainToken.symbol}
              </span>
            </span>
          </div>
        </TextSkeleton>
      </LabelValue>
      <LabelValue title={`Total ${token.symbol} Supply`}>
        <TextSkeleton loading={loading} height="sm" className="w-52">
          <div className={cn(noWrapRowCn, "gap-1")}>
            <IconImage src={token.logoURI} size={4} alt={token.name} />
            <span>
              {formatter.token(totalSupply, token)} {token.symbol}
            </span>
          </div>
        </TextSkeleton>
      </LabelValue>
      <LabelValue title={`Deposited ${mainToken.symbol} Totals`} className="align-top">
        <div className="flex flex-col gap-2 text-right">
          <TextSkeleton loading={loading} height="sm" className="self-end w-44">
            <div className={cn(noWrapRowCn, "self-end gap-1")}>
              <IconImage src={mainToken.logoURI} size={4} alt={mainToken.name} />
              <span>
                {formatter.token(totalDeposited, mainToken)} {mainToken.symbol}
              </span>
            </div>
          </TextSkeleton>
          <TextSkeleton loading={loading} height="sm" className="self-end w-44">
            <div className={cn(noWrapRowCn, "gap-1 self-end")}>
              <CornerBottomLeftIcon className="w-4 h-4 pb-1" />
              <IconImage src={STALK.logoURI} size={4} alt={STALK.name} />
              <span>{formatter.token(totalStalk, STALK)}</span>
            </div>
          </TextSkeleton>
          <TextSkeleton loading={loading} height="sm" className="self-end w-32">
            <div className={cn(noWrapRowCn, "gap-1 self-end")}>
              <CornerBottomLeftIcon className="w-4 h-4 pb-1" />
              <IconImage src={SEEDS.logoURI} size={4} alt={SEEDS.name} />
              <span>{formatter.token(totalSeed, SEEDS)}</span>
            </div>
          </TextSkeleton>
        </div>
      </LabelValue>
    </div>
  );
};

const FAQ_ITEMS: IBaseAccordionContent[] = [
  {
    key: "what-is-spinto",
    title: "What is sPinto?",
    content:
      "sPinto is a yield bearing token denominated in Pinto. It wraps Pinto Silo deposits and adheres to the ERC-20 and ERC-4626 standards. The token will increase in Pinto denominated value as yield accrues and does not rebase.",
  },
  {
    key: "do-i-claim-yield",
    title: "Do I need to claim yield with sPINTO?",
    content:
      "No. Holding sPinto allows users to have exposure to Silo yield without needing to interact directly with the Pinto protocol.",
  },
  {
    key: "what-happens-stalk-and-seed",
    title: "What happens to my Stalk and Seed?",
    content:
      "Stalk and Seeds are shared equally amongst all holders of sPinto. When unwrapping a user will receive the sPinto deposits with the lowest grown Stalk. It advisable to avoid wrapping deposits with a large amount of grown Stalk.",
  },
] as const;
