import { arbitrum, localhost } from "viem/chains";

export const subgraphs: { [chainId: number]: { beanstalk: string, bean: string } } = {
    [arbitrum.id]: {
        beanstalk: "https://graph.bean.money/beanstalk",
        bean: "https://graph.bean.money/bean"
    },
    [localhost.id]: {
        beanstalk: "https://graph.bean.money/beanstalk",
        bean: "https://graph.bean.money/bean"
    },
}