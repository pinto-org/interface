import { arbitrum, base, localhost } from "viem/chains";

export const subgraphs: { [chainId: number]: { beanstalk: string; bean: string; basin: string } } = {
  [arbitrum.id]: {
    beanstalk: "https://graph.bean.money/beanstalk-dev",
    bean: "https://graph.bean.money/bean-dev",
    basin: "https://graph.bean.money/exchange-dev",
  },
  [base.id]: {
    beanstalk: "https://graph.pinto.money/pintostalk",
    bean: "https://graph.pinto.money/pinto",
    basin: "https://graph.pinto.money/exchange",
  },
  [localhost.id]: {
    beanstalk: "https://graph.pinto.money/pintostalk",
    bean: "https://graph.pinto.money/pinto",
    basin: "https://graph.pinto.money/exchange",
  },
  [41337]: {
    beanstalk: "https://graph.pinto.money/pintostalk",
    bean: "https://graph.pinto.money/pinto",
    basin: "https://graph.pinto.money/exchange",
  },
};
