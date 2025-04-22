import { isObject } from "./utils";

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
