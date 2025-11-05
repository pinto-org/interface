import { abiSnippets } from "@/constants/abiSnippets";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";

export interface NFTData {
  id: number;
  contractAddress: string;
}

export type ViewMode = "owned" | "all";

interface UseNFTDataParams {
  contractAddress: string;
  viewMode?: ViewMode;
}

interface UseNFTDataReturn {
  // Data
  userNFTs: NFTData[];
  allNFTs: NFTData[];
  displayNFTs: NFTData[];
  balance: number;
  totalSupply: number;

  // Loading states
  loading: boolean;
  balanceLoading: boolean;
  userTokensLoading: boolean;
  allTokensLoading: boolean;

  // Error states
  error: string | null;
  balanceError: Error | null;
  userTokensError: Error | null;
  allTokensError: Error | null;

  // Actions
  refetchUserNFTs: () => void;
  refetchAllNFTs: () => void;
  refetchAll: () => void;
}

export const useNFTData = ({ contractAddress, viewMode = "owned" }: UseNFTDataParams): UseNFTDataReturn => {
  // Local state for processed NFT data
  const [userNFTs, setUserNFTs] = useState<NFTData[]>([]);
  const [allNFTs, setAllNFTs] = useState<NFTData[]>([]);

  const account = useAccount();

  // Query user's NFT balance
  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: abiSnippets.erc721Enum,
    functionName: "balanceOf",
    args: account.address ? [account.address] : undefined,
    query: {
      enabled: !!account.address && !!contractAddress,
    },
  });

  // Query total supply of NFTs
  const {
    data: totalSupply,
    error: totalSupplyError,
    isLoading: totalSupplyLoading,
    refetch: refetchTotalSupply,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: abiSnippets.erc721Enum,
    functionName: "totalSupply",
    query: {
      enabled: !!contractAddress,
    },
  });

  // Memoized queries for user's token IDs
  const userTokenQueries = useMemo(
    () =>
      balance && Number(balance) > 0 && account.address
        ? Array.from({ length: Number(balance) }, (_, index) => ({
            address: contractAddress as `0x${string}`,
            abi: abiSnippets.erc721Enum,
            functionName: "tokenOfOwnerByIndex" as const,
            args: [account.address, BigInt(index)],
          }))
        : [],
    [balance, account.address, contractAddress],
  );

  const {
    data: userTokenIds,
    error: userTokenError,
    isLoading: userTokensLoading,
    refetch: refetchUserTokens,
  } = useReadContracts({
    contracts: userTokenQueries,
    query: {
      enabled: userTokenQueries.length > 0,
    },
  });

  // Memoized queries for all collection token IDs
  const allTokenQueries = useMemo(
    () =>
      totalSupply && Number(totalSupply) > 0
        ? Array.from({ length: Number(totalSupply) }, (_, index) => ({
            address: contractAddress as `0x${string}`,
            abi: abiSnippets.erc721Enum,
            functionName: "tokenByIndex" as const,
            args: [BigInt(index)],
          }))
        : [],
    [totalSupply, contractAddress],
  );

  const {
    data: allTokenIds,
    error: allTokenError,
    isLoading: allTokensLoading,
    refetch: refetchAllTokens,
  } = useReadContracts({
    contracts: allTokenQueries,
    query: {
      enabled: allTokenQueries.length > 0,
    },
  });

  // Process user token IDs into NFT data
  useEffect(() => {
    if (userTokenIds && userTokenIds.length > 0) {
      const processedUserNFTs = userTokenIds
        .map((result) => {
          if (result.status === "success" && result.result) {
            return {
              id: Number(result.result),
              contractAddress,
            };
          }
          return null;
        })
        .filter((nft): nft is NFTData => nft !== null);

      setUserNFTs(processedUserNFTs);
    } else if (balance && Number(balance) === 0) {
      setUserNFTs([]);
    }
  }, [userTokenIds, balance, contractAddress]);

  // Process all token IDs into NFT data
  useEffect(() => {
    if (allTokenIds && allTokenIds.length > 0) {
      const processedAllNFTs = allTokenIds
        .map((result) => {
          if (result.status === "success" && result.result) {
            return {
              id: Number(result.result),
              contractAddress,
            };
          }
          return null;
        })
        .filter((nft): nft is NFTData => nft !== null);

      setAllNFTs(processedAllNFTs);
    } else if (totalSupply && Number(totalSupply) === 0) {
      setAllNFTs([]);
    }
  }, [allTokenIds, totalSupply, contractAddress]);

  // Memoized computed values
  const displayNFTs = useMemo(() => (viewMode === "owned" ? userNFTs : allNFTs), [viewMode, userNFTs, allNFTs]);

  const loading = useMemo(() => {
    if (viewMode === "owned") {
      return balanceLoading || userTokensLoading;
    }
    return totalSupplyLoading || allTokensLoading;
  }, [viewMode, balanceLoading, userTokensLoading, totalSupplyLoading, allTokensLoading]);

  const error = useMemo(() => {
    const errors = [
      balanceError?.message,
      totalSupplyError?.message,
      userTokenError?.message,
      allTokenError?.message,
    ].filter(Boolean);

    return errors.length > 0 ? errors.join("; ") : null;
  }, [balanceError, totalSupplyError, userTokenError, allTokenError]);

  // Refetch functions
  const refetchUserNFTs = useCallback(async () => {
    await refetchBalance();
    await refetchUserTokens();
  }, [refetchBalance, refetchUserTokens]);

  const refetchAllNFTs = useCallback(async () => {
    await refetchTotalSupply();
    await refetchAllTokens();
  }, [refetchTotalSupply, refetchAllTokens]);

  const refetchAll = useCallback(async () => {
    await Promise.all([refetchUserNFTs(), refetchAllNFTs()]);
  }, [refetchUserNFTs, refetchAllNFTs]);

  return {
    // Data
    userNFTs,
    allNFTs,
    displayNFTs,
    balance: Number(balance || 0),
    totalSupply: Number(totalSupply || 0),

    // Loading states
    loading,
    balanceLoading,
    userTokensLoading,
    allTokensLoading,

    // Error states
    error,
    balanceError,
    userTokensError: userTokenError,
    allTokensError: allTokenError,

    // Actions
    refetchUserNFTs,
    refetchAllNFTs,
    refetchAll,
  };
};
