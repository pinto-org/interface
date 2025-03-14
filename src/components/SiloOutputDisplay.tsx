import { TokenValue } from "@/classes/TokenValue";
import OutputDisplay from "@/components/OutputDisplay";
import { SEEDS, STALK } from "@/constants/internalTokens";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";

interface SiloOutputDisplayProps {
  title?: string;
  amount?: TokenValue;
  token?: Token;
  stalk: TokenValue;
  seeds: TokenValue;
  showNegativeDeltas?: boolean;
}

export default function SiloOutputDisplay({
  title = "I receive",
  amount,
  token,
  stalk,
  seeds,
  showNegativeDeltas = false,
}: SiloOutputDisplayProps) {
  const deltaMultiplier = showNegativeDeltas ? -1 : 1;

  return (
    <OutputDisplay title={title}>
      {amount && token && (
        <OutputDisplay.Item label="Deposited Amount">
          <OutputDisplay.Value
            value={formatter.token(amount, token)}
            token={token}
            suffix={token.symbol}
            className="whitespace-nowrap"
          />
        </OutputDisplay.Item>
      )}
      <OutputDisplay.Item label="Stalk">
        <OutputDisplay.Value
          value={formatter.twoDec(stalk)}
          suffix="Stalk"
          delta={stalk.toNumber() * deltaMultiplier}
          token={STALK}
          showArrow={stalk.toNumber() !== 0}
          className="whitespace-nowrap"
        />
      </OutputDisplay.Item>
      <OutputDisplay.Item label="Seed">
        <OutputDisplay.Value
          value={formatter.twoDec(seeds)}
          suffix="Seeds"
          delta={seeds.toNumber() * deltaMultiplier}
          token={SEEDS}
          showArrow={seeds.toNumber() !== 0}
          className="whitespace-nowrap"
        />
      </OutputDisplay.Item>
    </OutputDisplay>
  );
}
