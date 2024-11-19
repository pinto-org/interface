# Announcing Pinto, low volatility censorship resistant money

*"The soft overcomes the hard; the gentle overcomes the rigid."*

**Lao Tzu**, *Tao Te Ching*

OR 

*Nothing in the world is as soft and yielding as water. Yet for dissolving the hard and inflexible, nothing can surpass it.*

*The soft overcomes the hard; the gentle overcomes the rigid. Everyone knows that is true, but few can put it into practice.*

*Therefore the Master remains serene in the midst of sorrow. Evil cannot enter his heart. Because he has given up helping, he is people’s greatest help.*

*True words seem paradoxical.*

**Verse 78 Tao te Ching (by Lao-tzu)**

## An Existential Threat

Stablecoins are the crypto asset class that has found foremost product fit after BTC as a SOV. While stablecoins make up only 7% of the crypto market cap, 77% of the aggregate trading volume is at least one side stablecoin.

However, existing stablecoins suffer from a number of flaws that present an existential threat to censorship resistant, verifiable and permissionless computers: leading stablecoins are run by centralized operators (*e.g.*, Circle, Tether, PayPal, etc.) who actually dictate the canonical state of networks where the majority of network-native value is dependent on the existence of said stablecoin (*i.e.*, every existing compute network but Bitcoin). 

Because ultimately centralized companies are subject to governments, the canonical state is actually determined by governments, then custodians, and only then the network consensus mechanism. Stakers or miners are third class citizens. 

This reality is a far cry from the goal to create censorship resistant, verifiable, permissionless, globally distributed computer networks.

## A Seed of Hope

SCYLLA AND CHARIBDUS QUOTE

To date, all attempts to create a censorship resistant low volatility money competitive with centralized stablecoins have all failed due to either (1) excessive carrying costs due to collateral requirements or (2) excessive volatility due to insufficient collateral requirements (*i.e.*, [Scylla and Charibdus](https://publius.money/blog/2022-06-05-thoughts-before-the-barn-raise)).

On the one hand, censorship resistant collateral has a crippling structural issue: there simply isn’t sufficient quality censorship resistant value to scale in line with centralized alternatives. Excessive carrying costs for censorship resistant stablecoins lead to wider spreads and higher borrowing costs than markets that use centralized alternatives (*e.g.*, USDC, USD). 

On the other hand, the highly reflexive nature of non-collateralized stablecoins has resulted in crippling excess volatility in almost every implementation to date. Whereas most attempts at non-collateralized stablecoins have experienced a bank run and collapse to ~$0 within months, there have been 2 notable exceptions.

[Ampleforth](https://www.ampleforth.org/) is a rebasing stablecoin that has successfully achieved consistent peg crosses over the course of 5+ years. However, the rebasing nature of the system limits the utility of the currency as money. When below peg, tokens are taken out of people’s wallets in order to repeg the system, creating a horrible user experience for savers and borrowers alike.

[Beanstalk](https://bean.money/) is a credit based stablecoin protocol that issues dividends to depositors when above peg, but instead of forcibly rebasing downwards it incentivizes individual holders to voluntarily burn the stablecoin for an IOU for more tokens under certain conditions in the future. While Beanstalk has had extended periods above and below peg, it is the only other stablecoin model that hasn’t crashed to $0 due to a bank run. 

Beyond creating a better experience for users, credit presents the only potential for network-native value that has the potential for infinite scale and anti-reflexive properties. The more a borrower pays back debt, the more creditworthy it is viewed. Increased creditworthiness enables issuance of more debt at lower interest rates. 

In the 3 weeks prior to its hack in April 2022, Beanstalk experienced the first ever successful deleveraging of a credit based stablecoin. After being Replanted after the hack, Beanstalk was successfully able to cross the Bean price above and below peg with moderate frequency, but the market never too another serious look after the hack. 

The lack of participation has caused the system to stall, with no value flowing in or out of the system and minimal participation in any of the peg maintenance mechanisms. While the Beanstalk model has continued to be improved since Replant, lack of participation has made collecting data necessary to further improve the model impossible.

Nobody knows what would have happened had Beanstalk not been hacked, but given the efficacy demonstrated by the model both before and after the hack, there are very good reasons to find out. 

## Fork Season

“Beanstalk is likely being Replanted with a ridiculously high Pod Rate in the worst a) macro environment in at least a decade, b) crypto market in years, c) stablecoin market of all time, and d) endogenous circumstances possible, as a result of the attack. This presents an incredible opportunity for the model to demonstrate its efficacy. We will all know very quickly if it is working or not.”

