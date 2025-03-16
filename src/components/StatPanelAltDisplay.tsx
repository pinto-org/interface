import { TokenValue } from "@/classes/TokenValue";
import { useClaimRewards } from "@/hooks/useClaimRewards";
import { navbarPanelAtom } from "@/state/app/navBar.atoms";
import { formatter } from "@/utils/format";
import { useAtom } from "jotai";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import TooltipSimple from "./TooltipSimple";
import { Separator } from "./ui/Separator";
import { PrivateModeWrapper } from "./PrivateModeWrapper";

interface StatPanelAltDisplayProps {
  depositedValue: TokenValue;
  claimableValue: TokenValue;
  siloWrappedValue: TokenValue;
  siloWrappedExternal: TokenValue;
  siloWrappedInternal: TokenValue;
  farmBalance: TokenValue;
  claimableFlood: TokenValue;
  setHoveredButton: Dispatch<SetStateAction<string>>;
}

export default function StatPanelAltDisplay({
  depositedValue = TokenValue.ZERO,
  claimableValue = TokenValue.ZERO,
  siloWrappedValue = TokenValue.ZERO,
  siloWrappedExternal = TokenValue.ZERO,
  siloWrappedInternal = TokenValue.ZERO,
  farmBalance = TokenValue.ZERO,
  claimableFlood = TokenValue.ZERO,
  setHoveredButton = () => { },
}: StatPanelAltDisplayProps) {
  const [panelState, setPanelState] = useAtom(navbarPanelAtom);
  const { submitClaimRewards } = useClaimRewards();
  const navigate = useNavigate();

  const hasSiloWrappedExternal = siloWrappedExternal.gt(0);
  const hasSiloWrappedInternal = siloWrappedInternal.gt(0);
  const totalSiloWrapped = siloWrappedExternal.add(siloWrappedInternal);

  const getSiloWrappedTooltip = () => {
    const amount = formatter.twoDec(totalSiloWrapped, { allowZero: true });
    if (hasSiloWrappedExternal && !hasSiloWrappedInternal) {
      return `Value of ${amount} Wrapped Silo Pinto in your Wallet balance.`;
    } else if (!hasSiloWrappedExternal && hasSiloWrappedInternal) {
      return `Value of ${amount} Wrapped Silo Pinto in your Farm balance.`;
    } else if (hasSiloWrappedExternal && hasSiloWrappedInternal) {
      return `Value of ${amount} Wrapped Silo Pinto in your Wallet / Farm balance.`;
    } else {
      return "Value of the Wrapped Silo Pinto in your Wallet / Farm balance.";
    }
  };

  const openWalletPanel = (showClaimFlood?: boolean, showManageFarm?: boolean) => {
    setPanelState({
      ...panelState,
      openPanel: "wallet",
      backdropMounted: true,
      backdropVisible: true,
      walletPanel: {
        ...panelState.walletPanel,
        showClaim: !!showClaimFlood,
        balanceTab: showManageFarm ? "internal" : panelState.walletPanel.balanceTab,
      },
    });
  };

  return (
    <div
      className={`pinto-sm sm:pinto-body-light font-thin sm:font-thin pointer-events-none sm:pointer-events-auto text-pinto-light sm:text-pinto-light flex flex-col ${claimableFlood.gt(0) ? "lg:flex-row" : "sm:flex-row"} items-start sm:items-center gap-1 sm:gap-8 lg:gap-6 whitespace-nowrap`}
    >
      <span className="flex flex-col sm:flex-row gap-1 sm:gap-6 items-start sm:items-center">
        <span
          className={`flex flex-col relative group transition-colors ${claimableValue.gt(0) ? "sm:hover:cursor-pointer sm:hover:text-pinto-green-4" : ""}`}
          onClick={() => (claimableValue.gt(0) ? submitClaimRewards() : undefined)}
          onMouseEnter={() => claimableValue.gt(0) && setHoveredButton("claim")}
          onMouseLeave={() => claimableValue.gt(0) && setHoveredButton("")}
        >
          <span className="inline-flex items-center gap-1">
            <span className="inline-flex items-center gap-1">
              <span>Deposited Value: </span>
              <PrivateModeWrapper variant="short">
                {depositedValue.lte(0) ? "-" : formatter.usd(depositedValue)}
              </PrivateModeWrapper>

              {claimableValue.gt(0) && (
                <span className="text-pinto-green-4">
                  + <PrivateModeWrapper variant="short">{formatter.usd(claimableValue)}</PrivateModeWrapper>
                </span>
              )}
            </span>
            <TooltipSimple
              variant={claimableValue.gt(0) ? "green" : "gray"}
              content={"Deposited and Claimable value in the Silo"}
            />
          </span>
          {claimableValue.gt(0) && (
            <span className="absolute top-4 opacity-0 transition-all sm:group-hover:top-6 sm:group-hover:opacity-100 pinto-sm-light text-pinto-gray-3 text-center w-full">
              Click to Claim Pinto
            </span>
          )}
        </span>
        <Separator orientation="vertical" className="h-[0.875rem] hidden sm:block" />
        <span
          className="flex flex-col relative group sm:hover:cursor-pointer sm:hover:text-pinto-green-4 transition-colors"
          onClick={() => navigate(`/wrap`)}
        >
          <span className="inline-flex items-center gap-1">
            <span>
              sPINTO:{" "}
              <PrivateModeWrapper>
                {siloWrappedValue.lte(0) ? "-" : formatter.usd(siloWrappedValue)}
              </PrivateModeWrapper>
            </span>
            <TooltipSimple variant="gray" content={getSiloWrappedTooltip()} />
          </span>
          <span className="absolute top-4 opacity-0 transition-all sm:group-hover:top-6 sm:group-hover:opacity-100 pinto-sm-light text-pinto-gray-3 text-center w-full">
            Click to Wrap
          </span>
        </span>
      </span>
      <Separator
        orientation="vertical"
        className={`h-[0.875rem] hidden sm:block ${claimableFlood.gt(0) ? "sm:hidden lg:block" : ""}`}
      />
      <span className="flex flex-col sm:flex-row gap-1 sm:gap-6 items-start sm:items-center">
        <span
          className="flex flex-col relative group sm:hover:cursor-pointer sm:hover:text-pinto-green-4 transition-colors"
          onClick={() => openWalletPanel(false, true)}
        >
          <span className="inline-flex items-center gap-1">
            <span>
              Farm Balance:{" "}
              <PrivateModeWrapper>
                {farmBalance.lte(0) ? "-" : formatter.usd(farmBalance)}
              </PrivateModeWrapper>
            </span>
            <TooltipSimple
              variant="gray"
              content={"Value of your Farm Balance, ERC-20 tokens stored by the protocol on your behalf."}
            />
          </span>
          <span className="absolute top-4 opacity-0 transition-all sm:group-hover:top-6 sm:group-hover:opacity-100 pinto-sm-light text-pinto-gray-3 text-center w-full">
            Click to View
          </span>
        </span>
        {claimableFlood.gt(0) && (
          <>
            <Separator orientation="vertical" className="h-[0.875rem] hidden sm:block" />
            <span
              className="flex flex-col relative group sm:hover:cursor-pointer sm:hover:text-pinto-green-4 transition-colors"
              onClick={() => openWalletPanel(true, false)}
            >
              <span className="inline-flex items-center gap-1">
                <span>
                  Claimable Flood: <span className="text-pinto-green-4">{formatter.usd(claimableFlood)}</span>
                </span>
                <TooltipSimple variant="gray" content={"Claimable value from Flood."} />
              </span>
              <span className="absolute top-4 opacity-0 transition-all sm:group-hover:top-6 sm:group-hover:opacity-100 pinto-sm-light text-pinto-gray-3 text-center w-full">
                Click to Claim Flood
              </span>
            </span>
          </>
        )}
      </span>
    </div>
  );
}
