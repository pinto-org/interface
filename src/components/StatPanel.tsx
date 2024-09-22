import { TokenValue } from "@/classes/TokenValue"
import stalkIcon from "@/assets/protocol/Stalk-variant.png";
import seedIcon from "@/assets/protocol/Seed-variant.png";
import podIcon from "@/assets/protocol/Pod-variant.png";
import pdvIcon from "@/assets/protocol/PDV.png";
import tooltipIcon from "@/assets/misc/Tooltip-default.png";
import TooltipSimple from "./TooltipSimple";
import { ReactNode } from "react";

interface StatPanel {
    mode: 'depositedValue' | 'stalk' | 'seeds' | 'pods',
    mainValue: TokenValue,
    secondaryValue: TokenValue,
    mainValueChange?: TokenValue,
    tooltipContent?: ReactNode,
    size?: 'large' | 'small' | undefined,
    variant?: 'overview' | 'silo'
}

export default function StatPanel({ mode, mainValue = TokenValue.ZERO, secondaryValue = TokenValue.ZERO, tooltipContent, size = 'small', variant = 'overview' }: StatPanel) {

    
    return (
        <div className="flex flex-col items-center">
            <div className="text-[1.25rem] text-pinto-gray-5 font-[400]">
                {mode === 'depositedValue' && 'My deposited value'}
                {mode === 'stalk' && 'My Stalk'}
                {mode === 'seeds' && 'My Seeds'}
                {mode === 'pods' && 'My Pods'}
            </div>
            <div className={`${size === "large" ? 'text-[3.5rem]' : 'text-[2rem]'} text-black leading-tight font-[400]`}>
                {mode === 'depositedValue' && `$${mainValue.toHuman('short')}`}
                {mode === 'stalk' &&                         
                    <div className="flex flex-row gap-1 items-center">
                        <img src={stalkIcon} className={`${size === "large" ? 'h-12 w-12' : 'h-9 w-9'} drop-shadow-md`}/>
                        <div>{mainValue.toHuman('short')}</div>
                    </div>
                }
                {mode === 'seeds' &&                 
                    <div className="flex flex-row gap-1 items-center">
                        <img src={seedIcon} className={`${size === "large" ? 'h-12 w-12' : 'h-9 w-9'} drop-shadow-md`}/>
                        <div>{mainValue.toHuman('short')}</div>
                    </div>
                }
                {mode === 'pods' &&                 
                    <div className="flex flex-row gap-1 items-center">
                        <img src={podIcon} className={`${size === "large" ? 'h-12 w-12' : 'h-9 w-9'} drop-shadow-md`}/>
                        <div>{mainValue.toHuman('short')}</div>
                    </div>
                }
            </div>
            <div className="flex flex-row gap-1 items-center">
                {mode === 'depositedValue' && 
                    <>
                        <img src={pdvIcon} className="scale-[1.2]"/>
                        <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">{secondaryValue.toHuman('short')} PDV</div>
                    </>
                }
                {mode === 'stalk' && 
                    <>
                        <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">
                            {variant === 'overview' && 
                            `${secondaryValue.toHuman('short')}% of Stalk supply`
                            }
                            {variant === 'silo' && 
                            <>
                            Claimable Stalk: 
                            <span className="text-pinto-green-2 pl-2">{secondaryValue.gt(0) ? '+' : ''}{secondaryValue.toHuman('short')}</span>
                            </>
                            }
                        </div>
                        {tooltipContent &&
                            <TooltipSimple content={tooltipContent}>
                                <img src={tooltipIcon} className={"h-4 w-4"} />
                            </TooltipSimple>
                        }
                    </>
                }
                {mode === 'seeds' && 
                    <>
                        <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">
                            {variant === 'overview' &&
                            `+${secondaryValue.toHuman('short')} Grown Stalk per Season`
                            }
                            {variant === 'silo' && 
                            <>
                            Claimable Seeds: 
                            <span className="text-pinto-green-2 pl-2">{secondaryValue.gt(0) ? '+' : ''}{secondaryValue.toHuman('short')}</span>
                            </>
                            }
                        </div>
                        {tooltipContent &&
                            <TooltipSimple content={tooltipContent}>
                                <img src={tooltipIcon} className={"h-4 w-4"} />
                            </TooltipSimple>
                        }
                    </>
                }
                {mode === 'pods' && 
                    <>
                        <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">Next position in line: {secondaryValue.toHuman('short')}</div>
                        {tooltipContent &&
                            <TooltipSimple content={tooltipContent}>
                                <img src={tooltipIcon} className={"h-4 w-4"} />
                            </TooltipSimple>
                        }
                    </>
                }
            </div>
        </div>
    )
}