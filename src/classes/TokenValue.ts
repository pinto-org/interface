import { formatUnits, parseUnits, toHex } from "viem";
import { DecimalBigNumber } from "./DecimalBigNumber";

const blocker = {};
const maxUint256 = 2n ** 256n - 1n;

export class TokenValue {
  static ZERO = TokenValue.fromHuman(0, 0);
  static NEGATIVE_ONE = TokenValue.fromHuman(-1, 0);
  static ONE = TokenValue.fromHuman(1, 0);
  static MAX_UINT32 = TokenValue.fromHuman(4294967295, 0);
  static MAX_UINT256 = TokenValue.fromBlockchain(maxUint256, 0);

  public humanString: string;
  public blockchainString: string;
  public decimals: number;
  public value: DecimalBigNumber;

  /**
   * Create a TokenValue from string, number, or BigNumber values that represent a **human** readable form.
   * For example: "3" ETH, or "4.5" beans.
   * If your value is a blockchain value, for ex 3e18 or 4500000, use `fromBlockchain()` method instead.
   *
   * Example: `fromHuman('3.14', 6)` means 3.14 BEAN tokens, and would be represented as 3140000 on the blockchain
   *
   * Warning: Even thought we support supplying the value as a BigNumber, make sure you really mean to use it here.
   * If your input is a BigNumber, you most likely want to use `.fromBlockchain()`
   *
   * @param value The amount, as a human readable value, in string, number or BigNumber form.
   * @param decimals The number of decimals this TokenValue should be stored with. For ex, 6 for BEAN or 18 for ETH
   * @returns a TokenValue
   */
  static fromHuman(value: string | number | bigint, decimals: number): TokenValue {
    if (typeof value === "string") return TokenValue.fromString(value, decimals);
    if (typeof value === "number") {
      if (value.toString().includes("e")) {
        return TokenValue.fromString(value.toFixed(decimals), decimals);
      } else {
        return TokenValue.fromString(value.toString(), decimals);
      }
    }
    if (typeof value === "bigint") {
      // TODO: are we ok with this warning? should we add ability to ignore it?
      console.warn(
        "WARNING: calling TokenValue.fromHuman(bigint). This may have unexpected results. Are you sure you didn't mean TokenValue.fromBlockchain(bigint)?",
      );
      return TokenValue.fromString(value.toString(), decimals);
    }

    throw new Error("Invalid value parameter");
  }

  /**
   * Create a TokenValue from string, number, or BigNumber values that represent a **blockhain** value.
   * For example: 3e18 ETH, or 4500000 beans.
   * If your value is a human readable value, for ex 5 ETH  or 3.14 BEAN, use `fromHuman()` method instead.
   *
   * Example: `fromBlockchain('3140000', 6)` means 3.14 BEAN tokens, and would be represented as 3140000 on the blockchain
   * @param value The amount, as a human readable value, in string, number or BigNumber form.
   * @param decimals The number of decimals this TokenValue should be stored with. For ex, 6 for BEAN or 18 for ETH
   * @returns a TokenValue
   */
  static fromBlockchain(value: string | number | bigint, decimals: number): TokenValue {
    if (typeof value === "string" || typeof value === "number") {
      const units = formatUnits(BigInt(value), decimals);
      return TokenValue.fromString(units, decimals);
    }
    if (typeof value === "bigint") {
      return TokenValue.fromBigInt(value, decimals);
    }

    throw new Error("Invalid value parameter");
  }

  /**
   * Create a TokenValue from another decimal-supporting object: DecimalBigNumber or TokenValue.
   *
   * @param value The amount
   * @returns a TokenValue
   */
  static from(value: DecimalBigNumber | TokenValue): TokenValue {
    if (value instanceof DecimalBigNumber) {
      return new TokenValue(blocker, value.toBigInt(), value.getDecimals());
    }

    if (value instanceof TokenValue) return value;

    throw new Error('Invalid "value" parameter');
  }

  private static fromString(value: string, decimals: number): TokenValue {
    if (!value) {
      throw new Error("Must provide value to BigNumber.fromHuman(value,decimals)");
    }
    if (decimals === undefined || decimals === null) {
      throw new Error("Must provide decimals to BigNumber.fromHuman(value,decimals)");
    }
    let [int, safeDecimals] = value.split(".");

    if (safeDecimals && safeDecimals.length > decimals) {
      safeDecimals = safeDecimals.substring(0, decimals);
    }

    const safeValue = safeDecimals ? `${int}.${safeDecimals}` : int;
    const result = parseUnits(safeValue, decimals);

    return TokenValue.fromBigInt(result, decimals);
  }

  static fromBigInt(value: bigint, decimals: number): TokenValue {
    return new TokenValue(blocker, value, decimals);
  }

