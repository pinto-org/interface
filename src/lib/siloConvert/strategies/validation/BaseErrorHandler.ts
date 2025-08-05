import { TV } from "@/classes/TokenValue";
import * as SCE from "@/lib/siloConvert/strategies/validation/SiloConvertErrors";
import { Token } from "@/utils/types";
import { AnyRecord } from "@/utils/types.generic";
import { SiloConvertValidationRules as ValidationRules } from "./SiloConvertValidationRules";

/**
 * BaseErrorHandler
 *
 * Architecture notes:
 *
 * The BaseErrorHandler provides a foundation for all error handling in the siloConvert
 * system, ensuring consistent error wrapping, context management, and validation patterns.
 *
 * [Generic Design]
 * The handler uses generic types to support different token representations:
 * - TTokenContext: The type used for token context (Token objects, strings, etc.)
 * - TContext: Additional context data specific to each implementation
 *
 * [Error Wrapping Strategy]
 * Common error wrapping patterns for:
 * 1. Synchronous operations
 * 2. Asynchronous operations
 * 3. Cache operations (with graceful fallbacks)
 * 4. Re-throwing of custom SiloConvertError instances
 *
 * [Validation Framework]
 * Shared validation utilities for:
 * - Amount validation (positive, non-NaN, non-zero)
 * - Scalar value bounds checking
 * - Type-safe assertions with detailed error context
 * - Contract response validation
 *
 * [Context Management]
 * Provides flexible context building with:
 * - Additional context accumulation
 * - Token-specific context extraction
 * - Operation-specific context merging
 */
export abstract class BaseErrorHandler<TTokenContext = unknown, TContext extends AnyRecord = AnyRecord> {
  protected additionalContext: TContext = {} as TContext;

  constructor(
    protected sourceToken: TTokenContext,
    protected targetToken: TTokenContext,
  ) {}

  /**
   * Add additional context that will be included in all error reports
   */
  addCtx(context: Partial<TContext>) {
    this.additionalContext = {
      ...this.additionalContext,
      ...context,
    } as TContext;
  }

  /**
   * Build complete context object for error reporting
   * Subclasses should override this to provide domain-specific context
   */
  protected buildContext(operationContext?: AnyRecord): TContext & AnyRecord {
    return {
      ...this.additionalContext,
      ...this.getTokenContext(),
      ...(operationContext ?? {}),
    } as TContext & AnyRecord;
  }

  /**
   * Extract token-specific context - subclasses must implement
   */
  protected abstract getTokenContext(): AnyRecord;

  /**
   * Create domain-specific error - subclasses must implement
   */
  protected abstract createDomainError(
    operationName: string,
    originalError: unknown,
    context: AnyRecord,
  ): SCE.SiloConvertError;

  /**
   * Create domain-specific cache error - subclasses can override
   */
  protected createCacheError(operationName: string, originalError: unknown, context: AnyRecord): SCE.SiloConvertError {
    return new SCE.CacheError(
      operationName,
      originalError instanceof Error ? originalError.message : "Unknown cache error",
      context,
    );
  }

  /**
   * Create domain-specific simulation/pipeline error - subclasses can override
   */
  protected createExecutionError(
    operationName: string,
    originalError: unknown,
    context: AnyRecord,
  ): SCE.SiloConvertError {
    if (operationName.includes("simulation")) {
      return new SCE.SimulationError(
        operationName,
        originalError instanceof Error ? originalError.message : "Unknown simulation error",
        context,
      );
    }

    if (operationName.includes("pipeline")) {
      return new SCE.PipelineExecutionError(
        operationName,
        originalError instanceof Error ? originalError.message : "Unknown pipeline error",
        context,
      );
    }
    return this.createDomainError(operationName, originalError, context);
  }

  /**
   * Wraps synchronous operations with error handling
   */
  wrap<T>(operation: () => T, operationName: string, context?: AnyRecord): T {
    try {
      return operation();
    } catch (error) {
      // Re-throw custom errors as-is
      if (error instanceof SCE.SiloConvertError) {
        throw error;
      }

      // Wrap other errors
      throw this.createDomainError(operationName, error, this.buildContext(context));
    }
  }

