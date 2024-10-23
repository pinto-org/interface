import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount, useChainId } from "wagmi";
import { FarmerSiloBalancesDocument } from "@/generated/gql/graphql";
import { TokenValue } from "@/classes/TokenValue";
import { useSiloData } from "./useSiloData";
import { useSunData } from "./useSunData";
import useTokenData from "./useTokenData";
import { STALK } from "@/constants/internalTokens";
import { subgraphs } from "@/constants/subgraph";
import { DepositData, Token, TokenDepositData } from "@/utils/types";

function useFarmerDepositedBalances() {
  const account = useAccount();
  const chainId = useChainId();
  const season = useSunData().current;
  const silo = useSiloData();
  const BEAN = useTokenData().mainToken;
  const SILO_WHITELIST = useTokenData().whitelistedTokens;

  const queryKey = [
    "farmerDepositedBalances",
    { chainId: chainId, variables: [account.address?.toString().toLowerCase(), Number(season.toHuman())] },
  ]

  const { data: data, refetch: refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () =>
      request(subgraphs[chainId].beanstalk, FarmerSiloBalancesDocument, {
        account: account.address!.toString().toLowerCase(),
        season: Number(season.toHuman()),
      }),
    enabled: !!account.address,
  });

  const output: Map<Token, TokenDepositData> = new Map();

  SILO_WHITELIST.forEach((token) => {
    let amount = TokenValue.fromBlockchain(0n, token.decimals);
    let convertibleAmount = TokenValue.fromBlockchain(0n, token.decimals);
    let depositBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
    let currentBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
    const depositData: DepositData[] = [];
    const siloTokenData = silo.tokenData.get(token);
    data?.farmer?.deposited.forEach((deposit) => {
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

  return {
    data: output,
    queryKey: queryKey,
    refetch: refetch
  };
}

export default useFarmerDepositedBalances;
