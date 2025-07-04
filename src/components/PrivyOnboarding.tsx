import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";

export default function PrivyOnboarding() {
  const { authenticated, user, ready } = usePrivy();
  const [showWelcome, setShowWelcome] = useState(false);

  // Show welcome message for new email users
  useEffect(() => {
    if (authenticated && user?.email && ready) {
      const hasSeenWelcome = localStorage.getItem("pinto-privy-welcome");
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        localStorage.setItem("pinto-privy-welcome", "true");
      }
    }
  }, [authenticated, user, ready]);

  if (!showWelcome) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-pinto-green rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🎉</span>
            </div>
            <h2 className="text-2xl font-semibold text-pinto-gray-5 mb-2">Welcome to Pinto!</h2>
            <p className="text-pinto-gray-4">
              You've successfully signed up with{" "}
              <span className="font-medium text-pinto-green">{user?.email?.address}</span>
            </p>
          </div>

          <div className="bg-pinto-gray-1 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-pinto-gray-5 mb-3">What's next?</h3>
            <ul className="space-y-2 text-sm text-pinto-gray-4">
              <li className="flex items-start gap-2">
                <span className="text-pinto-green mt-0.5">✓</span>
                <span>A secure wallet has been created for you automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pinto-green mt-0.5">✓</span>
                <span>You can start using Pinto DeFi features right away</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pinto-green mt-0.5">✓</span>
                <span>Fund your wallet to begin trading and earning</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setShowWelcome(false)}
              className="w-full h-12 bg-pinto-green hover:bg-pinto-green-dark text-white rounded-xl"
            >
              Get Started
            </Button>

            <p className="text-xs text-pinto-gray-4">
              Your wallet is secured by email. You can always access it by signing in with the same email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
