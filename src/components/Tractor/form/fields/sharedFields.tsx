import arrowDown from "@/assets/misc/ChevronDown.svg";
import { Row } from "@/components/Container";
import TooltipSimple from "@/components/TooltipSimple";
import { Button } from "@/components/ui/Button";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { TractorTokenStrategy, extractAddressesFromTokenStrategy } from "@/lib/Tractor";
import { getTokenIndex } from "@/utils/token";
import { useFormContext, useWatch } from "react-hook-form";

const empty = [];

export const TokenStrategyFormField = ({
  openDialog,
  label = "Fund order using",
  selectText = "Select Tokens",
  tooltipText,
}: {
  label: string | JSX.Element;
  selectText?: string;
  tooltipText?: string;
  openDialog: () => void;
}) => {
  const ctx = useFormContext<{ tokenStrategy: TractorTokenStrategy }>();
  const tokenMap = useTokenMap();

  const strategy = useWatch({ control: ctx.control, name: "tokenStrategy" });

  const addresses = extractAddressesFromTokenStrategy(strategy);

  const tokens = addresses?.map((tkAddress) => tokenMap[getTokenIndex(tkAddress)]) || empty;

  const dynamicSource = strategy.type === "LOWEST_SEEDS" || strategy.type === "LOWEST_PRICE";

  const dynamicSourceText = dynamicSource
    ? strategy.type === "LOWEST_SEEDS"
      ? "Token with Least Seeds"
      : "Token with Best Price"
    : undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Row className="gap-1 items-center">
          {typeof label === "string" ? <Label variant="form">{label}</Label> : label}
          <TooltipSimple content={tooltipText} variant="outlined" disabled={!tooltipText} />
        </Row>
        <Button
          variant="outline-gray-shadow"
          size="xl"
          rounded="full"
          onClick={openDialog}
          className="flex flex-row gap-2"
        >
          {dynamicSourceText ? (
            dynamicSourceText
          ) : tokens.length === 1 ? (
            <div className="flex items-center gap-2">
              <IconImage src={tokens?.[0]?.logoURI} alt="token" size={6} className="rounded-full" />
              <div className="pinto-body-light">{tokens?.[0]?.symbol}</div>
            </div>
          ) : tokens.length > 1 ? (
            <Row className="items-center">
              {tokens?.map((token, i) => (
                <div key={`token-strategy-select-${token.symbol}`} className={i !== 0 ? "-ml-2" : ""}>
                  <IconImage src={token.logoURI} alt="token" size={6} className="rounded-full" />
                </div>
              ))}
            </Row>
          ) : (
            selectText
          )}
          <IconImage src={arrowDown} size={3} alt="open token select dialog" />
        </Button>
      </div>
    </div>
  );
};
