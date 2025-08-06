import DepositForm from "@/components/silo/forms/DepositForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Token } from "@/utils/types";
import { ReactNode, useState } from "react";

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
  const handleSuccess = () => {
    onSuccess?.();
  };

  // Only show DepositForm for deposit actions
  // Withdraw and Convert actions need proper form implementations
  if (defaultAction === "deposit") {
    return (
      <div className="w-full max-w-2xl mx-auto">
        {DepositForm && <DepositForm siloToken={siloToken} onSuccess={handleSuccess} />}
      </div>
    );
  }

  // Placeholder for withdraw and convert actions
  return (
    <div className="w-full max-w-2xl mx-auto p-6 text-center">
      <div className="text-lg font-medium text-pinto-gray-5 mb-2">
        {defaultAction === "withdraw" ? "Withdraw" : "Convert"} {siloToken?.symbol || "Token"}
      </div>
      <div className="text-pinto-gray-4">
        {defaultAction === "withdraw"
          ? "Withdraw functionality will be available soon. Please use the Silo page for withdrawals."
          : "Convert functionality will be available soon. Please use the Silo page for conversions."}
      </div>
    </div>
  );
};

const SiloActionDialog = ({ children, siloToken, defaultAction = "deposit", onOpenChange }: SiloActionDialogProps) => {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <SiloActionDialogContent
          siloToken={siloToken}
          defaultAction={defaultAction}
          onSuccess={() => onOpenChange?.(false)}
          DepositForm={DepositForm}
        />
      </DialogContent>
    </Dialog>
  );
};

export { SiloActionDialog, SiloActionDialogContent };
export type { SiloActionFormProps };
