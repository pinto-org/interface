import { TokenValue } from "@/classes/TokenValue";
import { STALK } from "@/constants/internalTokens";
import { beanstalkAbi, beanstalkAddress } from "@/generated/contractHooks";
import { useTokenMap } from "@/hooks/pinto/useTokenMap";
import { useChainAddress } from "@/utils/chain";
import { DepositData, Token, TokenDepositData } from "@/utils/types";
import { unpackStem } from "@/utils/utils";
import { useMemo } from "react";
import { Address, toHex } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { getTokenIndex } from "./../utils/token";
import { useSiloData } from "./useSiloData";
import { useSunData } from "./useSunData";
import useTokenData from "./useTokenData";

interface DepositQuery {
  id: bigint;
  season?: number | undefined;
  stem: bigint;
  // token: Token;
  depositedAmount: bigint;
  depositedBDV: bigint;
}

const querySettings = {
  staleTime: 1000 * 60 * 3,
  refetchInterval: 1000 * 60 * 3, // 3 minutes, in milliseconds
};

function useFarmerDepositedBalances() {
  const account = useAccount();
  const season = useSunData().current;
  const silo = useSiloData();
  const BEAN = useTokenData().mainToken;
  const SILO_WHITELIST = useTokenData().whitelistedTokens;
  const diamondAddress = useChainAddress(beanstalkAddress);

  const tokenMap = useTokenMap();

  const {
    data: depositsByToken,
    refetch,
    queryKey,
  } = useReadContract({
    address: diamondAddress,
    abi: beanstalkAbi,
    functionName: "getDepositsForAccount",
    args: [account.address as Address],
    scopeKey: ["season", season].join(" "),
    query: {
      ...querySettings,
      enabled: !!account.address,
      select: (data) => {
        const deposits: Map<string, DepositQuery[]> = new Map();
        for (const deposit of data) {
          const tokenDeposits: DepositQuery[] = deposit.depositIds.map((depositId, index) => {
            const stem = unpackStem(depositId);
            const tokenDeposit = deposit.tokenDeposits[index];
            return {
              id: depositId,
              stem: stem,
              depositedAmount: tokenDeposit.amount,
              depositedBDV: tokenDeposit.bdv,
            };
          });

          deposits.set(getTokenIndex(deposit.token), tokenDeposits);
        }
        return deposits;
      },
    },
  });

  const depositsData = useMemo(() => {
    const output: Map<Token, TokenDepositData> = new Map();

    let amount = TokenValue.ZERO;
    let convertibleAmount = TokenValue.ZERO;
    let depositBDV = TokenValue.ZERO;
    let currentBDV = TokenValue.ZERO;

    depositsByToken?.forEach((tokenDeposits, tokenIndex) => {
      const token = tokenMap[tokenIndex];
      const siloTokenData = silo.tokenData.get(token);

      if (!token || !siloTokenData) return;

      const depositData: DepositData[] = [];
      const convertibleDeposits: DepositData[] = [];

      let totalBaseStalk: TokenValue = TokenValue.ZERO;
      let totalGrownStalk: TokenValue = TokenValue.ZERO;
      let totalStalk: TokenValue = TokenValue.ZERO;
      let totalSeeds: TokenValue = TokenValue.ZERO;

      tokenDeposits.forEach((deposit) => {
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

        totalBaseStalk = totalBaseStalk.add(baseStalk);
        totalGrownStalk = totalGrownStalk.add(grownStalk);
        totalStalk = totalStalk.add(baseStalk.add(grownStalk));
        totalSeeds = totalSeeds.add(seeds);

        amount = amount.add(depositAmount);
        depositBDV = depositBDV.add(_depositBDV);
        currentBDV = currentBDV.add(_currentBDV).reDecimal(BEAN.decimals);

        const thisDeposit: DepositData = {
          id: deposit.id,
          idHex: toHex(deposit.id).toString(),
          token: token,
          stemTipForToken: siloTokenData.stemTip,
          stem: depositStem,
          season: deposit.season ?? 0,
          amount: depositAmount,
          depositBdv: _depositBDV,
          currentBdv: _currentBDV,
          stalk: {
            base: baseStalk,
            grown: grownStalk,
            total: baseStalk.add(grownStalk),
          },
          seeds: seeds,
          isGerminating: isGerminating,
        };

        depositData.push(thisDeposit);
        if (!isGerminating) {
          convertibleAmount = convertibleAmount.add(depositAmount);
          convertibleDeposits.push(thisDeposit);
        }
      });

      output.set(token, {
        amount: amount,
        convertibleAmount: convertibleAmount,
        currentBDV: currentBDV,
        depositBDV: depositBDV,
        stalk: {
          base: totalBaseStalk,
          grown: totalGrownStalk,
          total: totalStalk,
        },
        seeds: totalSeeds,
        deposits: depositData,
        convertibleDeposits: convertibleDeposits,
      });
    });

    return output;
  }, [depositsByToken, silo.tokenData, tokenMap, BEAN.decimals]);

  return {
    data: depositsData,
    queryKey: queryKey,
    refetch,
  };
}

