import chevronDown from "@/assets/misc/ChevronDown.svg";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Hooks
import { useClaimRewards } from "@/hooks/useClaimRewards";
import useFarmerActions from "@/hooks/useFarmerActions";
import { useTotalSoil } from "@/state/useFieldData";

// Utils
import { formatter } from "@/utils/format";

import { navbarPanelAtom } from "@/state/app/navBar.atoms";
import { getSiloConvertUrl } from "@/utils/url";
import { useAtom } from "jotai";
import MobileActionBar from "./MobileActionBar";
// Components
import { Button } from "./ui/Button";
import IconImage from "./ui/IconImage";
import { TabletPanel } from "./ui/Panel";

interface Action {
  id: string;
  label: string;
  variant?: "gradient" | "outline-primary";
  onClick: () => void;
  enabled: boolean;
  priority: number;
}

const useAvailableActions = () => {
  const navigate = useNavigate();
  const { submitClaimRewards } = useClaimRewards();
  const farmerActions = useFarmerActions();
  const totalSoil = useTotalSoil().totalSoil;
  const [panelState, setPanelState] = useAtom(navbarPanelAtom);

  // Compute all possible states
  const isSoilAvailable = totalSoil.gt(0);
  const hasHarvestablePods = !farmerActions.harvestPods.outputs.podGain.eq(0);
  const claimEnabled =
    (farmerActions.claimRewards.enabled && farmerActions.claimRewards.outputs.stalkGain.gt(0.01)) ||
    farmerActions.updateDeposits.enabled;
  const floodValue = farmerActions.floodAssets.totalValue;
  const convertEnabled = farmerActions.convertDeposits.enabled;
  const convertFrom = farmerActions.convertDeposits.bestConversion.from;
  const convertTo = farmerActions.convertDeposits.bestConversion.to;
  const canWrap = farmerActions.canWrapPinto;

  // Define all possible actions with their priority (higher number = higher priority)
  const actions: Action[] = [
    {
      id: "claim",
      label: "Claim Yield",
      variant: "gradient",
      onClick: submitClaimRewards,
      enabled: claimEnabled,
      priority: 5,
    },
    {
      id: "convert",
      label: `Convert ${convertFrom?.name} to ${convertTo?.name}`,
      onClick: () => {
        convertFrom && convertTo && navigate(getSiloConvertUrl(convertFrom, convertTo));
      },
      enabled: convertEnabled && !!convertFrom && !!convertTo,
      priority: 4,
    },
    {
      id: "fieldAction",
      label: hasHarvestablePods ? "Harvest Pods" : "Sow (Lend) in the Field for Pods",
      onClick: () => navigate(hasHarvestablePods ? "/field?action=harvest" : "/field?action=sow"),
      enabled: isSoilAvailable || hasHarvestablePods,
      priority: 3,
    },
    {
      id: "flood",
      label: `Claim ${formatter.usd(floodValue)} from Flood`,
      onClick: () => {
        setPanelState({
          ...panelState,
          openPanel: "wallet",
          backdropMounted: true,
          backdropVisible: true,
          walletPanel: {
            ...panelState.walletPanel,
            showClaim: true,
            showTransfer: false,
          },
        });
      },
      enabled: floodValue.gt(0),
      priority: 2,
    },
    {
      id: "wrap",
      label: "Wrap Deposited Pinto",
      onClick: () => {
        navigate("/wrap");
      },
      enabled: canWrap,
      priority: 2,
    },
    {
      id: "manageWallet",
      label: "Manage Farm and Wallet Balances",
      onClick: () => {
        setPanelState({
          ...panelState,
          openPanel: "wallet",
          backdropMounted: true,
          backdropVisible: true,
          walletPanel: {
            ...panelState.walletPanel,
            showClaim: false,
            showTransfer: false,
          },
        });
      },
      enabled: true,
      priority: 1,
    },
  ];

  // Get available actions and sort by priority
  const availableActions = actions.filter((action) => action.enabled).sort((a, b) => b.priority - a.priority);

  // Get the highest priority action (if any)
  const mainAction = availableActions.find((action) => action.enabled && action.variant === "gradient") || null;

  // Get remaining actions for the panel
  const secondaryActions = availableActions.filter((action) => action.variant !== "gradient");

  return {
    mainAction,
    secondaryActions,
    hasActions: availableActions.length > 0,
  };
};

const ActionButton = ({ action }: { action: Action }) => (
  <Button
    variant={action.variant || "outline-primary"}
    rounded="full"
    className="w-full text-black pinto-sm"
    onClick={action.onClick}
  >
    {action.label}
  </Button>
);

const MoreActions = ({ actions, mainActionAvailable }: { actions: Action[]; mainActionAvailable: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (actions.length === 0) return null;

  return (
    <TabletPanel
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      side="right"
      panelProps={{
        className: `max-w-panel-price w-panel-price mt-4 ${
          isOpen ? "translate-x-12 mr-12" : "translate-x-full -mr-12"
        }`,
      }}
      trigger={
        <Button variant="ghost" className="flex flex-1 pinto-sm gap-2">
          {mainActionAvailable ? "Show more actions" : "Show recommended actions"}
          <IconImage src={chevronDown} size={4} mobileSize={2.5} alt="chevron down" />
        </Button>
      }
    >
      <div className="flex flex-col p-6 gap-6">
        <div className="flex flex-row justify-between">
          <span className="pinto-body">Suggested Actions</span>
          <div onClick={() => setIsOpen(false)} className="cursor-pointer">
            <IconImage size={6} src={Cross2Icon} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {actions.map((action) => (
            <ActionButton key={action.id} action={action} />
          ))}
        </div>
      </div>
    </TabletPanel>
  );
};

const ActionsMenu = ({ showOnTablet }: { showOnTablet?: boolean }) => {
  const { mainAction, secondaryActions, hasActions } = useAvailableActions();

  if (!hasActions) return null;
  return (
    <MobileActionBar showOnTablet={showOnTablet}>
      <MoreActions actions={secondaryActions} mainActionAvailable={Boolean(mainAction)} />
      {mainAction && (
        <Button
          variant={mainAction.variant || "outline-primary"}
          rounded="full"
          className="flex flex-1 max-w-[190px] h-[3.125rem]"
          onClick={mainAction.onClick}
        >
          {mainAction.label}
        </Button>
      )}
    </MobileActionBar>
  );
};

export default ActionsMenu;
