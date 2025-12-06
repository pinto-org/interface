import { TokenValue } from "@/classes/TokenValue";
import { Col, Row } from "@/components/Container";
import DonutChart from "@/components/DonutChart";
import TextSkeleton from "@/components/TextSkeleton";
import TooltipSimple from "@/components/TooltipSimple";
import { tabToSeasonalLookback } from "@/components/charts/SeasonalChart";
import { TimeTab } from "@/components/charts/TimeTabs";
import { Card } from "@/components/ui/Card";
import IconImage from "@/components/ui/IconImage";
import useIsMobile from "@/hooks/display/useIsMobile";
import { useSeasonalSiloActiveFarmers } from "@/state/seasonal/seasonalDataHooks";
import { usePriceData } from "@/state/usePriceData";
import { useSeedGauge } from "@/state/useSeedGauge";
import { useSiloData } from "@/state/useSiloData";
import { useSeason } from "@/state/useSunData";
import { useWhitelistedTokens } from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { getTokenIndex } from "@/utils/token";
import { Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const SiloStatsComponent = () => {
  const { data: siloStats, siloWhitelistData, isLoading } = useSiloStats();

  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);

  const handleSetHoveredIndex = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  return (
    <Card className="flex flex-col p-4 sm:p-6 gap-2 sm:gap-6 h-auto w-full">
      <Col className="gap-2">
        <div className="flex flex-row gap-4">
          <SiloStatContent data={siloStats} isLoading={isLoading} />
        </div>
        <Link
          to="/explorer/silo"
          className="pinto-xs sm:pinto-sm font-light text-pinto-green-4 sm:text-pinto-green-4 hover:underline transition-all mt-2"
        >
          See more data →
        </Link>
      </Col>
      <div className="grid sm:pt-4 grid-cols-1 sm:grid-cols-2 gap-4 w-full justify-between">
        <Col className="gap-4 self-stretch order-2 sm:order-1">
          {Object.entries(siloWhitelistData).map(([key, wlData], i) => {
            const isHovered = (hoveredIndex || 0) === i;
            if (!isHovered) return null;

            return (
              <HoveredSiloTokenStatContent
                key={`${key}-${wlData.token.symbol}`}
                wlTokenSiloDetails={wlData}
                isLoading={isLoading}
              />
            );
          })}
        </Col>
        <DepositedByTokenDoughnutChart
          setHoveredIndex={handleSetHoveredIndex}
          siloWhitelistData={siloWhitelistData}
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
};

const SiloStats = memo(SiloStatsComponent);

export default SiloStats;

// ---------- Hovered Silo Token Stat Content ----------

interface HoveredSiloTokenStatContentProps {
  wlTokenSiloDetails: SiloTokenDepositOverallDetails;
  isLoading: boolean;
}

const tooltipProps = {
  variant: "outlined",
  showOnMobile: true,
  className: "pinto-sm",
} as const;

const HoveredSiloStatRow = (props: {
  label: string | JSX.Element;
  value: string | JSX.Element;
  loading: boolean;
  tooltip?: string | JSX.Element;
}) => {
  const { label, value, loading, tooltip } = props;

  return (
    <Row className="gap-2 justify-between">
      <Row className="gap-1 items-center pinto-sm-light sm:pinto-body-light text-pinto-light sm:text-pinto-light">
        {label}
        {tooltip && <TooltipSimple {...tooltipProps} content={tooltip} />}
      </Row>
      <TextSkeleton height="same-sm" desktopHeight="same-body" className="w-32" loading={loading}>
        <div className="pinto-sm-light sm:pinto-body-light shrink-0">{value}</div>
      </TextSkeleton>
    </Row>
  );
};

const HoveredSiloTokenStatContent = ({
  wlTokenSiloDetails: {
    token,
    depositedBDV,
    depositedAmount,
    siloDepositedRatio,
    optimalPctDepositedBdv,
    currentDepositedLPBDVRatio,
  },
  isLoading,
}: HoveredSiloTokenStatContentProps) => {
  const { tokenPrices, loading: priceLoading } = usePriceData();

  const usdPrice = tokenPrices.get(token)?.instant;

  const usdDeposited = usdPrice ? depositedAmount.mul(usdPrice) : undefined;

  const loading = isLoading || priceLoading;

  return (
    <Col className="gap-4 justify-start self-stretch h-auto">
      <div className="pinto-body-bold flex flex-row gap-1">
        <TextSkeleton height="same-body" className="w-32" loading={loading}>
          <>
            <IconImage size={5} src={token.logoURI} />
            <>{token.symbol}</>
          </>
        </TextSkeleton>
      </div>
      <HoveredSiloStatRow
        label="Total Deposited Amount"
        value={formatter.token(depositedAmount, token)}
        loading={loading}
      />
      <HoveredSiloStatRow
        label="Total Deposited PDV"
        value={formatter.twoDec(depositedBDV)}
        loading={loading}
        tooltip={<>The total Pinto-denominated value deposited into the Silo.</>}
      />
      <HoveredSiloStatRow
        label="Total Deposited Value"
        value={usdDeposited ? formatter.usd(usdDeposited) : "--"}
        loading={loading}
        tooltip={<>The total USD value deposited into the Silo.</>}
      />
      <HoveredSiloStatRow
        label=" % of Total Deposited PDV"
        value={formatter.pct(siloDepositedRatio.mul(100))}
        loading={loading}
        tooltip={<>The percentage of the total Pinto-denominated value deposited into the Silo.</>}
      />
      {!token.isMain && (
        <>
          <HoveredSiloStatRow
            label="Optimal % LP Deposited PDV"
            value={formatter.pct(optimalPctDepositedBdv)}
            loading={loading}
            tooltip={<>The optimal percentage of the total LP Deposited PDV deposited into the Silo.</>}
          />
          <HoveredSiloStatRow
            label="Current % LP Deposited PDV"
            value={formatter.pct(currentDepositedLPBDVRatio.mul(100))}
            loading={loading}
            tooltip={<>The current percentage of the total LP Deposited PDV in the Silo.</>}
          />
        </>
      )}
    </Col>
  );
};

// ---------- Upper Silo Stats ----------

const SiloStatContent = ({
  data,
  isLoading,
}: { data: ReturnType<typeof useSiloStats>["data"]; isLoading: boolean }) => {
  const stats = useMemo(
    () => [
      {
        label: "Total Deposited PDV",
        subLabel: "Total Pinto Denominated Value deposited into the Silo",
        value: formatter.twoDec(data.totalDepositedBDV),
      },
      {
        label: "Total Stalk",
        subLabel: "Total Stalk issued to Silo Depositors",
        value: formatter.twoDec(data.totalStalk),
      },
      {
        label: "Active Farmers",
        subLabel: "Total number of unique depositors in the Silo",
        value: data.uniqueDepositors,
      },
    ],
    [data.totalDepositedBDV, data.totalStalk, data.uniqueDepositors],
  );

  return (
    <>
      <div className="hidden sm:flex flex-row gap-x-12 gap-y-4 flex-wrap w-full">
        {stats.map(({ label, subLabel, value }) => {
          return (
            <div key={`silo-stat-desktop-${label}`} className="flex flex-col flex-grow gap-1 sm:gap-2">
              <div className="pinto-sm-light sm:pinto-body-light font-thin">{label}</div>
              <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light">{subLabel}</div>
              <TextSkeleton height="same-body" desktopHeight="h3" className="w-32" loading={isLoading}>
                <div className="pinto-body sm:pinto-h3">{isLoading ? "--" : value}</div>
              </TextSkeleton>
            </div>
          );
        })}
      </div>
      <Col className="flex sm:hidden gap-2 w-full">
        {stats.map(({ label, value }) => {
          return (
            <Row key={`silo-stat-mobile-${label}`} className="gap-2 items-center justify-between">
              <div className="pinto-xs">{label}</div>
              <TextSkeleton height="same-sm" desktopHeight="same-body" className="w-32" loading={isLoading}>
                <div className="pinto-sm text-end">{value}</div>
              </TextSkeleton>
            </Row>
          );
        })}
      </Col>
    </>
  );
};

// ---------- Deposited By Token Doughnut Chart ----------

const donutOptions = {
  layout: {
    padding: 12,
  },
  plugins: {
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context) => {
          return `% TVD: ${context.formattedValue}%`;
        },
      },
    },
  },
} as const;

