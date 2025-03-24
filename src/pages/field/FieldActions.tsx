import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useParamsTabs } from "@/hooks/useRouterTabs";
import { useMorning } from "@/state/useSunData";
import clsx from "clsx";
import { useEffect } from "react";
import Harvest from "./actions/Harvest";
import Sow from "./actions/Sow";

const slugs = ["sow", "harvest"] as const;

const morningClass = clsx("data-[state=active]:bg-pinto-morning-orange data-[state=active]:text-pinto-morning");

export default function FieldActions() {
  const isMorning = useMorning().isMorning;
  const [tab, handleChangeTab] = useParamsTabs(slugs, "action", true);

  return (
    <Tabs defaultValue="sow" className="w-full" value={!tab ? "sow" : tab} onValueChange={handleChangeTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sow" className={isMorning ? morningClass : undefined}>
          Sow
        </TabsTrigger>
        <TabsTrigger value="harvest" className={isMorning ? morningClass : undefined}>
          Harvest
        </TabsTrigger>
      </TabsList>
      <Separator className="my-4" />
      {tab === "sow" && (
        <TabsContent value="sow">
          <Sow isMorning={isMorning} />
        </TabsContent>
      )}
      {tab === "harvest" && (
        <TabsContent value="harvest">
          <Harvest isMorning={isMorning} />
        </TabsContent>
      )}
    </Tabs>
  );
}
