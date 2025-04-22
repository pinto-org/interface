import { TokenValue } from "@/classes/TokenValue";
import { navbarPanelAtom } from "@/state/app/navBar.atoms";
import { FarmerBalance, useFarmerBalances } from "@/state/useFarmerBalances";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { ENABLE_SWITCH_CHAINS } from "@/utils/wagmi/chains";
import { Avatar } from "connectkit";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import ChainButton from "./ChainButton";
import { BackwardArrowDotsIcon, LeftArrowIcon, UpDownArrowsIcon } from "./Icons";
import WalletButtonClaim from "./WalletButtonClaim";
import WalletButtonTransfer from "./WalletButtonTransfer";
import WalletPanelTokenDisplay from "./WalletPanelTokenDisplay";
import { Button } from "./ui/Button";
import { CardContent, CardFooter, CardHeader } from "./ui/Card";
import { ScrollArea } from "./ui/ScrollArea";
import { Separator } from "./ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

// Wallet header component
interface WalletHeaderProps {
  address: `0x${string}` | undefined;
  ensName: string | null | undefined;
  ensAvatar: string | null | undefined;
  disconnect: () => void;
  togglePanel: () => void;
  totalBalance: FarmerBalance;
}
const WalletHeader = ({ address, ensName, ensAvatar, disconnect, togglePanel, totalBalance }: WalletHeaderProps) => (
  <div className="flex flex-col gap-2 2xl:gap-4">
    <div className="flex flex-row justify-between items-center h-4">
      <div className="flex flex-row gap-1">
        {ensAvatar && <Avatar address={address} size={24} />}
        <span className="pinto-sm text-pinto-gray-5">
          {ensName || (address ? `${address.substring(0, 7)}...${address.substring(38, 42)}` : "")}
        </span>
      </div>
      {address && (
        <button
          type="button"
          onClick={() => {
            disconnect();
            togglePanel();
          }}
          className="flex justify-center items-center gap-1 w-[11.25rem] h-[2.125rem] bg-[#F8F8F8] rounded-full pinto-sm hover:hover:bg-pinto-green hover:text-white"
        >
          <span>Disconnect Wallet</span>
          <span className="w-4 h-4">×</span>
        </button>
      )}
    </div>
    <span className="text-[3rem] leading-[1.1] 2xl:pinto-h1 text-pinto-gray-5">
      {formatter.usd(totalBalance.total, { decimals: totalBalance.total.gt(9999999) ? 0 : 2 })}
    </span>
  </div>
);

// Balance summary component
interface BalanceSummaryProps {
  totalBalance: FarmerBalance;
}
const BalanceSummary = ({ totalBalance }: BalanceSummaryProps) => (
  <div className="flex flex-col gap-1">
    <div className="pinto-sm-light text-pinto-gray-4 inline-flex gap-1 items-center">
      <div className="rounded-full bg-pinto w-3 h-3" />
      <div>Wallet Balance:</div>
      <div className="text-pinto-gray-5">{formatter.usd(totalBalance.external)}</div>
    </div>
    <div className="pinto-sm-light text-pinto-gray-4 inline-flex gap-1 items-center">
      <div className="rounded-full bg-pinto-morning-yellow-1 w-3 h-3" />
      <div>Farm Balance:</div>
      <div className="text-pinto-gray-5">{formatter.usd(totalBalance.internal)}</div>
    </div>
  </div>
);

// Action buttons component
interface ActionButtonsProps {
  navigate: ReturnType<typeof useNavigate>;
  togglePanel: () => void;
}
const ActionButtons = ({ navigate, togglePanel }: ActionButtonsProps) => (
  <div className="flex flex-row gap-3 w-full">
    <Button
      onClick={() => {
        navigate("/swap");
        togglePanel();
      }}
      variant="ghost"
      className="bg-pinto-gray-1 hover:hover:bg-pinto-green flex-1 h-auto 2xl:h-[6.375rem] rounded-[1rem] font-[400] text-[1rem] text-pinto-gray-5 hover:text-white flex flex-row 2xl:flex-col gap-4"
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
      className="bg-pinto-gray-1 hover:hover:bg-pinto-green flex-1 h-auto 2xl:h-[6.375rem] rounded-[1rem] font-[400] text-[1rem] text-pinto-gray-5 hover:text-white flex flex-row 2xl:flex-col gap-4"
    >
      <div className="rounded-full bg-pinto-green h-9 w-9 flex justify-evenly">
        <span className="self-center items-center">
          <LeftArrowIcon color={"white"} />
        </span>
      </div>
      Send
    </Button>
  </div>
);

