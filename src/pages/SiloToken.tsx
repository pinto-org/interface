import copyIcon from "@/assets/misc/Copy.svg";
import etherscanIcon from "@/assets/misc/Etherscan.png";
import backArrowIcon from "@/assets/misc/LeftArrow.svg";
import seedsIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import APYChip from "@/components/APYChip";
import { AddCoinsIcon, ExternalLinkIcon, LeftArrowIcon, RotateArrowIcon } from "@/components/Icons";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { usePriceData } from "@/state/usePriceData";
import { useSiloData } from "@/state/useSiloData";
import useTokenData from "@/state/useTokenData";
import { Link, useParams } from "react-router-dom";
import DepositsTable from "./silo/DepositsTable";
import SiloActions from "./silo/SiloActions";
import GerminationNotice from "./silo/GerminationNotice";
import { useChainId, useConfig } from "wagmi";

export default function SiloToken() {
  const config = useConfig();
  const chainId = useChainId();
  const currentChain = config.chains.find((chain) => chain.id === chainId);
  const blockExplorer = currentChain?.blockExplorers?.default.url ?? "https://basescan.org";

  const { tokenAddress } = useParams();
  const tokenData = useTokenData();
  const siloData = useSiloData();
  const priceData = usePriceData();
  const depositedBalances = useFarmerDepositedBalances();

  const siloToken = tokenData.whitelistedTokens.find(
    (token) => token.address.toLowerCase() === tokenAddress?.toLowerCase(),
  );
  const siloTokenData = siloToken ? siloData.tokenData.get(siloToken) : undefined;
  const farmerDeposits = siloToken ? depositedBalances.data.get(siloToken) : undefined;

  const siloTVD = [...siloData.tokenData]
    .map(([token, data]) => ({ token, data }))
    .reduce((total, siloData) => siloData.data.depositedBDV.add(total), TokenValue.ZERO);

  const liquidityTVD = [...siloData.tokenData]
    .map(([token, data]) => ({ token, data }))
    .reduce(
      (total, siloData) => (siloData.token.isLP ? TokenValue.ZERO : siloData.data.depositedBDV).add(total),
      TokenValue.ZERO,
    );

  if (!siloToken) {
    return <>404</>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-[80%] gap-14 items-start">
        <div className="flex flex-col w-[80%] gap-8">
          <Button asChild variant={"outline"} className="rounded-full -my-4 h-12 w-12 p-0">
            <Link to={"/silo"}>
              <img src={backArrowIcon} alt="go to previous page" />
            </Link>
          </Button>
          <div className="inline-flex items-center gap-3">
            <img src={siloToken?.logoURI} className="w-14 h-14" alt={siloToken?.name} />
            <span className="text-black font-[300] text-[3.5rem]">{siloToken?.name}</span>
            <div className="inline-flex gap-2">
              <Button
                variant={"outline"}
                className="rounded-full h-12 w-12 p-0"
                onClick={() => {
                  navigator.clipboard.writeText(siloToken.address);
                }}
              >
                <img src={copyIcon} alt="copy address" />
              </Button>
              <Button asChild variant={"outline"} className="rounded-full h-12 w-12 p-0">
                <Link
                  to={`https://pinto.exchange/#/wells/${siloToken.address}`}
                  target={"_blank"}
                  className="text-pinto-gray-5 hover:cursor-pointer transition-all"
                  rel="noreferrer"
                >
                  <ExternalLinkIcon />
                </Link>
              </Button>
              <Button variant={"outline"} className="rounded-full h-12 w-12 p-0">
                <Link to={`${blockExplorer}/address/${siloToken.address}`} target={"_blank"} rel="noreferrer">
                  <img src={etherscanIcon} alt="go to etherscan" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <div className="font-[400] text-[1rem] text-black">Current Deposit Rewards</div>
              <div className="flex flex-row gap-3">
                <div className="inline-flex gap-0.5 items-center">
                  <img src={stalkIcon} className="w-7 h-7" alt="Stalk" />
                  <div className="font-[400] text-[1.5rem] text-black">
                    {(siloTokenData ? siloTokenData.rewards.stalk.mul(1000000) : TokenValue.ZERO).toHuman("short")}{" "}
                    Stalk
                  </div>
                </div>
                <div className="inline-flex gap-0.5 items-center">
                  <img src={seedsIcon} className="w-7 h-7" alt="Seeds" />
                  <div className="font-[400] text-[1.5rem] text-black">
                    {(siloTokenData ? siloTokenData.rewards.seeds : TokenValue.ZERO).reDecimal(2).toHuman("short")}{" "}
                    Seeds
                  </div>
                </div>
              </div>
            </div>
            <APYChip apyValue={siloTokenData ? siloTokenData.yields.beanAPY : 0} />
          </div>
          <Separator />
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <div className="font-[400] text-[1rem] text-black">My Deposits</div>
              <div className="flex flex-row gap-3">
                <div className="flex flex-col">
                  <div className="inline-flex gap-2 items-center">
                    <img src={siloToken.logoURI} className="w-9 h-9" alt={siloToken.name} />
                    <div className="font-[400] text-[2rem] text-black">
                      {`${(farmerDeposits ? farmerDeposits.amount : TokenValue.ZERO).toHuman("short")} ${siloToken.name}`}
                    </div>
                  </div>
                  <div className="font-[300] text-[1.5rem] text-pinto-gray-4">
                    {`$${(farmerDeposits ? farmerDeposits.depositBDV : TokenValue.ZERO).mul(priceData.price).reDecimal(2).toHuman()}`}
                  </div>
                </div>
                <div className="inline-flex ml-24 gap-8 items-center">
                  <div className="flex flex-col">
                    <div className="text-[1rem] font-[400] text-pinto-gray-5">My Stalk</div>
                    <div className="inline-flex items-center gap-1">
                      <img src={stalkIcon} className="w-6 h-6" alt="Stalk" />
                      <div className="font-[400] text-[1.5rem] text-black">
                        {(siloTokenData
                          ? siloTokenData.tokenSettings.stalkIssuedPerBdv.mul(siloTokenData.depositedBDV)
                          : TokenValue.ZERO
                        )
                          .reDecimal(2)
                          .toHuman("short")}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[1rem] font-[400] text-pinto-gray-5">My Seeds</div>
                    <div className="inline-flex items-center gap-1">
                      <img src={seedsIcon} className="w-6 h-6" alt="Seeds" />
                      <div className="font-[400] text-[1.5rem] text-black">
                        {(farmerDeposits ? farmerDeposits.seeds : TokenValue.ZERO).reDecimal(2).toHuman("short")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DepositsTable token={siloToken} />
          <div className="flex flex-col gap-8">
            <div className="font-[400] text-[2rem] text-pinto-gray-5">About {siloToken.name}</div>
            <div className="flex flex-row items-center justify-start gap-28">
              <div className="flex flex-col">
                <div className="font-[400] text-[1rem] text-pinto-gray-5">Total Value Deposited</div>
                <div className="font-[400] text-[1.5rem] text-black">
                  $
                  {(siloTokenData ? siloTokenData.depositedBDV : TokenValue.ZERO).mul(priceData.price).toHuman("short")}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-[400] text-[1rem] text-pinto-gray-5">% of Value Deposited</div>
                <div className="font-[400] text-[1.5rem] text-black">
                  {`${(siloTokenData ? siloTokenData.depositedBDV : TokenValue.ZERO)
                    .div(siloTVD.gt(0) ? siloTVD : TokenValue.ONE)
                    .mul(100)
                    .toHuman("short")}%`}
                </div>
              </div>
              {siloToken.isLP && (
                <div className="flex flex-col">
                  <div className="font-[400] text-[1rem] text-pinto-gray-5">% of LP Deposits</div>
                  <div className="font-[400] text-[1.5rem] text-black">
                    {`${(siloTokenData ? siloTokenData.depositedBDV : TokenValue.ZERO)
                      .div(liquidityTVD.gt(0) ? liquidityTVD : TokenValue.ONE)
                      .mul(100)
                      .toHuman("short")}%`}
                  </div>
                </div>
              )}
              {siloToken.isLP && (
                <div className="flex flex-col">
                  <div className="font-[400] text-[1rem] text-pinto-gray-5">Target % of LP Deposits</div>
                  <div className="font-[400] text-[1.5rem] text-black">
                    {Number(
                      (siloTokenData
                        ? siloTokenData.tokenSettings.optimalPercentDepositedBdv
                        : TokenValue.ZERO
                      ).toHuman(),
                    ).toFixed(2)}
                    %
                  </div>
                </div>
              )}
            </div>
            <div className="font-[400] text-[1.25rem] text-pinto-gray-3">
              {siloToken.isLP
                ? `${siloToken.name} is a liquidity pool token on the Basin decentralized exchange. 
                            You can deposit ETH, DAI, USDC, XX, and your assets will be swapped and deposited into the liquidity pool
                            to provide liquidity for this pair.
                            `
                : `${siloToken.name} is the token that powers the ${siloToken.name} protocol.
                            `}
            </div>
            <div>
              <Link
                to={"/explorer"}
                className="font-[400] text-[1.25rem] text-pinto-green-2 hover:underline transition-all"
              >
                See More Data →
              </Link>
            </div>
          </div>
        </div>
        <div className="w-[500px] mt-32 flex flex-col gap-6">
          <div className="p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border">
            <SiloActions token={siloToken} />
          </div>
          {farmerDeposits?.deposits.map((farmerDeposit) => {
            if (farmerDeposit.isGerminating) {
              return <GerminationNotice deposit={farmerDeposit} />;
            }
          })}
          <div className="p-2 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border flex flex-col gap-2">
            <Button
              variant="ghost"
              className="px-2 hover:hover:bg-pinto-green w-full h-[2.5rem] rounded-[0.75rem] font-[400] text-[1.25rem] text-pinto-gray-5 hover:text-white flex flex-row justify-start gap-[0.625rem]"
            >
              <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
                <span className="self-center items-center">
                  <LeftArrowIcon color={"white"} height={16} width={16} />
                </span>
              </div>
              Send Deposits
            </Button>
            <Button
              variant="ghost"
              className="px-2 hover:hover:bg-pinto-green w-full h-[2.5rem] rounded-[0.75rem] font-[400] text-[1.25rem] text-pinto-gray-5 hover:text-white flex flex-row justify-start gap-[0.625rem]"
            >
              <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
                <span className="self-center items-center">
                  <RotateArrowIcon color={"white"} height={16} width={16} />
                </span>
              </div>
              Update Deposits
            </Button>
            <Button
              variant="ghost"
              className="px-2 hover:hover:bg-pinto-green w-full h-[2.5rem] rounded-[0.75rem] font-[400] text-[1.25rem] text-pinto-gray-5 hover:text-white flex flex-row justify-start gap-[0.625rem]"
            >
              <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
                <span className="self-center items-center">
                  <AddCoinsIcon color={"white"} height={16} width={16} />
                </span>
              </div>
              Collect Grown Stalk
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