**Publius, Thoughts Before the Barn Raise. June 5, 2022**

The plan to restart Beanstalk in incredibly adverse conditions had very interesting results, but did not indicate whether Beanstalk clearly “works” or not. While the price has been consistently below peg for the past 6 months, Beanstalk has repegged after multiple bank runs and longer continuous periods below peg. From that perspective there is no reason to suspect it does not work. 

Instead, there has been an impressively low amount of exits from the system given the lack of activity and new capital. It seems the market has cold feet after the exploit, the collapse of Terra, and the incredible nuance of the topic. 

Given the lack of available options to solve the existential stablecoin threat, it is essential to determine whether the credit based model has the potential for long term efficacy or not. Given the success of modern fiat currency over the past 53 years it is hard to imagine it is not. To that end, it is pertinent to continue the Beanstalk experiment. 

We are launching the first ever Beanstalk fork: Pinto – low volatility censorship resistant money. Pinto implements all the latest features of Beanstalk, Basin, Multi-Flow Pump, Pipeline and Tractor (*i.e.*, the entire Beanstalk ecosystem code base) and restructures the original Beanstalk debt to give the Beanstalk model a clean shot at success and failure. 

## Why low volatility?

*"Everything flows, nothing stands still.”*

**Heraclitus**

Beanstalk was never intended to create perfect stability. The stablecoin trilemma clearly states that censorship resistance and capital efficiency (*i.e.*, low carrying costs) must come at the cost of price stability. However, there is certainly some sufficiently low level of volatility below which a censorship resistant money with competitive carrying costs would make a compelling case to compete with centralized stablecoins. 

The term stablecoin gives people the wrong idea. Whereas centralized convertible tokens are in fact stable coins, they are not money. Money has endogenous value. Money is volatile in nature. Our goal is to create money with endogenous value because of its properties of censorship resistance, capital efficiency and *low volatility.* 

Stablecoin out. Low volatility money in. 

## Why a Fork?

*Two gunslingers walked out in the street // And one said, "I don't want to fight no more" // And the other gunslinger thought about it // And he said, "Yeah, what are we fighting for?"* 

**Tom Petty, Into the Great Wide Open, 1991**

While censorship resistant low volatility money is likely to be a winner take most asset class (*i.e.*, just like censorship resistant hard money a la BTC), at such an early stage in the development of the asset class, multiple competing versions can be symbiotic. 

Beanstalk could clearly benefit from a debt restructure. Our choice was then whether to (A) propose a debt restructure to the DAO that forces the restructure on *everyone*, including those that did not vote for it, or (B) deploy a fork that automatically restructures the debt without imposing the restructure on *anyone.* 

Under the fork construction, every debt holder in the old version of Beanstalk retains the entirety of their position in Beanstalk *and* receives an airdrop for an additional debt position in Pinto. 

A true win win, Pinto establishes a healthy and sustainable model for forking the Beanstalk codebase for continuous low friction and permissionless development of low volatility money while promoting the continuous honoring of Beanstalk debt across models without imposing anything on any participant.

## Securing Beanstalk

"Fool me once, shame on you; fool me twice, shame on me."

**17th Century Proverb**

There are two and three separate and independent systems within and without Beanstalk, respectively, that have been put in place to minimize the risk of another exploit. 

No Governance

