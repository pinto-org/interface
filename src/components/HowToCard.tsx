import { StepItem } from "./ui/StepItem";

const steps = [
  {
    title: "Qualify as a Referrer",
    description: "Sow at least 1,000 Pinto in the Field to unlock your referral link.",
  },
  {
    title: "Share Your Link",
    description: "Copy your unique referral link and share it with friends, on social media, or anywhere else.",
  },
  {
    title: "Earn Rewards",
    description:
      "When someone uses your link and Sows Pinto, you earn 10% of the Pods they receive as a referral bonus.",
  },
  {
    title: "Get Credited",
    description:
      "Referral rewards are automatically credited to your wallet address when your referral completes their Sow transaction.",
  },
];

export function HowToCard() {
  return (
    <div className="space-y-4">
      <div className="pinto-h3 sm:pinto-h2">How It Works</div>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <StepItem key={index} stepNumber={index + 1} title={step.title} description={step.description} />
        ))}
      </div>
    </div>
  );
}