const chartColors = [
  "#246645", // Pinto Green (pinto-green-3)
  "#1E6091", // Deep Blue
  "#854f96", // Lavender
  "#8338EC", // Bright Purple
  "#FF9F1C", // Golden Orange
  "#00BCD4", // Light Blue / Cyan
];

// Memoize to prevent chart animations from re-rendering
const DepositedByTokenDoughnutChart = memo(
  (
    props: Omit<ReturnType<typeof useSiloStats>, "data"> & {
      setHoveredIndex: (index: number) => void;
    },
  ) => {
    const { siloWhitelistData, isLoading, setHoveredIndex } = props;

    const isMobile = useIsMobile();

    const donutChartProps = useMemo(() => {
      return {
        labels: Object.keys(siloWhitelistData),
        datasets: [
          {
            label: "",
            data: Object.values(siloWhitelistData).map((d) => d.siloDepositedRatio.mul(100).toNumber()),
            backgroundColor: chartColors,
            borderWidth: 0,
            offset: 2,
            borderRadius: 4,
          },
        ],
      };
    }, [siloWhitelistData]);

    return (
      <Col className="relative gap-4 items-center order-1 sm:order-2">
        <div className="flex flex-col self-stretch items-center">
          <DonutChart
            className={cn("w-72 h-72", isMobile && "w-52 h-52")}
            size={isMobile ? 200 : 350}
            data={donutChartProps}
            options={donutOptions}
            onHover={setHoveredIndex}
          />
        </div>
      </Col>
    );
  },
);