  constructor(_blocker: typeof blocker, _bigNumber: bigint, decimals: number) {
    if (_blocker !== blocker)
      throw new Error("Do not create an instance via the constructor. Use the .from...() methods");

    this.decimals = decimals;
    this.value = new DecimalBigNumber(_bigNumber, decimals);
    this.humanString = this.toHuman();
    this.blockchainString = this.toBlockchain();

    // make values immutable
    Object.defineProperty(this, "decimals", { configurable: false, writable: false });
    Object.defineProperty(this, "value", { configurable: false, writable: false });
  }

  ////// Utility Functions //////
  toBigInt(): bigint {
    return this.value.toBigInt();
  }

  toBlockchain(): string {
    return this.value.toBigInt().toString();
  }

  toNumber(): number {
    return Number(this.toHuman());
  }

  /**
   * @deprecated
   * Ambiguous function. This exists only as a safety, otherwise the .toString()
   * call would go to Object.toString().
   * @returns
   */
  toString(): string {
    return this.toBlockchain();
  }

  toHex(): string {
    return toHex(this.value.toBigInt());
  }

  /**
   * Returns a human readable string, for example "3.14"
   * @param format "short" for short format, "ultraShort" for short format using K.
   * @param allowNegative allow negative numbers
   * @returns string
   */
  public toHuman(format?: string, allowNegative?: boolean): string {
    if (!format) return this.value.toString();

    if (format === "short") return this.friendlyFormat(this);
    if (format === "ultraShort") return this.friendlyFormat(this, true, allowNegative);

    throw new Error(`Unsupported formatting option: ${format}`);
  }

  // Used mostly by the math functions to normalize the input
  private toDBN(num: TokenValue | bigint | number): DecimalBigNumber {
    if (num instanceof TokenValue) {
      return TokenValue.from(num).value;
    } else if (typeof num === "bigint") {
      return TokenValue.fromBlockchain(num, 0).value;
    } else {
      const decimals = num.toString().split(".")[1]?.length || 0;
      return TokenValue.fromHuman(num, decimals).value;
    }
  }

  /**
   * Returns a new TokenValue with the number of decimals set to the new value
   * @param decimals
   */
  public reDecimal(decimals: number) {
    return TokenValue.from(this.value.reDecimal(decimals));
  }

  ////// Math Functions //////
  add(num: TokenValue | bigint | number): TokenValue {
    return TokenValue.from(this.value.add(this.toDBN(num)));
  }
  sub(num: TokenValue | bigint | number): TokenValue {
    return TokenValue.from(this.value.sub(this.toDBN(num)));
  }
  mod(num: TokenValue | number) {
    // num needs to have the same number of decimals as THIS
    const n = this.toDBN(num).reDecimal(this.decimals);
    return TokenValue.from(this.value.mod(n));
  }
  mul(num: TokenValue | number | bigint) {
    return TokenValue.from(this.value.mul(this.toDBN(num)).reDecimal(this.decimals));
  }
  mulMod(num: TokenValue | number, denominator: TokenValue | number): TokenValue {
    return TokenValue.from(this.value.mul(this.toDBN(num)).mod(this.toDBN(denominator).reDecimal(this.decimals)));
  }
  mulDiv(num: TokenValue | bigint | number, denominator: TokenValue | number, rounding?: "down" | "up") {
    return TokenValue.from(
      this.value.mulDiv(this.toDBN(num), this.toDBN(denominator), rounding).reDecimal(this.decimals),
    );
  }
  div(num: TokenValue | bigint | number, decimals?: number) {
    return TokenValue.from(this.value.div(this.toDBN(num), decimals));
  }
  eq(num: TokenValue | bigint | number): boolean {
    return this.value.eq(this.toDBN(num));
  }
  gt(num: TokenValue | bigint | number): boolean {
    return this.value.gt(this.toDBN(num));
  }
  gte(num: TokenValue | bigint | number): boolean {
    return this.value.gte(this.toDBN(num));
  }
  lt(num: TokenValue | bigint | number): boolean {
    return this.value.lt(this.toDBN(num));
  }
  lte(num: TokenValue | bigint | number): boolean {
    return this.value.lte(this.toDBN(num));
  }
  static min(...values: TokenValue[]): TokenValue {
    return values.reduce((acc, num) => (acc.lt(num) ? acc : num));
  }
  static max(...values: TokenValue[]): TokenValue {
    return values.reduce((acc, num) => (acc.gt(num) ? acc : num));
  }
  abs(): TokenValue {
    return TokenValue.from(this.value.abs());
  }
  pow(num: number): TokenValue {
    return TokenValue.from(this.value.pow(num));
  }
  pct(num: number): TokenValue {
    const minDecimals = this.decimals < 2 ? 2 : this.decimals;
    if (num < 0) throw new Error("Percent value must be bigger than 0");
    return TokenValue.from(this.value.mul(num.toString()).div("100", minDecimals));
  }

