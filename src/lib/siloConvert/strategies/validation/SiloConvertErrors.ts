import { Token } from "@/utils/types";
import { AnyRecord } from "@/utils/types.generic";
import { SiloConvertTokenDirection } from "../../types";

/**
 * Base error class for all SiloConvert-related errors
 */
export abstract class SiloConvertError extends Error {
  abstract readonly code: string;
  abstract readonly category: "validation" | "quotation" | "execution" | "cache" | "network" | "configuration";

  constructor(
    message: string,
    public readonly context?: AnyRecord,
  ) {
    super(message);
    this.name = this.constructor.name;

    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Returns a structured error object for logging
   */
  toLogObject() {
    return {
      name: this.name,
      code: this.code,
      category: this.category,
      message: this.message,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Thrown when invalid tokens are provided for conversion
 */
export class InvalidConversionTokensError extends SiloConvertError {
  readonly code = "INVALID_CONVERSION_TOKENS";
  readonly category = "validation" as const;

  constructor(source: Token, target: Token, expectedType: SiloConvertTokenDirection, reason?: string) {
    const baseMessage = `Invalid conversion tokens: source=${source.symbol}(${source.address}), target=${target.symbol}(${target.address}), expected=${expectedType}`;
    const message = reason ? `${baseMessage}. Reason: ${reason}` : baseMessage;

    super(message, {
      source: {
        symbol: source.symbol,
        address: source.address,
        isMain: source.isMain,
        isLP: source.isLP,
      },
      target: {
        symbol: target.symbol,
        address: target.address,
        isMain: target.isMain,
        isLP: target.isLP,
      },
      expectedType,
      reason,
    });
  }
}

/**
 * Thrown when strategy selection fails
 */
export class StrategySelectionError extends SiloConvertError {
  readonly code = "STRATEGY_SELECTION_FAILED";
  readonly category = "quotation" as const;

  constructor(source: Token, target: Token, reason: string, context?: AnyRecord) {
    super(`Failed to select conversion strategy for ${source.symbol} -> ${target.symbol}: ${reason}`, {
      source: source.symbol,
      target: target.symbol,
      reason,
      ...context,
    });
  }
}

/**
 * Thrown when max convert quotation fails
 */
export class MaxConvertQuotationError extends SiloConvertError {
  readonly code = "MAX_CONVERT_QUOTATION_FAILED";
  readonly category = "quotation" as const;

  constructor(source: Token, target: Token, reason: string, context?: AnyRecord) {
    super(`Failed to quote max convert for ${source.symbol} -> ${target.symbol}: ${reason}`, {
      source: source.symbol,
      target: target.symbol,
      reason,
      ...context,
    });
  }
}

/**
 * Thrown when conversion quotation fails
 */
export class ConversionQuotationError extends SiloConvertError {
  readonly code = "CONVERSION_QUOTATION_FAILED";
  readonly category = "quotation" as const;
}

/**
 * Thrown when cache operations fail
 */
export class CacheError extends SiloConvertError {
  readonly code = "CACHE_ERROR";
  readonly category = "cache" as const;

  constructor(operation: string, reason: string, context?: AnyRecord) {
    super(`Cache operation '${operation}' failed: ${reason}`, {
      operation,
      reason,
      ...context,
    });
  }
}

/**
 * Thrown when pipeline execution fails
 */
export class PipelineExecutionError extends SiloConvertError {
  readonly code = "PIPELINE_EXECUTION_FAILED";
  readonly category = "execution" as const;

  constructor(operation: string, reason: string, context?: AnyRecord) {
    super(`Pipeline execution failed for '${operation}': ${reason}`, {
      operation,
      reason,
      ...context,
    });
  }
}

/**
 * Thrown when simulation fails
 */
export class SimulationError extends SiloConvertError {
  readonly code = "SIMULATION_FAILED";
  readonly category = "execution" as const;

  constructor(operation: string, reason: string, context?: AnyRecord) {
    super(`Simulation failed for '${operation}': ${reason}`, {
      operation,
      reason,
      ...context,
    });
  }
}

/**
 * Thrown when invalid amounts are provided
 */
export class InvalidAmountError extends SiloConvertError {
  readonly code = "INVALID_AMOUNT";
  readonly category = "validation" as const;

  constructor(amount: string, reason: string, context?: AnyRecord) {
    super(`Invalid amount '${amount}': ${reason}`, {
      amount,
      reason,
      ...context,
    });
  }
}
export class StrategizerError extends SiloConvertError {
  readonly code = "STRATEGIZER_ERROR";
  readonly category = "quotation" as const;

  constructor(operation: string, context?: AnyRecord) {
    super(`Strategizer error for '${operation}'`, {
      operation,
      ...context,
    });
  }
}
