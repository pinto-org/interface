import { TV } from "@/classes/TokenValue";
import { SiloConvertTokenDirection } from "@/lib/siloConvert/types";
import { tokensEqual } from "@/utils/token";
import { Token } from "@/utils/types";
import { AnyRecord } from "@/utils/types.generic";
import { InvalidConversionTokensError, SiloConvertError } from "./SiloConvertErrors";

/**
 * ValidationRules
 *
 * Static utility class containing all common validation logic used across
 * the silo convert system. This centralizes validation patterns and reduces
 * code duplication across error handlers.
 */
export class SiloConvertValidationRules {
  /**
   * Validates token conversion patterns
   */
  static validateConversionTokens(expectedType: SiloConvertTokenDirection, sourceToken: Token, targetToken: Token) {
    // Basic token validation
    if (!sourceToken || !targetToken) {
      throw new InvalidConversionTokensError(sourceToken, targetToken, expectedType, "Missing source or target token");
    }

    if (!sourceToken.address || !targetToken.address) {
      throw new InvalidConversionTokensError(sourceToken, targetToken, expectedType, "Invalid token addresses");
    }

    if (tokensEqual(sourceToken, targetToken)) {
      throw new InvalidConversionTokensError(
        sourceToken,
        targetToken,
        expectedType,
        "Source and target cannot be the same token",
      );
    }

    // Type-specific validation
    if (expectedType === "LP2LP") {
      if (sourceToken.isMain || targetToken.isMain) {
        throw new InvalidConversionTokensError(
          sourceToken,
          targetToken,
          expectedType,
          `Expected both tokens to be LP tokens but got source: ${sourceToken.symbol}(isMain:${sourceToken.isMain}) and target: ${targetToken.symbol}(isMain:${targetToken.isMain})`,
        );
      }

      if (!sourceToken.isLP || !targetToken.isLP) {
        throw new InvalidConversionTokensError(
          sourceToken,
          targetToken,
          expectedType,
          `Both tokens must be LP tokens but got source: ${sourceToken.symbol}(isLP:${sourceToken.isLP}) and target: ${targetToken.symbol}(isLP:${targetToken.isLP})`,
        );
      }
    } else if (expectedType === "default") {
      if (sourceToken.isLP && targetToken.isLP) {
        throw new InvalidConversionTokensError(
          sourceToken,
          targetToken,
          expectedType,
          `Expected only one LP token for default convert but got source: ${sourceToken.symbol}(isLP:${sourceToken.isLP}) and target: ${targetToken.symbol}(isLP:${targetToken.isLP})`,
        );
      }

      if (!(sourceToken.isMain || targetToken.isMain)) {
        throw new InvalidConversionTokensError(
          sourceToken,
          targetToken,
          expectedType,
          `Default convert requires one main token but got source: ${sourceToken.symbol}(isMain:${sourceToken.isMain}) and target: ${targetToken.symbol}(isMain:${targetToken.isMain})`,
        );
      }
    } else if (expectedType === "Main2LP") {
      if (!sourceToken.isMain || !targetToken.isLP) {
        const msg = !sourceToken.isMain
          ? `Main2LP convert requires source token to be a main token but got source: ${sourceToken.symbol}(isMain:${sourceToken.isMain})`
          : `Main2LP convert requires target token to be a LP token but got target: ${targetToken.symbol}(isLP:${targetToken.isLP})`;

        throw new InvalidConversionTokensError(sourceToken, targetToken, expectedType, msg);
      }
    } else if (expectedType === "LP2Main") {
      if (!sourceToken.isLP || !targetToken.isMain) {
        const msg = !sourceToken.isLP
          ? `LP2Main convert requires source token to be a LP token but got source: ${sourceToken.symbol}(isLP:${sourceToken.isLP})`
          : `LP2Main convert requires target token to be a main token but got target: ${targetToken.symbol}(isMain:${targetToken.isMain})`;

        throw new InvalidConversionTokensError(sourceToken, targetToken, expectedType, msg);
      }
    }
  }

  /**
   * Validates amounts with appropriate error messages
   */
  static validateAmount(
    amount: TV | number | undefined | null,
    name: string,
    errorFactory: (operationName: string, originalError: string | Error, context: AnyRecord) => SiloConvertError,
    context: AnyRecord = {},
  ) {
    if (!amount && amount !== 0) {
      throw errorFactory(`${name}_validation`, new Error(`${name} is required`), {
        amountType: name,
        value: amount,
        ...context,
      });
    }

    const numericValue = typeof amount === "number" ? amount : amount.toNumber();
    const displayValue = typeof amount === "number" ? amount.toString() : amount.toHuman();

    if (Number.isNaN(numericValue)) {
      throw errorFactory(`${name}_validation`, `${name} is NaN`, {
        amountType: name,
        value: displayValue,
        ...context,
      });
    }

    if (numericValue < 0) {
      throw errorFactory(`${name}_validation`, `${name} must be positive`, {
        amountType: name,
        value: displayValue,
        ...context,
      });
    }

    // Special validation for slippage values
    if (name.toLowerCase().includes("slippage") && (numericValue < 0 || numericValue > 100)) {
      throw errorFactory(`${name}_validation`, "Slippage must be between 0 and 100", {
        amountType: name,
        value: displayValue,
        validRange: "0-100",
        ...context,
      });
    }
  }

  /**
   * Validates scalar values (should be between 0 and 1)
   */
  static validateScalar(
    scalar: number | undefined,
    name: string,
    errorFactory: (operationName: string, originalError: unknown, context: AnyRecord) => SiloConvertError,
    context: AnyRecord = {},
  ) {
    if (scalar === undefined || scalar === null) {
      throw errorFactory(`${name}_validation`, new Error(`${name} is required`), {
        scalarType: name,
        value: scalar,
        ...context,
      });
    }

    if (Number.isNaN(scalar)) {
      throw errorFactory(`${name}_validation`, new Error(`${name} is NaN`), {
        scalarType: name,
        value: scalar,
        ...context,
      });
    }

    if (scalar <= 0 || scalar > 1) {
      throw errorFactory(`${name}_validation`, new Error(`${name} must be between 0 and 1`), {
        scalarType: name,
        value: scalar,
        validRange: "0 < scalar <= 1",
        ...context,
      });
    }
  }

  /**
   * Validates contract responses
   */
  static validateContractResponse<T>(
    response: T | undefined | null,
    operationName: string,
    errorFactory: (operationName: string, originalError: unknown, context: AnyRecord) => SiloConvertError,
    context: AnyRecord = {},
  ): T {
    if (response === undefined || response === null) {
      throw errorFactory(operationName, new Error(`Contract returned invalid response for ${operationName}`), {
        operation: operationName,
        response,
        originalError: response,
        ...context,
      });
    }
    return response;
  }

  /**
   * Simple assertion with custom error factory
   */
  static assert(
    condition: boolean,
    message: string,
    errorFactory: (operationName: string, originalError: unknown, context: AnyRecord) => SiloConvertError,
    context: AnyRecord = {},
  ) {
    if (!condition) {
      throw errorFactory("assertion", new Error(message), {
        assertion: "failed",
        ...context,
      });
    }
  }

  /**
   * Type-safe assertion that ensures a value is defined and narrows the type
   */
  static assertDefined<T>(
    value: T | undefined | null,
    message: string,
    errorFactory: (operationName: string, originalError: unknown, context: AnyRecord) => SiloConvertError,
    context: AnyRecord = {},
  ): T {
    if (value === undefined || value === null) {
      throw errorFactory("assertion", new Error(message), {
        valueType: typeof value,
        ...context,
      });
    }
    return value;
  }
}
