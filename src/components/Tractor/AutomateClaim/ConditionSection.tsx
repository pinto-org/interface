import { Col, Row } from "@/components/Container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { isValidCustomValue } from "@/lib/Tractor/claimOrder/automate-claim-helpers";
import type { ClaimFrequencyPreset } from "@/lib/Tractor/claimOrder/tractor-claim-types";
import { sanitizeNumericInputValue } from "@/utils/string";
import { cn } from "@/utils/utils";
import { CheckIcon } from "@radix-ui/react-icons";

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────

export interface ConditionSectionProps {
  /** Section title shown in the accordion header (e.g. "Mow my Silo"). */
  title: string;
  /** Whether a preset has been selected (shows green checkmark when true). */
  enabled: boolean;
  /** Currently selected preset, or null if none selected. */
  preset: ClaimFrequencyPreset | null;
  /** Value for the custom numeric input field. */
  customValue: string;
  /** Callback when a preset button is clicked. */
  onPresetChange: (preset: ClaimFrequencyPreset | null) => void;
  /** Callback when the custom input value changes. */
  onCustomValueChange: (value: string) => void;
  /** Unit label shown inside the custom input (e.g. "Stalk" or "PINTO"). */
  unit?: string;
}

// ────────────────────────────────────────────────────────────────────────────────
// Preset button metadata
// ────────────────────────────────────────────────────────────────────────────────

interface PresetMeta {
  key: ClaimFrequencyPreset;
  label: string;
}

const PRESET_BUTTONS: PresetMeta[] = [
  { key: "high", label: "Aggressively" },
  { key: "medium", label: "Medium-Aggressively" },
  { key: "low", label: "Not-Aggressively" },
  { key: "custom", label: "Custom" },
];

// ────────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────────

export const ConditionSection = ({
  title,
  enabled,
  preset,
  customValue,
  onPresetChange,
  onCustomValueChange,
  unit,
}: ConditionSectionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem className="border-[1px] px-4 border-pinto-gray-2 rounded-md bg-white" value="condition">
        {/* Header: title + green checkmark + chevron */}
        <AccordionTrigger className="pinto-body-light text-pinto-primary py-4" iconClassName="text-pinto-secondary">
          <Row className="gap-2 items-center">
            <span>{title}</span>
            {enabled && <CheckIcon className="w-4 h-4 text-pinto-green-4" />}
          </Row>
        </AccordionTrigger>

        {/* Expanded content: preset buttons + optional custom input */}
        <AccordionContent className="pb-2 pt-0">
          <Col className="gap-3">
            {/* Preset buttons grid */}
            <div className="grid grid-cols-4 gap-2">
              {PRESET_BUTTONS.map((btn) => {
                const isSelected = preset === btn.key;

                // When "custom" is selected, show inline input instead of button
                if (btn.key === "custom" && isSelected) {
                  const isValid = isValidCustomValue(customValue);

                  return (
                    <div
                      key={btn.key}
                      className={cn(
                        "flex items-center justify-center rounded-lg border px-1",
                        isValid ? "border-pinto-green-4 bg-pinto-green-1/50" : "border-pinto-gray-2 bg-pinto-gray-1",
                      )}
                    >
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder={unit ?? "0"}
                        value={customValue}
                        onChange={(e) => {
                          // 18 = max decimal precision to accommodate all token types (Stalk=10, PINTO=6)
                          const sanitized = sanitizeNumericInputValue(e.target.value, 18);
                          onCustomValueChange(sanitized.str);
                        }}
                        className={cn(
                          "w-full text-center pinto-xs bg-transparent outline-none",
                          isValid
                            ? "text-pinto-green-4 placeholder:text-pinto-green-4/50"
                            : "text-pinto-gray-4 placeholder:text-pinto-gray-3",
                        )}
                      />
                    </div>
                  );
                }

                return (
                  <PresetButton
                    key={btn.key}
                    label={btn.label}
                    selected={isSelected}
                    onClick={() => onPresetChange(isSelected ? null : btn.key)}
                  />
                );
              })}
            </div>
          </Col>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Internal: Preset Button
// ────────────────────────────────────────────────────────────────────────────────

const PresetButton = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center rounded-lg border px-3 py-3 text-center transition-colors cursor-pointer pinto-sm-light",
      selected
        ? "border-pinto-green-4 bg-pinto-green-1/50 text-pinto-green-4"
        : "border-pinto-gray-2 bg-white text-pinto-primary hover:bg-pinto-green-1/30",
    )}
  >
    {label}
  </button>
);
