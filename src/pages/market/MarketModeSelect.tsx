import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { useFarmerField } from "@/state/useFarmerField";
import { trackSimpleEvent } from "@/utils/analytics";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface MarketModeSelectProps {
  onMainSelectionChange?: (v: string) => void;
  onSecondarySelectionChange?: (v: string) => void;
}

export default function MarketModeSelect({ onMainSelectionChange, onSecondarySelectionChange }: MarketModeSelectProps) {
  const { mode, id } = useParams();
  const navigate = useNavigate();
  const farmerField = useFarmerField();

  const mainTab = mode === "buy" || mode === "sell" ? mode : undefined;
  // Only set secondaryTab if id is explicitly "create" or "fill"
  const secondaryTab = id === "create" ? "create" : id === "fill" ? "fill" : undefined;
  const hasNoPods = farmerField.plots.length === 0;

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
        navigate(`/market/pods/${mainTab}/create`);
      } else if (v === "fill") {
        navigate(`/market/pods/${mainTab}/fill`);
      }
      onSecondarySelectionChange?.(v);
    },
    [mainTab, navigate, onSecondarySelectionChange, secondaryTab],
  );

  return (
    <div className="flex flex-col gap-4 mb-4">
      <Tabs className="w-full" value={mainTab} onValueChange={handleMainChange}>
        <TabsList variant="textSecondary" className="justify-around">
          <TabsTrigger value="buy">Buy Pods</TabsTrigger>
          <TabsTrigger value="sell">Sell Pods</TabsTrigger>
        </TabsList>
      </Tabs>
      {mainTab ? (
        <>
          {mainTab === "sell" && hasNoPods ? (
            <>
              <Separator className="bg-pinto-gray-2" />
              <div className="flex flex-col gap-2 justify-center items-center w-full h-[12rem] border rounded-[0.75rem] bg-pinto-off-white border-pinto-gray-2">
                <div className="pinto-body-light text-pinto-light text-center px-4">
                  You have no Pods. You can get Pods by placing a bid on the Field or selecting{" "}
                  <span className="text-pinto-primary font-medium">Buy Pods</span>!
                </div>
              </div>
            </>
          ) : (
            <>
              <Separator className="bg-pinto-gray-2" />
              <Tabs key={mainTab} className="w-full" value={secondaryTab} onValueChange={handleSecondaryChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">{mainTab === "buy" ? "Order" : "List"}</TabsTrigger>
                  <TabsTrigger value="fill">Fill</TabsTrigger>
                </TabsList>
              </Tabs>
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center w-full h-[12rem] border rounded-[0.75rem] bg-pinto-off-white border-pinto-gray-2">
          <div className="pinto-body-light text-pinto-light text-center">
            Select <span className="text-pinto-primary font-medium">Buy Pods</span>
            <br />
            or <span className="text-pinto-primary font-medium">Sell Pods</span>
          </div>
        </div>
      )}
    </div>
  );
}
