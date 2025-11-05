import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackSimpleEvent } from "@/utils/analytics";
import { useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

interface MarketModeSelectProps {
  onMainSelectionChange?: (v: string) => void;
  onSecondarySelectionChange?: (v: string) => void;
}

export default function MarketModeSelect({ onMainSelectionChange, onSecondarySelectionChange }: MarketModeSelectProps) {
  const { mode, id } = useParams();
  const navigate = useNavigate();

  const mainTab = !mode || mode === "buy" ? "buy" : "sell";
  const secondaryTab = !id || id === "create" ? "create" : "fill";

  const handleMainChange = useCallback(
    (v: string) => {
      // Track buy/sell tab changes
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.BUY_SELL_TAB_CLICK, {
        previous_mode: mainTab,
        new_mode: v,
        secondary_tab: secondaryTab,
      });

      navigate(`/market/pods/${v}`);
      onMainSelectionChange?.(v);
    },
    [navigate, onMainSelectionChange, mainTab, secondaryTab],
  );

  const handleSecondaryChange = useCallback(
    (v: string) => {
      // Track create/fill tab changes
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.CREATE_FILL_TAB_CLICK, {
        previous_action: secondaryTab,
        new_action: v,
        market_mode: mainTab,
      });

      if (v === "create") {
        navigate(`/market/pods/${mainTab}`);
      } else if (v === "fill") {
        navigate(`/market/pods/${mainTab}/fill`);
      }
      onSecondarySelectionChange?.(v);
    },
    [mainTab, navigate, onSecondarySelectionChange, secondaryTab],
  );

  return (
    <div className="flex flex-col gap-4 mb-4">
      <Tabs defaultValue="buy" className="w-full" value={mainTab} onValueChange={handleMainChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">Buy Pods</TabsTrigger>
          <TabsTrigger value="sell">Sell Pods</TabsTrigger>
        </TabsList>
      </Tabs>
      <Separator className="bg-pinto-gray-2" />
      <Tabs defaultValue="create" className="w-full" value={secondaryTab} onValueChange={handleSecondaryChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">{mainTab === "buy" ? "Order" : "List"}</TabsTrigger>
          <TabsTrigger value="fill">Fill</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