// Empty state component
interface EmptyStateProps {
  message: string;
}
const EmptyState = ({ message }: EmptyStateProps) => (
  <div className="flex flex-grow gap-1 flex-col items-center text-center justify-center h-[30vh]">
    <span>{message}</span>
  </div>
);

// Token list component
interface TokenListProps {
  tokens: Token[];
  balances: Map<Token, FarmerBalance>;
  priceData: ReturnType<typeof usePriceData>;
  balanceType: "internal" | "external" | "total";
  hasSiloWrappedToken: { internal: boolean; external: boolean; total: boolean };
}
const TokenList = ({ tokens, balances, priceData, balanceType, hasSiloWrappedToken }: TokenListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {hasSiloWrappedToken[balanceType] && (
        <div className={"-mx-4"}>
          <span className={"mx-4 text-sm text-pinto-gray-4"}>Wrapped Silo Tokens</span>
          {tokens.map((token) => {
            const tokenBalances = balances.get(token);
            const price = priceData.tokenPrices.get(token)?.instant || TokenValue.ZERO;
            if (
              !tokenBalances ||
              !tokenBalances[balanceType].gt(0) ||
              !(token.isSiloWrapped === true || token.is3PSiloWrapped === true)
            )
              return null;

            return (
              <WalletPanelTokenDisplay
                key={token.address}
                token={token}
                balances={tokenBalances}
                price={price}
                balanceType={balanceType}
                showDonutChart={true}
                useAltValueColor
              />
            );
          })}
        </div>
      )}
      <div className={"-mx-4"}>
        {hasSiloWrappedToken[balanceType] && <span className={"mx-4 text-sm text-pinto-gray-4"}>Other Tokens</span>}
        {tokens.map((token) => {
          const tokenBalances = balances.get(token);
          const price = priceData.tokenPrices.get(token)?.instant || TokenValue.ZERO;
          if (
            !tokenBalances ||
            !tokenBalances[balanceType].gt(0) ||
            token.isSiloWrapped === true ||
            token.is3PSiloWrapped === true
          )
            return null;

          return (
            <WalletPanelTokenDisplay
              key={token.address}
              token={token}
              balances={tokenBalances}
              price={price}
              balanceType={balanceType}
              showDonutChart={true}
            />
          );
        })}
      </div>
    </div>
  );
};

