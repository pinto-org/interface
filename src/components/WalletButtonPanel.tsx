import { Card } from "./ui/Card";

export default function WalletButtonPanel({isOpen = false}: {isOpen: boolean}) {

    return (
        <Card className={`absolute top-[5rem] transition-all ${isOpen ? 'right-[1.5rem]' : '-right-[100%]'} w-[38rem] overflow-clip max-h-[calc(100vh-9rem)] z-[51]`}>
            test
        </Card>
    )
}