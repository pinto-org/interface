import { TV } from "@/classes/TokenValue";
import { MAIN_TOKEN, NATIVE_TOKEN, S_MAIN_TOKEN } from "@/constants/tokens";
import { useFarmerSilo } from "@/state/useFarmerSilo";
import { usePriceData } from "@/state/usePriceData";
import { useChainConstant, useResolvedChainId } from "@/utils/chain";
import { getChainTokenMap, getTokenIndex, tokensEqual } from "@/utils/token";
import { Token } from "@/utils/types";
import { Lookup } from "@/utils/types.generic";
import { useMemo } from "react";
import { useAccount, useChainId } from "wagmi";
import { useLPTokenToNonPintoUnderlyingMap, useTokenMap } from "./pinto/useTokenMap";
import useUSDExtendedFarmerBalances, { USDExtendedFarmerBalances } from "./useUSDExtendedFarmerBalances";

export interface UsePreferredTokenProps {
  /**
   * most preferred token
   * - if no token is provided, return tokens with the greatest USD value in total balance
   * - If token is LP =>
   *     - if the user has an LP balance, prioritize [LP token, non-pinto underlying, ...rest, PINTO].
   *     - if the user does not have an LP balance, prioritize [underlying, ...rest, PINTO, LP].
   * - If token is not LP, prioritize [token, ...rest]
   */
  token?: Token;
  /**
   * filter out LP tokens. If an LP token is provided, it will not be filtered out.
   */
  filterLP?: boolean;
  /**
   * If token prop is provided, it will not be filtered out.
   * Otherwise, filter out tokens from the list
   */
  filter?: Token[];
  /**
   * filter out silo-wrapped tokens.
   */
  enableSiloWrapped?: boolean;
}

export function usePreferredInputToken(args?: UsePreferredTokenProps) {
  const { isConnecting } = useAccount();
  const { data: farmerBalances, loading } = useUSDExtendedFarmerBalances();
  const lp2Underlying = useLPTokenToNonPintoUnderlyingMap("lp2Underlying");

  const siloWrapped = useChainConstant(S_MAIN_TOKEN);

  const tokenMap = useTokenMap();
  const chainId = useResolvedChainId();

  const preferredToken = useMemo(() => {
    const balances = { ...farmerBalances }; // shallow copy

    const filterTokens = [...(args?.filter ?? [])];
    if (!args?.enableSiloWrapped) {
      filterTokens.push(siloWrapped);
    }

    filterBalances(balances, tokenMap, { ...args, filter: filterTokens });

    const hasBalance = getTokensWithBalances(balances);

    // handle case where no balances.
    if (!hasBalance.length) return handleNoBalances(args, chainId, lp2Underlying);

    const sortedByUSD = hasBalance.sort(sortByUSDDesc);

    // If there is only one token with a balance, return it.
    if (sortedByUSD.length === 1) return sortedByUSD[0].token;

    // At this point we know there is more than one token with a balance.
    if (args?.token) {
      const preferred = handlePreferredToken(args.token, chainId, lp2Underlying, balances, sortedByUSD);
      if (preferred) return preferred;
    }

    return sortedByUSD[0].token;
  }, [farmerBalances, tokenMap, args, lp2Underlying, chainId, siloWrapped]);

  return {
    loading: loading || isConnecting,
    preferredToken,
  };
}

function sortByUSDDesc(a: USDExtendedFarmerBalances, b: USDExtendedFarmerBalances) {
  return b.usd.total.sub(a.usd.total).toNumber();
}

function handlePreferredToken(
  token: Token,
  chainId: number,
  lp2Underlying: Lookup<Token>,
  balances: Lookup<USDExtendedFarmerBalances>,
  sortedByUSD: USDExtendedFarmerBalances[],
) {
  const pinto = MAIN_TOKEN[chainId];
  const tokenIndex = getTokenIndex(token);

  // If the priority token has a balance gt 0, return the token.
  if (balances[tokenIndex]?.usd.total.gt(0)) {
    return token;
  }

  // Handle case where token provided is LP & no LP balance in wallet.
  if (token.isLP) {
    // npu = non-pinto-underlying
    const npu = lp2Underlying[tokenIndex];
    if (npu && balances[getTokenIndex(npu)]?.usd.total.gt(0)) {
      return npu;
    }
  }
  // Find the first balance that is not the main token. By this point, we should have at least 1 balance that is not PINTO.
  return sortedByUSD.find((value) => !tokensEqual(value.token, pinto))?.token;
}

// If no balances, return the most preferred token.
function handleNoBalances(
  args: UsePreferredTokenProps | undefined,
  chainId: number,
  lp2Underlying: Lookup<Token>,
): Token {
  if (!args?.token) return MAIN_TOKEN[chainId]; // if no balances & no token provided, return PINTO

  const npu = args?.token.isLP && lp2Underlying[getTokenIndex(args.token)];
  if (npu) return npu;

  return args.token;
}

function filterBalances(
  balances: Lookup<USDExtendedFarmerBalances>,
  tokenMap: Lookup<Token>,
  args: UsePreferredTokenProps | undefined,
) {
  if (!args?.filter?.length && !args?.filterLP) {
    return;
  }

  const addresses = Object.keys(balances);
  const remove = new Set<string>(args?.filter?.map((t) => getTokenIndex(t)) ?? []);

  for (const address of addresses) {
    const tokenIndex = getTokenIndex(address);
    const token = tokenMap[tokenIndex];

    const shouldFilter =
      (args?.filterLP && token.isLP) || remove.has(tokenIndex) || (!!args?.enableSiloWrapped && token.isSiloWrapped);

    if (shouldFilter && !tokensEqual(token, args?.token)) {
      delete balances[tokenIndex];
    }
  }
}

function getTokensWithBalances(balances: Lookup<USDExtendedFarmerBalances>): USDExtendedFarmerBalances[] {
  const hasBalance: USDExtendedFarmerBalances[] = [];

  for (const balance of Object.values(balances)) {
    if (balance.usd.total.gt(0)) {
      hasBalance.push(balance);
    }
  }

  return hasBalance;
}

export function usePreferredInputSiloDepositToken(farmerSilo: ReturnType<typeof useFarmerSilo>, fallbackToken?: Token) {
  const mainToken = useChainConstant(MAIN_TOKEN);
  const chainId = useChainId();
  const { isConnecting } = useAccount();

  const tokenMap = useTokenMap();
  const priceData = usePriceData();

  const sortedByBDVDescending = useMemo(
    () => sortByBDVDescending(farmerSilo.deposits, chainId),
    [farmerSilo.deposits, tokenMap, priceData, chainId],
  );

  const preferredToken = sortedByBDVDescending.length ? sortedByBDVDescending[0]?.token : (fallbackToken ?? mainToken);

  return {
    preferredToken,
    isLoading: farmerSilo.isLoading || priceData.loading || isConnecting,
  };
}

const sortByBDVDescending = (farmerDeposits: ReturnType<typeof useFarmerSilo>["deposits"], chainId: number) => {
  const tokens = getChainTokenMap(chainId);

  const values: { token: Token; bdv: TV }[] = [];

  for (const token of Object.values(tokens)) {
    if (!token.isMain && !token.isLP) continue;

    const deposit = farmerDeposits.get(token);
    values.push({
      token,
      bdv: deposit?.currentBDV ?? TV.ZERO,
    });
  }

  return values.sort((a, b) => b.bdv.sub(a.bdv).toNumber());
};
