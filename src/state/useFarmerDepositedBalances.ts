import { useAccount, useChainId, useReadContract } from "wagmi";
import { TokenValue } from "@/classes/TokenValue";
import { useSiloData } from "./useSiloData";
import { useSunData } from "./useSunData";
import useTokenData from "./useTokenData";
import { STALK } from "@/constants/internalTokens";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { unpackStem } from "@/utils/utils";
import { Address } from "viem";
import { useChainAddress } from "@/utils/chain";

interface DepositQuery {
  season?: number | undefined;
  stem: bigint;
  token: Address;
  depositedAmount: bigint;
  depositedBDV: bigint;
}

const querySettings = {
  staleTime: 1000 * 60 * 2,
  refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
};

const emptyMap: Map<Token, TokenDepositData> = new Map();

function useFarmerDepositedBalances() {
  const account = useAccount();
  const chainId = useChainId();
  const season = useSunData().current;
  const silo = useSiloData();
  const BEAN = useTokenData().mainToken;
  const SILO_WHITELIST = useTokenData().whitelistedTokens;
  const diamondAddress = useChainAddress(beanstalkAddress);

  const queryKey = [
    "farmerDepositedBalances",
    { chainId: chainId, variables: [account.address?.toString().toLowerCase(), season] },
  ];

  const { data: dataFromContract = emptyMap, refetch } = useReadContract({
    address: diamondAddress,
    abi: beanstalkAbi,
    functionName: "getDepositsForAccount",
    args: [account.address as Address],
    query: {
      ...querySettings,
      enabled: !!account.address,
      select: (data) => {
        const farmerDeposits: DepositQuery[] = [];

        for (const depositData of data) {
          for (const [index, depositId] of depositData.depositIds.entries()) {
            farmerDeposits.push({
              season: undefined,
              stem: unpackStem(depositId),
              token: depositData.token,
              depositedAmount: depositData.tokenDeposits[index].amount,
              depositedBDV: depositData.tokenDeposits[index].bdv,
            });
          }
        }

        const output: Map<Token, TokenDepositData> = new Map();

        SILO_WHITELIST.forEach((token) => {
          let amount = TokenValue.fromBlockchain(0n, token.decimals);
          let convertibleAmount = TokenValue.fromBlockchain(0n, token.decimals);
          let depositBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
          let currentBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
          const depositData: DepositData[] = [];
          const siloTokenData = silo.tokenData.get(token);
          farmerDeposits.forEach((deposit) => {
            const isToken = deposit.token.toLowerCase() === token.address.toLowerCase();
            if (isToken && deposit.depositedBDV > 2n && siloTokenData) {
              const isGerminating = deposit.stem >= siloTokenData.germinatingStem.toBigInt();
              const _depositBDV = TokenValue.fromBlockchain(deposit.depositedBDV, BEAN.decimals);
              const depositStem = TokenValue.fromBlockchain(deposit.stem, BEAN.decimals);
              const baseStalk = isGerminating
                ? TokenValue.fromBlockchain(0n, STALK.decimals)
                : _depositBDV.mul(siloTokenData.rewards.seeds);
              const grownStalk = _depositBDV.mul(siloTokenData.stemTip.sub(depositStem)).div(10000);
              const seeds = _depositBDV.mul(siloTokenData.rewards.seeds);
              const depositAmount = TokenValue.fromBlockchain(deposit.depositedAmount, token.decimals);
              const _currentBDV = depositAmount.mul(siloTokenData.tokenBDV);
              amount = amount.add(depositAmount);
              convertibleAmount = convertibleAmount.add(isGerminating ? TokenValue.ZERO : depositAmount);
              depositBDV = depositBDV.add(_depositBDV);
              currentBDV = currentBDV.add(_currentBDV).reDecimal(BEAN.decimals);
              depositData.push({
                /** Token contained within the crate. */
                token: token,
                /** The current stem tip for this token, for calculation of grownStalk. */
                stemTipForToken: siloTokenData.stemTip,
                /** The stem (identifier) of this Deposit. */
                stem: depositStem,
                /** The Season this Deposit ocurred. */
                season: deposit.season ?? 0,
                /** The amount of tokens Deposited. */
                amount: depositAmount,
                /** The BDV of this Deposit at the time of Deposit. */
                depositBdv: depositBDV,
                /** The current BDV of this Deposit. */
                currentBdv: currentBDV,
                stalk: {
                  base: baseStalk,
                  grown: grownStalk,
                  total: baseStalk.add(grownStalk),
                },
                seeds: seeds,
                isGerminating: isGerminating,
              });
            }
          });
          output.set(token, {
            amount: amount,
            convertibleAmount: convertibleAmount,
            currentBDV: currentBDV,
            depositBDV: depositBDV,
            stalk: {
              base: depositData.reduce((total, deposit) => deposit.stalk.base.add(total), TokenValue.ZERO),
              grown: depositData.reduce((total, deposit) => deposit.stalk.grown.add(total), TokenValue.ZERO),
              total: depositData.reduce((total, deposit) => deposit.stalk.total.add(total), TokenValue.ZERO),
            },
            seeds: depositData.reduce((total, deposit) => deposit.seeds.add(total), TokenValue.ZERO),
            deposits: depositData,
          });
        });

        return output;
      },
    },
  });

  return {
    data: dataFromContract,
    queryKey: queryKey,
    refetch,
  };
}

