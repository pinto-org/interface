import PdvIcon from "@/assets/protocol/PDV-HQ.png";
import SeedIcon from "@/assets/protocol/Seed.png";
import StalkIcon from "@/assets/protocol/Stalk.png";
import { Col, Row } from "@/components/Container";
import TextSkeleton from "@/components/TextSkeleton";
import TooltipSimple from "@/components/TooltipSimple";
import { useDebouncedLoading } from "@/hooks/display/useDelayedLoading";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { ReactNode } from "react";
import { useAccount } from "wagmi";

interface StatCardProps {
  title: string;
  tooltip: string;
  mainValue: string | ReactNode;
  secondaryValue?: string | ReactNode;
  tertiaryValue?: string | ReactNode;
  deltaValue?: string | ReactNode;
  icon?: string;
  iconAlt?: string;
  loading: boolean;
  showDelta: boolean;
  deltaColor?: string;
  className?: string;
}

function StatCard({
  title,
  tooltip,
  mainValue,
  secondaryValue,
  tertiaryValue,
  deltaValue,
  icon,
  iconAlt,
  loading,
  showDelta,
  deltaColor = "text-pinto-green-4",
  className = "",
}: StatCardProps) {
  return (
    <Col className={`gap-2 ${className}`}>
      <Row className="gap-1 text-pinto-primary">
        <span className="pinto-sm-light">{title}</span>
        <TooltipSimple
          variant="outlined"
          content={tooltip}
          triggerClassName="text-pinto-primary w-3 h-3 mb-1"
          showOnMobile
        />
      </Row>
      <Row className="gap-1 whitespace-nowrap">
        {icon && <img src={icon} className="h-6 w-6 sm:h-8 sm:w-8" alt={iconAlt} />}
        <TextSkeleton loading={loading} desktopHeight="h3" height="h4" className="w-40">
          <div className="pinto-h4 sm:pinto-h3">{mainValue}</div>
        </TextSkeleton>
        {showDelta && deltaValue && (
          <TextSkeleton loading={loading} desktopHeight="h3" height="h4" className="w-32">
            <div className={`pl-2 pinto-h4 sm:pinto-h3 ${deltaColor}`}>{deltaValue}</div>
          </TextSkeleton>
        )}
      </Row>
      {secondaryValue && (
        <TextSkeleton loading={loading} desktopHeight="sm" height="xs" className="w-32">
          {secondaryValue}
        </TextSkeleton>
      )}
      {tertiaryValue && (
        <TextSkeleton loading={loading} desktopHeight="sm" height="xs" className="w-32">
          {tertiaryValue}
        </TextSkeleton>
      )}
    </Col>
  );
}

export interface FarmerSiloOverviewStatsProps {
  farmerSilo: ReturnType<typeof useFarmerSilo>;
  hoveredButton: string;
  farmerActions: ReturnType<typeof useFarmerActions>;
}

