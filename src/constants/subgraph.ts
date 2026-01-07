import { arbitrum, base, localhost } from "viem/chains";

export const subgraphs: { [chainId: number]: { beanstalk: string; bean: string; basin: string; cache: string } } = {
  [arbitrum.id]: {
    beanstalk: "https://graph.bean.money/beanstalk-dev",
    bean: "https://graph.bean.money/bean-dev",
    basin: "https://graph.bean.money/exchange-dev",
    cache: "https://graph.bean.money/cache",
  },
  [base.id]: {
    beanstalk: "https://graph.pinto.money/pintostalk",
    bean: "https://graph.pinto.money/pinto",
    basin: "https://graph.pinto.money/exchange",
    cache: "https://graph.pinto.money/cache",
  },
  [localhost.id]: {
    beanstalk: "https://graph.pinto.money/pintostalk",
    bean: "https://graph.pinto.money/pinto",
    basin: "https://graph.pinto.money/exchange",
    cache: "https://graph.pinto.money/cache",
  },
  [41337]: {
    beanstalk: "https://graph.pinto.money/pintostalk",
    bean: "https://graph.pinto.money/pinto",
    basin: "https://graph.pinto.money/exchange",
    cache: "https://graph.pinto.money/cache",
  },
};

export const SG_FETCH_DISABLED = import.meta.env.VITE_SG_FETCH_DISABLED === "true";
