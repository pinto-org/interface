import TooltipSimple from "@/components/TooltipSimple";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/AnimatedTabs";
import { Separator } from "@/components/ui/Separator";
import { useParamsTabs } from "@/hooks/useRouterTabs";
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
  const VALUE_TARGET = 1;
  const isPintoConvertDisabled = token.isMain && priceData.price.lt(VALUE_TARGET);

  useEffect(() => {
    if (token.isWhitelisted) {
      return;
    }

    if (tab === "deposit") {
      handleChangeTab("withdraw");
    }
  }, [token, tab, handleChangeTab]);

  useEffect(() => {
    // Redirect away from convert tab if Pinto convert is disabled
    if (isPintoConvertDisabled && tab === "convert") {
      handleChangeTab(token.isWhitelisted ? "deposit" : "withdraw");
    }
  }, [isPintoConvertDisabled, tab, token.isWhitelisted, handleChangeTab]);

  const handleTabChange = (newTab: string) => {
    // Prevent switching to convert tab when it's disabled for Pinto
    if (newTab === "convert" && isPintoConvertDisabled) {
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
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            {token.isMain && isPintoConvertDisabled ? (
              <TooltipSimple
                content={
                  <>
                    Conversions from Pinto are not permitted
                    <br />
                    when Pinto is below the Value Target.
                  </>
                }
                showOnMobile
                className="text-center"
              >
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