// ---------- Hooks ----------

const useUniqueDepositors = () => {
  const season = useSeason();
  const query = useSeasonalSiloActiveFarmers(Math.max(0, season - tabToSeasonalLookback(TimeTab.Week)), season);

  return {
    ...query,
    data: query.data?.length ? query.data[0].value : undefined,
  };
};

type SiloTokenDepositOverallDetails = {
  token: Token;
  depositedBDV: TokenValue;
  depositedAmount: TokenValue;
  siloDepositedRatio: TokenValue;
  optimalPctDepositedBdv: TokenValue;
  currentDepositedLPBDVRatio: TokenValue;
};

const baseObj: Omit<SiloTokenDepositOverallDetails, "token"> = {
  depositedBDV: TokenValue.ZERO,
  siloDepositedRatio: TokenValue.ZERO,
  depositedAmount: TokenValue.ZERO,
  optimalPctDepositedBdv: TokenValue.ZERO,
  currentDepositedLPBDVRatio: TokenValue.ZERO,
};

const reduceTotalDepositedBDV = (tokenData: ReturnType<typeof useSiloData>["tokenData"]) => {
  const entries = [...tokenData.entries()];
  return entries.reduce<TokenValue>((acc, [_, tokenData]) => acc.add(tokenData.depositedBDV), TokenValue.ZERO);
};

const useSiloStats = () => {
  const [totalDepositedBDV, setTotalDepositedBDV] = useState<TokenValue>(TokenValue.ZERO);
  const [byToken, setByToken] = useState<Record<string, SiloTokenDepositOverallDetails>>({});
  const whitelist = useWhitelistedTokens();

  const uniqueDepositors = useUniqueDepositors();
  const seedGauge = useSeedGauge();
  const silo = useSiloData();

  const gaugeDataLoaded = !!Object.values(seedGauge.data.gaugeData).length && !seedGauge.isLoading;
  const siloDataLoaded = !!silo.tokenData.size;

  const dataLoaded = gaugeDataLoaded && siloDataLoaded;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!dataLoaded) return;

    const totalBDV = reduceTotalDepositedBDV(silo.tokenData);

    // Only set data if data has changed.
    if (totalBDV.gt(0) && totalDepositedBDV.eq(totalBDV)) return;

    const map = whitelist.reduce<Record<string, SiloTokenDepositOverallDetails>>((prev, token) => {
      const obj = { token, ...baseObj };

      const wlTokenData = silo.tokenData.get(token);
      const tokenGaugeData = seedGauge.data.gaugeData[getTokenIndex(token)];

      if (wlTokenData) {
        obj.depositedBDV = wlTokenData.depositedBDV;
        obj.siloDepositedRatio = wlTokenData.depositedBDV.div(totalBDV);
        obj.depositedAmount = wlTokenData.totalDeposited;
      }

      if (tokenGaugeData) {
        obj.optimalPctDepositedBdv = tokenGaugeData.optimalPctDepositedBdv;
        obj.currentDepositedLPBDVRatio = tokenGaugeData.currentDepositedLPBDVRatio ?? TokenValue.ZERO;
      }

      prev[token.symbol] = obj;
      return prev;
    }, {});

    setTotalDepositedBDV(totalBDV);
    setByToken(map);
  }, [whitelist, silo.tokenData, seedGauge.data.gaugeData]);

  const isLoading = uniqueDepositors.isLoading || totalDepositedBDV.lte(0);

  return useMemo(() => {
    return {
      data: {
        totalDepositedBDV: totalDepositedBDV,
        uniqueDepositors: uniqueDepositors.data,
        totalStalk: silo.totalStalk,
      },
      siloWhitelistData: byToken,
      isLoading,
    };
  }, [totalDepositedBDV, uniqueDepositors.data, silo.totalStalk, byToken, isLoading]);
};
