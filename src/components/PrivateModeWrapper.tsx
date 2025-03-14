import { usePrivateMode } from '@/hooks/useAppSettings'

const ASTERISK_OPERATOR = '∗'
const TEARDROP_SPOKED_ASTERISK = '✻'
const SMALL_ASTERISK = '﹡'
const FULLWIDTH_ASTERISK = '＊'
const EIGHT_POINTED_PINWHEEL_STAR = '✵'
const SIX_POINTED_BLACK_STAR = '✶'

const asterisks = [
    ASTERISK_OPERATOR,
    TEARDROP_SPOKED_ASTERISK,
    SMALL_ASTERISK,
    FULLWIDTH_ASTERISK,
    EIGHT_POINTED_PINWHEEL_STAR,
    SIX_POINTED_BLACK_STAR,
]

const getRandomAsterisk = () => {
    const asterisk = asterisks[Math.floor(Math.random() * asterisks.length)]
    return asterisk.repeat(5)
}

export const privateModeObsfucation: string = asterisks[2].repeat(5)

export const obfuscatedWalletAddress = '0x1234...ABCD'

export const PrivateModeWrapper = ({ children }: { children: React.ReactNode }) => {
    const isPrivateMode = usePrivateMode();
    return isPrivateMode ? privateModeObsfucation : children

}