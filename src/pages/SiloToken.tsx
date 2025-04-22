import copyIcon from "@/assets/misc/Copy.svg";
import etherscanIcon from "@/assets/misc/Etherscan.png";
import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import pintoexchangelogo from "@/assets/misc/pinto-exchange-logo.svg";
import portalbridgelogo from "@/assets/misc/portal-bridge-logo.svg";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import APYTooltip from "@/components/APYTooltip";
import DepositsTable from "@/components/DepositsTable";
import GerminationNotice from "@/components/GerminationNotice";
import { ExternalLinkIcon } from "@/components/Icons";
import InlineStats from "@/components/InlineStats";
import MobileActionBar from "@/components/MobileActionBar";
import PageMetaWrapper from "@/components/PageMetaWrapper";
import SiloActionBox from "@/components/SiloActionBox";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import DenominationSwitcher from "@/components/ui/DenominationSwitcher";
import IconImage from "@/components/ui/IconImage";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import META, { MetaSlug } from "@/constants/meta";
import { S_MAIN_TOKEN } from "@/constants/tokens";
import useIsMobile from "@/hooks/display/useIsMobile";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useDenomination } from "@/hooks/useAppSettings";
import { useChainConstant } from "@/hooks/useChainConstant";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useSeedGauge } from "@/state/useSeedGauge";
import { SiloTokenYield, useSiloTokenAPYs } from "@/state/useSiloAPYs";
import { useSiloData } from "@/state/useSiloData";
import { useSeason } from "@/state/useSunData";
import { formatter } from "@/utils/format";
import { stringEq } from "@/utils/string";
import { getTokenIndex } from "@/utils/token";
import { SiloTokenData, Token, TokenDepositData } from "@/utils/types";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useChainId, useConfig } from "wagmi";
import SiloWrappedSiloToken from "./SiloWrappedSiloToken";
import SiloActions from "./silo/SiloActions";
import SiloTokenPageHeader, { SiloTokenPageSubHeader } from "./siloToken/SiloTokenPageHeader";

