import { truncateAddress } from "@/utils/string";
import { Link } from "react-router-dom";
import { useChainId, useConfig } from "wagmi";

export default function AddressLink({ address }: { address: string | undefined }) {
  const config = useConfig();
  const chainId = useChainId();
  const currentChain = config.chains.find((chain) => chain.id === chainId);
  const blockExplorer = currentChain?.blockExplorers?.default.url ?? "https://basescan.org";

  return (
    <>
      {blockExplorer ? (
        <Link to={`${blockExplorer}/address/${address}`} target="_blank" rel="noopener noreferrer">
          <div className="font-roboto font-[300] text-[1rem] sm:text-[2rem] -tracking-[0.02em] underline decoration-1 sm:decoration-2 text-pinto-green">
            <span className="hidden sm:block">{address}</span>
            <span className="sm:hidden">{truncateAddress(address, { suffix: true })}</span>
          </div>
        </Link>
      ) : (
        <div className="font-roboto font-[300] text-[1rem] sm:text-[2rem] -tracking-[0.02em] underline decoration-1 sm:decoration-2 text-pinto-green">
          {address}
        </div>
      )}
    </>
  );
}
