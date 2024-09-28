import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Avatar } from "connectkit";
import { useFarmerBalances } from "@/state/useFarmerBalances";
import { usePriceData } from "@/state/usePriceData";
import { TokenValue } from "@/classes/TokenValue";
import { Button } from "./ui/Button";
import { Separator } from "./ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

export default function WalletButtonPanel({isOpen = false}: {isOpen: boolean}) {

    const { address } = useAccount();
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName as string })

    const farmerBalances = useFarmerBalances();
    const priceData = usePriceData();

    const totalBalance = Array.from(farmerBalances.balances).reduce((totalBalance, tokenBalance) => {
        const price = priceData.tokenPrices.get(tokenBalance[0])?.instant || 0

        const internalValue = tokenBalance[1].internal.mul(price).add(totalBalance.internal)
        const externalValue = tokenBalance[1].external.mul(price).add(totalBalance.external)
        const totalValue = tokenBalance[1].total.mul(price).add(totalBalance.total)
        
        return ({ internal: internalValue, external: externalValue, total: totalValue })
        
    }, { internal: TokenValue.ZERO, external: TokenValue.ZERO, total: TokenValue.ZERO })
    
    return (
        <Card className={`absolute top-[5rem] flex flex-col transition-all ${isOpen ? 'right-[1.5rem]' : '-right-[100%]'} w-[38rem] overflow-clip max-h-[calc(100vh-9rem)] z-[51]`}>
            <CardHeader>
                {ensAvatar && <Avatar address={address} size={24} />}
                <span>{ensName ? ensName : address ? `${address.substring(0, 7)}...${address.substring(38, 42)}` : ''}</span>
                <span>{`$${Number(totalBalance.total.toHuman()).toFixed(2)}`}</span>
                <span>wallet balance: {`$${Number(totalBalance.external.toHuman()).toFixed(2)}`}</span>
                <span>farm balance: {`$${Number(totalBalance.internal.toHuman()).toFixed(2)}`}</span>
                <Button>swap</Button>
                <Button>send</Button>
                <Button>transfer</Button>
                <Separator />
            </CardHeader>
            <CardContent>
            <Tabs defaultValue="combined" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="combined">Combined</TabsTrigger>
                    <TabsTrigger value="external">Wallet Balance</TabsTrigger>
                    <TabsTrigger value="internal">Farm Balance</TabsTrigger>
                </TabsList>
                <TabsContent value="combined">
                combined
                </TabsContent>
                <TabsContent value="external">
                external
                </TabsContent>
                <TabsContent value="internal">
                internal
                </TabsContent>
            </Tabs>
            </CardContent>
        </Card>
    )
}