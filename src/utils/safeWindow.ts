/**
 * Safe window access utilities to handle cross-origin restrictions
 */

/**
 * Safely access localStorage with cross-origin error handling
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn("localStorage access blocked:", error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn("localStorage write blocked:", error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn("localStorage remove blocked:", error);
      return false;
    }
  },
};

/**
 * Safely access window.location with cross-origin error handling
 */
export const safeLocation = {
  get href(): string {
    try {
      return window.location.href;
    } catch (error) {
      console.warn("location.href access blocked:", error);
      return "";
    }
  },

  get hostname(): string {
    try {
      return window.location.hostname;
    } catch (error) {
      console.warn("location.hostname access blocked:", error);
      return "";
    }
  },

  get pathname(): string {
    try {
      return window.location.pathname;
    } catch (error) {
      console.warn("location.pathname access blocked:", error);
      return "/";
    }
  },

  get search(): string {
    try {
      return window.location.search;
    } catch (error) {
      console.warn("location.search access blocked:", error);
      return "";
    }
  },

  get origin(): string {
    try {
      return window.location.origin;
    } catch (error) {
      console.warn("location.origin access blocked:", error);
      return "";
    }
  },

  replace: (url: string): void => {
    try {
      window.location.replace(url);
    } catch (error) {
      console.warn("location.replace blocked:", error);
      // Fallback to opening in new tab
      window.open(url, "_blank");
    }
  },
};

/**
 * Safely access window properties with cross-origin error handling
 */
export const safeWindow = {
  addEventListener: (event: string, handler: EventListener): boolean => {
    try {
      window.addEventListener(event, handler);
      return true;
    } catch (error) {
      console.warn("addEventListener blocked:", error);
      return false;
    }
  },

  removeEventListener: (event: string, handler: EventListener): boolean => {
    try {
      window.removeEventListener(event, handler);
      return true;
    } catch (error) {
      console.warn("removeEventListener blocked:", error);
      return false;
    }
  },

  dispatchEvent: (event: Event): boolean => {
    try {
      return window.dispatchEvent(event);
    } catch (error) {
      console.warn("dispatchEvent blocked:", error);
      return false;
    }
  },
};

/**
 * Check if window access is available (not blocked by cross-origin)
 */
export const isWindowAccessible = (): boolean => {
  try {
    // Try a simple property access that would fail in cross-origin context
    window.location.href;
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Safe wrapper for custom window properties
 */
export const safeWindowProperty = <T>(propertyPath: string): T | null => {
  try {
    const parts = propertyPath.split(".");
    let current: any = window;

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return null;
      }
    }

    return current as T;
  } catch (error) {
    console.warn(`Window property ${propertyPath} access blocked:`, error);
    return null;
  }
};
