import { arbitrum, base, localhost } from "viem/chains";

export const subgraphs: { [chainId: number]: { beanstalk: string; bean: string } } = {
  [arbitrum.id]: {
    beanstalk: "https://graph.bean.money/beanstalk-dev",
    bean: "https://graph.bean.money/bean-dev",
  },
  [base.id]: {
    // beanstalk: "https://graph.pinto.money/pintostalk",
    // bean: "https://graph.pinto.money/pinto",
    beanstalk: "https://graph.bean.money/beanstalk-dev",
    bean: "https://graph.bean.money/bean-dev",
  },
  [localhost.id]: {
    beanstalk: "https://graph.bean.money/beanstalk-dev",
    bean: "https://graph.bean.money/bean-dev",
  },
  // Pointing tenderly testnet to beanstalk subgraphs, since there is no data on pinto ones
  [41337]: {
    beanstalk: "https://graph.bean.money/beanstalk-dev",
    bean: "https://graph.bean.money/bean-dev",
  },
};
