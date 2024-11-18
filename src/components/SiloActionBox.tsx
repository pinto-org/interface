import ClaimRewards from "@/components/ClaimRewards";
import { LeftArrowIcon } from "@/components/Icons";
import { Button } from "@/components/ui/Button";
import useFarmerActions from "@/hooks/useFarmerActions";
import useFarmerDepositedBalances from "@/state/useFarmerDepositedBalances";
import { getClaimText } from "@/utils/string";
import { TokenDepositData } from "@/utils/types";
import { useNavigate } from "react-router-dom";

interface SiloActionBoxProps {
  farmerDeposits: TokenDepositData | undefined;
}

export default function SiloActionBox({ farmerDeposits }: SiloActionBoxProps) {
  const farmerActions = useFarmerActions();
  const enableClaim =
    farmerActions.claimRewards.outputs.beanGain.gte(0.01) ||
    farmerActions.claimRewards.outputs.stalkGain.gte(0.01) ||
    farmerActions.claimRewards.outputs.seedGain.gte(0.01);
  const navigate = useNavigate();

  return (
    <div className="p-2 rounded-[1rem] bg-pinto-off-white border-pinto-gray-2 border flex flex-col gap-2">
      <Button
        className="w-full"
        variant="silo-action"
        disabled={!farmerDeposits || farmerDeposits.deposits.length === 0}
        onClick={() => navigate("/transfer")}
      >
        <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
          <span className="self-center items-center">
            <LeftArrowIcon color={"white"} height={16} width={16} />
          </span>
        </div>
        Send Deposits
      </Button>
      <ClaimRewards
        trigger={
          <Button className="w-full" variant="silo-action" disabled={!enableClaim}>
            <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
              <span className="self-center items-center rotate-90">
                <LeftArrowIcon color={"white"} height={16} width={16} />
              </span>
            </div>
            {getClaimText(
              farmerActions.claimRewards.outputs.beanGain,
              farmerActions.claimRewards.outputs.stalkGain,
              farmerActions.claimRewards.outputs.seedGain,
            )}
          </Button>
        }
      />
    </div>
  );
}
