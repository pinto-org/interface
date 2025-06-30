import seedIcon from "@/assets/protocol/Seed.png";
import stalkIcon from "@/assets/protocol/Stalk.png";
import { TokenValue } from "@/classes/TokenValue";
import { InfoOutlinedIcon } from "@/components/Icons";
import IconImage from "@/components/ui/IconImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Separator } from "@/components/ui/Separator";
import { SowOrderTokenStrategy } from "@/lib/Tractor/types";
import { TokenSelectionDialogProps } from "@/lib/Tractor/tractorOrderTypes";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import useTokenData from "@/state/useTokenData";
import { formatter } from "@/utils/format";
import { useSwapMany } from "@/hooks/swap/useSwap";
import { useMemo } from "react";

export default function TokenSelectionDialog({
  open,
  onOpenChange,
  selectedTokenStrategy,
  onTokenStrategyChange,
}: TokenSelectionDialogProps) {
  const { whitelistedTokens, mainToken } = useTokenData();
  const priceData = usePriceData();
  const farmerSilo = useFarmerSilo();
  const farmerDeposits = farmerSilo.deposits;

  // Get LP tokens for swap calculations
  const lpTokens = useMemo(() => whitelistedTokens.filter((t) => t.isLP), [whitelistedTokens]);

  const swapArgs = useMemo(() => {
    return lpTokens.map((token) => {
      const amount = farmerDeposits.get(token)?.amount || TokenValue.ZERO;
      return {
        tokenIn: token,
        tokenOut: mainToken,
        amountIn: amount,
        slippage: 0.5,
        disabled: amount.eq(0),
      };
    });
  }, [mainToken, farmerDeposits, lpTokens]);

  // Create swap hooks for each LP token
  const swapQuotes = useSwapMany({
    args: swapArgs,
  });

  // Combine the results into a map
  const swapResults = useMemo(() => {
    const results = new Map<string, TokenValue>();
    lpTokens.forEach((token, i) => {
      const buyAmount = swapQuotes[i]?.data?.buyAmount;
      if (buyAmount) {
        results.set(token.address, buyAmount);
      }
    });
    return results;
  }, [lpTokens, swapQuotes]);

  const handleStrategySelect = (strategy: SowOrderTokenStrategy) => {
    onTokenStrategyChange(strategy);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 backdrop-blur-sm bg-black/30" />
        <DialogContent
          className="sm:max-w-[700px] mx-auto p-0 bg-white rounded-2xl border border-pinto-gray-2"
          style={{ padding: 0, gap: 0 }}
        >
          <div className="p-3">
            <DialogHeader className="mb-6 -mt-1">
              <DialogTitle className="font-medium mb-1 text-[1.25rem] tracking-normal">
                Select Token from Silo Deposits
              </DialogTitle>
              <DialogDescription className="text-gray-500 pb-1">
                Tractor allows you to fund Orders for Soil using Deposits
              </DialogDescription>
              <Separator />
            </DialogHeader>

            {/* Dynamic funding source options */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="text-gray-500">Dynamic funding source</div>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`flex items-center px-6 py-4 gap-2 rounded-[36px] cursor-pointer ${
                    selectedTokenStrategy.type === "LOWEST_PRICE"
                      ? "bg-[#F8F8F8] border border-pinto-gray-2"
                      : "bg-[#F8F8F8] border border-pinto-gray-2"
                  }`}
                  onClick={() => handleStrategySelect({ type: "LOWEST_PRICE" })}
                >
                  <div
                    className={`w-10 h-10 rounded-full ${
                      selectedTokenStrategy.type === "LOWEST_PRICE"
                        ? "bg-[#D8F1E2] border border-dashed border-[#387F5C]"
                        : "border border-pinto-gray-2"
                    }`}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-normal leading-[110%] text-black">Token with Best Price</span>
                    <span className="text-base font-normal leading-[110%] text-[#9C9C9C]">at time of execution</span>
                  </div>
                </div>

                <div
                  className={`flex items-center px-6 py-4 gap-2 rounded-[36px] cursor-pointer ${
                    selectedTokenStrategy.type === "LOWEST_SEEDS"
                      ? "bg-[#F8F8F8] border border-pinto-gray-2"
                      : "bg-[#F8F8F8] border border-pinto-gray-2"
                  }`}
                  onClick={() => handleStrategySelect({ type: "LOWEST_SEEDS" })}
                >
                  <div
                    className={`w-10 h-10 rounded-full ${
                      selectedTokenStrategy.type === "LOWEST_SEEDS"
                        ? "bg-[#D8F1E2] border border-dashed border-[#387F5C]"
                        : "border border-pinto-gray-2"
                    }`}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-normal leading-[110%] text-black">Token with Least Seeds</span>
                    <span className="text-base font-normal leading-[110%] text-[#9C9C9C]">at time of execution</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deposited Tokens */}
            <div className="flex flex-col gap-2">
              <div className="text-gray-500">Deposited Tokens</div>
              <div className="flex flex-col space-y-1 bg-white rounded-xl">
                {whitelistedTokens.map((token) => {
                  const deposit = farmerDeposits.get(token);
                  const amount = deposit?.amount || TokenValue.ZERO;

                  // Calculate dollar value - use price for PINTO, swap results for LP tokens
                  const pintoAmount =
                    token.symbol === "PINTO"
                      ? amount.mul(priceData.price)
                      : swapResults.get(token.address) || TokenValue.ZERO;

                  const isSelected =
                    selectedTokenStrategy.type === "SPECIFIC_TOKEN" &&
                    selectedTokenStrategy.address === token.address;

                  return (
                    <div
                      key={token.address}
                      className={`flex items-center justify-between py-4 cursor-pointer rounded-lg ${
                        isSelected ? "bg-green-50" : "bg-white"
                      }`}
                      onClick={() =>
                        handleStrategySelect({
                          type: "SPECIFIC_TOKEN",
                          address: token.address as `0x${string}`,
                        })
                      }
                    >
                      <div className="flex items-center gap-3">
                        <IconImage src={token.logoURI} alt={token.symbol} size={12} className="rounded-full" />
                        <div className="flex flex-col">
                          <div className="font-medium text-lg mb-1">{token.symbol}</div>
                          <div className="flex items-center text-xs text-gray-500 gap-1">
                            <IconImage src={stalkIcon} size={3} alt="Stalk" />{" "}
                            {formatter.number(deposit?.stalk?.total || 0)} Stalk
                            <IconImage src={seedIcon} size={3} alt="Seeds" className="ml-1" />{" "}
                            {formatter.number(deposit?.seeds || 0)} Seeds
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-right text-xl font-medium">
                          {amount.toNumber() > 0 && amount.toNumber() < 0.01
                            ? formatter.number(amount, { minDecimals: 4, maxDecimals: 8 })
                            : formatter.number(amount)}
                        </div>
                        <div className="text-right text-gray-500 text-sm">
                          ${formatter.number(pintoAmount, { minDecimals: 2, maxDecimals: 2 })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                <InfoOutlinedIcon width={14} height={14} />
                Deposits with the least Grown Stalk will always be used first
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}