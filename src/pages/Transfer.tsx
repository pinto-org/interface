import { Separator } from "@/components/ui/Separator";
import { useParams } from "react-router-dom";
import { useChainId, useConfig } from "wagmi";
import TransferActions from "./transfer/TransferActions";
import TransferAll from "./transfer/actions/TransferAll";
import TransferFarmBalance from "./transfer/actions/TransferFarmBalance";
import TransferDeposits from "./transfer/actions/TransferDeposits";
import TransferPods from "./transfer/actions/TransferPods";

function Transfer() {
  const { mode } = useParams();
  const config = useConfig();
  const chainId = useChainId();
  const currentChain = config.chains.find((chain) => chain.id === chainId);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-12 w-[80%] max-w-4xl">
        <div className="flex flex-col gap-2">
          <div className="inline-flex gap-2 items-center">
            <span className="font-[300] text-[3.5rem] text-black">Send tokens</span>
          </div>
          <div className="font-[400] text-xl text-pinto-gray-4">
            {`Move tokens to a different address${currentChain ? ` on ${currentChain.name}.` : "."}`}
          </div>
        </div>
        <Separator />
        {mode === "all" ? <TransferAll /> : mode === "farmbalance" ? <TransferFarmBalance /> : mode === "deposits" ? <TransferDeposits /> : mode === "pods" ? <TransferPods /> : <TransferActions />}
      </div>
    </div>
  );
}

export default Transfer;
