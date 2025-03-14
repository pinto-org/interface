import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Separator } from "@/components/ui/Separator";
import { useCallback } from "react";

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
      navigate(`/market/pods/${v}`);
      onMainSelectionChange?.(v);
    },
    [navigate, onMainSelectionChange],
  );

  const handleSecondaryChange = useCallback(
    (v: string) => {
      if (v === "create") {
        navigate(`/market/pods/${mainTab}`);
      } else if (v === "fill") {
        navigate(`/market/pods/${mainTab}/fill`);
      }
      onSecondarySelectionChange?.(v);
    },
    [mainTab, navigate, onSecondarySelectionChange],
  );

  return (
    <div className="flex flex-col gap-4">
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
