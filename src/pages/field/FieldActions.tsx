import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Separator } from "@/components/ui/Separator";
import Sow from "./actions/Sow";
import Harvest from "./actions/Harvest";

export default function FieldActions() {

  return (
    <Tabs defaultValue="sow" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sow">Sow</TabsTrigger>
        <TabsTrigger value="harvest">Harvest</TabsTrigger>
      </TabsList>
      <TabsContent value="sow">
        <div className="my-4 text-pinto-gray-5 text-[1.25rem]">
            Lend to Pinto at the current interest rate
        </div>
        <Separator className="my-4"/>
        <Sow />
      </TabsContent>
      <TabsContent value="harvest">
      <div className="my-4 text-pinto-gray-5 text-[1.25rem]">
            Collect on your Pinto debt
        </div>
        <Separator className="my-4"/>
        <Harvest />
        </TabsContent>
    </Tabs>
  );
}