import { useQuery } from "@tanstack/react-query";
import { useAccount, useChainId } from "wagmi";
import useTokenData from "@/state/useTokenData";
import { ZeroExAPI } from "@/utils/types";
import { arbitrum, avalanche, base, bsc, celo, fantom, foundry, localhost, mainnet, optimism, polygon } from "viem/chains";

interface ZeroExQuote extends ZeroExAPI {
    mode: "exactInput" | "exactOutput",
    enabled: boolean
};

export default function use0x(settings: ZeroExQuote) {

    const chainId = useChainId();
    const endpoints = {
        [mainnet.id]: 'https://api.0x.org/swap/v1/quote?',
        [arbitrum.id]: 'https://arbitrum.api.0x.org/swap/v1/quote?',
        [avalanche.id]: 'https://avalanche.api.0x.org/swap/v1/quote?',
        [base.id]: 'https://base.api.0x.org/swap/v1/quote?',
        [bsc.id]: 'https://bsc.api.0x.org/swap/v1/quote?',
        [celo.id]: 'https://celo.api.0x.org/swap/v1/quote?',
        [fantom.id]: 'https://fantom.api.0x.org/swap/v1/quote?',
        [optimism.id]: 'https://optimism.api.0x.org/swap/v1/quote?',
        [polygon.id]: 'https://polygon.api.0x.org/swap/v1/quote?',
        41337: 'https://base.api.0x.org/swap/v1/quote?',
        [localhost.id]: 'https://base.api.0x.org/swap/v1/quote?',
        [foundry.id]: 'https://base.api.0x.org/swap/v1/quote?'
    }
    const account = useAccount().address || '0x';

    const mainToken = useTokenData().mainToken;

    const urlParams = {
        buyToken: settings.buyToken || '',
        buyAmount: settings.buyAmount || '', 
        sellToken: settings.sellToken || '',
        sellAmount: settings.sellAmount || '', 
        slippagePercentage: settings.slippagePercentage || '', 
        gasPrice: settings.gasPrice || '',
        takerAddress: settings.takerAddress || '',
        excludedSources: settings.excludedSources || '',
        includedSources: settings.includedSources || '',
        skipValidation: settings.skipValidation || '',
        feeRecipient: settings.feeRecipient || '',
        buyTokenPercentageFee: settings.buyTokenPercentageFee || '',
        priceImpactProtectionPercentage: settings.priceImpactProtectionPercentage || '',
        feeRecipientTradeSurplus: settings.feeRecipientTradeSurplus || '',
        shouldSellEntireBalance: settings.shouldSellEntireBalance || ''
    };

    Object.keys(urlParams).forEach(key => urlParams[key] === '' && delete urlParams[key])

    const params = new URLSearchParams(urlParams);

    const headers = {'0x-api-key': `${import.meta.env.VITE_ZEROEX_API_KEY}`}

    const query = useQuery({
        queryKey: ["0xSwapQuote", { chainId: chainId, params: params.toString() }],
        queryFn: async () => await fetch(
            `${endpoints[chainId]}${params.toString()}` , {headers}).then((response) => response.json()),
        enabled: !!account && !!settings.buyToken && !!settings.sellToken
            && settings.buyToken.toLowerCase() !== mainToken.address.toLowerCase() 
            && settings.sellToken.toLowerCase() !== mainToken.address.toLowerCase()
            && !!settings.enabled
      });

    return query

}