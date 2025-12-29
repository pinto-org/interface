import { isDev } from "@/utils/utils";
import { useEffect } from "react";
import { useConnect } from "wagmi";

/**
 * AutoConnectFirstConnector Component
 *
 * Automatically connects to the first available wagmi connector when:
 * - Status is "idle" (not connected)
 * - Connectors array has at least one connector
 * - Component is mounted
 *
 * This is useful for development/testing purposes.
 * Can be conditionally rendered based on environment (e.g., only in dev mode).
 *
 * Usage:
 * ```tsx
 * {isDev() && <AutoConnectFirstConnector />}
 * ```
 */
export default function AutoConnectFirstConnector() {
  const { connectors, connectAsync, status } = useConnect();

  useEffect(() => {
    if (!isDev()) {
      return;
    }

    if (status === "idle" && connectors.length > 0) {
      const firstConnector = connectors[0];
      connectAsync({ connector: firstConnector }).catch((error) => {
        console.error("AutoConnectFirstConnector: Auto-connect failed", error);
      });
    }
  }, [connectors, status, connectAsync]);

  // This component doesn't render anything
  return null;
}