Using a fork-based model instead of on-chain governance removes the need to vote on upgrading the system. By removing the ability to upgrade Beanstalk via a vote, there is no longer any potential governance vulnerability. While in its early days Pinto will remain upgradable by a multi-sig under [specific conditions](https://pinto.gitbook.io/pinto/appendix/upgradability), in time the intention is to remove upgradability altogether. 

Beanstalk 3: Secure Beanstalk

With the move to L2, the entire Beanstalk codebase was restructured with a prioritization on loss prevention and minimization over gas efficiency. In the past, a significant amount of complexity was added to the code in the interest of lowering Farmers’ gas costs to make Beanstalk more accessible. However, this complexity also introduced a significant amount of bugs, and with it costs via bug bounty programs. Pinto is also deployed on an L2 such that gas costs are not nearly as relevant as security.

Immunefi

The vast majority of the codebase is identical to Beanstalk, which has an existing Immunifi bug bounty covering the codebase with a maximum bounty of $1.1m. The bounty has been live on the existing codebase for X months. Although not a guarantee, this is a strong indicator the codebase is secure.

An Immunefi bug bounty program will be created once the Pinto supply passes 10M for the first time, with one-off mints to fund the program according to the schedule outlined [here](https://pinto.gitbook.io/pinto/appendix/upgradability#bug-bounty-mint-schedule). 

To date, Beanstalk has paid out ~1.5M Beans in bug bounties. Although costly, the value protected has been an order of magnitude higher than the cost. 

Code4rena

In our experience, public audit competitions are among the highest efficacy ways to discover bugs because of the number of eyes that are looking at the code.

Beanstalk, and thus Pinto, have been heavily audited via Code4rena. Additionally, at some point in the future, once there are enough funds in the development budget (see below), we intend to run Pinto-specific audit competitions of the entire codebase.

Hypernative

A critical component of a robust security stack is a real-time production monitoring solution. Similar to the audit competitions, the goal is to setup Hypernative (or another monitoring solution) with Pinto [in a similar way to Beanstalk](https://bean.money/bip-46) once there are sufficient funds in the development budget.

## No Governance

While Pinto implements the key ideas for the fork system in principle, additional development work must be completed in order to create a generalized fork system. In the meantime, select upgrades to Pinto may be implemented by the Pinto multi-sig.

The Pinto multi sig has permission to upgrade Pinto under the following conditions:

- Fixing bugs and security vulnerabilities;
- Changing parameters (*e.g.*, Target Seasons to Catch Up, Pod Rate and L2SR thresholds, optimal LP BDV distribution, etc.) until 2 weeks after the first time the Pinto supply reaches 50M;
- Mint Pinto to fund a bug bounty program according to [Bug Bounty Mint Schedule](https://pinto.gitbook.io/pinto/appendix/upgradability#bug-bounty-mint-schedule);
- Adding the Shipment that pays back old Beanstalk holders after 1 billion Pinto supply ([explained here](https://pinto.gitbook.io/pinto/appendix/old-beanstalk-holders)); and
- Adding the Fork Migration System ([explained here](https://pinto.gitbook.io/pinto/appendix/upgradability#fork-migration-system)).

## What About Beanstalk Holders?

As one of the [permitted upgrades to Pinto](https://pinto.gitbook.io/pinto/appendix/upgradability), in the future, Pinto will be upgraded to issue assets to Beanstalk participants based on a snapshot of the Beanstalk state at the time of Pinto deployment. After a supply of 1B Pinto, 3% of mints will go to [paying back old Beanstalk holders](https://pinto.gitbook.io/pinto/farm/sun#shipments):

- [Unripe Bean](https://docs.bean.money/almanac/farm/barn#unripe-assets) holders will receive an asset representing a recapitalized Unripe asset (Ripening Pinto) at a rate of 1 Ripening Pinto per Unripe Bean;
- Unripe LP holders will receive a number of Ripening Pinto based on the Bean Denominated Value of Unripe LP if it were fully recapitalized at the time of snapshot;
- Pod holders will receive Pods in a separate Beanstalk Pod Line; and
- [Fertilizer](https://docs.bean.money/almanac/farm/barn#fertilizer) holders will receive ERC-1155 tokens similar to the existing Fertilizer tokens.

Ripening Pinto holders, Pod holders in this separate Pod Line, and Active Fertilizer holders each receive 1/3 of new Pinto mints allocated to paying back old Beanstalk holders. If there is no Active Fertilizer, Ripening Pinto and Beanstalk Pod holders receive 1/2 of new Pinto mints allocated to paying back old Beanstalk holders each. If there are neither Ripening Pinto nor Active Fertilizer, Beanstalk Pod holders receive 100% of the new Pinto mints allocated to paying back old Beanstalk holders. If there is no longer any outstanding Ripening Pinto, Active Fertilizer, nor Beanstalk Pods, the 3% of mints allocated to honoring Beanstalk debt will be distributed to Pinto participants under its normal model.

Because Beanstalk Beans and LP tokens can be sold to purchase Pinto 

## A Forum For Healthy Experimentation

*“I know it when I see it.”*

**Chief Justice William Rheinquist on Non-substantive Trolling, 1971**

As a group participating in an attempt to create censorship resistant money, the Pinto community should strive to follow the ideals of censorship resistance.

However, as the Beanstalk community learned the hard way, following the ideal of censorship resistance at all costs has major drawbacks. The quality of discourse in the Beanstalk community has fallen off a cliff since the hack.

Angry community members that refuse to engage substantively have pushed out genuinely interested or curious community members from participating.

Given the necessity for high quality discourse at this stage of the experiment, the Pinto Discord will not tolerate non-substantive trolling. First and second violations will… what is the actual policy cc @guy

Our hope is that this restriction on speech will create an environment where highly technical discussion can place out in the open, users can ask and receive high quality answers to questions both simple and complex.

## Men Wanted for Hazardous Journey

*“Small wages, bitter cold, long months of complete darkness, constant danger, safe return doubtful. Honour and recognition in case of success.”*

**Sir Earnest Shackleton, Advertisement for the Endurance Expedition, 1913**

Thus begins the next chapter in the Beanstalk experiment. The only guarantee is a frightening journey ahead.

However, the reality that lies ahead without a censorship resistant low volatility money that presents an alternative to centralized stablecoins is even scarier. 

---

### outline

intro

Beans

explaining pinto’s mechanisms

Pinto beautiful

### intro

Monetary system should be fair

But it should be big

Hence Pinto → fair and big

Pinto is 2nd/3rd attempt at the Bean Model of simple monetary policy: Works EZ

Leads to Best Ever thing (but still an experiment)

---

Monetary policy should be fair, transparent, autonomous and deterministic, not unilaterally and arbitrarily determined by a privileged few.

While hard money like BTC represents an important component of the decentralized economy, mass adoption of this new economic system requires low volatility, fiat money with similar trustless properties.

Pinto is the 2nd attempt at the Bean Model of algorithmic monetary policy. It minimizes volatility by inflating the supply when demand exceeds it and incentivizing market participants to decrease the supply when demand is low. 

It acts as a monetary system should while being transparent, permissionless and censorship resistant.

---

> We fell in love with Beanstalk because it was (and is) by far the most successful implementation of uncollateralized, low volatility money to date. It represents a monetary system that can support a massive economy while implementing the trustless properties first introduced by technology like Bitcoin.
> 

OR

> We fell in love with the most successful implementation of uncollateralized, low volatility money to date, Beanstalk, because it represents a monetary system that can support a massive economy while implementing the trustless ideals of blockchain.
> 

Due to headwinds created by the 2022 exploit [TODO] with governance, sloppy algorithms at launch(??) and bad debt resulting from an exploit, Beanstalk isn’t in a position to deliver on that promise right now. 

We remain believers in its mission and the promise of its technology. That is why we have migrated the best, most updated version of beanstalk onto a new __ with a few changes.

- introduces fork system → no governance? - say a piece
- elegant design and UX
- no debt
- no trolls?

If successful, Pinto has the potential to form the basis of a decentralized economy and pay back the debt of those who bravely participated in the first Bean experiment. 

Like Beanstalk, Pinto is an experiment. We believe it is an experiment worth trying.

Links to read docs, plant, invest etc

scratch 

Terra was a stablecoin collateralized by censorship resistant collateral (*i.e.*, a token that represented equity in the Terra system). However, a bank run in May of 2022 after almost 18 months of activity led to a complete loss of value in the system and highlighted the highly reflexive nature of system-native equity. As soon as the market cap of the equity dipped below the outstanding liability of stablecoins the stablecoin became undercollateralized and a historic bank run began: $45B of value disappeared in a matter of days. The market remains scarred.