export default function FarmerSiloOverviewStats({
  farmerSilo,
  hoveredButton,
  farmerActions,
}: FarmerSiloOverviewStatsProps) {
  const { mainToken } = useTokenData();
  const priceData = usePriceData();
  const account = useAccount();

  const { loading } = useDebouncedLoading({
    isLoading: account.status === "connecting" || farmerSilo.isLoading,
    ms: 50,
    defaultValue: account.status === "connecting" ? true : farmerSilo.isLoading,
  });

  const showActionValues = hoveredButton === "claim";

  const deltaDepositedBDV = farmerActions.claimRewards.outputs.bdvGain;
  const hasDeltaDepositedBDV = deltaDepositedBDV.gt(0);

  const deltaStalk = farmerActions.claimRewards.outputs.stalkGain;
  const hasDeltaStalk = deltaStalk.gt(0);

  const deltaSeed = farmerActions.claimRewards.outputs.seedGain;
  const hasDeltaSeed = deltaSeed.gt(0);

  const getDepositedValueCard = () => {
    const secondaryValue =
      showActionValues && hasDeltaDepositedBDV ? (
        <Row className="pinto-xs sm:pinto-sm font-thin text-pinto-light gap-1">
          <img src={PdvIcon} alt="PDV" className="h-3 w-[1.125rem] sm:h-4 sm:w-6" />
          <span>
            {formatter.number(farmerSilo.depositsBDV, { minDecimals: 2, maxDecimals: 2, allowZero: true })} PDV
          </span>
          <span className="text-pinto-green-4">+{formatter.pdv(deltaDepositedBDV)}</span>
        </Row>
      ) : (
        <Row className="pinto-xs sm:pinto-sm font-thin text-pinto-light gap-1">
          <img src={PdvIcon} alt="PDV" className="h-3 w-[1.125rem] sm:h-4 sm:w-6" />
          {formatter.token(farmerSilo.depositsBDV, mainToken)} PDV
        </Row>
      );

    const deltaValue =
      showActionValues && farmerActions.claimRewards.outputs.bdvGain.abs().gt(0.01)
        ? formatter.usd(deltaDepositedBDV.mul(priceData.price), { showPositiveSign: true })
        : null;

    return (
      <StatCard
        title="My Deposited Value"
        tooltip="My Deposited Value in the Silo in terms of USD / PDV"
        mainValue={formatter.usd(farmerSilo.depositsUSD)}
        secondaryValue={secondaryValue}
        deltaValue={deltaValue}
        loading={loading}
        showDelta={showActionValues && farmerActions.claimRewards.outputs.bdvGain.abs().gt(0.01)}
        deltaColor="text-pinto-green-4"
      />
    );
  };

  const getStalkCard = () => {
    const mainValueWithGerminating = (
      <>
        {formatter.number(farmerSilo.activeStalkBalance)}
        {farmerSilo.germinatingStalkBalance.gt(0) && !showActionValues && (
          <TooltipSimple showOnMobile content="This Stalk is germinating.">
            <span className="pinto-h4 sm:pinto-h3 text-pinto-off-green/60 ml-1">
              {formatter.number(farmerSilo.germinatingStalkBalance, {
                showPositiveSign: !farmerSilo.activeStalkBalance.eq(0),
              })}
            </span>
          </TooltipSimple>
        )}
      </>
    );

    const secondaryValue = (
      <div
        className={`pinto-xs sm:pinto-sm font-thin text-pinto-light ${
          showActionValues || deltaStalk.lt(0.01) ? "opacity-0" : "opacity-100"
        }`}
      >
        Claimable Stalk:{" "}
        <span className="text-pinto-stalk-gold">{formatter.twoDec(deltaStalk, { showPositiveSign: true })}</span>
      </div>
    );

    const deltaValue =
      showActionValues && deltaStalk.abs().gt(0.01) ? formatter.number(deltaStalk, { showPositiveSign: true }) : null;

    return (
      <StatCard
        title="My Stalk"
        tooltip="Stalk entitles holders to passive interest in the form of a share of future Pinto. Your Stalk is forfeited when you Withdraw your Deposited assets from the Silo."
        mainValue={mainValueWithGerminating}
        secondaryValue={secondaryValue}
        deltaValue={deltaValue}
        icon={StalkIcon}
        iconAlt="STALK"
        loading={loading}
        showDelta={showActionValues && deltaStalk.abs().gt(0.01)}
        deltaColor="text-pinto-stalk-gold"
      />
    );
  };

  const getSeedsCard = () => {
    const secondaryValue = (
      <Row className="pinto-xs sm:pinto-sm font-thin text-pinto-light gap-1">
        {showActionValues && hasDeltaSeed ? (
          <span className="text-pinto-seed-silver">
            +{formatter.twoDec(farmerSilo.activeSeedsBalance.add(deltaSeed).div(10000))}
          </span>
        ) : (
          <span className="text-pinto-gray-5">+{formatter.twoDec(farmerSilo.activeSeedsBalance.div(10000))}</span>
        )}
        <span>Grown Stalk per Season</span>
      </Row>
    );

    const tertiaryValue = (
      <div
        className={`pinto-xs sm:pinto-sm font-thin text-pinto-light ${
          showActionValues || deltaSeed.lt(0.01) ? "opacity-0" : "opacity-100"
        }`}
      >
        Claimable Seeds:{" "}
        <span className="text-pinto-seed-silver">{formatter.twoDec(deltaSeed, { showPositiveSign: true })}</span>
      </div>
    );

    const deltaValue =
      showActionValues && deltaSeed.abs().gt(0.01) ? formatter.number(deltaSeed, { showPositiveSign: true }) : null;

    return (
      <StatCard
        title="My Seeds"
        tooltip="Seeds are illiquid tokens that yield 1/10,000 Stalk each Season."
        mainValue={formatter.number(farmerSilo.activeSeedsBalance)}
        secondaryValue={secondaryValue}
        tertiaryValue={tertiaryValue}
        deltaValue={deltaValue}
        icon={SeedIcon}
        iconAlt="SEEDS"
        loading={loading}
        showDelta={showActionValues && deltaSeed.abs().gt(0.01)}
        deltaColor="text-pinto-seed-silver"
        className="w-40"
      />
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
      {getDepositedValueCard()}
      {getStalkCard()}
      {getSeedsCard()}
    </div>
  );
}
