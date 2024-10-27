import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import Deposit from "./actions/Deposit";
import Withdraw from "./actions/Withdraw";
import Convert from "./actions/Convert";
import { Separator } from "@/components/ui/Separator";
import { Token } from "@/utils/types";

interface SiloToken {
  token: Token
}

export default function SiloActions({ token }: SiloToken) {

  return (
    <Tabs defaultValue="deposit" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="deposit">Deposit</TabsTrigger>
        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        <TabsTrigger value="convert">Convert</TabsTrigger>
      </TabsList>
      <Separator className="my-4"/>
      <TabsContent value="deposit">
        <Deposit siloToken={token} />
      </TabsContent>
      <TabsContent value="withdraw">
        <Withdraw siloToken={token} />
      </TabsContent>
      <TabsContent value="convert">
        <Convert siloToken={token} />
      </TabsContent>
    </Tabs>
  );
}