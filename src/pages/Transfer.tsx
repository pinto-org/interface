import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/Separator";
import Text from "@/components/ui/Text";
import { useParams } from "react-router-dom";
import { mode } from "viem/chains";
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
        <div className="flex flex-col gap-12 w-full">
          <div className="flex flex-col gap-4">
            <Text variant="h1">Send tokens</Text>
            <Text
              variant="body"
              color="light"
            >{`Move tokens to a different address${currentChain ? ` on ${currentChain.name}.` : "."}`}</Text>
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
