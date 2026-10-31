import TooltipSimple from "@/components/TooltipSimple";
import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { useParamsTabs } from "@/hooks/useRouterTabs";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { trackSimpleEvent } from "@/utils/analytics";
import { Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";
import Convert from "./actions/Convert";
import Deposit from "./actions/Deposit";
import UnifiedWithdrawal from "./actions/UnifiedWithdrawal";
import UnwrapToken from "./actions/UnwrapToken";
import WrapToken from "./actions/WrapToken";

interface SiloToken {
  token: Token;
}

const SLUGS = {
  wrappable: ["wrap", "unwrap"],
  nonWrappable: ["deposit", "withdraw", "convert", "redeem"],
  nonWhitelistedNonWrappable: ["withdraw", "convert", "redeem"],
} as const;

export default function SiloActions({ token }: SiloToken) {
  const [withdrawalBusy, setWithdrawalBusy] = useState(false);
  const [tab, handleChangeTab] = useParamsTabs(
    token.isSiloWrapped ? SLUGS.wrappable : token.isWhitelisted ? SLUGS.nonWrappable : SLUGS.nonWhitelistedNonWrappable,
    "action",
    true,
  );

  const priceData = usePriceData();
  const farmerSilo = useFarmerSilo();
  const VALUE_TARGET = 1;

  // Check if user has deposits for this token
  const userDeposits = farmerSilo.deposits.get(token);
  const hasDeposits = userDeposits?.amount?.gt(0) || false;

  // Create disable conditions with proper priority
  const isWithdrawDisabled = !hasDeposits;
  const isPintoConvertDisabled = token.isMain && priceData.price.lt(VALUE_TARGET);
  const isConvertDisabled = !hasDeposits || isPintoConvertDisabled;

  // Determine Convert tooltip message (no assets takes priority)
  const getConvertTooltip = () => {
    if (!hasDeposits) {
      return "Conversion not enabled because you have no assets.";
    }
    if (isPintoConvertDisabled) {
      return (
        <>
          Conversions from Pinto are not permitted
          <br />
          when Pinto is below the value target.
        </>
      );
    }
    return null;
  };
  const handleTabChange = useCallback(
    (newTab: string) => {
      if (withdrawalBusy) return;
      // Track tab changes
      const eventMap = {
        deposit: ANALYTICS_EVENTS.SILO.DEPOSIT_TAB_CLICK,
        withdraw: ANALYTICS_EVENTS.SILO.WITHDRAW_TAB_CLICK,
        convert: ANALYTICS_EVENTS.SILO.CONVERT_TAB_CLICK,
        wrap: ANALYTICS_EVENTS.SILO.WRAP_TAB_CLICK,
        unwrap: ANALYTICS_EVENTS.SILO.UNWRAP_TAB_CLICK,
      };

      const eventName = eventMap[newTab as keyof typeof eventMap];
      if (eventName) {
        trackSimpleEvent(eventName, {
          previous_tab: tab,
          new_tab: newTab,
          token_symbol: token.symbol,
          token_address: token.address,
        });
      }

      handleChangeTab(newTab);
    },
    [tab, token, handleChangeTab, withdrawalBusy],
  );

  useEffect(() => {
    if (token.isWhitelisted) {
      return;
    }

    if (tab === "deposit") {
      handleChangeTab("withdraw");
    }
  }, [token, tab, handleChangeTab]);

  useEffect(() => {
    // Keep an in-flight exit mounted; wait for eligibility before resolving deep links.
    if (withdrawalBusy || farmerSilo.isLoading) return;
    // Redirect away from disabled tabs
    if (tab === "redeem") {
      // Preserve old exit links, but put their content under Withdraw.
      handleChangeTab(isWithdrawDisabled && token.isWhitelisted ? "deposit" : "withdraw");
    } else if (tab === "convert" && isConvertDisabled) {
      // Redirect to deposit if available, otherwise withdraw if not disabled, otherwise no redirect needed
      if (token.isWhitelisted) {
        handleChangeTab("deposit");
      } else if (!isWithdrawDisabled) {
        handleChangeTab("withdraw");
      }
    } else if (tab === "withdraw" && isWithdrawDisabled) {
      // Redirect to deposit if available, otherwise convert if not disabled
      if (token.isWhitelisted) {
        handleChangeTab("deposit");
      } else if (!isConvertDisabled) {
        handleChangeTab("convert");
      }
    }
  }, [
    isConvertDisabled,
    isWithdrawDisabled,
    withdrawalBusy,
    farmerSilo.isLoading,
    tab,
    token.isWhitelisted,
    handleChangeTab,
  ]);

  return (
    <Tabs value={tab === "redeem" ? "withdraw" : tab} onValueChange={handleTabChange} className="w-full">
      <TabsList
        className={cn(
          "grid w-full",
          token.isSiloWrapped ? "grid-cols-2" : token.isWhitelisted ? "grid-cols-3" : "grid-cols-2",
          !token.isSiloWrapped &&
            "[&_[role=tab]]:px-2 [&_[role=tab]]:text-sm sm:[&_[role=tab]]:px-3 sm:[&_[role=tab]]:text-xl",
        )}
      >
        {token.isSiloWrapped ? (
          <>
            <TabsTrigger value="wrap">Wrap</TabsTrigger>
            <TabsTrigger value="unwrap">Unwrap</TabsTrigger>
          </>
        ) : (
          <>
            {token.isWhitelisted && <TabsTrigger value="deposit">Deposit</TabsTrigger>}
            {isWithdrawDisabled ? (
              <TooltipSimple
                content="You have no assets in the silo. Deposit to enable withdrawals."
                showOnMobile
                className="text-center"
              >
                <TabsTrigger
                  value="withdraw"
                  disabled
                  className="opacity-50 cursor-not-allowed disabled:pointer-events-auto"
                >
                  Withdraw
                </TabsTrigger>
              </TooltipSimple>
            ) : (
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            )}
            {isConvertDisabled ? (
              <TooltipSimple content={getConvertTooltip()} showOnMobile className="text-center">
                <TabsTrigger
                  value="convert"
                  disabled
                  className="opacity-50 cursor-not-allowed disabled:pointer-events-auto"
                >
                  Convert
                </TabsTrigger>
              </TooltipSimple>
            ) : (
              <TabsTrigger value="convert">Convert</TabsTrigger>
            )}
          </>
        )}
      </TabsList>
      <Separator className="my-4" />
      {farmerSilo.depositsError && (
        <p role="alert">Unable to verify current deposits and locks. Spending is disabled until balances refresh.</p>
      )}
      {!farmerSilo.depositsError && userDeposits?.lockedAmount?.gt(0) && (
        <p className="mb-4 text-sm text-pinto-gray-4">
          {userDeposits.lockedAmount.toHuman()} {token.symbol} is temporarily unavailable following Auto Convert. Your
          total ownership and Stalk are unchanged by this lock; unlocked deposits remain available.
        </p>
      )}
      {token.isWhitelisted && (
        <TabsContent value="deposit">
          <Deposit siloToken={token} />
        </TabsContent>
      )}
      <TabsContent value="withdraw">
        <UnifiedWithdrawal key={token.address} siloToken={token} onBusyChange={setWithdrawalBusy} />
      </TabsContent>
      <TabsContent value="convert">
        <Convert siloToken={token} />
      </TabsContent>
      {token.isSiloWrapped && (
        <TabsContent value="wrap">
          <WrapToken siloToken={token} />
        </TabsContent>
      )}
      {token.isSiloWrapped && (
        <TabsContent value="unwrap">
          <UnwrapToken siloToken={token} />
        </TabsContent>
      )}
    </Tabs>
  );
}
