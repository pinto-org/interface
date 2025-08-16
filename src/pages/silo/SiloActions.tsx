import TooltipSimple from "@/components/TooltipSimple";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/AnimatedTabs";
import { Separator } from "@/components/ui/Separator";
import { useParamsTabs } from "@/hooks/useRouterTabs";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { useEffect } from "react";
import Convert from "./actions/Convert";
import Deposit from "./actions/Deposit";
import UnwrapToken from "./actions/UnwrapToken";
import Withdraw from "./actions/Withdraw";
import WrapToken from "./actions/WrapToken";

interface SiloToken {
  token: Token;
}

const SLUGS = {
  wrappable: ["wrap", "unwrap"],
  nonWrappable: ["deposit", "withdraw", "convert"],
  nonWhitelistedNonWrappable: ["withdraw", "convert"],
} as const;

export default function SiloActions({ token }: SiloToken) {
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

  useEffect(() => {
    if (token.isWhitelisted) {
      return;
    }

    if (tab === "deposit") {
      handleChangeTab("withdraw");
    }
  }, [token, tab, handleChangeTab]);

  useEffect(() => {
    // Redirect away from disabled tabs
    if (tab === "convert" && isConvertDisabled) {
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
  }, [isConvertDisabled, isWithdrawDisabled, tab, token.isWhitelisted, handleChangeTab]);

  const handleTabChange = (newTab: string) => {
    // Prevent switching to disabled tabs
    if (newTab === "withdraw" && isWithdrawDisabled) {
      return;
    }
    if (newTab === "convert" && isConvertDisabled) {
      return;
    }
    handleChangeTab(newTab);
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <TabsList
        className={cn("grid w-full", token.isSiloWrapped || !token.isWhitelisted ? "grid-cols-2" : "grid-cols-3")}
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
      {token.isWhitelisted && (
        <TabsContent value="deposit">
          <Deposit siloToken={token} />
        </TabsContent>
      )}
      <TabsContent value="withdraw">
        <Withdraw siloToken={token} />
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
