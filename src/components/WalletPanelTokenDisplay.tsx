import { TokenValue } from "@/classes/TokenValue";
import { formatter } from "@/utils/format";
import { Token } from "@/utils/types";
import DonutChart from "./DonutChart";
import { ChevronDownIcon } from "./Icons";
import { Toggle } from "./ui/Toggle";

interface TokenBalances {
  external: TokenValue;
  internal: TokenValue;
  total: TokenValue;
}

interface TokenBalanceToggleProps {
  token: Token;
  balances: TokenBalances;
  price: TokenValue;
  balanceType?: "total" | "external" | "internal";
  showDonutChart?: boolean;
  useAltValueColor?: boolean;
  blankUSDValue?: boolean;
}

const WalletPanelTokenDisplay = ({
  token,
  balances,
  price,
  balanceType = "total", // Can be 'total', 'external', or 'internal'
  showDonutChart = true,
  useAltValueColor = false,
  blankUSDValue = false,
}: TokenBalanceToggleProps) => {
  // Get the appropriate balance based on type
  const getDisplayBalance = () => {
    switch (balanceType) {
      case "external":
        return balances.external;
      case "internal":
        return balances.internal;
      default:
        return balances.total;
    }
  };

  const displayBalance = getDisplayBalance();
  const displayValue = displayBalance.mul(price);

  return (
    <Toggle
      key={`${token.address}_${balanceType}Balance`}
      className="flex flex-row w-full gap-2 sm:gap-4 group overflow-hidden transition-all hover:bg-pinto-gray-1 hover:cursor-pointer data-[state=on]:bg-white data-[state=on]:hover:bg-pinto-gray-1 data-[state=off]:hover:bg-pinto-gray-1 data-[state=off]:bg-pinto-off-white rounded-[0.75rem] h-auto px-4 py-2 items-start"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
        <img src={token.logoURI} alt={`${token.symbol} token logo`} className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col text-left gap-1 sm:gap-2 sm:my-1">
            <span className="text-[1rem] sm:text-[1.25rem] text-pinto-gray-5">{token.symbol}</span>
            <span className="font-[340] transition-all group-hover:text-pinto-green text-pinto-gray-4 inline-flex gap-1 items-center">
              {balanceType === "total" && showDonutChart ? (
                <>
                  <div className="relative">
                    <DonutChart
                      data={{
                        labels: ["Farm Balance", "Wallet Balance"],
                        datasets: [
                          {
                            label: "",
                            data: token.isNative
                              ? [0, Number(balances.external)]
                              : [Number(balances.internal), Number(balances.external)],
                            backgroundColor: ["rgb(254, 225, 140)", "rgb(36, 102, 69)"],
                            borderWidth: 0,
                          },
                        ],
                      }}
                    />
                  </div>
                  <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light place-self-end sm:place-self-auto">
                    {`${displayBalance.toHuman("short")} ${token.symbol}`}
                  </div>
                  <ChevronDownIcon
                    color={"currentColor"}
                    className={"transform transition-transform group-data-[state=on]:-scale-y-100"}
                  />
                </>
              ) : (
                <div className="pinto-xs sm:pinto-sm text-pinto-light sm:text-pinto-light">{`${displayBalance.toHuman("short")} ${token.symbol}`}</div>
              )}
            </span>
          </div>
          <span
            className={`text-[1.25rem] sm:text-[1.5rem] font-[500] ${useAltValueColor ? "text-pinto-gray-4" : "text-pinto-gray-5"}`}
          >
            {!blankUSDValue ? formatter.usd(displayValue) : "-"}
          </span>
        </div>
        {balanceType === "total" && showDonutChart && (
          <div className="h-0 opacity-0 group-data-[state=on]:h-auto group-data-[state=on]:opacity-100 transition-all duration-200">
            <div className="flex flex-col gap-1 py-2">
              <div className="font-[340] text-[0.875rem] sm:text-[1rem] text-pinto-gray-4 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className="rounded-full bg-pinto w-3 h-3 flex-shrink-0" />
                  <div>Wallet Balance</div>
                </div>
                <div>{`${balances.external.toHuman("short")} ${token.symbol}`}</div>
              </div>
              {token.symbol !== "ETH" && (
                <div className="font-[340] text-[0.875rem] sm:text-[1rem] text-pinto-gray-4 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <div className="rounded-full bg-pinto-morning-yellow-1 w-3 h-3 flex-shrink-0" />
                    <div>Farm Balance</div>
                  </div>
                  <div>{`${balances.internal.toHuman("short")} ${token.symbol}`}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Toggle>
  );
};

export default WalletPanelTokenDisplay;
