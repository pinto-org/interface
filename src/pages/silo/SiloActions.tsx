import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";


export default function SiloActions() {

  return (
    <Tabs defaultValue="deposit" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="deposit">Account</TabsTrigger>
        <TabsTrigger value="withdraw">Password</TabsTrigger>
        <TabsTrigger value="convert">Convert</TabsTrigger>
      </TabsList>
      <TabsContent value="deposit">Deposit form here.</TabsContent>
      <TabsContent value="withdraw">Withdraw form here.</TabsContent>
      <TabsContent value="convert">Convert form here.</TabsContent>
    </Tabs>
  );
}