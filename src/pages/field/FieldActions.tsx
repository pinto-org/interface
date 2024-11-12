import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import useRouterTabs from "@/hooks/useRouterTabs";
import { useNavigate, useParams } from "react-router-dom";
import Harvest from "./actions/Harvest";
import Sow from "./actions/Sow";

const slugs = ["sow", "harvest"] as const;

const routerTabsOptions = {
  scrollToTop: true,
};

export default function FieldActions() {
  const [tab, handleChangeTab] = useRouterTabs(slugs, "action", 0, routerTabsOptions);

  return (
    <Tabs defaultValue="sow" className="w-full" value={!tab ? "sow" : tab} onValueChange={handleChangeTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sow">Sow</TabsTrigger>
        <TabsTrigger value="harvest">Harvest</TabsTrigger>
      </TabsList>
      <Separator className="my-4" />
      {tab === "sow" && (
        <TabsContent value="sow">
          <Sow />
        </TabsContent>
      )}
      {tab === "harvest" && (
        <TabsContent value="harvest">
          <Harvest />
        </TabsContent>
      )}
    </Tabs>
  );
}
