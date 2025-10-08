import SowOrderDialog from "@/components/SowOrderDialog";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { useParamsTabs } from "@/hooks/useRouterTabs";
import { useMorning } from "@/state/useSunData";
import { trackSimpleEvent } from "@/utils/analytics";
import clsx from "clsx";
import { useCallback, useState } from "react";
import Harvest from "./actions/Harvest";
import Sow from "./actions/Sow";

const slugs = ["sow", "harvest"] as const;

const morningClass = clsx("data-[state=active]:bg-pinto-morning-orange data-[state=active]:text-pinto-morning");

interface FieldActionsProps {
  onTractorOrderPublished?: () => void;
}

export default function FieldActions({ onTractorOrderPublished }: FieldActionsProps) {
  const isMorning = useMorning().isMorning;
  const [tab, setTab] = useParamsTabs(slugs, "action", true);
  const [showSowOrder, setShowSowOrder] = useState(false);

  const handleChangeTab = useCallback(
    (newTab: string) => {
      trackSimpleEvent(ANALYTICS_EVENTS.FIELD.ACTION_TAB_CLICK, {
        previous_tab: tab || "sow",
        new_tab: newTab,
        is_morning: isMorning,
      });
      setTab(newTab);
    },
    [tab, isMorning, setTab],
  );

  return (
    <div className="relative h-full w-full">
      <div className={showSowOrder ? "invisible" : "visible"}>
        <Tabs defaultValue="sow" className="w-full h-full" value={!tab ? "sow" : tab} onValueChange={handleChangeTab}>
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
              <Sow isMorning={isMorning} onShowOrder={() => setShowSowOrder(true)} />
            </TabsContent>
          )}
          {tab === "harvest" && (
            <TabsContent value="harvest">
              <Harvest isMorning={isMorning} />
            </TabsContent>
          )}
        </Tabs>
      </div>
      {showSowOrder && (
        <Card className="absolute inset-x-0 -top-[calc(2.5rem)] rounded-xl z-10" id="sow-order-dialog">
          <div className="flex flex-col w-full items-center p-4">
            <SowOrderDialog
              open={showSowOrder}
              onOpenChange={setShowSowOrder}
              onOrderPublished={onTractorOrderPublished}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
