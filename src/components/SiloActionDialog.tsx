import { TokenValue } from "@/classes/TokenValue";
import SiloTokenBDVChart from "@/components/charts/SiloTokenBDVChart";
import ConvertForm from "@/components/silo/forms/ConvertForm";
import DepositForm from "@/components/silo/forms/DepositForm";
import WithdrawForm from "@/components/silo/forms/WithdrawForm";
import { Card } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useSiloBDVChartData } from "@/hooks/silo/useSiloBDVChartData";
import { Token } from "@/utils/types";
import { ReactNode, useCallback, useMemo, useState } from "react";

export type SiloActionType = "deposit" | "withdraw" | "convert";

interface SiloActionDialogProps {
  children: ReactNode;
  siloToken?: Token;
  defaultAction?: SiloActionType;
  onOpenChange?: (open: boolean) => void;
}

interface SiloActionFormProps {
  siloToken?: Token;
  onSuccess?: () => void;
  onPreviewChange?: (token?: Token, bdvGain?: TokenValue) => void;
}

export interface SiloActionDialogContentProps {
  siloToken?: Token;
  defaultAction?: SiloActionType;
  onSuccess?: () => void;
  DepositForm?: React.ComponentType<SiloActionFormProps>;
  WithdrawForm?: React.ComponentType<SiloActionFormProps>;
  ConvertForm?: React.ComponentType<SiloActionFormProps>;
}

const SiloActionDialogContent = ({
  siloToken,
  defaultAction = "deposit",
  onSuccess,
  DepositForm,
  WithdrawForm,
  ConvertForm,
}: SiloActionDialogContentProps) => {
  const { tokenBDVData, whitelistedTokens, isLoading, hasDeposits } = useSiloBDVChartData();

  // State for deposit preview
  const [previewToken, setPreviewToken] = useState<Token | undefined>();
  const [previewBDVGain, setPreviewBDVGain] = useState<TokenValue | undefined>();

  const handleSuccess = () => {
    onSuccess?.();
  };

  // Memoize the preview change handler to prevent infinite re-renders
  const handlePreviewChange = useCallback((token?: Token, bdvGain?: TokenValue) => {
    setPreviewToken(token);
    setPreviewBDVGain(bdvGain);
  }, []);

  // Show DepositForm for deposit actions
  if (defaultAction === "deposit") {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-center">
          {/* Chart Column - only show if user has deposits */}
          {hasDeposits && (
            <div className="order-2 lg:order-1">
              <SiloTokenBDVChart
                tokenBDVData={tokenBDVData}
                whitelistedTokens={whitelistedTokens}
                isLoading={isLoading}
                previewToken={previewToken}
                previewBDVGain={previewBDVGain}
              />
            </div>
          )}

          {/* Form Column */}
          <div className={`order-1 lg:order-2 ${hasDeposits ? "" : "lg:col-span-2 max-w-2xl mx-auto"}`}>
            <Card className="p-4">
              {DepositForm && (
                <DepositForm siloToken={siloToken} onSuccess={handleSuccess} onPreviewChange={handlePreviewChange} />
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show WithdrawForm for withdraw actions
  if (defaultAction === "withdraw") {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-center">
          {/* Chart Column - only show if user has deposits */}
          {hasDeposits && (
            <div className="order-2 lg:order-1">
              <SiloTokenBDVChart
                tokenBDVData={tokenBDVData}
                whitelistedTokens={whitelistedTokens}
                isLoading={isLoading}
                previewToken={previewToken}
                previewBDVGain={previewBDVGain}
              />
            </div>
          )}

          {/* Form Column */}
          <div className={`order-1 lg:order-2 ${hasDeposits ? "" : "lg:col-span-2 max-w-2xl mx-auto"}`}>
            <Card className="p-4">
              {WithdrawForm && (
                <WithdrawForm siloToken={siloToken} onSuccess={handleSuccess} onPreviewChange={handlePreviewChange} />
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show ConvertForm for convert actions
  if (defaultAction === "convert") {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-center">
          {/* Chart Column - only show if user has deposits */}
          {hasDeposits && (
            <div className="order-2 lg:order-1">
              <SiloTokenBDVChart
                tokenBDVData={tokenBDVData}
                whitelistedTokens={whitelistedTokens}
                isLoading={isLoading}
                previewToken={previewToken}
                previewBDVGain={previewBDVGain}
              />
            </div>
          )}

          {/* Form Column */}
          <div className={`order-1 lg:order-2 ${hasDeposits ? "" : "lg:col-span-2 max-w-2xl mx-auto"}`}>
            <Card className="p-4">
              {ConvertForm && (
                <ConvertForm siloToken={siloToken} onSuccess={handleSuccess} onPreviewChange={handlePreviewChange} />
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for unknown actions
  return (
    <div className="w-full max-w-2xl mx-auto p-6 text-center">
      <div className="text-lg font-medium text-pinto-gray-5 mb-2">Unknown Action</div>
      <div className="text-pinto-gray-4">Please select a valid action.</div>
    </div>
  );
};

const SiloActionDialog = ({ children, siloToken, defaultAction = "deposit", onOpenChange }: SiloActionDialogProps) => {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto border-none shadow-none bg-transparent p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {defaultAction === "deposit" && "Deposit"}
            {defaultAction === "withdraw" && "Withdraw"}
            {defaultAction === "convert" && "Convert"}
          </DialogTitle>
        </DialogHeader>
        <SiloActionDialogContent
          siloToken={siloToken}
          defaultAction={defaultAction}
          onSuccess={() => onOpenChange?.(false)}
          DepositForm={DepositForm}
          WithdrawForm={WithdrawForm}
          ConvertForm={ConvertForm}
        />
      </DialogContent>
    </Dialog>
  );
};

export { SiloActionDialog, SiloActionDialogContent };
export type { SiloActionFormProps };
