import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import { useParams } from "react-router-dom";
import { useChainId, useConfig } from "wagmi";
import TransferActions from "./transfer/TransferActions";
import TransferAll from "./transfer/actions/TransferAll";
import TransferDeposits from "./transfer/actions/TransferDeposits";
import TransferFarmBalance from "./transfer/actions/TransferFarmBalance";
import TransferPods from "./transfer/actions/TransferPods";

function Transfer() {
  const { mode } = useParams();
  const config = useConfig();
  const chainId = useChainId();
  const currentChain = config.chains.find((chain) => chain.id === chainId);

  return (
    <PageContainer variant="md">
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-6 sm:gap-12 w-full">
          <div className="flex flex-col gap-4">
            <div className="pinto-h2 sm:pinto-h1">Send tokens</div>
            <div className="pinto-sm sm:pinto-body text-pinto-light">{`Move tokens to a different address${currentChain ? ` on ${currentChain.name}.` : "."}`}</div>
          </div>
          <Separator />
          {mode === "all" ? (
            <TransferAll />
          ) : mode === "farmbalance" ? (
            <TransferFarmBalance />
          ) : mode === "deposits" ? (
            <TransferDeposits />
          ) : mode === "pods" ? (
            <TransferPods />
          ) : (
            <TransferActions />
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default Transfer;
