import { isProd } from "./utils";

// Global gtag function declaration for TypeScript
declare global {
  function gtag(...args: any[]): void;
  interface Window {
    gtag?: typeof gtag;
    dataLayer?: any[];
  }
}

/**
 * [Analytics/GA] Utility for Pinto Interface
 *
 * Handles [Analytics/GA] integration with proper TypeScript typing
 * and production environment checks. Designed for React SPA tracking.
 */

export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || "";

/**
 * Check if [Analytics/GA] is available and environment is production
 */
export function isAnalyticsEnabled(): boolean {
  if (!isProd()) return false;
  if (!GA_TRACKING_ID) return false;
  return isProd() && typeof window !== "undefined" && typeof window.gtag === "function";
}

/**
 * Initialize [Analytics/GA] with proper configuration
 * Called once when the app starts (if in production)
 */
export function initializeGA(): void {
  if (!isAnalyticsEnabled()) {
    return;
  }

  // GA script should already be loaded via index.html in production
  // This is just a safety check
  if (!window.gtag) {
    console.warn("[Analytics/GA]: gtag function not found");
    return;
  }
}

/**
 * Track a page view event for React SPA navigation
 *
 * @param title - Page title from meta data
 * @param url - Full URL of the page
 * @param metaKey - Page category from meta constants (silo, field, swap, etc.)
 * @param customData - Optional additional tracking data
 */
export function trackPageView(title: string, url: string, metaKey: string, customData?: Record<string, any>): void {
  if (!isAnalyticsEnabled()) {
    return;
  }

  let pathname: string = "";
  try {
    pathname = new URL(url).pathname ?? "";
    if (pathname === "/") {
      pathname = "/index";
    }
  } catch (e) {
    pathname = url;
  }

  try {
    if (!window.gtag) {
      console.warn("[Analytics/GA]: gtag function not available");
      return;
    }

    // Send page view with enhanced data
    window.gtag("config", GA_TRACKING_ID, {
      page_title: title,
      page_location: url,
      page_path: pathname,
      custom_map: {
        custom_dimension_1: "page_category", // metaKey mapping
      },
      ...customData,
    });

    // Send custom event for page category tracking
    window.gtag("event", "page_view", {
      page_title: title,
      page_location: url,
      page_path: pathname,
      page_category: metaKey,
      ...customData,
    });

    console.debug(`[GA] Page view tracked: ${pathname} (${metaKey})`);
  } catch (error) {
    console.error("[Analytics/GA] tracking error:", error);
  }
}

/**
 * Track custom events for user interactions
 *
 * @param eventName - Name of the event (e.g., 'wallet_connect', 'transaction_start')
 * @param eventData - Additional event parameters
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>): void {
  if (!isAnalyticsEnabled()) {
    return;
  }

  try {
    if (!window.gtag) {
      console.warn("[Analytics/GA]: gtag function not available");
      return;
    }

    window.gtag("event", eventName, {
      ...eventData,
    });

    console.debug(`[GA] Event tracked: ${eventName}`, eventData);
  } catch (error) {
    console.error("[Analytics/GA] event tracking error:", error);
  }
}

/**
 * Create a click handler that tracks an event before executing
 *
 * @param eventName - Name of the event to track
 * @param eventData - Additional event parameters
 * @returns Click handler function
 */
export function trackClick(eventName: string, eventData?: Record<string, any>) {
  return (e?: React.MouseEvent) => {
    trackEvent(eventName, {
      element_text: e?.currentTarget.textContent?.trim() || "",
      page_location: window.location.pathname,
      timestamp: Date.now(),
      ...eventData,
    });
  };
}

/**
 * Compose event tracking with an existing click handler
 *
 * @param eventName - Name of the event to track
 * @param originalHandler - Original click handler to execute after tracking
 * @param eventData - Additional event parameters
 * @returns Composed click handler function
 */
export function withTracking(eventName: string, originalHandler?: (e: any) => void, eventData?: Record<string, any>) {
  return (e?: React.MouseEvent) => {
    trackEvent(eventName, {
      element_text: e?.currentTarget.textContent?.trim() || "",
      page_location: window.location.pathname,
      timestamp: Date.now(),
      ...eventData,
    });
    originalHandler?.(e);
  };
}

/**
 * Track an event with minimal context (for inline usage)
 *
 * @param eventName - Name of the event to track
 * @param eventData - Additional event parameters
 */
export function trackSimpleEvent(eventName: string, eventData?: Record<string, any>): void {
  trackEvent(eventName, {
    page_location: window.location.pathname,
    timestamp: Date.now(),
    ...eventData,
  });
}
