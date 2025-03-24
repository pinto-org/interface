import ClaimRewards from "@/components/ClaimRewards";
import CombineSelect from "@/components/CombineSelect";
import { LeftArrowIcon } from "@/components/Icons";
import { Button } from "@/components/ui/Button";
import useFarmerActions from "@/hooks/useFarmerActions";
import { DepositTransferData } from "@/pages/transfer/actions/TransferDeposits";
import { getClaimText } from "@/utils/string";
import { Token, TokenDepositData } from "@/utils/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconImage from "./ui/IconImage";

interface SiloActionBoxProps {
  farmerDeposits: TokenDepositData | undefined;
  token: Token;
}

export default function SiloActionBox({ farmerDeposits, token }: SiloActionBoxProps) {
  const farmerActions = useFarmerActions();
  const enableClaim =
    farmerActions.claimRewards.outputs.beanGain.gte(0.01) ||
    farmerActions.claimRewards.outputs.stalkGain.gte(0.01) ||
    farmerActions.claimRewards.outputs.seedGain.gte(0.01);
  const navigate = useNavigate();
  const [combineData, setCombineData] = useState<DepositTransferData[]>([]);

  // Calculate number of non-germinating deposits
  const nonGerminatingDeposits = farmerDeposits?.deposits.filter((deposit) => !deposit.isGerminating).length ?? 0;

  return (
    <div className="p-2 rounded-[1rem] bg-pinto-off-white border-pinto-gray-2 border flex-col gap-2 hidden sm:flex">
      <Button
        className="w-full"
        variant="silo-action"
        disabled={!farmerDeposits || farmerDeposits.deposits.length === 0}
        onClick={() => navigate("/transfer")}
      >
        <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
          <span className="self-center items-center">
            <LeftArrowIcon color={"white"} height={"1rem"} width={"1rem"} />
          </span>
        </div>
        Send Deposits
      </Button>
      {nonGerminatingDeposits >= 2 && farmerDeposits?.deposits[0]?.token && (
        <CombineSelect
          token={farmerDeposits.deposits[0].token}
          setTransferData={setCombineData}
          disabled={!farmerDeposits || farmerDeposits.deposits.length === 0}
        />
      )}
      {token.isMain && (
        <Button variant="silo-action" className="w-full" onClick={() => navigate("/wrap")}>
          <div className="flex flex-row gap-2 items-center">
            <IconImage src={token.logoURI} size={6} alt={token.symbol} />
            Wrap {token.symbol} Deposits
          </div>
        </Button>
      )}
      {/* 
      <ClaimRewards
        trigger={
          <Button className="w-full" variant="silo-action" disabled={!enableClaim}>
            <div className="rounded-full bg-pinto-green h-6 w-6 flex justify-evenly">
              <span className="self-center items-center rotate-90">
                <LeftArrowIcon color={"white"} height={"1rem"} width={"1rem"} />
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
      */}
    </div>
  );
}