function SiloTokenInner({ siloToken }: { siloToken: Token }) {
  const { tokenAddress } = useParams();
  const [params] = useSearchParams();
  const currentAction = params.get("action");

  const siloData = useSiloData();
  const priceData = usePriceData();
  const pool = priceData.pools.find((poolData) => stringEq(poolData.pool.address, tokenAddress));
  const poolPrice = pool?.price ?? TokenValue.ZERO;

  // we need to get the priceData for the current well
  const apysQuery = useSiloTokenAPYs(tokenAddress);
  const depositedBalances = useFarmerSilo().deposits;
  const farmerBalances = useFarmerBalances();

  const siloTokenData = siloData.tokenData.get(siloToken);
  const farmerDeposits = depositedBalances.get(siloToken);

  const isMain = Boolean(siloToken?.isMain);
  const isMobile = useIsMobile();

  const navigate = useNavigate();

  const farmerBalanceSiloTokenAmount: TokenValue = farmerBalances.balances.get(siloToken)?.total ?? TokenValue.ZERO;

  return (
    // Add pt-4 to container b/c backbutton overflows to the top for some reason.
    <PageContainer variant="xlAlt" bottomMarginOnMobile>
      <div className="flex flex-col gap-4 sm:gap-8 justify-start">
        {(!isMobile || (!currentAction && isMobile)) && <SiloTokenPageHeader token={siloToken} isMobile={isMobile} />}
        <div className="flex flex-col lg:flex-row gap-9 sm:gap-16">
          <div className="flex flex-col items-center flex-shrink-1 w-full">
            <div className="flex flex-col w-full gap-12 sm:gap-14 items-start">
              <div className="flex flex-col w-full gap-6">
                {(!isMobile || (!currentAction && isMobile)) && (
                  <>
                    <SiloTokenPageSubHeader siloTokenData={siloTokenData} apys={apysQuery.data} isMobile={isMobile} />
                    <Separator />
                  </>
                )}
                <div className="pt-0 sm:pt-8">
                  {currentAction && isMobile && (
                    <Button variant={"outline"} rounded="full" noPadding className="h-9 w-9 sm:h-12 sm:w-12 mb-4">
                      <Link to={`/silo/${siloToken.address}`}>
                        <img src={backArrowIcon} alt="go to previous page" className="h-6 w-6 sm:h-8 sm:w-8" />
                      </Link>
                    </Button>
                  )}
                  <FarmerSiloTokenDeposits
                    siloToken={siloToken}
                    farmerDeposits={farmerDeposits}
                    isMobile={isMobile}
                    price={siloToken.isMain ? priceData.price : poolPrice}
                  />
                </div>
              </div>
              {(!isMobile || (!currentAction && isMobile)) && (
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
              )}
              {(!isMobile || (!currentAction && isMobile)) && (
                <SiloTokenAbout
                  siloToken={siloToken}
                  price={siloToken.isMain ? priceData.price : poolPrice}
                  siloData={siloData}
                />
              )}
            </div>
          </div>
          {(!isMobile || (currentAction && isMobile)) && (
            <div className="w-full lg:max-w-[384px] 3xl:max-w-[518px] 3xl:min-w-[425px] lg:-mt-2s mb-14 sm:mb-0">
              <SiloTokenActions siloToken={siloToken} farmerDeposits={farmerDeposits} />
            </div>
          )}
          {!currentAction && (
            <MobileActionBar>
              <Button
                onClick={() => navigate(`/silo/${siloToken.address}?action=withdraw`)}
                rounded={"full"}
                variant={"outline-secondary"}
                className="pinto-sm-bold text-sm flex-1 flex h-full"
              >
                Withdraw
              </Button>
              <Button
                onClick={() => navigate(`/silo/${siloToken.address}?action=convert`)}
                rounded={"full"}
                variant={"outline-secondary"}
                className="pinto-sm-bold text-sm flex-1 flex h-full"
              >
                Convert
              </Button>
              <Button
                onClick={() => navigate(`/silo/${siloToken.address}?action=deposit`)}
                rounded={"full"}
                className="pinto-sm-bold text-sm flex-1 flex h-full"
              >
                Deposit
              </Button>
            </MobileActionBar>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default function SiloToken() {
  const { tokenAddress } = useParams();
  const navigate = useNavigate();
  const tokens = useTokenMap();
  const wrappedMain = useChainConstant(S_MAIN_TOKEN);

  const location = window.location.pathname;
  const isWrap = location === "/wrap";

  const siloToken = tokens[getTokenIndex(isWrap ? wrappedMain : tokenAddress ?? "")];

  useEffect(() => {
    if (!siloToken || siloToken.is3PSiloWrapped) {
      navigate("/404");
    }
  }, [siloToken]);

  if (!siloToken || siloToken.is3PSiloWrapped) {
    return null;
  }

  return (
    <PageMetaWrapper metaKey={siloToken.isSiloWrapped ? "wrap" : (siloToken.symbol as MetaSlug)}>
      {siloToken.isSiloWrapped ? <SiloWrappedSiloToken token={siloToken} /> : <SiloTokenInner siloToken={siloToken} />}
    </PageMetaWrapper>
  );
}

interface IBaseSiloToken {
  siloToken: Token;
  isMobile?: boolean;
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
      <SiloActionBox farmerDeposits={farmerDeposits} token={siloToken} />
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

          <div className="pinto-sm font-regular text-pinto-primary leading-2">
            You have {formatter.token(farmerBalanceSiloTokenAmount.toNumber(), siloToken)} {siloToken.name} not
            currently Deposited. Deposit them to earn yield when the Price of Pinto is greater than $1.
          </div>
        </div>
      ) : (
        <div className="flex flex-col bg-pinto-off-white border p-4 rounded-[1rem] gap-y-2">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="pinto-sm font-regular text-pinto-primary leading-2">
              You have {formatter.token(farmerBalanceSiloTokenAmount.toNumber(), siloToken)} {siloToken.name} not
              currently Deposited. Deposit them to earn yield or unwrap via the Pinto Exchange.
            </div>
          </div>
          <Button variant="outline-white" className="flex gap-x-2" asChild>
            <Link
              to={`https://pinto.exchange/#/wells/${chainId}/${siloToken.address}/liquidity`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconImage src={pintoexchangelogo} size={6} alt="pintoexchangelogo" />
              <div className="pinto-sm font-medium text-pinto-primary leading-2">Unwrap via Pinto Exchange</div>
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
      <div className="pinto-h3 text-pinto-secondary">About {siloToken.name}</div>
      <div
        className={`grid gap-8 w-full grid-rows-2 grid-cols-2 sm:grid-rows-1 sm:grid-cols-0 sm:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]`}
      >
        <div>
          <div className="pinto-sm-light font-thin sm:font-light text-pinto-secondary">Total Value Deposited</div>
          <div className="pinto-body sm:pinto-h4 pt-1">
            {denomination === "USD" ? formatter.usd(tvdUSD) : formatter.pdv(depositedBDV)}
          </div>
        </div>
        <div>
          <div className="pinto-sm-light font-thin sm:font-light text-pinto-secondary text-right sm:text-start">
            % of Value Deposited
          </div>
          <div className="pinto-body sm:pinto-h4 pt-1 text-right sm:text-start">{formatter.pct(depositedRatio)}</div>
        </div>
        {siloToken.isLP ? (
          <div>
            <div className="pinto-sm-light font-thin sm:font-light text-pinto-secondary">Current % of Dep. LP PDV</div>
            <div className="pinto-body sm:pinto-h4 pt-1">{formatter.pct(liquidityRatio)}</div>
          </div>
        ) : null}
        {siloToken.isLP ? (
          <div className="flex flex-col">
            <div className="pinto-sm-light font-thin sm:font-light text-pinto-secondary text-right sm:text-start">
              Optimal % of Dep. LP PDV
            </div>
            <div className="pinto-body sm:pinto-h4 pt-1 text-right sm:text-start">
              {formatter.pct(optimalDepositedRatio)}
            </div>
          </div>
        ) : null}
      </div>
      {siloToken.isLP && (
        <div className="pinto-sm-light sm:pinto-body-light font-thin sm:font-light text-pinto-lighter sm:text-pinto-lighter leading-2">
          {siloToken.isLP
            ? `${siloToken.name} is a liquidity pool token on the Pinto Exchange. You can use a variety of input tokens to add liquidity and deposit the LP token in the Silo.`
            : `${siloToken.name} is the token that powers the ${siloToken.name} protocol.`}
        </div>
      )}
      <Link to="/explorer/silo" className="pinto-body text-pinto-green-4 hover:underline transition-all">
        See more data →
      </Link>
    </div>
  );
};

interface IFarmerSiloTokenDeposits extends IBaseSiloToken {
  farmerDeposits: TokenDepositData | undefined;
  price: TokenValue;
}

const FarmerSiloTokenDeposits = ({ siloToken, farmerDeposits, price, isMobile }: IFarmerSiloTokenDeposits) => {
  const denomination = useDenomination();

  const stalkAmount = farmerDeposits?.stalk.total.sub(farmerDeposits?.stalk.germinating ?? TokenValue.ZERO);
  const hasGerminating = farmerDeposits?.stalk.germinating.gt(0);
  const hasOnlyGerminating = stalkAmount?.eq(0) && hasGerminating;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
      <div className="flex flex-col gap-2">
        <div className="pinto-sm font-thin sm:font-regular">My Deposits</div>
        <div className="inline-flex items-center gap-2">
          <IconImage src={siloToken.logoURI} size={isMobile ? 8 : 9} alt={siloToken.name} />
          <div className="pinto-h4 sm:pinto-h3">
            {formatter.token(farmerDeposits?.amount, siloToken)} {siloToken.name}
          </div>
        </div>
        <div className="flex flex-row items-center gap-x-1 -mt-1 sm:mt-0">
          <div className="pinto-body font-thin sm:font-regular text-pinto-secondary">
            {denomination === "USD"
              ? formatter.usd(farmerDeposits?.currentBDV.mul(price))
              : formatter.pdv(farmerDeposits?.depositBDV)}
          </div>
          <DenominationSwitcher />
        </div>
      </div>
      <div className="inline-flex gap-8 items-center">
        <div className="flex flex-col gap-2">
          <div className="pinto-sm font-thin sm:font-regular text-pinto-secondary sm:text-pinto-secondary">
            My Stalk
          </div>
          <div className="inline-flex flex-row gap-1">
            <IconImage src={stalkIcon} size={6} alt="Stalk" />
            {hasOnlyGerminating ? (
              <TooltipSimple content={"This Stalk is germinating."}>
                <div className="pinto-h4 font-thin sm:font-regular text-pinto-off-green/60">
                  {formatter.twoDec(farmerDeposits?.stalk.total)}
                </div>
              </TooltipSimple>
            ) : (
              <div className="pinto-h4 font-thin sm:font-regular">{formatter.twoDec(stalkAmount)}</div>
            )}
            {!hasOnlyGerminating && hasGerminating && (
              <TooltipSimple content={"This Stalk is germinating."}>
                <div className="pinto-h4 font-thin sm:font-regular text-pinto-off-green/60">
                  +{formatter.twoDec(farmerDeposits?.stalk.germinating)}
                </div>
              </TooltipSimple>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="pinto-sm font-thin sm:font-regular text-pinto-secondary sm:text-pinto-secondary">
            My Seeds
          </div>
          <div className="pinto-h4 font-thin sm:font-regular inline-flex gap-1">
            <IconImage src={seedsIcon} size={6} alt="Seeds" />
            {formatter.twoDec(farmerDeposits?.seeds)}
          </div>
        </div>
      </div>
    </div>
  );
};

const SiloTokenWSOLWarningHeader = () => {
  return (
    <div className="flex flex-col bg-pinto-off-white border rounded-[1rem] p-3 sm:p-4 gap-y-4 -mt-6 sm:mt-0">
      <div className="pinto-sm font-regular text-pinto-primary leading-2">
        WSOL liquidity on Base is limited, which may result in worse price execution if attempting to Deposit with any
        other token than WSOL. To avoid this, you can bridge SOL directly from the Solana network using the Portal
        Bridge.
      </div>

      <Button variant="outline-white" className="gap-x-2 w-full sm:w-auto" asChild>
        <Link to={"https://portalbridge.com"} target="_blank" rel="noopener noreferrer">
          <IconImage src={portalbridgelogo} size={6} alt="portal-bridge" />
          <div className="pinto-sm font-medium text-pinto-primary leading-2">Bridge WSOL through Portal Bridge</div>
        </Link>
      </Button>
    </div>
  );
};
