import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ANALYTICS_EVENTS } from "@/constants/analytics-events";
import { trackSimpleEvent } from "@/utils/analytics";
import { useCallback, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type MarketMode = "buy" | "sell";
type MarketAction = "create" | "fill";

interface MarketModeSelectProps {
  onMainSelectionChange?: (v: string) => void;
  onSecondarySelectionChange?: (v: string) => void;
}

// Constants
const DEFAULT_MODE: MarketMode = "buy";
const DEFAULT_ACTION_BY_MODE: Record<MarketMode, MarketAction> = {
  buy: "fill",
  sell: "create",
};

const ACTION_LABELS: Record<MarketMode, Record<MarketAction, string>> = {
  buy: {
    create: "Order",
    fill: "Fill",
  },
  sell: {
    create: "List",
    fill: "Fill",
  },
};

export default function MarketModeSelect({ onMainSelectionChange, onSecondarySelectionChange }: MarketModeSelectProps) {
  const { mode, id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Helper to preserve current search params (e.g. ?beanstalk=true) during navigation
  const buildPath = useCallback(
    (path: string) => {
      const params = searchParams.toString();
      return params ? `${path}?${params}` : path;
    },
    [searchParams],
  );

  // Derive current state from URL params
  const { mainTab, secondaryTab, secondaryTabValue } = useMemo(() => {
    const validMode = mode === "buy" || mode === "sell" ? (mode as MarketMode) : undefined;
    const validAction = id === "create" || id === "fill" ? (id as MarketAction) : undefined;

    const defaultAction = validMode ? DEFAULT_ACTION_BY_MODE[validMode] : undefined;
    const currentAction = validAction ?? defaultAction;

    return {
      mainTab: validMode,
      secondaryTab: validAction ?? (validMode ? DEFAULT_ACTION_BY_MODE[validMode] : undefined),
      secondaryTabValue: currentAction ?? DEFAULT_ACTION_BY_MODE[DEFAULT_MODE], // Fallback for Tabs component
    };
  }, [mode, id]);

  const handleMainChange = useCallback(
    (v: string) => {
      const newMode = v as MarketMode;
      const defaultAction = DEFAULT_ACTION_BY_MODE[newMode];

      // Track buy/sell tab changes
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.BUY_SELL_TAB_CLICK, {
        previous_mode: mainTab,
        new_mode: newMode,
        secondary_tab: secondaryTab,
      });

      navigate(buildPath(`/market/pods/${newMode}/${defaultAction}`));
      onMainSelectionChange?.(v);
    },
    [navigate, onMainSelectionChange, mainTab, secondaryTab, buildPath],
  );

  const handleSecondaryChange = useCallback(
    (v: string) => {
      const currentMode = mainTab ?? DEFAULT_MODE;
      // Track create/fill tab changes
      trackSimpleEvent(ANALYTICS_EVENTS.MARKET.CREATE_FILL_TAB_CLICK, {
        previous_action: secondaryTab,
        new_action: v,
        market_mode: currentMode,
      });

      if (v === "create") {
        navigate(buildPath(`/market/pods/${currentMode}/create`));
      } else if (v === "fill") {
        navigate(buildPath(`/market/pods/${currentMode}/fill`));
      }
      onSecondarySelectionChange?.(v);
    },
    [mainTab, navigate, onSecondarySelectionChange, secondaryTab, buildPath],
  );

  return (
    <div className="flex flex-col gap-4 mb-4">
      <Tabs className="w-full" value={mainTab ?? DEFAULT_MODE} onValueChange={handleMainChange}>
        <TabsList variant="textSecondaryLarge" className="justify-around mt-1">
          <TabsTrigger value="buy">Buy Pods</TabsTrigger>
          <TabsTrigger value="sell">Sell Pods</TabsTrigger>
        </TabsList>
      </Tabs>
      <Separator className="bg-pinto-gray-2" />
      <Tabs
        className="w-full"
        value={secondaryTabValue}
        defaultValue={DEFAULT_ACTION_BY_MODE[mainTab ?? DEFAULT_MODE]}
        onValueChange={handleSecondaryChange}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">{ACTION_LABELS[mainTab ?? DEFAULT_MODE].create}</TabsTrigger>
          <TabsTrigger value="fill">{ACTION_LABELS[mainTab ?? DEFAULT_MODE].fill}</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
