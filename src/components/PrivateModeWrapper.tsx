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

export type PrivateModeVariant = 'default' | 'short' | 'percent'

export const PrivateModeWrapper = ({ variant = 'default', children }: { variant?: PrivateModeVariant, children: React.ReactNode }) => {
    const isPrivateMode = usePrivateMode();
    let obfuscation = privateModeObsfucation;
    if (variant === 'short') {
        obfuscation = privateModeObsfucation.slice(0, 2);
    } else if (variant === 'percent') {
        obfuscation = privateModeObsfucation.slice(0, 3);
    }
    return isPrivateMode ? obfuscation : children

}