import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import useRouterTabs, { UseRouterTabsOptions } from "@/hooks/useRouterTabs";
import { Token } from "@/utils/types";
import Convert from "./actions/Convert";
import Deposit from "./actions/Deposit";
import Withdraw from "./actions/Withdraw";

interface SiloToken {
  token: Token;
}

const slugs = ["deposit", "withdraw", "convert"] as const;
const routerTabsOptions: UseRouterTabsOptions = {
  type: "query",
  key: "action",
  scrollToTop: true,
};

export default function SiloActions({ token }: SiloToken) {
  const [tab, handleChangeTab] = useRouterTabs(slugs, routerTabsOptions);

  return (
    <Tabs value={tab} onValueChange={handleChangeTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="deposit">Deposit</TabsTrigger>
        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        <TabsTrigger value="convert">Convert</TabsTrigger>
      </TabsList>
      <Separator className="my-4" />
      {tab === "deposit" && (
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
    </Tabs>
  );
}