export default function WalletButtonPanel({ togglePanel }) {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName ?? undefined });
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  const [panelState, setPanelState] = useAtom(navbarPanelAtom);
  const { showTransfer, showClaim, balanceTab: currentTab } = panelState.walletPanel;

  const setShowTransfer = useCallback(
    (show) => {
      setPanelState((prev) => ({
        ...prev,
        walletPanel: {
          ...prev.walletPanel,
          showTransfer: show,
        },
      }));
    },
    [setPanelState],
  );

  const setCurrentTab = useCallback(
    (tab) => {
      if (!tab) return;
      setPanelState((prev) => ({
        ...prev,
        walletPanel: {
          ...prev.walletPanel,
          balanceTab: tab,
        },
      }));
    },
    [setPanelState],
  );

  const { balances: farmerBalances } = useFarmerBalances();
  const priceData = usePriceData();
  const farmerSilo = useFarmerSilo();

  // Calculate total flood once
  const totalFlood = useMemo(
    () =>
      farmerSilo.flood.farmerSops.reduce((total, sopData) => total.add(sopData.wellsPlenty.plenty), TokenValue.ZERO),
    [farmerSilo.flood.farmerSops],
  );

  // Memoize balances calculations to avoid expensive recalculations on re-renders
  const { totalBalance, hasSiloWrappedToken, tokens } = useMemo(() => {
    const tokens = Array.from(farmerBalances.keys());

    const totalBalance = tokens.reduce(
      (totals, token) => {
        const tokenBalance = farmerBalances.get(token);
        const price = priceData.tokenPrices.get(token)?.instant || 0;

        return {
          internal: tokenBalance ? tokenBalance.internal.mul(price).add(totals.internal) : TokenValue.ZERO,
          external: tokenBalance ? tokenBalance.external.mul(price).add(totals.external) : TokenValue.ZERO,
          total: tokenBalance ? tokenBalance.total.mul(price).add(totals.total) : TokenValue.ZERO,
        };
      },
      {
        internal: TokenValue.ZERO,
        external: TokenValue.ZERO,
        total: TokenValue.ZERO,
      },
    );

    const hasSiloWrappedToken = tokens.reduce(
      (result, token) => {
        if (token.isSiloWrapped || token.is3PSiloWrapped) {
          const tokenBalance = farmerBalances.get(token);
          return {
            internal: tokenBalance?.internal.gt(0) || result.internal,
            external: tokenBalance?.external.gt(0) || result.external,
            total: tokenBalance?.total.gt(0) || result.total,
          };
        }
        return result;
      },
      { internal: false, external: false, total: false },
    );

    return { totalBalance, hasSiloWrappedToken, tokens };
  }, [farmerBalances, priceData.tokenPrices]);

  // If in transfer mode, just render the transfer component
  if (showTransfer) {
    return <WalletButtonTransfer />;
  }

  return (
    <>
      <CardHeader className="flex flex-col gap-4 p-4 2xl:p-6">
        <WalletHeader
          address={address}
          ensName={ensName}
          ensAvatar={ensAvatar}
          disconnect={disconnect}
          togglePanel={togglePanel}
          totalBalance={totalBalance}
        />
        <BalanceSummary totalBalance={totalBalance} />
        <ActionButtons navigate={navigate} togglePanel={togglePanel} />
      </CardHeader>

      <CardContent className="p-0">
        <Separator className="w-[40rem] -ml-4" />
        <div className="p-3 pb-12 2xl:p-6 sm:pb-16">
          <Tabs defaultValue="combined" className="w-full" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3 h-11 sm:h-12 py-0 px-1 gap-[0.5rem] sm:gap-[0.75rem]">
              <TabsTrigger className="h-9 text-[0.875rem] sm:text-[1rem] hover:bg-pinto-gray-1" value="combined">
                Combined
              </TabsTrigger>
              <TabsTrigger className="h-9 text-[0.875rem] sm:text-[1rem] hover:bg-pinto-gray-1" value="external">
                Wallet Balance
              </TabsTrigger>
              <TabsTrigger className="h-9 text-[0.875rem] sm:text-[1rem] hover:bg-pinto-gray-1" value="internal">
                Farm Balance
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100dvh-28.5rem)] sm:h-[calc(100dvh-32rem)] lg:h-[calc(100dvh-31rem)] 2xl:h-[calc(100dvh-37rem)] -mx-3 px-3">
              <TabsContent value="combined" className="overflow-y-auto overflow-x-clip">
                {totalBalance.total.eq(0) ? (
                  <EmptyState message="You don't have any value in your Wallet or Farm Balance, Bridge value to Base to get started." />
                ) : (
                  <TokenList
                    tokens={tokens}
                    balances={farmerBalances}
                    priceData={priceData}
                    balanceType="total"
                    hasSiloWrappedToken={hasSiloWrappedToken}
                  />
                )}
              </TabsContent>

              <TabsContent value="external" className="overflow-y-auto overflow-x-clip">
                {totalBalance.external.eq(0) ? (
                  <EmptyState message="You don't have any value in your Wallet Balance, Bridge value to Base to get started." />
                ) : (
                  <TokenList
                    tokens={tokens}
                    balances={farmerBalances}
                    priceData={priceData}
                    balanceType="external"
                    hasSiloWrappedToken={hasSiloWrappedToken}
                  />
                )}
              </TabsContent>

              <TabsContent value="internal" className="overflow-y-auto overflow-x-clip">
                {totalBalance.internal.eq(0) ? (
                  <EmptyState message="Your Farm Balance allows you store tokens in the protocol directly for usage in the Silo, Field and Market. You can still interact with Pinto without value in your Farm Balance." />
                ) : (
                  <TokenList
                    tokens={tokens}
                    balances={farmerBalances}
                    priceData={priceData}
                    balanceType="internal"
                    hasSiloWrappedToken={hasSiloWrappedToken}
                  />
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </CardContent>

      <CardFooter className="absolute bottom-0 mx-auto left-0 right-0 text-center justify-center flex flex-col gap-4">
        {ENABLE_SWITCH_CHAINS && !showClaim && <ChainButton />}
        <Button
          variant="default"
          onClick={() => setShowTransfer(true)}
          className={`transition-all ${showClaim ? "hidden" : "inline-flex"} rounded-full gap-x-1 m-0 text-[1rem] 2xl:text-[1.25rem] h-8 sm:h-10`}
        >
          <span className="self-center items-center">
            <BackwardArrowDotsIcon color={"white"} />
          </span>
          Manage Farm Balance
        </Button>
        {totalFlood.gt(0) && <WalletButtonClaim />}
      </CardFooter>
    </>
  );
}
