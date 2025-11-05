import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import creamFinanceLogo from "@/assets/misc/cream-finance-logo.png";
import spectraLogo from "@/assets/misc/spectra-token-logo.svg";
import { TV } from "@/classes/TokenValue";
import LabelValue from "@/components/LabelValue";
import MobileActionBar from "@/components/MobileActionBar";
import TextSkeleton from "@/components/TextSkeleton";
import { navLinks } from "@/components/nav/nav/Navbar";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { SEEDS, STALK } from "@/constants/internalTokens";
import useIsMobile from "@/hooks/display/useIsMobile";
import { ProtocolIntegrationSummary, useProtocolIntegrationLinks } from "@/hooks/useProtocolIntegrations";
import { useSpectraPoolData } from "@/state/integrations/useSpectraPoolData";
import { useSeasonalPrice, useSeasonalWrappedDepositExchangeRate } from "@/state/seasonal/seasonalDataHooks";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSiloWrappedDepositsAPYs } from "@/state/useSiloWrappedDepositsAPYs";
import { useSiloWrappedTokenExchangeRateQuery, useSiloWrappedTokenTotalSupply } from "@/state/useSiloWrappedTokenData";
import { useSeason } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { trackClick } from "@/utils/analytics";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { CornerBottomLeftIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";
import SiloActions from "./silo/SiloActions";
import SiloTokenPageHeader, { SiloTokenPageSubHeader } from "./siloToken/SiloTokenPageHeader";
import SiloedTokenCharts from "./wrap/SiloedTokenCharts";

export default function SiloWrappedSiloToken({ token }: { token: Token }) {
  // URL Params
  const [params] = useSearchParams();
  const currentAction = params.get("action");

  const navigate = useNavigate();

  // Queries | Hooks
  const { deposits } = useFarmerSilo(token.address);
  const exchangeRate = useSiloWrappedTokenExchangeRateQuery();
  const totalSupply = useSiloWrappedTokenTotalSupply();
  const priceData = usePriceData();
  const balances = useFarmerBalances();
  const isMobile = useIsMobile();

  const apys = useSiloWrappedDepositsAPYs();

  // Display State
  const overviewStatsLoading = Boolean(!deposits || exchangeRate.data?.lte(0) || totalSupply.data?.lte(0));
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
                      <Link to={navLinks.sPinto}>
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
        {!currentAction && (
          <MobileActionBar>
            <Button
              onClick={() => navigate(`${navLinks.sPinto}?action=wrap`)}
              rounded={"full"}
              variant={"outline-secondary"}
              className="pinto-sm-bold text-sm flex-1 flex h-full"
            >
              Wrap
            </Button>
            <Button
              onClick={() => navigate(`${navLinks.sPinto}?action=unwrap`)}
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

const useDelta24SeasonPrice = ({ token, deltaSeason }: { token: Token; deltaSeason: number }) => {
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

  return { data: usd, isLoading };
};

const BalanceSection = ({ token, tokenPrices, farmerBalances, loading }: IBalanceSectionProps) => {
  const account = useAccount();
  const season = useSeason();

  const delta24Seasons = season - 24;

  const { data: delta24SeasonsPriceUSD, isLoading: delta24SeasonsPriceLoading } = useDelta24SeasonPrice({
    token,
    deltaSeason: delta24Seasons,
  });

  const usdPrice = tokenPrices.get(token)?.instant;
  const balance = farmerBalances.get(token)?.total;

  const totalUSD = usdPrice?.mul(balance ?? TV.ZERO) ?? TV.ZERO;
  const delta24SeasonsTotalUSD = delta24SeasonsPriceUSD?.mul(balance ?? TV.ZERO) ?? TV.ZERO;

  const deltaPct =
    delta24SeasonsTotalUSD?.gt(0) && totalUSD?.gt(0)
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

  const spectraData = useSpectraPoolData();
  const poolData = spectraData.data?.[0];

  // Helper function to get specific event name based on integration key
  const getEventNameForIntegration = (key: string, protocol: string) => {
    const eventMap: Record<string, string> = {
      cream: ANALYTICS_EVENTS.SILO.WRAPPED_TOKEN_CREAM_FINANCE_CLICK,
      spectraPool: ANALYTICS_EVENTS.SILO.WRAPPED_TOKEN_SPECTRA_POOL_CLICK,
      spectraFixedRate: ANALYTICS_EVENTS.SILO.WRAPPED_TOKEN_SPECTRA_FIXED_RATE_CLICK,
      spectraTradeYield: ANALYTICS_EVENTS.SILO.WRAPPED_TOKEN_SPECTRA_YIELD_TRADING_CLICK,
    };
    return eventMap[key] || ANALYTICS_EVENTS.SILO.WRAPPED_TOKEN_PROTOCOL_INTEGRATION_CLICK;
  };

  // Helper function to create privacy-safe APY ranges
  const getAPYRange = (apy: number | undefined) => {
    if (!apy || apy === 0) return "none";
    if (apy < 5) return "low"; // < 5%
    if (apy < 15) return "medium"; // 5-15%
    return "high"; // > 15%
  };

  const ProtocolIntegrationCard = ({
    ctaMessage,
    protocol,
    logoURI,
    url,
    name,
    value,
    integrationKey,
  }: ProtocolIntegrationSummary & { value?: number; integrationKey: string }) => {
    return (
      <div className="flex flex-row items-center justify-between p-4 box-border rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border gap-2">
        <div className="pinto-sm-light text-pinto-light">{ctaMessage(token, value)}</div>
        <Button asChild variant="outline-secondary" className="rounded-[0.75rem] min-w-min">
          <Link
            to={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackClick(getEventNameForIntegration(integrationKey, protocol), {
              integration_type: integrationKey,
              external_url: url,
              apy_range: getAPYRange(value),
              apy_value: value,
              source_page: "silo_wrapped_token",
              source_component: "protocol_integration_card",
              link_type: "external_protocol",
            })}
          >
            <div className="flex flex-row items-center gap-2 pinto-sm-light">
              <IconImage src={logoURI} size={6} alt={protocol} />
              <span>Visit {protocol}</span>
            </div>
          </Link>
        </Button>
      </div>
    );
  };

  function getCardValue(key: string) {
    if (key === "spectraPool") {
      return poolData?.pools[0].lpApy.total;
    } else if (key === "spectraFixedRate") {
      return poolData?.pools[0].ptApy;
    } else if (key === "spectraTradeYield") {
      return poolData?.pools[0].ytLeverage;
    } else {
      return undefined;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(integrations).map(([key, integration]) => {
        return (
          <ProtocolIntegrationCard
            key={key}
            name={integration.name}
            ctaMessage={integration.ctaMessage}
            logoURI={integration.logoURI}
            protocol={integration.protocol}
            url={integration.url}
            value={getCardValue(key)}
            integrationKey={key}
          />
        );
      })}
    </div>
  );
};

interface ISiloedTokenOverviewStats {
  token: Token;
  deposits: ReturnType<typeof useFarmerSilo>["deposits"];
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
  loading: isLoading,
}: ISiloedTokenOverviewStats) => {
  const { mainToken, siloWrappedToken } = useTokenData();

  const depositsData = deposits?.get(mainToken);

  const loading = isLoading || !depositsData;

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
