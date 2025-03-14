import swap0xlogo from "@/assets/misc/0x.svg";
import baseLogo from "@/assets/misc/base-logo.svg";
import pintoExchangeLogo from "@/assets/misc/pinto-exchange-logo.svg";
import { default as pintoIcon, default as pintoIconOriginal } from "@/assets/tokens/PINTO.png";
import { TV } from "@/classes/TokenValue";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { MAIN_TOKEN } from "@/constants/tokens";
import { SwapSummary, SwapSummaryExchange } from "@/hooks/swap/useSwapSummary";
import { PriceImpactSummary } from "@/hooks/wells/usePriceImpactSummary";
import { ConvertResultStruct, SiloConvertSummary } from "@/lib/siloConvert/SiloConvert";
import { ExtendedPoolData } from "@/lib/siloConvert/SiloConvert.cache";
import { LP2LPConvertStrategyResult } from "@/lib/siloConvert/strategies/LP2LPConvertStrategy";
import { useChainConstant } from "@/utils/chain";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { cn, exists } from "@/utils/utils";
import { ArrowRightIcon, CornerBottomLeftIcon } from "@radix-ui/react-icons";
import { Separator } from "@radix-ui/react-separator";
import React, { createContext, useContext } from "react";
import IconImage from "./ui/IconImage";

type SiloTxn = "Swap" | "Deposit" | "Convert" | "Withdraw";

interface RoutingAndSlippageInfoContext {
  tokenOut: Token;
  tokenIn: Token;
  preferredSummary: "swap" | "priceImpact";
  txnType: SiloTxn;
  swapSummary?: SwapSummary;
  convertSummary?: SiloConvertSummary;
  priceImpactSummary?: PriceImpactSummary;
  secondaryPriceImpactSummary?: PriceImpactSummary;
  wellToken?: Token;
}

interface RoutingAndSlippageInfoProps extends RoutingAndSlippageInfoContext {
  title: string;
}

const RoutingAndSlippageInfoContext = createContext<RoutingAndSlippageInfoContext | null>(null);

const useRoutingAndSlippageInfoContext = () => {
  const context = useContext(RoutingAndSlippageInfoContext);
  if (!context) throw new Error("useRoutingAndSlippageCardContext must be used within a RoutingAndSlippageCard");
  return context;
};

const RoutingAndSlippageInfo = (props: RoutingAndSlippageInfoProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <RoutingAndSlippageInfoContext.Provider
          value={{
            tokenIn: props.tokenIn,
            swapSummary: props.swapSummary,
            priceImpactSummary: props.priceImpactSummary,
            preferredSummary: props.preferredSummary,
            secondaryPriceImpactSummary: props.secondaryPriceImpactSummary,
            tokenOut: props.tokenOut,
            txnType: props.txnType,
            wellToken: props.wellToken,
            convertSummary: props.convertSummary,
          }}
        >
          <DialogTrigger
            className="w-full"
            onClick={(e) => {
              // prevent opening the dialog if there's no price impact or swap summary
              if (!exists(props.priceImpactSummary?.priceAfter) && !exists(props.swapSummary)) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              setIsDialogOpen((prev) => !prev);
            }}
          >
            <FormRouterAndSlippage />
          </DialogTrigger>
          <DialogContent
            hideCloseButton={true}
            className={cn("bg-pinto-off-white", props.txnType === "Convert" && "sm:min-w-[600px]")}
          >
            <DialogHeader>
              <DialogTitle>
                <SlippageDialogHeader />
              </DialogTitle>
            </DialogHeader>
            <RoutingDetails />
            <PriceImpactDialogDetails />
          </DialogContent>
        </RoutingAndSlippageInfoContext.Provider>
      </Dialog>
    </>
  );
};

export default RoutingAndSlippageInfo;

// -------------------------------------------------------------------------------
// ------------------------------- ROOT COMPONENTS -------------------------------
// -------------------------------------------------------------------------------

