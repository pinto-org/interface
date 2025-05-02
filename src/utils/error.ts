import { API_SERVICES } from "@/constants/endpoints";
import { deployedCommitHash, isDev, isObject } from "./utils";

interface ErrorWithShortMessage {
  shortMessage: string;
}

type MayError = Record<string, unknown> | any;

export const tryExtractErrorMessage = (value: unknown, defaultMessage: string): string => {
  const hasShortMessage = (value: MayError): value is ErrorWithShortMessage => {
    return "shortMessage" in value && typeof value.shortMessage === "string";
  };

  if (value instanceof Error || isObject(value)) {
    if (hasShortMessage(value)) return value.shortMessage;
    if ("message" in value && typeof value.message === "string") {
      return value.message;
    }
  }

  return defaultMessage;
};

// Discord webhook for logging site-wide errors
export const activateDiscordLogging = () => {
  // Dont send messages with this content
  const WEBHOOK_BLACKLIST = [
    "validateDOMNesting",
    "UserRejectedRequestError",
    `"level":50,"context":`,
    "User rejected the request",
  ];

  const originalConsoleError = console.error;

  // biome-ignore lint/suspicious/noExplicitAny:
  console.error = (...args: any[]) => {
    // Keep printing errors in the console
    originalConsoleError.apply(console, args);

    if (!isDev()) {
      const content =
        `🚨 ${(deployedCommitHash() ?? "").slice(0, 7)} Console error on ${window.location.href}:\n${args.map((arg) => (arg instanceof Error ? arg.message : typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" ")}`
          // Prevent discord link previews
          .replace(/(https?:\/\/[^\s]+)/g, "<$1>")
          // Hide wallet addresses
          .replace(/0x[a-fA-F0-9]{40}(?=[^a-fA-F0-9]|$)/g, "ADDR");

      if (WEBHOOK_BLACKLIST.some((blacklist) => content.includes(blacklist))) {
        return;
      }

      // Send to Discord
      fetch(`${API_SERVICES.pinto}/proxy/ui-errors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.slice(0, 1950),
        }),
      }).catch(() => {});
    }
  };
};
