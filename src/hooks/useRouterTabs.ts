import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

export interface UseRouterTabsOptions {
  type?: "query" | "path";
  key?: string;
  defaultIndex?: number;
  pathname?: string;
  onTabChange?: (value: string) => void;
  replace?: boolean;
  scrollToTop?: boolean;
}

const useRouterTabs = (slugs: readonly string[], options: UseRouterTabsOptions = {}) => {
  const {
    type = "query",
    key = "tab",
    defaultIndex = 0,
    pathname,
    onTabChange,
    replace = true,
    scrollToTop = false,
  } = options;

  if (type === "path" && !pathname) {
    throw new Error("`pathname` is required for type=`path`, but was not provided.");
  }

  const [queryParams, updateQueryParams] = useSearchParams();
  const pathParams = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  // Get current slug from URL
  const getCurrentSlug = useCallback(() => {
    return type === "query" ? queryParams.get(key) : pathParams[key];
  }, [type, queryParams, pathParams, key]);

  // Initialize tab state
  const [tab, setTab] = useState(getCurrentSlug() ?? slugs[defaultIndex]);

  // Handle tab changes
  const handleChangeTab = useCallback(
    (value: string) => {
      if (slugs.includes(value)) {
        if (type === "query") {
          // Update URL
          const updatedParams = new URLSearchParams(queryParams);
          updatedParams.set(key, value);
          updateQueryParams(updatedParams, { replace });
        } else if (type === "path" && pathname) {
          // Update path
          const newPath = pathname.replace(`:${key}`, `${value}`);
          navigate(newPath + location.search, { replace });
        }
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
    [
      type,
      key,
      slugs,
      queryParams,
      updateQueryParams,
      pathname,
      location,
      navigate,
      defaultIndex,
      onTabChange,
      replace,
      scrollToTop,
    ],
  );

  useEffect(() => {
    const currentSlug = getCurrentSlug();
    // Handle external navigation
    if (currentSlug && currentSlug !== tab) {
      setTab(currentSlug);
    }

    // Handle incorrect initial state
    if (!currentSlug || !slugs.includes(currentSlug)) {
      handleChangeTab(slugs[defaultIndex]);
    }
  }, [getCurrentSlug, tab, slugs, defaultIndex, handleChangeTab]);

  return [tab, handleChangeTab] as const;
};

export default useRouterTabs;

export const useParamsTabs = (slugs: readonly string[], key: string = "action", scrollToTop: boolean = false) => {
  const [queryParams, updateQueryParams] = useSearchParams();
  const pathParams = useParams();

  const getCurrentSlug = useCallback(() => {
    if (queryParams) {
      return queryParams.get(key);
    }
    return pathParams[key];
  }, [pathParams, queryParams, key]);

  const [tab, setTab] = useState(getCurrentSlug() ?? slugs[0]);

  // Added this effect to update tab when URL changes
  useEffect(() => {
    const currentSlug = getCurrentSlug();
    if (currentSlug && slugs.includes(currentSlug) && currentSlug !== tab) {
      setTab(currentSlug);
    }
  }, [getCurrentSlug, slugs, tab]);

  // Handle tab changes
  const handleChangeTab = useCallback(
    (value: string) => {
      if (slugs.includes(value)) {
        setTab(value);
        // Update URL
        const updatedParams = new URLSearchParams(queryParams);
        updatedParams.set(key, value);
        updateQueryParams(updatedParams, { replace: true });

        if (scrollToTop) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    },
    [key, slugs, queryParams, updateQueryParams, scrollToTop],
  );

  return [tab, handleChangeTab] as const;
};
