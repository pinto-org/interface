import { Switch } from "@/components/ui/Switch";
import { cn } from "@/utils/utils";
import React from "react";

export type ValueMode = "BDV" | "USD";

interface ValueModeToggleProps {
  mode: ValueMode;
  onModeChange: (mode: ValueMode) => void;
  className?: string;
}

const ValueModeToggle: React.FC<ValueModeToggleProps> = ({ mode, onModeChange, className }) => {
  const handleToggle = (checked: boolean) => {
    console.log("ValueModeToggle: toggle clicked", { checked, currentMode: mode });
    onModeChange(checked ? "USD" : "BDV");
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          mode === "BDV" ? "text-pinto-gray-5" : "text-pinto-gray-3",
        )}
      >
        BDV
      </span>
      <Switch
        checked={mode === "USD"}
        onCheckedChange={handleToggle}
        variant="default"
        aria-label="Toggle between BDV and USD value display"
      />
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          mode === "USD" ? "text-pinto-gray-5" : "text-pinto-gray-3",
        )}
      >
        USD
      </span>
    </div>
  );
};

export default ValueModeToggle;