const FormRouterAndSlippage = () => {
  const { preferredSummary, txnType } = useRoutingAndSlippageInfoContext();

  return (
    <div className="flex flex-col bg-pinto-gray-1 border border-pinto-gray-2 rounded-md p-3 gap-y-3 mt-4 hover:bg-pinto-green-1 hover:border-pinto-green-4 cursor-pointer">
      {preferredSummary === "swap" ? <RoutesFormContent /> : null}
      {preferredSummary === "priceImpact" ? (
        txnType === "Convert" ? (
          <ConvertPriceImpactSummary variant="xs" showTokenName />
        ) : (
          <PriceImpactContent variant="xs" showTokenName />
        )
      ) : null}
    </div>
  );
};

const RoutingDetails = () => {
  const { txnType } = useRoutingAndSlippageInfoContext();

  if (txnType === "Convert") {
    return <ConvertRoutingDetails />;
  }

  return <SwapRoutingDetails />;
};

// -------------------------------------------------------------------------------
// -------------------------------- PRICE IMPACT ---------------------------------
// -------------------------------------------------------------------------------

interface IPriceImpactContent extends IInlineRowVariant {
  showTokenName?: boolean;
}

const PriceImpactRow = ({
  summary,
  showTokenName = false,
  variant = "xs",
}: { summary: PriceImpactSummary | undefined } & IPriceImpactContent) => {
  const nudge = variant === "xs" ? 1 : 0;

  const { priceImpact, token } = summary ?? {};

  const highPriceImpact = exists(priceImpact) ? priceImpact > 1 : false;

  return (
    <InlineRow
      variant={variant}
      left={
        <InlineRowLeft className="text-pinto-primary">
          <IconImage nudge={nudge} size={4} src={pintoIcon} />
          <span>
            Price Impact
            {showTokenName && token && <span className="text-pinto-light">{`: (${token.symbol})`}</span>}
          </span>
        </InlineRowLeft>
      }
    >
      <div
        className={cn(
          highPriceImpact && (variant === "sm-light" ? "font-medium" : "font-regular"),
          highPriceImpact ? "text-pinto-error" : "text-pinto-primary",
        )}
      >
        {formatPriceImpact(priceImpact)}
      </div>
    </InlineRow>
  );
};

const ConvertPriceImpactSummary = ({ variant, showTokenName }: IPriceImpactContent) => {
  const { tokenIn, tokenOut, priceImpactSummary, secondaryPriceImpactSummary } = useRoutingAndSlippageInfoContext();

  if (!tokenOut) return null;

  const isDefaultConvert = tokenIn.isMain || tokenOut.isMain;
  const nudge = variant === "xs" ? 1 : 0;

  return (
    <>
      {/*
       * If default convert, show the estimated price of the Well before & after convert
       */}
      {isDefaultConvert ? (
        <>
          <InlineRow
            variant={variant}
            left={
              <InlineRowLeft>
                <IconImage nudge={nudge} src={pintoIconOriginal} size={4} />
                Current Price {priceImpactSummary?.token?.symbol} LP
              </InlineRowLeft>
            }
          >
            {formatter.usd(priceImpactSummary?.priceBefore, { decimals: 4 })}
          </InlineRow>
          <InlineRow
            variant={variant}
            left={
              <InlineRowLeft>
                <IconImage nudge={nudge} src={pintoIconOriginal} size={4} />
                Price after my convert {tokenIn.isMain ? "to" : "from"} {priceImpactSummary?.token?.symbol} LP
              </InlineRowLeft>
            }
          >
            {formatter.usd(priceImpactSummary?.priceAfter, { decimals: 4 })}
          </InlineRow>
        </>
      ) : null}
      {/*
       * If LP<>LP Convert, show the price impact of the source Well, otherwise, show the price impact of the Well we are converting from/to
       */}
      <PriceImpactRow variant={variant} summary={priceImpactSummary} showTokenName={showTokenName} />
      {/*
       * If LP<>LP Convert, show the price impact of the target Well
       */}
      {!isDefaultConvert ? (
        <>
          <PriceImpactRow variant={variant} summary={secondaryPriceImpactSummary} showTokenName={showTokenName} />
        </>
      ) : null}
    </>
  );
};

