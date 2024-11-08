import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface UseRouterTabsOptions {
  onTabChange?: (value: string) => void;
  replace?: boolean;
  scrollToTop?: boolean;
}

const useRouterTabs = (
  slugs: readonly string[],
  key: string = "tab",
  defaultIndex: number = 0,
  options: UseRouterTabsOptions = {},
) => {
  const { onTabChange, replace = true, scrollToTop = false } = options;

  const [params, update] = useSearchParams();

  // Get current slug from URL
  const getCurrentSlug = useCallback(() => {
    return params.get(key) ?? slugs[defaultIndex];
  }, [params, key, slugs, defaultIndex]);

  // Initialize tab state
  const [tab, setTab] = useState(getCurrentSlug());

  // Handle tab changes
  const handleChangeTab = useCallback(
    (value: string) => {
      if (slugs.includes(value)) {
        // Update URL if slug is valid
        const updatedParams = new URLSearchParams(params);
        updatedParams.set(key, value);

        update(updatedParams, { replace });

        // Call onChange callback if provided
        onTabChange?.(value);

        // Handle scroll to top
        if (scrollToTop) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        // Handle invalid slug
        console.warn(`Invalid tab value: ${value}`);
        setTab(slugs[defaultIndex]);
      }
    },
    [key, params, slugs, update, defaultIndex, onTabChange, replace, scrollToTop],
  );

  // Handle external navigation
  useEffect(() => {
    const currentSlug = getCurrentSlug();
    if (currentSlug !== tab) {
      setTab(currentSlug);
    }
  }, [getCurrentSlug, tab]);

  // Validate initial state
  useEffect(() => {
    if (!slugs.includes(tab)) {
      handleChangeTab(slugs[defaultIndex]);
    }
  }, [tab, slugs, defaultIndex, handleChangeTab]);

  return [tab, handleChangeTab] as const;
};

export default useRouterTabs;
