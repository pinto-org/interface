import { TimeTab } from "@/components/charts/TimeTabs";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { useCallback, useEffect, useMemo } from "react";

export const getSharedTimeTabContextStorageKey = (ctx: string) => `pinto-shared-time-tab-ctx-${ctx}`;

// Atom families for different context keys and their registered overrides
const contextTimeTabFamily = atomFamily((contextKey: string) =>
  atomWithStorage<TimeTab>(getSharedTimeTabContextStorageKey(contextKey), TimeTab.Week),
);

// Atom family for registered overrides per given context key
const contextOverridesFamily = atomFamily((_contextKey: string) => atom<Record<string, TimeTab>>({}));

// Derived atom that combines chart override with context state
const chartTabFamily = atomFamily(
  ({ chartId, contextKey }: { chartId?: string; contextKey: string }) =>
    atom<TimeTab>((get) => {
      const ctxAtom = contextTimeTabFamily(contextKey);

      if (!chartId) {
        return get(ctxAtom);
      }
      const overrideAtom = contextOverridesFamily(contextKey);
      const overrides = get(overrideAtom);

      return overrides[chartId] ?? get(ctxAtom);
    }),
  (a, b) => a.chartId === b.chartId && a.contextKey === b.contextKey,
);

type UseSharedTimeTabReturn = readonly [tab: TimeTab, setTab: (tab: TimeTab) => void];

export const useSharedTimeTab = (
  chartId?: string,
  defaultOverride?: TimeTab,
  contextKey: string = "sharedTimeTab",
): UseSharedTimeTabReturn => {
  // Context tab is the global tab for the given contextKey
  const setContextTab = useSetAtom(contextTimeTabFamily(contextKey));

  // Set registered overrides for the given contextKey
  const setContextOverrides = useSetAtom(contextOverridesFamily(contextKey));

  // Get the chart tab for the given chartId and contextKey
  const contextChartTab = useAtomValue(chartTabFamily({ chartId, contextKey }));

  // Set the default override for the given chartId only if it's not already set
  useEffect(() => {
    if (defaultOverride && chartId) {
      setContextOverrides((prev) => {
        // If the chartId is already in the overrides, don't do anything
        if (!prev[chartId]) {
          return {
            ...prev,
            [chartId]: defaultOverride,
          };
        }
        return prev;
      });
    }
  }, [chartId, defaultOverride, setContextOverrides]);

  // Clear all overrides when the global context unmounts
  useEffect(() => {
    return () => {
      if (!chartId || chartId === contextKey) {
        setContextOverrides({});
        setContextTab(TimeTab.Week);
      }
    };
  }, [chartId, contextKey, setContextOverrides]);

  const setTab = useCallback(
    (tab: TimeTab) => {
      if (chartId) {
        setContextOverrides((prev) => ({ ...prev, [chartId]: tab }));
      } else {
        // Clear all overrides when setting context tab
        setContextOverrides({});
        // Set the context tab
        setContextTab(tab);
      }
    },
    [chartId, setContextTab, setContextOverrides],
  );

  const currentTab = contextChartTab;

  return [currentTab, setTab] as const;
};
