import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/AnimatedTabs";
import { Separator } from "@/components/ui/Separator";
import { useParamsTabs } from "@/hooks/useRouterTabs";
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

  useEffect(() => {
    if (token.isWhitelisted) {
      return;
    }

    if (tab === "deposit") {
      handleChangeTab("withdraw");
    }
  }, [token, tab, handleChangeTab]);

  return (
    <Tabs value={tab} onValueChange={handleChangeTab} className="w-full">
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
            <TabsTrigger value="convert">Convert</TabsTrigger>
          </>
        )}
      </TabsList>
      <Separator className="my-4" />
      {tab === "deposit" && token.isWhitelisted && (
        <TabsContent value="deposit">
          <Deposit siloToken={token} />
        </TabsContent>
      )}
      {tab === "withdraw" && (
        <TabsContent value="withdraw">
          <Withdraw siloToken={token} />
        </TabsContent>
      )}
      {tab === "convert" && (
        <TabsContent value="convert">
          <Convert siloToken={token} />
        </TabsContent>
      )}
      {tab === "wrap" && (
        <TabsContent value="wrap">
          <WrapToken siloToken={token} />
        </TabsContent>
      )}
      {tab === "unwrap" && (
        <TabsContent value="unwrap">
          <UnwrapToken siloToken={token} />
        </TabsContent>
      )}
    </Tabs>
  );
}
