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
    <div className="p-4 rounded-[1.25rem] bg-pinto-off-white border-pinto-gray-2 border flex flex-col gap-2">
      <Button
        variant="ghost"
        className="px-2 hover:hover:bg-pinto-green w-full h-[2.5rem] rounded-[0.75rem] font-[400] text-[1.25rem] text-pinto-gray-5 hover:text-white flex flex-row justify-start gap-[0.625rem] disabled:bg-transparent disabled:text-pinto-gray-5 disabled:opacity-30"
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
          <Button
            variant="ghost"
            className="px-2 hover:hover:bg-pinto-green w-full h-[2.5rem] rounded-[0.75rem] font-[400] text-[1.25rem] text-pinto-gray-5 hover:text-white flex flex-row justify-start gap-[0.625rem] disabled:bg-transparent disabled:text-pinto-gray-5 disabled:opacity-30"
            disabled={!enableClaim}
          >
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