const ConvertPriceImpactDetails = () => {
  const { priceImpactSummary, secondaryPriceImpactSummary, tokenIn, tokenOut } = useRoutingAndSlippageInfoContext();

  const isDefaultConvert = tokenIn.isMain || tokenOut.isMain;

  if (isDefaultConvert) {
    return <ConvertPriceImpactSummary variant="sm-light" showTokenName />;
  }

  const details = [
    { summary: priceImpactSummary, token: tokenIn },
    { summary: secondaryPriceImpactSummary, token: tokenOut },
  ];

  return (
    <div className="flex flex-col gap-y-3 pt-4">
      <div className="pinto-sm text-pinto-primary">Before Convert</div>
      {details.map(({ summary, token }, i) => (
        <InlineRow
          key={`lp-lp-convert-price-before-details-${token.symbol}-${i}`}
          variant={"sm-light"}
          left={
            <InlineRowLeft>
              <IconImage nudge={1} src={pintoIconOriginal} size={4} />
              Current Price {token.symbol} LP
            </InlineRowLeft>
          }
        >
          {summary?.priceBefore ? formatter.usd(summary?.priceBefore, { decimals: 4 }) : "-"}
        </InlineRow>
      ))}
      <div className="pinto-sm text-pinto-primary">After Convert</div>
      {details.map(({ summary, token }, i) => (
        <InlineRow
          key={`lp-lp-convert-price-after-details-${token.symbol}-${i}`}
          variant={"sm-light"}
          left={
            <InlineRowLeft>
              <IconImage nudge={1} src={pintoIconOriginal} size={4} />
              Price after my Convert in {token?.symbol} LP
            </InlineRowLeft>
          }
        >
          {summary?.priceAfter ? formatter.usd(summary?.priceAfter, { decimals: 4 }) : "-"}
        </InlineRow>
      ))}
      <div className="pinto-sm text-pinto-primary">Price Impact</div>
      {details.map(({ summary, token }, i) => (
        <PriceImpactRow
          key={`lp-lp-convert-price-impact-details-${token.symbol}-${i}`}
          variant="sm-light"
          summary={summary}
          showTokenName
        />
      ))}
    </div>
  );
};

const PriceImpactContent = ({ variant = "sm-light", showTokenName = false }: IPriceImpactContent) => {
  const { priceImpactSummary, wellToken, txnType } = useRoutingAndSlippageInfoContext();
  const mainToken = useChainConstant(MAIN_TOKEN);

  // Convert has a separate component for price impact
  if (txnType === "Convert") {
    return null;
  }

  const { priceBefore, priceAfter, token } = priceImpactSummary ?? {};

  const well = token?.isLP ? token : wellToken;

  const nudge = variant === "xs" ? 1 : 0;

  return (
    <>
      <InlineRow
        variant={variant}
        left={
          <InlineRowLeft>
            <IconImage nudge={nudge} src={pintoIconOriginal} size={4} />
            {mainToken.symbol} Price {token?.symbol ?? ""} before
          </InlineRowLeft>
        }
      >
        {formatter.usd(priceBefore, { decimals: 4 })}
      </InlineRow>
      <InlineRow
        variant={variant}
        left={
          <InlineRowLeft>
            <IconImage nudge={nudge} src={pintoIconOriginal} size={4} />
            {mainToken.symbol} Price {token?.symbol ?? ""} after
          </InlineRowLeft>
        }
      >
        {exists(priceAfter) ? formatter.usd(priceAfter, { decimals: 4 }) : "-"}
      </InlineRow>
      {well && <PriceImpactRow summary={priceImpactSummary} variant={variant} showTokenName={showTokenName} />}
    </>
  );
};