  /**
   * Calculates value after substracting slippage.
   *
   * For ex, a value of 100, with slippage 3 would return 97
   *
   * @param slippage The percent to remove from the value. Slippage should be
   * a human readable percentage; 3 = 3%, 25=25%, .1 = 0.1%
   *
   * @return The original value minus slippage
   */
  subSlippage(slippage: number) {
    return this.pct(100 - slippage);
  }

  /**
   * Calculates value after adding slippage.
   *
   * For ex, a value of 100, with slippage 3 would return 103
   *
   * @param slippage The percent to remove from the value. Slippage should be
   * a human readable percentage; 3 = 3%, 25=25%, .1 = 0.1%
   *
   * @return The original value plus slippage
   */
  addSlippage(slippage: number) {
    return this.pct(100 + slippage);
  }

  /**
   * Formats a TokenValue to a human readable string that is abbreviated
   * @param tv TokenValue to format
   * @param ultraShort use shorter formatting
   * @param allowNegative allow negative numbers
   * @returns formatted string
   */
  friendlyFormat(tv: TokenValue, ultraShort?: boolean, allowNegative?: boolean): string {
    const _tv = tv.abs();
    const isNegative = tv.lt(0);
    const showPlus = allowNegative && !isNegative;

    if (_tv.eq(0)) return "0";

    if (!allowNegative) {
      if (_tv.lte(TokenValue.fromHuman("0.00000001", 8))) return "<.00000001";
    }

    if (_tv.lte(TokenValue.fromHuman(1e-3, 3))) {
      return this.trimDecimals(tv, 8).toHuman();
    }

    const quadrillion = TokenValue.fromHuman(1e15, 0);
    if (_tv.gte(quadrillion)) {
      return `${showPlus ? "+" : ""}${this.trimDecimals(tv.div(quadrillion), 4).toHuman()}Q`;
    }

    const trillion = TokenValue.fromHuman(1e12, 0);
    if (_tv.gte(trillion)) {
      return `${showPlus ? "+" : ""}${this.trimDecimals(tv.div(trillion), 4).toHuman()}T`;
    }

    const billion = TokenValue.fromHuman(1e9, 0);
    if (_tv.gte(billion)) {
      return `${showPlus ? "+" : ""}${this.trimDecimals(tv.div(billion), 3).toHuman()}B`;
    }

    const hmillion = TokenValue.fromHuman(1e8, 0);
    const millions = TokenValue.fromHuman(1e6, 0);
    if (_tv.gte(hmillion)) {
      return `${showPlus ? "+" : ""}${this.trimDecimals(tv.div(millions), 2).toHuman()}M`;
    }
    if (_tv.gte(millions)) {
      return `${showPlus ? "+" : ""}${this.trimDecimals(tv.div(millions), 2).toHuman()}M`;
    }

    if (ultraShort) {
      const thousand = TokenValue.fromHuman(1e3, 0);
      if (_tv.gte(thousand)) {
        return `${showPlus ? "+" : ""}${this.trimDecimals(tv.div(thousand), 1).toHuman()}K`;
      }
    }

    if (_tv.gte(TokenValue.fromHuman(1e3, 0))) {
      return tv.value.toApproxNumber().toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        signDisplay: showPlus ? "exceptZero" : "auto",
      });
    }

    const decimals = _tv.gt(10) ? (ultraShort ? 0 : 2) : _tv.gt(1) ? (ultraShort ? 0 : 3) : ultraShort ? 2 : 4;
    return `${showPlus ? "+" : ""}${this.trimDecimals(tv, decimals).toHuman()}`;
  }

  /**
   * Trims a TokenValue to a set number of decimals
   * @param tokenValue TokenValue to trim
   * @param decimals Number of decimals to trim to
   * @returns
   */
  public trimDecimals(tokenValue: TokenValue, decimals: number) {
    const tvString = tokenValue.toHuman();
    const decimalComponents = tvString.split(".");

    // No decimals, just return;
    if (decimalComponents.length < 2) return tokenValue;

    const numOfDecimals = decimalComponents[1].length;
    if (numOfDecimals <= decimals) return tokenValue;

    const decimalsToTrim = numOfDecimals - decimals;
    const newString = tvString.substring(0, tvString.length - decimalsToTrim);

    return TokenValue.fromHuman(newString, decimals);
  }

  public roundDown() {
    return TokenValue.from(this.value.roundDown(this.decimals));
  }

  public roundUp() {
    return TokenValue.from(this.value.roundUp(this.decimals));
  }

  public roundCeil() {
    return TokenValue.from(this.value.roundCeil(this.decimals));
  }

  public roundFloor() {
    return TokenValue.from(this.value.roundFloor(this.decimals));
  }

  ////// Getters //////

  get isZero(): boolean {
    return this.eq(0n);
  }
}

export { TokenValue as TV };
