import { Card, CardContent, CardHeader } from "./ui/Card"

export default function SeasonsButtonPanel({isOpen = false}: {isOpen: boolean}) {

    return (
        <Card className={`absolute top-[5rem] transition-all ${isOpen ? 'left-[1.5rem]' : '-left-[100%]'} w-[38rem] overflow-clip max-h-[calc(100vh-9rem)] z-[51]`}>
            <CardHeader>
            lol
            </CardHeader>
            <CardContent>
            lmao
            </CardContent>
        </Card>
    )
}