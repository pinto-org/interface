import { Link } from "react-router-dom";
import { useChainId, useConfig } from "wagmi";

export default function AddressLink({ address }: { address: string | undefined }) {
  const config = useConfig();
  const chainId = useChainId();
  const currentChain = config.chains.find((chain) => chain.id === chainId);
  const blockExplorer = currentChain?.blockExplorers?.default ?? undefined;

  return (
    <>
      {blockExplorer ? (
        <Link to={`${blockExplorer}/address/${address}`}>
          <div className="font-roboto font-[300] text-[2rem] -tracking-[0.02em] underline decoration-2 text-pinto-green">
            {address}
          </div>
        </Link>
      ) : (
        <div className="font-roboto font-[300] text-[2rem] -tracking-[0.02em] underline decoration-2 text-pinto-green">
          {address}
        </div>
      )}
    </>
  );
}
