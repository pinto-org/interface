import copyIcon from "@/assets/misc/Copy.svg";
import etherscanIcon from "@/assets/misc/Etherscan.png";
import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import pintoexchangelogo from "@/assets/misc/pinto-exchange-logo.svg";
import portalbridgelogo from "@/assets/misc/portal-bridge-logo.svg";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import GerminationNotice from "@/components/GerminationNotice";
import { ExternalLinkIcon } from "@/components/Icons";
import InlineStats from "@/components/InlineStats";
import SiloActionBox from "@/components/SiloActionBox";
import { Button } from "@/components/ui/Button";
import DenominationSwitcher from "@/components/ui/DenominationSwitcher";
import IconImage from "@/components/ui/IconImage";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import { useDenomination } from "@/hooks/useAppSettings";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { usePriceData } from "@/state/usePriceData";
import { useSeedGauge } from "@/state/useSeedGauge";
import { SiloTokenYield, useSiloTokenAPYs } from "@/state/useSiloAPYs";
import { useSiloData } from "@/state/useSiloData";
import { useSeason } from "@/state/useSunData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { SiloTokenData, Token, TokenDepositData } from "@/utils/types";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useChainId, useConfig } from "wagmi";
import DepositsTable from "../components/DepositsTable";
import SiloActions from "./silo/SiloActions";

