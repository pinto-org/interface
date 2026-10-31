import { InfoOutlinedIcon } from "@/components/Icons";
import TooltipSimple from "@/components/TooltipSimple";
import IconImage from "@/components/ui/IconImage";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import type { Token } from "@/utils/types";
import type { ReactNode } from "react";
import { formatUnits } from "viem";

export default function WithdrawAs({
  token,
  outputs,
  onChange,
  disabled,
  estimated,
  loading,
  sameToken,
  info,
}: {
  token: Token;
  outputs: Token[];
  onChange: (token: Token) => void;
  disabled: boolean;
  estimated?: bigint;
  loading?: boolean;
  sameToken?: boolean;
  info?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-pinto-gray-3 bg-white p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1">
        <Label className="pinto-body-light text-pinto-light">Withdraw as</Label>
        {info && (
          <TooltipSimple
            content={info}
            variant="outlined"
            showOnMobile
            side="top"
            align="start"
            className="max-w-80 sm:max-w-80"
          >
            <button
              type="button"
              aria-label="About fee-free withdrawal routing"
              className="inline-flex items-center text-pinto-gray-4"
            >
              <InfoOutlinedIcon />
            </button>
          </TooltipSimple>
        )}
      </div>
      <Select
        value={token.address}
        onValueChange={(address) => {
          const next = outputs.find((output) => output.address === address);
          if (next) onChange(next);
        }}
        disabled={disabled}
      >
        <SelectTrigger aria-label="Withdraw as">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {outputs.map((output) => (
            <SelectItem key={output.address} value={output.address}>
              <span className="flex items-center gap-2">
                <IconImage src={output.logoURI} size={5} />
                {output.symbol}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {sameToken && (
        <p className="text-sm text-pinto-gray-5">Choose another token to use a fee-free exit for eligible deposits.</p>
      )}
      <div className="flex flex-wrap justify-between gap-2" aria-live="polite">
        <span className="pinto-sm-light text-pinto-light">Estimated output</span>
        <span className="pinto-body-light">
          {loading
            ? "Getting estimate…"
            : estimated === undefined
              ? "—"
              : `${formatUnits(estimated, token.decimals)} ${token.symbol}`}
        </span>
      </div>
    </div>
  );
}