export default useFarmerDepositedBalances;

// const datas = useMemo(() => {
//   const farmerDeposits: DepositQuery[] = [];

//   const output: Map<Token, TokenDepositData> = new Map();

//   SILO_WHITELIST.forEach((token) => {
//     let amount = TokenValue.fromBlockchain(0n, token.decimals);
//     let convertibleAmount = TokenValue.fromBlockchain(0n, token.decimals);
//     let depositBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
//     let currentBDV = TokenValue.fromBlockchain(0n, BEAN.decimals);
//     const depositData: DepositData[] = [];
//     const siloTokenData = silo.tokenData.get(token);

//     farmerDeposits.forEach((deposit) => {
//       const isToken = deposit.token.toLowerCase() === token.address.toLowerCase();
//       if (isToken && siloTokenData) {
//         const isGerminating = deposit.stem >= siloTokenData.germinatingStem.toBigInt();
//         const _depositBDV = TokenValue.fromBlockchain(deposit.depositedBDV, BEAN.decimals);
//         const depositStem = TokenValue.fromBlockchain(deposit.stem, BEAN.decimals);
//         const baseStalk = isGerminating
//           ? TokenValue.fromBlockchain(0n, STALK.decimals)
//           : _depositBDV.mul(siloTokenData.rewards.seeds);
//         const grownStalk = _depositBDV.mul(siloTokenData.stemTip.sub(depositStem)).div(10000);
//         const seeds = _depositBDV.mul(siloTokenData.rewards.seeds);
//         const depositAmount = TokenValue.fromBlockchain(deposit.depositedAmount, token.decimals);
//         const _currentBDV = depositAmount.mul(siloTokenData.tokenBDV);
//         amount = amount.add(depositAmount);
//         convertibleAmount = convertibleAmount.add(isGerminating ? TokenValue.ZERO : depositAmount);
//         depositBDV = depositBDV.add(_depositBDV);
//         currentBDV = currentBDV.add(_currentBDV).reDecimal(BEAN.decimals);
//         depositData.push({
//           /** The ID of this Deposit */
//           id: deposit.id,
//           /** The ID of this Deposit, as a hex string. */
//           idHex: toHex(deposit.id).toString(),
//           /** Token contained within the crate. */
//           token: token,
//           /** The current stem tip for this token, for calculation of grownStalk. */
//           stemTipForToken: siloTokenData.stemTip,
//           /** The stem (identifier) of this Deposit. */
//           stem: depositStem,
//           /** The Season this Deposit ocurred. */
//           season: deposit.season ?? 0,
//           /** The amount of tokens Deposited. */
//           amount: depositAmount,
//           /** The BDV of this Deposit at the time of Deposit. */
//           depositBdv: depositBDV,
//           /** The current BDV of this Deposit. */
//           currentBdv: currentBDV,
//           stalk: {
//             base: baseStalk,
//             grown: grownStalk,
//             total: baseStalk.add(grownStalk),
//           },
//           seeds: seeds,
//           isGerminating: isGerminating,
//         });
//       }
//     });
//     output.set(token, {
//       amount: amount,
//       convertibleAmount: convertibleAmount,
//       currentBDV: currentBDV,
//       depositBDV: depositBDV,
//       stalk: {
//         base: depositData.reduce((total, deposit) => deposit.stalk.base.add(total), TokenValue.ZERO),
//         grown: depositData.reduce((total, deposit) => deposit.stalk.grown.add(total), TokenValue.ZERO),
//         total: depositData.reduce((total, deposit) => deposit.stalk.total.add(total), TokenValue.ZERO),
//       },
//       seeds: depositData.reduce((total, deposit) => deposit.seeds.add(total), TokenValue.ZERO),
//       deposits: depositData,
//       convertibleDeposits: [],
//     });
//   });

//   return output;
// }, [dataFromContract, SILO_WHITELIST, BEAN.decimals, silo.tokenData]);
