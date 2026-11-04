import { type Address, type Client, parseAbi } from "viem";
import { getBlock, readContract } from "viem/actions";

const depositABI = parseAbi([
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

/** Current releases have no output locks. Retain the snapshot shape for deposit consumers.
 * Read errors still propagate, so unavailable balances never become spendable balances.
 */
export async function readDepositsWithLocks(
  client: Client,
  diamond: Address,
  account: Address,
  _pinto: Address,
  tokens: Address[],
) {
  const block = await getBlock(client, { blockTag: "latest" });
  const deposits = await readContract(client, {
    address: diamond,
    blockNumber: block.number,
    abi: depositABI,
    functionName: "getDepositsForAccount",
    args: [account, tokens],
  });
  return {
    deposits,
    locks: {} as Record<string, { amount: bigint; unlockAt: number }>,
    blockNumber: block.number,
    timestamp: Number(block.timestamp),
    supported: false,
  };
}
