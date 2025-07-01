import { TokenValue } from "@/classes/TokenValue";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import IconImage from "@/components/ui/IconImage";
import { Separator } from "@/components/ui/Separator";
import { Slider } from "@/components/ui/Slider";
import { MAIN_TOKEN } from "@/constants/tokens";
import { useMultiLPConversion, useExecuteMultiLPConversion } from "@/hooks/silo/useMultiLPConversion";
import { useChainConstant } from "@/utils/chain";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import { cn } from "@/utils/utils";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";

interface MultiLPConversionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lpTokens: Token[];
  onSuccess?: () => void;
}

export default function MultiLPConversionDialog({
  open,
  onOpenChange,
  lpTokens,
  onSuccess,
}: MultiLPConversionDialogProps) {
  const [percentage, setPercentage] = useState(100);
  const [isConverting, setIsConverting] = useState(false);
  const pintoToken = useChainConstant(MAIN_TOKEN);

  const {
    data: conversionQuote,
    isLoading: isQuoting,
    error: quoteError,
  } = useMultiLPConversion({
    lpTokens,
    percentage,
    slippage: 0.25, // 0.25% default slippage
    enabled: open && lpTokens.length >= 2,
  });

  const executeMultiLPConversion = useExecuteMultiLPConversion();

  const handleConvert = async () => {
    if (!conversionQuote?.enabled || !conversionQuote.workflow) {
      toast.error("Invalid conversion quote");
      return;
    }

    setIsConverting(true);
    try {
      await executeMultiLPConversion(conversionQuote);
      toast.success(`Successfully converted ${conversionQuote.conversions.length} LP tokens to Pinto!`);
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Multi-LP conversion failed:", error);
      toast.error("Conversion failed. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const isValid = conversionQuote?.enabled && conversionQuote.conversions.length >= 2;

  // Debug logging
  React.useEffect(() => {
    if (open) {
      console.log("MultiLPConversionDialog state:", {
        percentage,
        lpTokens: lpTokens.map(t => t.symbol),
        isQuoting,
        quoteError,
        conversionQuote: conversionQuote ? {
          enabled: conversionQuote.enabled,
          conversions: conversionQuote.conversions.length,
          totalFromAmount: conversionQuote.totalFromAmount.toHuman(),
          totalToAmount: conversionQuote.totalToAmount.toHuman(),
        } : null,
        isValid
      });
    }
  }, [open, percentage, lpTokens, isQuoting, quoteError, conversionQuote, isValid]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🌈</span>
            Convert All LP Tokens to Pinto
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Percentage Slider */}
          <Card className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="pinto-body font-medium">Conversion Amount</label>
                <div className="text-2xl font-bold text-pinto-green-4">{percentage}%</div>
              </div>
              
              <div className="px-2">
                <Slider
                  value={[percentage]}
                  onValueChange={(value) => setPercentage(value[0])}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between text-sm text-pinto-light">
                <span>1%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </Card>

          {/* Token List */}
          <div className="flex flex-col gap-3">
            <h3 className="pinto-body-light font-medium">Converting from these LP tokens:</h3>
            <div className="grid gap-2">
              {lpTokens.map((token, index) => {
                const conversionData = conversionQuote?.conversions.find(c => c.token.address === token.address);
                
                return (
                  <motion.div
                    key={token.address}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "p-3 transition-all",
                      conversionData ? "border-pinto-green-4/30 bg-pinto-green-4/5" : "border-pinto-gray-6"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconImage src={token.logoURI} size={8} />
                          <div>
                            <div className="pinto-body font-medium">{token.symbol}</div>
                            <div className="pinto-sm text-pinto-light">{token.name}</div>
                          </div>
                        </div>
                        
                        {conversionData ? (
                          <div className="text-right">
                            <div className="pinto-sm font-medium">
                              {formatter.token(conversionData.fromAmount, token)} →
                            </div>
                            <div className="pinto-sm text-pinto-green-4 font-medium">
                              {formatter.token(conversionData.toAmount, token)} Pinto
                            </div>
                          </div>
                        ) : (
                          <div className="pinto-sm text-pinto-light">
                            {isQuoting ? "Calculating..." : "No conversion"}
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Conversion Summary */}
          {conversionQuote && (
            <Card className="p-4 bg-pinto-green-4/5 border-pinto-green-4/30">
              <div className="flex flex-col gap-3">
                <h3 className="pinto-body font-medium text-pinto-green-4">Conversion Summary</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="pinto-sm text-pinto-light">Total Pinto Received</div>
                    <div className="pinto-body font-medium">
                      {formatter.token(conversionQuote.totalToAmount, pintoToken)} Pinto
                    </div>
                  </div>
                  
                  <div>
                    <div className="pinto-sm text-pinto-light">Tokens Converting</div>
                    <div className="pinto-body font-medium">
                      {conversionQuote.conversions.length} LP tokens
                    </div>
                  </div>
                  
                  <div>
                    <div className="pinto-sm text-pinto-light">Estimated Gas</div>
                    <div className="pinto-body font-medium">
                      ~{formatter.usd(conversionQuote.totalGasEstimate)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="pinto-sm text-pinto-light">Transaction Type</div>
                    <div className="pinto-body font-medium text-pinto-green-4">
                      Batch Convert
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Error Message */}
          {quoteError && (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="pinto-sm text-red-600">
                Failed to get conversion quote. Please try again.
              </div>
            </Card>
          )}

          {/* Debug Information (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="p-4 bg-gray-50 border-gray-200">
              <div className="pinto-xs text-gray-600">
                <div>Debug Info:</div>
                <div>Percentage: {percentage}%</div>
                <div>LP Tokens: {lpTokens.map(t => t.symbol).join(", ")}</div>
                <div>Is Quoting: {isQuoting ? "Yes" : "No"}</div>
                <div>Quote Enabled: {conversionQuote?.enabled ? "Yes" : "No"}</div>
                <div>Successful Conversions: {conversionQuote?.conversions.length || 0}</div>
                <div>Is Valid: {isValid ? "Yes" : "No"}</div>
                {conversionQuote && (
                  <div>Total Output: {conversionQuote.totalToAmount.toHuman()} Pinto</div>
                )}
              </div>
            </Card>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isConverting}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleConvert}
              disabled={!isValid || isQuoting || isConverting}
              className="flex-1 bg-gradient-to-r from-pinto-green-4 to-pinto-green-3 hover:from-pinto-green-3 hover:to-pinto-green-2"
            >
              {isConverting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Converting...
                </div>
              ) : isQuoting ? (
                "Calculating..."
              ) : (
                `Convert ${percentage}% to Pinto`
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="pinto-xs text-pinto-light text-center">
            This will convert {percentage}% of your selected LP token deposits to Pinto in a single transaction.
            All conversions will maintain your Stalk and optimize for maximum Seeds gain.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}