const RoutesFormContent = () => {
  const { swapSummary, priceImpactSummary, txnType, tokenOut } = useRoutingAndSlippageInfoContext();
  const exchanges = swapSummary?.swap?.exchanges;
  const totalSlippage = swapSummary?.totalSlippage ?? 0;

  const slippageColor = () => {
    if (totalSlippage >= 4) return "error";
    if (totalSlippage >= 3.5) return "warning-orange";
    return totalSlippage >= 3 ? "warning-yellow" : "default";
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="pinto-sm">Router</div>
        <div className="flex flex-row gap-x-2">
          {exchanges?.map((exchange) => {
            if (exchange === "pinto-exchange") {
              return (
                <div className="pinto-sm flex flex-row items-center gap-x-1" key={`exchange-${exchange}`}>
                  <IconImage src={pintoExchangeLogo} alt="Pinto Exchange" size={4} />
                  Pinto Exchange
                </div>
              );
            } else if (exchange === "0x") {
              return (
                <div className="pinto-sm flex flex-row items-center gap-x-1" key={`exchange-${exchange}`}>
                  <IconImage src={swap0xlogo} alt="0x" size={4} />
                  0x Swap
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="pinto-sm">Route Slippage</div>
        <div className="pinto-sm">{formatter.pct(totalSlippage)}</div>
      </div>
      {!tokenOut.isMain && (
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-x-1">
            <div className="pinto-sm text-pinto-primary flex flex-row gap-x-1">
              <IconImage size={4} src={pintoIcon} />
              Price Impact of {txnType}
            </div>
          </div>
          <div className="pinto-sm">
            <div className="pinto-sm">{formatPriceImpact(priceImpactSummary?.priceImpact)}</div>
          </div>
        </div>
      )}
    </>
  );
};

// this is the header for the dialog
const SlippageDialogHeader = () => {
  const { swapSummary, txnType, tokenIn, tokenOut } = useRoutingAndSlippageInfoContext();

  const isLPToLPConvert = txnType === "Convert" && tokenIn.isLP && tokenOut.isLP;

  return (
    <div className="flex flex-row pinto-body font-medium">
      {isLPToLPConvert || swapSummary?.swap.routes?.length ? "Order Routing and Price Impact" : "Price Impact"}
    </div>
  );
};

const RouteExchangeDetails = ({ exchange, feePct }: { exchange: SwapSummaryExchange; feePct?: number }) => {
  const icon = exchange === "pinto-exchange" ? pintoExchangeLogo : exchange === "0x" ? swap0xlogo : baseLogo;
  const text = exchange === "pinto-exchange" ? "Pinto-Exchange" : exchange === "0x" ? "0x-Swap" : "Base";

  return (
    <div className="flex flex-row items-center gap-x-1 pinto-sm-light text-pinto-light">
      <CornerBottomLeftIcon className="w-4 h-4 pb-1" />
      <IconImage src={icon} nudge={1} alt={text} className="opacity-60" size={4} />
      <div className="inline">
        {text}
        {exchange === "0x" && exists(feePct) ? <span> ({formatter.xDec(feePct, 3)}% fee)</span> : null}
      </div>
    </div>
  );
};
interface IConvertActionItem {
  from: Token[];
  to: Token[];
  amounts: TV[];
  usd: TV[];
  exchange: SwapSummaryExchange;
  itemKey: string;
  feePct?: number;
}

const ConvertActionItem = ({ from, to, exchange, amounts, itemKey, feePct, usd }: IConvertActionItem) => {
  const RoutingTokenDetails = (props: { tokens: Token[]; itemKey: string }) => {
    return props.tokens.map((token, i, arr) => (
      <React.Fragment key={`${props.itemKey}-${token.symbol}-${i}`}>
        <IconImage src={token.logoURI} className="w-4 h-4" size={4} />
        <span className="hidden md:block ">{`${token.symbol}${token.isLP ? " LP" : ""}`}</span>
        {i === 0 && arr.length > 1 && (
          <Separator orientation="vertical" className="h-4 w-[0.5px] bg-pinto-gray-2 mx-1" />
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-row w-full justify-between">
      {/*
       * routing info
       */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-1 pinto-sm">
          <RoutingTokenDetails tokens={from} itemKey={`from-${itemKey}`} />
          <ArrowRightIcon className="w-4 h-4" />
          <RoutingTokenDetails tokens={to} itemKey={`to-${itemKey}`} />
        </div>
        <RouteExchangeDetails exchange={exchange} feePct={feePct} />
      </div>
      {/*
       * amounts info
       */}
      <div className="flex flex-row items-center gap-1">
        {to.map((token, i, arr) => (
          <React.Fragment key={`to-amount-${itemKey}-${token.symbol}-${i}`}>
            <div className="flex flex-col gap-0">
              <div className="pinto-sm text-right inline-flex gap-1 justify-end">
                <IconImage src={token.logoURI} size={4} />
                {formatter.token(amounts[i], token)}
              </div>
              <div className="pinto-xs-light text-pinto-light mt-1 text-right">
                {formatter.usd(usd[i].mul(amounts[i]))}
              </div>
            </div>
            {i < arr.length - 1 && arr.length > 1 && (
              <Separator orientation="vertical" className="h-10 w-[0.5px] bg-pinto-gray-2 mx-1" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const ConvertRoutingDetails = () => {
  const { convertSummary, tokenIn, tokenOut, priceImpactSummary, secondaryPriceImpactSummary } =
    useRoutingAndSlippageInfoContext();
  const isDefaultConvert = tokenIn.isMain || tokenOut.isMain;

  if (!convertSummary || !tokenOut || isDefaultConvert) return null;

  const normalizedConvertActions = convertSummary.quotes.map((quote, i) =>
    normalizeConvertSummary(
      quote as LP2LPConvertStrategyResult,
      convertSummary.results[i],
      i,
      // use the price impact summary only if it's not the 1st action
      i > 0 ? priceImpactSummary : undefined,
      secondaryPriceImpactSummary,
    ),
  );

  const isMultiStep = convertSummary.quotes.length > 1;

  return (
    <div className="flex flex-col space-y-4">
      <Separator
        orientation="horizontal"
        decorative
        className="bg-pinto-gray-2 h-[1px] w-[calc(100%+3rem)] -translate-x-6"
      />
      <div className="flex flex-col gap-y-9">
        <div className="pinto-sm">Order Routing</div>
        <div className="flex flex-col gap-4 w-full">
          {normalizedConvertActions.map((convertData, i) => (
            <div className="flex flex-row gap-2 w-full" key={`convert-action-item-${i.toString()}`}>
              {isMultiStep ? <div className="pinto-sm-light">{i + 1}</div> : null}
              <div className="flex flex-col gap-y-4 w-full">
                {convertData.map((thisAction, j) => (
                  <div className="flex flex-row gap-x-3" key={`convert-action-item-${i}-${j.toString()}`}>
                    <ConvertActionItem {...thisAction} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// this is a start on the swap slippage dialog body component. needs to be adjusted to use standard props from RoutingAndSlippageCardProps
const SwapRoutingDetails = () => {
  const { swapSummary } = useRoutingAndSlippageInfoContext();
  if (!swapSummary?.swap.routes[0]) return null;

  return (
    <div className="space-y-4">
      <Separator
        orientation="horizontal"
        decorative
        className="bg-pinto-gray-2 h-[1px] w-[calc(100%+3rem)] -translate-x-6"
      />
      <div className="pinto-sm text-pinto-primary py-2">Order Routing</div>
      {swapSummary.swap.routes.map((route) => {
        return (
          <div key={`${route.sellToken.address}-${route.buyToken.address}-${route.amountIn}-${route.amountOut}`}>
            <div className="flex flex-row justify-between px-1 py-2 items-center">
              {/* route + exchange */}
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-row gap-x-2 items-center">
                  {/* token in */}
                  <div className="flex flex-row items-center gap-x-1">
                    <IconImage src={route.sellToken.logoURI} alt={route.sellToken.symbol} size={4} />
                    <div className="pinto-sm">{route.sellToken.symbol}</div>
                  </div>
                  <ArrowRightIcon className="w-4 h-4" />
                  {/* token out */}
                  <div className="flex flex-row items-center gap-x-1">
                    <IconImage src={route.buyToken.logoURI} alt={route.buyToken.symbol} size={4} />
                    <div className="pinto-sm">{route.buyToken.symbol}</div>
                  </div>
                </div>
                <RouteExchangeDetails exchange={route.exchange} feePct={route.exchangeFeePct} />
              </div>
              <div className="flex flex-col justify-end items-end gap-y-1">
                <div className="pinto-sm">
                  {formatter.xDec(route.amountOut, route.buyToken.displayDecimals ?? 8)} {route.buyToken.symbol}
                </div>
                <div className="pinto-sm text-pinto-light">{formatter.usd(route.usdOut)}</div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex flex-row justify-between pt-2 pb-2">
        <div className="pinto-sm">Route slippage</div>
        <div className="pinto-sm">
          {formatter.pct(swapSummary.swap.totalSlippage, {
            maxDecimals: 3,
          })}
        </div>
      </div>
    </div>
  );
};

// needs to appear for deposits / converts / swaps
const PriceImpactDialogDetails = () => {
  const { priceImpactSummary, txnType } = useRoutingAndSlippageInfoContext();

  if (!priceImpactSummary?.priceAfter) return null;

  return (
    <div className="space-y-3">
      <Separator orientation="horizontal" decorative className="bg-pinto-gray-2 h-[1px] w-full" />
      {txnType === "Convert" ? (
        <ConvertPriceImpactDetails />
      ) : (
        <>
          <div className="pinto-sm text-pinto-primary py-3">Price Impact</div>
          <PriceImpactContent variant="sm-light" />
        </>
      )}
    </div>
  );
};

// -------------------------------------------------------------------------------
// ------------------------------ HELPER COMPONENTS ------------------------------
// -------------------------------------------------------------------------------

interface IInlineRowVariant {
  variant?: "xs" | "sm-light";
}

const InlineRowContext = createContext<IInlineRowVariant>({ variant: "sm-light" });

const InlineRow = ({
  left,
  children,
  variant = "xs",
}: { left: React.ReactNode; children: React.ReactNode } & IInlineRowVariant) => {
  return (
    <InlineRowContext.Provider value={{ variant }}>
      <div
        className={cn(
          "flex flex-row justify-between items-center text-pinto-light",
          variant === "xs" && "pinto-xs",
          variant === "sm-light" && "pinto-sm-light",
        )}
      >
        {left}
        {children}
      </div>
    </InlineRowContext.Provider>
  );
};

const InlineRowLeft = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("text-pinto-light", "flex", "flex-row", "gap-x-1", className)}>{children}</div>;
};

// -------------------------------------------------------------------------------
// ------------------------------- SLIPPAGE WARNING ------------------------------
// -------------------------------------------------------------------------------

const SLIPPAGE_THRESHOLD = 4;

export const useRoutingAndSlippageWarning = ({
  totalSlippage,
  txnType,
  priceImpact,
}: { totalSlippage: number | undefined; txnType: SiloTxn; priceImpact: number | undefined }) => {
  const [isChecked, setIsChecked] = React.useState(false);

  const required = exists(totalSlippage) && totalSlippage >= SLIPPAGE_THRESHOLD;

  const slippageWarning = required ? (
    <form>
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center gap-y-2 sm:gap-x-2 bg-pinto-red-1 border border-pinto-red-2 p-3 rounded-sm mt-4`}
      >
        <Checkbox
          id="slippage-warning-terms"
          checked={isChecked}
          onCheckedChange={(checked) => {
            if (checked !== "indeterminate") {
              setIsChecked(checked);
            } else {
              setIsChecked(false);
            }
          }}
          variant="error"
        />

        <label htmlFor="slippage-warning-terms" className="pinto-sm text-pinto-error flex-1">
          {`Your transaction will execute with ${formatter.pct(totalSlippage)} route slippage${priceImpact ? ` and a ${formatPriceImpact(priceImpact)}% price impact` : ""} during your ${txnType}. Click on the checkbox to continue.`}
        </label>
      </div>
    </form>
  ) : null;

  const canProceed = required ? isChecked : true;
  return { slippageWarning, canProceed };
};

// -------------------------------------------------------------------------------
// ------------------------------- HELPER FUNCTIONS ------------------------------
// -------------------------------------------------------------------------------

function formatPriceImpact(value: number | undefined) {
  if (!exists(value)) return "-";

  // const absValue = Math.abs(value);
  // if (absValue < 0.001) return `${value < 0 ? "-" : ""}0.001%`;

  return `${formatter.xDec(Math.abs(value), 3)}%`;
}

// If summary is provided, we assume that the price is the projected price.
function getPricesFromWellData(tokens: Token[], well: ExtendedPoolData, summary: PriceImpactSummary | undefined): TV[] {
  return tokens.map((token) => {
    if (!token.isMain && !token.isLP) return well.pair.price;
    // Well LP Token price
    if (token.isLP) return summary?.lpUSDAfter ?? well.lpUsd;
    // Protocol Token price
    return summary?.priceAfter ?? well.price;
  });
}

/**
 * Combine the quote, result, and price impact summaries
 */
function normalizeConvertSummary(
  quote: LP2LPConvertStrategyResult,
  result: ConvertResultStruct<TV>,
  index: number,
  sourceWellSummary?: PriceImpactSummary,
  targetWellSummary?: PriceImpactSummary,
): IConvertActionItem[] {
  const { source, target, swap } = quote.summary;

  const data: IConvertActionItem[] = [];

  data.push({
    from: [source.token],
    to: source.removeTokens,
    amounts: source.amountOut,
    usd: getPricesFromWellData(source.removeTokens, source.well, sourceWellSummary),
    exchange: "pinto-exchange" as const,
    itemKey: `${index}-convert-source`,
  });

  if (swap) {
    data.push({
      from: [swap.sellToken],
      to: [swap.buyToken],
      amounts: [swap.buyAmount],
      usd: getPricesFromWellData([swap.buyToken], target.well, undefined),
      exchange: "0x",
      feePct: swap.fee?.feePct,
      itemKey: `${index}-convert-swap`,
    });
  }

  data.push({
    from: target.addTokens,
    to: [target.token],
    // for the target, we show the amount via the result instead of the quote
    amounts: [result.toAmount],
    usd: getPricesFromWellData([target.token], target.well, targetWellSummary),
    exchange: "pinto-exchange" as const,
    itemKey: `${index}-convert-target`,
  });

  return data;
}

/* {well && (
        <div className="flex flex-row justify-between items-center">
          <div
            className={cn(
              variant === "xs" && "pinto-xs",
              variant === "sm-light" && "pinto-sm-light",
              "text-pinto-light",
              "pinto-body",
              "flex",
              "flex-row",
              "gap-x-1",
            )}
          >
            <IconImage nudge={nudge} size={4} src={pintoIcon} />
            <span>
              Price Impact
              {showTokenName && <span className="text-pinto-light">{`: (${well.symbol})`}</span>}
            </span>
          </div>
          <div
            className={cn(
              variant === "xs" && "pinto-xs",
              variant === "sm-light" && "pinto-sm-light",
              highPriceImpact && (variant === "sm-light" ? "font-medium" : "font-regular"),
              highPriceImpact ? "text-pinto-error" : "text-pinto-primary",
            )}
          >
            {formatPriceImpact(priceImpact)}
          </div>
        </div>
      )} */
