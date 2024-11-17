import copyIcon from "@/assets/misc/Copy.svg";
import etherscanIcon from "@/assets/misc/Etherscan.png";
import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import APYChip from "@/components/APYChip";
import { ExternalLinkIcon } from "@/components/Icons";
import SiloActionBox from "@/components/SiloActionBox";
import { Button } from "@/components/ui/Button";
import DenominationSwitcher from "@/components/ui/DenominationSwitcher";
import IconImage from "@/components/ui/IconImage";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { usePriceData } from "@/state/usePriceData";
import { useSeedGauge } from "@/state/useSeedGauge";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { SiloTokenData, Token, TokenDepositData } from "@/utils/types";
import { Link, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useChainId, useConfig } from "wagmi";
import DepositsTable from "../components/DepositsTable";
import GerminationNotice from "./silo/GerminationNotice";
import SiloActions from "./silo/SiloActions";

export default function SiloToken() {
  const { tokenAddress } = useParams();
  const tokenData = useTokenData();
  const siloData = useSiloData();
  const priceData = usePriceData();
  const depositedBalances = useFarmerSiloNew().deposits;

  const siloToken = tokenData.whitelistedTokens.find((token) => stringEq(token.address, tokenAddress ?? ""));
  const siloTokenData = siloToken ? siloData.tokenData.get(siloToken) : undefined;
  const farmerDeposits = siloToken ? depositedBalances.get(siloToken) : undefined;

  if (!siloToken) {
    return <>404</>;
  }

  return (
    // Add pt-4 to container b/c backbutton overflows to the top for some reason.
    <PageContainer variant="xl">
      <div className="flex flex-col gap-8 justify-start">
        <SiloTokenHeader siloToken={siloToken} />
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex flex-col items-center flex-shrink-1 w-full">
            <div className="flex flex-col w-full gap-14 items-start">
              <div className="flex flex-col w-full gap-6">
                <SiloTokenSubHeader siloTokenData={siloTokenData} />
                {siloToken.name === "PINTOWSOL LP" && <SiloTokenWSOLWarningHeader />}
                <Separator />
                <div className="pt-6">
                  <FarmerSiloTokenDeposits
                    siloToken={siloToken}
                    farmerDeposits={farmerDeposits}
                    price={priceData.price}
                  />
                </div>
              </div>
              <div className="w-full border border-pinto-gray-2 rounded-[1rem] overflow-clip">
                <DepositsTable token={siloToken} />
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
      <div className="p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border">
        <SiloActions token={siloToken} />
      </div>
      {farmerDeposits?.deposits.map((farmerDeposit) => {
        if (farmerDeposit.isGerminating) {
          return <GerminationNotice deposit={farmerDeposit} />;
        }
        return null;
      })}
      <SiloActionBox farmerDeposits={farmerDeposits} />
    </div>
  );
};

interface ISiloTokenAbout extends IBaseSiloToken {
  price: TokenValue;
  siloData: ReturnType<typeof useSiloData>;
}

const SiloTokenAbout = ({ siloToken, price, siloData }: ISiloTokenAbout) => {
  const seedGauge = useSeedGauge();
  const siloTokenData = siloData.tokenData.get(siloToken);

  const siloTVD = [...siloData.tokenData]
    .map(([token, data]) => ({ token, data }))
    .reduce((total, siloData) => siloData.data.depositedBDV.add(total), TokenValue.ZERO);

  const liquidityTVD = [...siloData.tokenData]
    .map(([token, data]) => ({ token, data }))
    .reduce(
      (total, siloData) => (siloData.token.isLP ? TokenValue.ZERO : siloData.data.depositedBDV).add(total),
      TokenValue.ZERO,
    );

  const gaugeData = seedGauge.data.gaugeData[getTokenIndex(siloToken)];
  const liquidityRatio = siloTokenData?.depositedBDV.div(liquidityTVD.gt(0) ? liquidityTVD : TokenValue.ONE);
  const optimalDepositedRatio = gaugeData?.optimalPctDepositedBdv;

  const depositedBDV = siloTokenData?.depositedBDV;
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
            {formatter.usd(tvdUSD)}
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
            {formatter.usd(farmerDeposits?.depositBDV.mul(price))}
          </Text>
          <DenominationSwitcher />
        </div>
      </div>
      <div className="inline-flex gap-8 items-center">
        <div className="flex flex-col gap-2">
          <Text variant="sm" color="secondary">
            My Stalk
          </Text>
            <div  className="inline-flex flex-row items-center gap-1">
            <IconImage src={stalkIcon} size={6} alt="Stalk" />
            <Text variant="h4">
              {formatter.twoDec(farmerDeposits?.stalk.total)}
            </Text>
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

const SiloTokenSubHeader = ({ siloTokenData }: { siloTokenData: SiloTokenData | undefined }) => {
  const stalkRewards = siloTokenData?.rewards.stalk;
  const seedRewards = siloTokenData?.rewards.seeds;

  return (
    <>
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col gap-2">
        <Text variant="sm">Current Deposit Rewards</Text>
        <div className="flex flex-row gap-3">
          <div className="inline-flex gap-1 items-center">
            <IconImage src={stalkIcon} size={6} alt="Stalk" />
            <Text variant="h4">{formatter.twoDec(stalkRewards)} Stalk</Text>
          </div>
          <div className="inline-flex gap-1 items-center">
            <IconImage src={seedsIcon} size={6} alt="Seeds" />
            <Text variant="h4">{formatter.twoDec(seedRewards)} Seeds</Text>
          </div>
        </div>
      </div>
      <APYChip apyValue={siloTokenData ? siloTokenData.yields.beanAPY : 0} />
    </div>
    </>
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
    <div className="bg-white border rounded-[0.75rem] p-4 rounded-md">
      <Text variant="body" weight="thin" color="primary" className="leading-2">WSOL liquidity on Base is limited, which may result in worse price execution if attempting to Deposit with any other token than WSOL. To avoid this, you can bridge SOL directly from the Solana network using the <a href="https://portalbridge.com/" style={{ color: "#387F5C"}}>Portal Bridge</a>.</Text>
    </div>
  )
};