export default function SiloToken() {
  const { tokenAddress } = useParams();
  const tokenData = useTokenData();
  const siloData = useSiloData();
  const priceData = usePriceData();
  const apysQuery = useSiloTokenAPYs(tokenAddress);
  const depositedBalances = useFarmerSiloNew().deposits;
  const farmerBalances = useFarmerBalances();

  const siloToken = tokenData.whitelistedTokens.find((token) => stringEq(token.address, tokenAddress ?? ""));
  const siloTokenData = siloToken ? siloData.tokenData.get(siloToken) : undefined;
  const farmerDeposits = siloToken ? depositedBalances.get(siloToken) : undefined;

  const isMain = Boolean(siloToken?.isMain);

  if (!siloToken) {
    return <>404</>;
  }

  const farmerBalanceSiloTokenAmount: TokenValue = farmerBalances.balances.get(siloToken)?.total ?? TokenValue.ZERO;

  // what's the logic here?
  // if they already have the token, then they already know to bridge it over

  return (
    // Add pt-4 to container b/c backbutton overflows to the top for some reason.
    <PageContainer variant="xl">
      <div className="flex flex-col gap-8 justify-start">
        <SiloTokenHeader siloToken={siloToken} />
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex flex-col items-center flex-shrink-1 w-full">
            <div className="flex flex-col w-full gap-14 items-start">
              <div className="flex flex-col w-full gap-6">
                <SiloTokenSubHeader siloTokenData={siloTokenData} apys={apysQuery.data} />
                <Separator />
                <div className="pt-8">
                  <FarmerSiloTokenDeposits
                    siloToken={siloToken}
                    farmerDeposits={farmerDeposits}
                    price={priceData.price}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-y-6 w-full">
                {farmerBalanceSiloTokenAmount.gt(0) ? (
                  <UndepositedSiloTokenInfoHeader
                    siloToken={siloToken}
                    farmerBalanceSiloTokenAmount={farmerBalanceSiloTokenAmount}
                    isMain={isMain}
                  />
                ) : (
                  siloToken.name === "PINTOWSOL LP" && <SiloTokenWSOLWarningHeader />
                )}
                <div className="flex flex-col gap-6 w-full">
                  <div className="w-full border border-pinto-gray-2 rounded-[1rem] overflow-clip">
                    <DepositsTable token={siloToken} />
                  </div>
                </div>
              </div>
              <SiloTokenAbout siloToken={siloToken} price={priceData.price} siloData={siloData} />
            </div>
          </div>
          <div className="w-full lg:max-w-[518px] lg:min-w-[425px] lg:-mt-2">
            <SiloTokenActions siloToken={siloToken} farmerDeposits={farmerDeposits} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

interface IBaseSiloToken {
  siloToken: Token;
}

interface ISiloTokenActions extends IBaseSiloToken {
  farmerDeposits: TokenDepositData | undefined;
}

const SiloTokenActions = ({ siloToken, farmerDeposits }: ISiloTokenActions) => {
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="p-4 rounded-[1rem] bg-pinto-off-white border-pinto-gray-2 border">
        <SiloActions token={siloToken} />
      </div>
      {farmerDeposits?.deposits.map((farmerDeposit) => {
        if (farmerDeposit.isGerminating || farmerDeposit.isPlantDeposit) {
          return <GerminationNotice type="single" deposit={farmerDeposit} />;
        }
        return null;
      })}
      <SiloActionBox farmerDeposits={farmerDeposits} />
    </div>
  );
};

interface IUndepositedSiloToken extends IBaseSiloToken {
  farmerBalanceSiloTokenAmount: TokenValue;
  isMain: boolean;
}

const UndepositedSiloTokenInfoHeader = ({ siloToken, farmerBalanceSiloTokenAmount, isMain }: IUndepositedSiloToken) => {
  const chainId = useChainId();

  return (
    <>
      {isMain ? (
        <div className="flex flex-row bg-pinto-off-white border p-4 rounded-[1rem] gap-x-2 items-center w-auto">
          <IconImage src={InfoCircledIcon} size={4} alt="warning icon" />

          <Text variant="sm" weight="regular" color="primary" className="leading-2">
            You have {formatter.token(farmerBalanceSiloTokenAmount.toNumber(), siloToken)} {siloToken.name} not
            currently Deposited. Deposit them to earn yield when the Price of Pinto is greater than $1.
          </Text>
        </div>
      ) : (
        <div className="flex flex-col bg-pinto-off-white border p-4 rounded-[1rem] gap-y-2">
          <div className="flex flex-row gap-x-2 items-center">
            <Text variant="sm" weight="regular" color="primary" className="leading-2">
              You have {formatter.token(farmerBalanceSiloTokenAmount.toNumber(), siloToken)} {siloToken.name} not
              currently Deposited. Deposit them to earn yield or unwrap via the Pinto Exchange.
            </Text>
          </div>
          <Button variant="outline-white" className="flex gap-x-2" asChild>
            <Link
              to={`https://pinto.exchange/#/wells/${chainId}/${siloToken.address}/liquidity`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconImage src={pintoexchangelogo} size={6} alt="pintoexchangelogo" />
              <Text variant="sm" weight="medium" color="primary" className="leading-2">
                Unwrap via Pinto Exchange
              </Text>
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

interface ISiloTokenAbout extends IBaseSiloToken {
  price: TokenValue;
  siloData: ReturnType<typeof useSiloData>;
}

type SiloBDVs = {
  siloTVD: TokenValue;
  liquidityTVD: TokenValue;
};

const SiloTokenAbout = ({ siloToken, price, siloData }: ISiloTokenAbout) => {
  const seedGauge = useSeedGauge();
  const siloTokenData = siloData.tokenData.get(siloToken);
  const denomination = useDenomination();

  const { siloTVD, liquidityTVD } = [...siloData.tokenData.entries()].reduce<SiloBDVs>(
    (prev, [token, data]) => {
      const bdv = data.depositedBDV.add(data.germinatingBDV);

      prev.siloTVD = prev.siloTVD.add(bdv);
      if (token.isLP) {
        prev.liquidityTVD = prev.liquidityTVD.add(bdv);
      }
      return prev;
    },
    { siloTVD: TokenValue.ZERO, liquidityTVD: TokenValue.ZERO },
  );

  const depositedBDV = siloTokenData?.depositedBDV.add(siloTokenData?.germinatingBDV ?? TokenValue.ZERO);

  const gaugeData = seedGauge.data.gaugeData[getTokenIndex(siloToken)];
  const liquidityRatio = depositedBDV?.div(liquidityTVD.gt(0) ? liquidityTVD : TokenValue.ONE).mul(100);
  const optimalDepositedRatio = gaugeData?.optimalPctDepositedBdv;

  const tvdUSD = depositedBDV?.mul(price);
  const depositedRatio = depositedBDV?.div(siloTVD.gt(0) ? siloTVD : TokenValue.ONE).mul(100);

  return (
    <div className="flex w-full flex-col gap-8">
      <Text variant="h3" color="secondary">
        About {siloToken.name}
      </Text>
      <div className={`grid gap-8 w-full grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]`}>
        <div>
          <Text variant="sm-light" color="secondary">
            Total Value Deposited
          </Text>
          <Text variant="h4" className="pt-1">
            {denomination === "USD" ? formatter.usd(tvdUSD) : formatter.pdv(depositedBDV)}
          </Text>
        </div>
        <div>
          <Text variant="sm-light" color="secondary">
            % of Value Deposited
          </Text>
          <Text variant="h4" className="pt-1">
            {formatter.pct(depositedRatio)}
          </Text>
        </div>
        {siloToken.isLP ? (
          <div>
            <Text variant="sm-light" color="secondary">
              Current % of Dep. LP PDV
            </Text>
            <Text variant="h4" className="pt-1">
              {formatter.pct(liquidityRatio)}
            </Text>
          </div>
        ) : null}
        {siloToken.isLP ? (
          <div className="flex flex-col">
            <Text variant="sm-light" color="secondary">
              Optimal % of Dep. LP PDV
            </Text>
            <Text variant="h4" className="pt-1">
              {formatter.pct(optimalDepositedRatio)}
            </Text>
          </div>
        ) : null}
      </div>
      {siloToken.isLP && (
        <Text variant="body-light" color="lighter" className="leading-2">
          {siloToken.isLP
            ? `${siloToken.name} is a liquidity pool token on the Pinto Exchange. You can use a variety of input tokens to add liquidity and deposit the LP token in the Silo.`
            : `${siloToken.name} is the token that powers the ${siloToken.name} protocol.`}
        </Text>
      )}
      <Text variant="body" as={Link} to="/explorer/silo" className="text-pinto-green-4 hover:underline transition-all">
        See more data →
      </Text>
    </div>
  );
};

interface IFarmerSiloTokenDeposits extends IBaseSiloToken {
  farmerDeposits: TokenDepositData | undefined;
  price: TokenValue;
}

const FarmerSiloTokenDeposits = ({ siloToken, farmerDeposits, price }: IFarmerSiloTokenDeposits) => {
  const denomination = useDenomination();

  const stalkAmount = farmerDeposits?.stalk.total.sub(farmerDeposits?.stalk.germinating ?? TokenValue.ZERO);

  return (
    <div className="flex flex-row gap-16">
      <div className="flex flex-col gap-2">
        <Text variant="sm">My Deposits</Text>
        <div className="inline-flex gap-2 items-center">
          <IconImage src={siloToken.logoURI} size={9} alt={siloToken.name} />
          <Text variant="h3">
            {formatter.twoDec(farmerDeposits?.amount)} {siloToken.name}
          </Text>
        </div>
        <div className="flex flex-row items-center gap-x-1">
          <Text variant="body" weight="thin" color="secondary">
            {denomination === "USD"
              ? formatter.usd(farmerDeposits?.depositBDV.mul(price))
              : formatter.pdv(farmerDeposits?.depositBDV)}
          </Text>
          <DenominationSwitcher />
        </div>
      </div>
      <div className="inline-flex gap-8 items-center">
        <div className="flex flex-col gap-2">
          <Text variant="sm" color="secondary">
            My Stalk
          </Text>
          <div className="inline-flex flex-row items-center gap-1">
            <IconImage src={stalkIcon} size={6} alt="Stalk" />
            <Text variant="h4">{formatter.twoDec(stalkAmount)}</Text>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Text variant="sm" color="secondary">
            My Seeds
          </Text>
          <Text variant="h4" className="inline-flex items-center gap-1">
            <IconImage src={seedsIcon} size={6} alt="Seeds" />
            {formatter.twoDec(farmerDeposits?.seeds)}
          </Text>
        </div>
      </div>
    </div>
  );
};

const SiloTokenSubHeader = ({
  siloTokenData,
  apys,
}: { siloTokenData: SiloTokenData | undefined; apys: Partial<SiloTokenYield> | undefined }) => {
  const season = useSeason();
  const stalkRewards = siloTokenData?.rewards.stalk;
  const seedRewards = siloTokenData?.rewards.seeds;

  const ema24 = apys?.ema24;
  const ema168 = apys?.ema168;
  const ema720 = apys?.ema720;

  const stats = [
    {
      label: "24H:",
      value: ema24 ? formatter.pct(ema24 * 100) : "-",
      notApplicable: season <= 24,
    },
    {
      label: "7D:",
      value: ema168 ? formatter.pct(ema168 * 100) : "-",
      notApplicable: season <= 168,
    },
    {
      label: "30D:",
      value: ema720 ? formatter.pct(ema720 * 100) : "-",
      notApplicable: season <= 720,
    },
  ];

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col gap-2">
        <Text variant="sm">Current Deposit Rewards</Text>
        <div className="flex flex-row gap-3">
          <div className="inline-flex gap-1 items-center">
            <IconImage src={stalkIcon} size={6} alt="Stalk" />
            <Text variant="h4">{formatter.noDec(stalkRewards)} Stalk</Text>
          </div>
          <div className="inline-flex gap-1 items-center">
            <IconImage src={seedsIcon} size={6} alt="Seeds" />
            <Text variant="h4">{formatter.twoDec(seedRewards)} Seeds</Text>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-4 lg:gap-6">
        <Text variant="sm-light" color="green4" align="right" className={stats[0].notApplicable ? "opacity-50" : ""}>
          Variable APY
        </Text>
        <InlineStats variant="sm" stats={stats} />
      </div>
    </div>
  );
};

const SiloTokenHeader = ({ siloToken }: IBaseSiloToken) => {
  const config = useConfig();
  const chainId = useChainId();
  const currentChain = config.chains.find((chain) => chain.id === chainId);
  const blockExplorer = currentChain?.blockExplorers?.default.url ?? "https://basescan.org";

  return (
    <div className="flex flex-col w-full gap-6">
      <Button variant={"outline"} rounded="full" noPadding className="h-12 w-12">
        <Link to={"/silo"}>
          <img src={backArrowIcon} alt="go to previous page" />
        </Link>
      </Button>
      <div className="inline-flex items-center flex-wrap gap-3">
        <div className="inline-flex gap-3 items-center whitespace-nowrap">
          <IconImage src={siloToken?.logoURI} size={12} alt={siloToken?.name} />
          <Text variant="h1">{siloToken?.name}</Text>
        </div>
        <div className="inline-flex gap-2">
          <Button
            variant="outline"
            rounded="full"
            noPadding
            className="h-12 w-12"
            onClick={() => {
              navigator.clipboard.writeText(siloToken.address);
              toast.success("Address copied to clipboard");
            }}
          >
            <IconImage src={copyIcon} size={6} alt="copy address" />
          </Button>
          <Button asChild variant={"outline"} noPadding rounded="full" className="h-12 w-12">
            <Link
              to={`https://pinto.exchange/#/wells/${chainId}/${siloToken.address}`}
              target={"_blank"}
              className="text-pinto-gray-5 hover:cursor-pointer transition-all"
              rel="noreferrer"
            >
              <ExternalLinkIcon />
            </Link>
          </Button>
          <Button asChild variant={"outline"} rounded="full" noPadding className="h-12 w-12">
            <Link to={`${blockExplorer}/address/${siloToken.address}`} target={"_blank"} rel="noreferrer">
              <IconImage src={etherscanIcon} size={6} alt="go to basescan" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const SiloTokenWSOLWarningHeader = () => {
  return (
    <div className="flex flex-col bg-pinto-off-white border rounded-[1rem] p-4 gap-y-4">
      <Text variant="sm" weight="regular" color="primary" className="leading-2">
        WSOL liquidity on Base is limited, which may result in worse price execution if attempting to Deposit with any
        other token than WSOL. To avoid this, you can bridge SOL directly from the Solana network using the Portal
        Bridge.
      </Text>

      <Button variant="outline-white" className="gap-x-2" asChild>
        <Link to={"https://portalbridge.com"} target="_blank" rel="noopener noreferrer">
          <IconImage src={portalbridgelogo} size={6} alt="portal-bridge" />
          <Text variant="sm" weight="medium" color="primary" className="leading-2">
            Bridge WSOL through the Portal Bridge
          </Text>
        </Link>
      </Button>
    </div>
  );
};
