import { erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useChainId } from "wagmi";
import { ALL_SUPPORTED_TOKENS } from "@/constants/tokens";
import { beanstalkAddress } from "@/generated/contractHooks";
import { TokenValue } from "@/classes/TokenValue";

export function useTokenAllowances() {
  const chainId = useChainId();
  const account = useAccount();
  const output = new Map();
  const queryKeys = [];
  ALL_SUPPORTED_TOKENS.forEach((token) => {
    const { data: allowance, queryKey } = useReadContract({
      abi: erc20Abi,
      address: token.address,
      functionName: "allowance",
      args: [account!.address, beanstalkAddress[chainId]],
      query: {
        enabled: !!account.address,
      },
    });
    queryKeys.push(queryKey);
    if (!account.address || !allowance) {
      output.set(token, TokenValue.fromBlockchain(0n, token.decimals));
    } else {
      output.set(token, TokenValue.fromBlockchain(allowance, token.decimals));
    }
  });

  return {
    allowances: output,
    queryKey: queryKeys,
  };
}
