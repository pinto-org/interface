import { TokenValue } from "@/classes/TokenValue"
import stalkIcon from "@/assets/protocol/Stalk-variant.png";
import seedIcon from "@/assets/protocol/Seed-variant.png";
import podIcon from "@/assets/protocol/Pod-variant.png";
import pdvIcon from "@/assets/protocol/PDV.png";
import tooltipIcon from "@/assets/misc/Tooltip-default.png";
import TooltipSimple from "./TooltipSimple";
import { ReactNode } from "react";

interface StatPanel {
    variant: 'depositedValue' | 'stalk' | 'seeds' | 'pods',
    mainValue: TokenValue,
    secondaryValue: TokenValue,
    mainValueChange?: TokenValue,
    tooltipContent?: ReactNode,
    size?: 'large' | 'small' | undefined
}

export default function StatPanel({ variant, mainValue, secondaryValue, tooltipContent, size = 'small' }: StatPanel) {

    
    return (
        <div className="flex flex-col items-center">
            <div className="text-[1.25rem] text-pinto-gray-5 font-[400]">
                {variant === 'depositedValue' && 'My deposited value'}
                {variant === 'stalk' && 'My Stalk'}
                {variant === 'seeds' && 'My Seeds'}
                {variant === 'pods' && 'My Pods'}
            </div>
            <div className={`${size === "large" ? 'text-[3.5rem]' : 'text-[2rem]'} text-black leading-tight font-[400]`}>
                {variant === 'depositedValue' && `$${mainValue.toHuman('short')}`}
                {variant === 'stalk' &&                         
                    <div className="flex flex-row gap-1 items-center">
                        <img src={stalkIcon} className={`${size === "large" ? 'h-12 w-12' : 'h-9 w-9'} drop-shadow-md`}/>
                        <div>{mainValue.toHuman('short')}</div>
                    </div>
                }
                {variant === 'seeds' &&                 
                    <div className="flex flex-row gap-1 items-center">
                        <img src={seedIcon} className={`${size === "large" ? 'h-12 w-12' : 'h-9 w-9'} drop-shadow-md`}/>
                        <div>{mainValue.toHuman('short')}</div>
                    </div>
                }
                {variant === 'pods' &&                 
                    <div className="flex flex-row gap-1 items-center">
                        <img src={podIcon} className={`${size === "large" ? 'h-12 w-12' : 'h-9 w-9'} drop-shadow-md`}/>
                        <div>{mainValue.toHuman('short')}</div>
                    </div>
                }
            </div>
            <div className="flex flex-row gap-1 items-center">
                {variant === 'depositedValue' && 
                    <>
                        <img src={pdvIcon} className="scale-[1.2]"/>
                        <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">{secondaryValue.toHuman('short')} PDV</div>
                    </>
                }
                {variant === 'stalk' && 
                    <>
                        <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">{secondaryValue.toHuman('short')}% of Stalk supply</div>
                        {tooltipContent &&
                            <TooltipSimple content={tooltipContent}>
                                <img src={tooltipIcon} className={"h-4 w-4"} />
                            </TooltipSimple>
                        }
                    </>
                }
                {variant === 'seeds' && 
                    <>
                        <div className="text-[1.25rem] text-pinto-gray-4 font-[300] leading-none">+{secondaryValue.toHuman('short')} Grown Stalk per Season</div>
                        {tooltipContent &&
                            <TooltipSimple content={tooltipContent}>
                                <img src={tooltipIcon} className={"h-4 w-4"} />
                            </TooltipSimple>
                        }
                    </>
                }
                {variant === 'pods' && 
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