export default useFarmerDepositedBalances;



  // const { data: data, refetch: refetch } = useQuery({
  //   queryKey: queryKey,
  //   queryFn: async () =>
  //     request(subgraphs[chainId].beanstalk, FarmerSiloBalancesDocument, {
  //       account: account.address?.toString().toLowerCase() ?? "",
  //       season: season,
  //     }),
  //   ...querySettings,
  //   enabled: !!account.address,
  // });

  // const { data: dataFromContract, refetch: refetchContract } = useReadBeanstalk_GetDepositsForAccount({
  //   args: [account.address as Address],
  //   query: {
  //     ...querySettings,
  //     enabled: !!account.address && !(data && data.farmer)
  //   },
  // });

  // const farmerDeposits: DepositQuery[] = [];

  // if (data?.farmer) {
  //   for (const deposit of data.farmer.deposited) {
  //     farmerDeposits.push({
  //       season: deposit.season ?? undefined,
  //       stem: deposit.stem ? BigInt(deposit.stem) : 0n,
  //       token: deposit.token,
  //       depositedAmount: BigInt(deposit.depositedAmount),
  //       depositedBDV: BigInt(deposit.depositedBDV),
  //     })
  //   }
  // } else if (dataFromContract) {
  //   for (const depositData of dataFromContract) {
  //     for (const [index, depositId] of depositData.depositIds.entries()) {
  //       farmerDeposits.push({
  //         season: undefined,
  //         stem: unpackStem(depositId),
  //         token: depositData.token,
  //         depositedAmount: depositData.tokenDeposits[index].amount,
  //         depositedBDV: depositData.tokenDeposits[index].bdv,
  //       })
  //     }
  //   }
  // }

  // const output: Map<Token, TokenDepositData> = new Map();

  // SILO_WHITELIST.forEach((token) => {
  //   let amount = TokenValue.fromBlockchain(0n, token.decimals);
  //   let convertibleAmount = TokenValue.fromBlockchain(0n, token.decimals);
  //   let depositBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
  //   let currentBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
  //   const depositData: DepositData[] = [];
  //   const siloTokenData = silo.tokenData.get(token);
  //   farmerDeposits.forEach((deposit) => {
  //     const isToken = deposit.token.toLowerCase() === token.address.toLowerCase();
  //     if (isToken && deposit.depositedBDV > 2n && siloTokenData) {
  //       const isGerminating = deposit.stem >= siloTokenData.germinatingStem.toBigInt();
  //       const _depositBDV = TokenValue.fromBlockchain(deposit.depositedBDV, BEAN.decimals);
  //       const depositStem = TokenValue.fromBlockchain(deposit.stem, BEAN.decimals);
  //       const baseStalk = isGerminating
  //         ? TokenValue.fromBlockchain(0n, STALK.decimals)
  //         : _depositBDV.mul(siloTokenData.rewards.seeds);
  //       const grownStalk = _depositBDV.mul(siloTokenData.stemTip.sub(depositStem)).div(10000);
  //       const seeds = _depositBDV.mul(siloTokenData.rewards.seeds);
  //       const depositAmount = TokenValue.fromBlockchain(deposit.depositedAmount, token.decimals);
  //       const _currentBDV = depositAmount.mul(siloTokenData.tokenBDV);
  //       amount = amount.add(depositAmount);
  //       convertibleAmount = convertibleAmount.add(isGerminating ? TokenValue.ZERO : depositAmount);
  //       depositBDV = depositBDV.add(_depositBDV);
  //       currentBDV = currentBDV.add(_currentBDV).reDecimal(BEAN.decimals);
  //       depositData.push({
  //         /** Token contained within the crate. */
  //         token: token,
  //         /** The current stem tip for this token, for calculation of grownStalk. */
  //         stemTipForToken: siloTokenData.stemTip,
  //         /** The stem (identifier) of this Deposit. */
  //         stem: depositStem,
  //         /** The Season this Deposit ocurred. */
  //         season: deposit.season ?? 0,
  //         /** The amount of tokens Deposited. */
  //         amount: depositAmount,
  //         /** The BDV of this Deposit at the time of Deposit. */
  //         depositBdv: depositBDV,
  //         /** The current BDV of this Deposit. */
  //         currentBdv: currentBDV,
  //         stalk: {
  //           base: baseStalk,
  //           grown: grownStalk,
  //           total: baseStalk.add(grownStalk),
  //         },
  //         seeds: seeds,
  //         isGerminating: isGerminating,
  //       });
  //     }
  //   });
  //   output.set(token, {
  //     amount: amount,
  //     convertibleAmount: convertibleAmount,
  //     currentBDV: currentBDV,
  //     depositBDV: depositBDV,
  //     stalk: {
  //       base: depositData.reduce((total, deposit) => deposit.stalk.base.add(total), TokenValue.ZERO),
  //       grown: depositData.reduce((total, deposit) => deposit.stalk.grown.add(total), TokenValue.ZERO),
  //       total: depositData.reduce((total, deposit) => deposit.stalk.total.add(total), TokenValue.ZERO),
  //     },
  //     seeds: depositData.reduce((total, deposit) => deposit.seeds.add(total), TokenValue.ZERO),
  //     deposits: depositData,
  //   });
  // });