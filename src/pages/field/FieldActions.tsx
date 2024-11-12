import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useNavigate, useParams } from "react-router-dom";
import Harvest from "./actions/Harvest";
import Sow from "./actions/Sow";

export default function FieldActions() {
  const { action } = useParams();
  const navigate = useNavigate();

  return (
    <Tabs
      defaultValue="sow"
      className="w-full"
      value={!action ? "sow" : action}
      onValueChange={(value) => navigate(`/field/${value}`)}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sow">Sow</TabsTrigger>
        <TabsTrigger value="harvest">Harvest</TabsTrigger>
      </TabsList>
      <TabsContent value="sow">
        <div className="my-4 text-pinto-gray-5 text-[1.25rem]">Lend to Pinto at the current interest rate</div>
        <Separator className="my-4" />
        <Sow />
      </TabsContent>
      <TabsContent value="harvest">
        <div className="my-4 text-pinto-gray-5 text-[1.25rem]">Collect on your Pinto debt</div>
        <Separator className="my-4" />
        <Harvest />
      </TabsContent>
    </Tabs>
  );
}
