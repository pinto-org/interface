import { Link } from "react-router-dom";
import { StepItem } from "./ui/StepItem";

const steps = [
  {
    title: "Qualify as a Referrer",
    description: (
      <>
        Sow at least 1,000 Pinto in the Field to unlock your referral link.{" "}
        <Link to="/field" className="text-pinto-green underline hover:text-pinto-green-3 transition-colors">
          Sow now
        </Link>
      </>
    ),
  },
  {
    title: "Share Your Link",
    description: "Copy your unique referral link and share it with friends, on social media, or anywhere else.",
  },
  {
    title: "Earn Rewards",
    description: "Earn 10% of the number of Pods your referees earn as a bonus, and they get an extra 5% too!",
  },
  {
    title: "Get Credited",
    description:
      "Referral rewards are automatically credited to your wallet address when your referee completes their Sow transaction.",
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
