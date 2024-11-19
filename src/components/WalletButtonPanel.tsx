import { TokenValue } from "@/classes/TokenValue";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { useFarmerSiloNew } from "@/state/useFarmerSiloNew";
import { usePriceData } from "@/state/usePriceData";
import { formatter } from "@/utils/format";
import { isDev } from "@/utils/utils";
import { ENABLE_SWITCH_CHAINS } from "@/utils/wagmi/chains";
import { Avatar } from "connectkit";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import ChainButton from "./ChainButton";
import DonutChart from "./DonutChart";
import { BackwardArrowDotsIcon, ChevronDownIcon, CloseIcon, LeftArrowIcon, UpDownArrowsIcon } from "./Icons";
import NoBaseValueAlert from "./NoBaseValueAlert";
import WalletButtonClaim from "./WalletButtonClaim";
import WalletButtonTransfer from "./WalletButtonTransfer";
import { Button } from "./ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/Card";
import { Separator } from "./ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import Text from "./ui/Text";
import { Toggle } from "./ui/Toggle";

export default function WalletButtonPanel({
  isOpen = false,
  togglePanel,
  showClaim,
  setShowClaim,
}: {
  isOpen: boolean;
  togglePanel: () => void;
  showClaim: boolean;
  setShowClaim: Dispatch<SetStateAction<boolean>>;
}) {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName as string });
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  const farmerBalances = useFarmerBalances();
  const priceData = usePriceData();
  const farmerSilo = useFarmerSiloNew();

  const totalFlood = farmerSilo.flood.farmerSops.reduce(
    (total, sopData) => total.add(sopData.wellsPlenty.plenty),
    TokenValue.ZERO,
  );

  const totalBalance = Array.from(farmerBalances.balances).reduce(
    (totalBalance, tokenBalance) => {
      const price = priceData.tokenPrices.get(tokenBalance[0])?.instant || 0;
      const internalValue = tokenBalance[1].internal.mul(price).add(totalBalance.internal);
      const externalValue = tokenBalance[1].external.mul(price).add(totalBalance.external);
      const totalValue = tokenBalance[1].total.mul(price).add(totalBalance.total);
      return {
        internal: internalValue,
        external: externalValue,
        total: totalValue,
      };
    },
    {
      internal: TokenValue.ZERO,
      external: TokenValue.ZERO,
      total: TokenValue.ZERO,
    },
  );

  const [showTransfer, setShowTransfer] = useState(false);

  return (
    <Card
      className={`absolute top-[3.5rem] flex flex-col bg-white transition-all ${isOpen ? "right-[0rem]" : "-right-[42rem]"} w-[38rem] overflow-clip h-[calc(100vh-6rem)] z-[51]`}
    >
      {address && (
        <button
          type="button"
          onClick={() => {
            disconnect();
            togglePanel();
          }}
          className="absolute top-4 right-4 flex justify-center items-center px-3 py-2 gap-1 w-[181px] h-[34px] bg-[#F8F8F8] rounded-full font-['Pinto'] font-[400] text-base leading-[110%] text-black hover:hover:bg-pinto-green hover:text-white"
        >
          <span>Disconnect Wallet</span>
          <span className="w-4 h-4">×</span>
        </button>
      )}
      {!showTransfer ? (
        <>
          <CardHeader className="flex flex-col gap-4 p-6 pb-10">
            <div className="flex flex-row gap-1">
              {ensAvatar && <Avatar address={address} size={24} />}
              <span className="font-[400] text-[1rem] text-pinto-gray-5">
                {ensName ? ensName : address ? `${address.substring(0, 7)}...${address.substring(38, 42)}` : ""}
              </span>
            </div>
            <span className="font-[300] text-[3.425rem] text-pinto-gray-5 leading-none">
              {formatter.usd(totalBalance.total)}
            </span>
            <div className="flex flex-col gap-2">
              <div className="font-[340] text-[1rem] text-pinto-gray-4 inline-flex gap-1 items-center leading-none">
                <div className="rounded-full bg-pinto w-3 h-3" />
                <div>Wallet Balance:</div>
                <div className="text-pinto-gray-5">{formatter.usd(totalBalance.external)}</div>
              </div>
              <div className="font-[340] text-[1rem] text-pinto-gray-4 inline-flex gap-1 items-center leading-none">
                <div className="rounded-full bg-pinto-morning-yellow-1 w-3 h-3" />
                <div>Farm Balance:</div>
                <div className="text-pinto-gray-5">{formatter.usd(totalBalance.internal)}</div>
              </div>
            </div>
            <div className="flex flex-row gap-3 w-full">
              <Button
                onClick={() => {
                  navigate("/market");
                  togglePanel();
                }}
                variant="ghost"
                className="bg-pinto-gray-1 hover:hover:bg-pinto-green flex-1 h-[6.375rem] rounded-[1rem] font-[400] text-[1rem] text-pinto-gray-5 hover:text-white flex flex-col gap-4"
              >
                <div className="rounded-full bg-pinto-green h-9 w-9 flex justify-evenly">
                  <span className="self-center items-center">
                    <UpDownArrowsIcon color={"white"} />
                  </span>
                </div>
                Swap
              </Button>
              <Button
                onClick={() => {
                  navigate("/transfer");
                  togglePanel();
                }}
                variant="ghost"
                className="bg-pinto-gray-1 hover:hover:bg-pinto-green flex-1 h-[6.375rem] rounded-[1rem] font-[400] text-[1rem] text-pinto-gray-5 hover:text-white flex flex-col gap-4"
              >
                <div className="rounded-full bg-pinto-green h-9 w-9 flex justify-evenly">
                  <span className="self-center items-center">
                    <LeftArrowIcon color={"white"} />
                  </span>
                </div>
                Send
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 -mt-4 pb-0">
            <Separator className="w-[38rem] -ml-4" />
            <div className="pt-6 px-3 pb-0">
              <Tabs defaultValue="combined" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-11 py-0 px-1 gap-[0.75rem]">
                  <TabsTrigger className="h-9 text-[1rem] hover:bg-pinto-gray-1" value="combined">
                    Combined
                  </TabsTrigger>
                  <TabsTrigger className="h-9 text-[1rem] hover:bg-pinto-gray-1" value="external">
                    Wallet Balance
                  </TabsTrigger>
                  <TabsTrigger className="h-9 text-[1rem] hover:bg-pinto-gray-1" value="internal">
                    Farm Balance
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="combined"
                  className="overflow-y-auto overflow-x-clip max-h-[calc(100vh-39rem)] -mx-4 px-4"
                >
                  {totalBalance.total.eq(0) ? (
                    <div className="flex flex-grow gap-1 flex-col items-center text-center min-h-[calc(100vh-39rem)] justify-center">
                      <span>
                        You don’t have any value in your Wallet or Farm Balance, Bridge value to Base to get started.
                      </span>
                    </div>
                  ) : (
                    <div className={"mt-4 -mx-4"}>
                      {Array.from(farmerBalances.balances).map((tokenBalance) => {
                        const [token, balances] = tokenBalance;
                        const price = priceData.tokenPrices.get(token)?.instant || TokenValue.ZERO;
                        if (balances.total.eq(0)) return;
                        return (
                          <Toggle
                            key={`${token.address}_totalBalance`}
                            className="flex flex-row w-full gap-4 group overflow-hidden transition-all hover:bg-pinto-gray-1 hover:cursor-pointer data-[state=on]:bg-white data-[state=on]:hover:bg-pinto-gray-1 data-[state=off]:hover:bg-pinto-gray-1 data-[state=off]:bg-white rounded-[0.75rem] h-auto px-4 py-2 items-start"
                          >
                            <div className="w-12 h-12 flex-shrink-0">
                              <img
                                src={token.logoURI}
                                alt={`${token.symbol} token logo`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-col text-left gap-2 my-1">
                                  <span className="text-[1.25rem] text-pinto-gray-5">{token.symbol}</span>
                                  <span className="font-[340] transition-all group-hover:text-pinto-green text-pinto-gray-4 inline-flex gap-1 items-center">
                                    <div className="relative">
                                      <DonutChart
                                        data={{
                                          labels: ["Farm Balance", "Wallet Balance"],
                                          datasets: [
                                            {
                                              label: "",
                                              data: token.isNative
                                                ? [0, Number(balances.external)]
                                                : [Number(balances.internal), Number(balances.external)],
                                              backgroundColor: ["rgb(254, 225, 140)", "rgb(36, 102, 69)"],
                                              borderWidth: 0,
                                            },
                                          ],
                                        }}
                                      />
                                    </div>
                                    <Text
                                      variant="sm"
                                      color="light"
                                    >{`${balances.total.toHuman("short")} ${token.symbol}`}</Text>
                                    <ChevronDownIcon
                                      color={"currentColor"}
                                      className={"transform transition-transform group-data-[state=on]:-scale-y-100"}
                                    />
                                  </span>
                                </div>
                                <span className="text-[1.5rem] font-[500] text-pinto-gray-5">
                                  {formatter.usd(balances.total.mul(price))}
                                </span>
                              </div>
                              <div className="h-0 opacity-0 group-data-[state=on]:h-auto group-data-[state=on]:opacity-100 transition-all duration-200">
                                <div className="flex flex-col gap-1 py-2">
                                  <div className="font-[340] text-[1rem] text-pinto-gray-4 flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                      <div className="rounded-full bg-pinto w-3 h-3 flex-shrink-0" />
                                      <div>Wallet Balance</div>
                                    </div>
                                    <div>{`${balances.external.toHuman("short")} ${token.symbol}`}</div>
                                  </div>
                                  {token.symbol !== "ETH" && (
                                    <div className="font-[340] text-[1rem] text-pinto-gray-4 flex justify-between items-center">
                                      <div className="flex items-center gap-1">
                                        <div className="rounded-full bg-pinto-morning-yellow-1 w-3 h-3 flex-shrink-0" />
                                        <div>Farm Balance</div>
                                      </div>
                                      <div>{`${balances.internal.toHuman("short")} ${token.symbol}`}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Toggle>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
                <TabsContent
                  value="external"
                  className="overflow-y-auto overflow-x-clip max-h-[calc(100vh-39rem)] -mx-4 px-4"
                >
                  {totalBalance.external.eq(0) ? (
                    <div className="flex flex-grow gap-1 flex-col items-center text-center min-h-[calc(100vh-39rem)] justify-center">
                      <span>You don’t have any value in your Wallet Balance, Bridge value to Base to get started.</span>
                    </div>
                  ) : (
                    <div className="mt-4 -mx-4">
                      {Array.from(farmerBalances.balances).map((tokenBalance) => {
                        const [token, balances] = tokenBalance;
                        const price = priceData.tokenPrices.get(token)?.instant || TokenValue.ZERO;
                        if (balances.external.eq(0)) return;
                        return (
                          <Toggle
                            key={`${token.address}_externalBalance`}
                            className="flex flex-row w-full gap-4 overflow-hidden transition-all hover:cursor-default hover:bg-pinto-gray-1 data-[state=on]:bg-white data-[state=off]:bg-white rounded-[0.75rem] h-auto px-4 py-2 items-start"
                          >
                            <div className="w-12 h-12 flex-shrink-0">
                              <img
                                src={token.logoURI}
                                alt={`${token.symbol} token logo`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex flex-col w-full transition-all">
                              <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-col text-left gap-2 my-1">
                                  <span className="text-[1.25rem] text-pinto-gray-5">{token.symbol}</span>
                                  <span className="font-[340] transition-all text-pinto-gray-4 inline-flex gap-1 items-center">
                                    {`${balances.external.toHuman("short")} ${token.symbol}`}
                                  </span>
                                </div>
                                <span className="text-[1.5rem] font-[500] text-pinto-gray-5">
                                  {formatter.usd(balances.external.mul(price))}
                                </span>
                              </div>
                            </div>
                          </Toggle>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
                <TabsContent
                  value="internal"
                  className="overflow-y-auto overflow-x-clip max-h-[calc(100vh-39rem)] -mx-4 px-4"
                >
                  {totalBalance.internal.eq(0) ? (
                    <div className="flex flex-grow gap-1 flex-col items-center text-center min-h-[calc(100vh-39rem)] justify-center">
                      <span>You don’t have any value in your Farm Balance.</span>
                      <span>
                        Your Farm Balance allows you store tokens in the protocol directly for usage in the Silo, Field
                        and Market.
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 -mx-4">
                      {Array.from(farmerBalances.balances).map((tokenBalance) => {
                        const [token, balances] = tokenBalance;
                        const price = priceData.tokenPrices.get(token)?.instant || TokenValue.ZERO;
                        if (balances.internal.eq(0)) return;
                        return (
                          <Toggle
                            key={`${token.address}_externalBalance`}
                            className="flex flex-row w-full gap-4 overflow-hidden transition-all hover:cursor-default hover:bg-pinto-gray-1 data-[state=on]:bg-white data-[state=off]:bg-white rounded-[0.75rem] h-auto px-4 py-2 items-start"
                          >
                            <div className="w-12 h-12 flex-shrink-0">
                              <img
                                src={token.logoURI}
                                alt={`${token.symbol} token logo`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex flex-col w-full transition-all">
                              <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-col text-left gap-2 my-1">
                                  <span className="text-[1.25rem] text-pinto-gray-5">{token.symbol}</span>
                                  <span className="font-[340] transition-all text-pinto-gray-4 inline-flex gap-1 items-center">
                                    {`${balances.internal.toHuman("short")} ${token.symbol}`}
                                  </span>
                                </div>
                                <span className="text-[1.5rem] font-[500] text-pinto-gray-5">
                                  {formatter.usd(balances.internal.mul(price))}
                                </span>
                              </div>
                            </div>
                          </Toggle>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="absolute bottom-0 mx-auto left-0 right-0 text-center justify-center flex flex-col gap-4">
            {ENABLE_SWITCH_CHAINS && <ChainButton />}
            <Button variant="default" onClick={() => setShowTransfer(true)} className={`rounded-full gap-x-1 m-4`}>
              <span className="self-center items-center">
                <BackwardArrowDotsIcon color={"white"} />
              </span>
              Manage Farm Balance
            </Button>
            {totalFlood.gt(0) && <WalletButtonClaim setShowClaim={setShowClaim} showClaim={showClaim} />}
          </CardFooter>
          {totalBalance.total.eq(0) && <NoBaseValueAlert />}
        </>
      ) : (
        <WalletButtonTransfer setShowTransfer={setShowTransfer} />
      )}
    </Card>
  );
}