  /**
   * Wraps asynchronous operations with error handling
   */
  async wrapAsync<T>(operation: () => Promise<T>, operationName: string, context?: AnyRecord): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      // Re-throw custom errors as-is
      if (error instanceof SCE.SiloConvertError) {
        throw error;
      }

      // Handle special operation types
      if (operationName.includes("simulation") || operationName.includes("pipeline")) {
        throw this.createExecutionError(operationName, error, this.buildContext(context));
      }

      if (operationName.includes("cache")) {
        throw this.createCacheError(operationName, error, this.buildContext(context));
      }

      // Wrap other errors
      throw this.createDomainError(operationName, error, this.buildContext(context));
    }
  }

  /**
   * Wraps cache operations with graceful error handling (non-fatal)
   * Cache failures should not break the main flow, just log and continue
   */
  wrapCache<T>(operation: () => T, operationName: string, fallback: T, context?: AnyRecord): T {
    try {
      return operation();
    } catch (error) {
      // Log cache errors but don't throw - return fallback instead
      const errorMessage = error instanceof Error ? error.message : String(error);
      const fullContext = this.buildContext(context);

      console.debug(`[${this.constructor.name}/${operationName}]: cache operation failed, using fallback`, {
        error: errorMessage,
        fallback,
        ...fullContext,
      });
      return fallback;
    }
  }

  /**
   * Validates token conversion patterns
   */
  validateConversionTokens(expectedType: "default" | "LP2LP" | "default-down", sourceToken: Token, targetToken: Token) {
    ValidationRules.validateConversionTokens(expectedType, sourceToken, targetToken);
  }

  /**
   * Validates amounts with appropriate error messages
   */
  validateAmount(amount: TV | number | undefined | null, name: string, context?: AnyRecord) {
    ValidationRules.validateAmount(
      amount,
      name,
      (operationName, originalError, ctx) => {
        const displayValue = typeof amount === "number" ? amount.toString() : amount?.toHuman() ?? "undefined";
        const errorMessage = originalError instanceof Error ? originalError.message : "Unknown error";

        return new SCE.InvalidAmountError(displayValue, errorMessage, {
          amount: amount instanceof TV ? amount.toHuman() : amount,
          operation: operationName,
          originalError: originalError instanceof Error ? originalError.message : "Unknown error",
          ...this.buildContext(ctx),
        });
      },
      this.buildContext(context),
    );
  }

  /**
   * Validates scalar values (should be between 0 and 1)
   */
  validateScalar(scalar: number | undefined, name: string, context?: AnyRecord) {
    ValidationRules.validateScalar(
      scalar,
      name,
      (operationName, originalError, ctx) => this.createDomainError(operationName, originalError, ctx),
      this.buildContext(context),
    );
  }

  /**
   * Validates contract responses
   */
  validateContractResponse<T>(response: T | undefined | null, operationName: string, context?: AnyRecord): T {
    return ValidationRules.validateContractResponse(
      response,
      operationName,
      (operationName, originalError, ctx) => this.createDomainError(operationName, originalError, ctx),
      this.buildContext(context),
    );
  }

  /**
   * Simple assertion with domain-specific context
   */
  assert(condition: boolean, message: string, context?: AnyRecord) {
    ValidationRules.assert(
      condition,
      message,
      (operationName, originalError, ctx) => this.createDomainError(operationName, originalError, ctx),
      this.buildContext(context),
    );
  }

  /**
   * Type-safe assertion that ensures a value is defined and narrows the type
   */
  assertDefined<T>(value: T | undefined | null, message: string, context?: AnyRecord): T {
    return ValidationRules.assertDefined(
      value,
      message,
      (operationName, originalError, ctx) => this.createDomainError(operationName, originalError, ctx),
      this.buildContext(context),
    );
  }
}
