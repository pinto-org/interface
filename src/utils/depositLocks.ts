import { autoConvertABI } from "@/constants/abi/autoConvertABI";
import { type Address, type Client, parseAbi, toFunctionSelector, zeroAddress } from "viem";
import { getBlock, readContract } from "viem/actions";

const depositABI = parseAbi([
  "function facetAddress(bytes4 selector) view returns(address)",
  "function getDepositsForAccount(address account,address[] tokens) view returns((address token,uint256[] depositIds,(uint128 amount,uint128 bdv)[] tokenDeposits)[])",
]);

/** Read failure blocks spending, but is not evidence that the protocol locked ownership. */
export function depositAvailability(
  amount: bigint,
  lock: { amount: bigint; unlockAt: number } | undefined,
  timestamp: number,
  readFailed: boolean,
) {
  const activeLock = lock && lock.unlockAt > timestamp ? lock.amount : 0n;
  const locked = activeLock > amount ? amount : activeLock;
  return { locked, available: readFailed ? 0n : amount - locked };
}

/** One block for both crates and their locks. Missing selector is legacy; RPC failure is not. */
export async function readDepositsWithLocks(
  client: Client,
  diamond: Address,
  account: Address,
  pinto: Address,
  tokens: Address[],
) {
  const block = await getBlock(client, { blockTag: "latest" });
  const options = { address: diamond, blockNumber: block.number };
  const [deposits, facet] = await Promise.all([
    readContract(client, {
      ...options,
      abi: depositABI,
      functionName: "getDepositsForAccount",
      args: [account, tokens],
    }),
    readContract(client, {
      ...options,
      abi: depositABI,
      functionName: "facetAddress",
      args: [toFunctionSelector("getAutoConvertOutputLock(address,int96)")],
    }),
  ]);
  const locks: Record<string, { amount: bigint; unlockAt: number }> = {};
  if (facet !== zeroAddress) {
    const pintoDeposits = deposits.find((d) => d.token.toLowerCase() === pinto.toLowerCase());
    await Promise.all(
      (pintoDeposits?.depositIds ?? []).map(async (id) => {
        const stem = BigInt.asIntN(96, id);
        const [amount, unlockAt] = await readContract(client, {
          ...options,
          abi: autoConvertABI,
          functionName: "getAutoConvertOutputLock",
          args: [account, stem],
        });
        locks[id.toString()] = { amount, unlockAt };
      }),
    );
  }
  return {
    deposits,
    locks,
    blockNumber: block.number,
    timestamp: Number(block.timestamp),
    supported: facet !== zeroAddress,
  };
}
