export function HowToCard() {
  return (
    <div className="space-y-4">
      <div className="pinto-h3 sm:pinto-h2">How It Works</div>
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green/10 flex items-center justify-center text-pinto-green pinto-sm-bold">
            1
          </div>
          <div>
            <div className="pinto-body-bold text-pinto-dark mb-1">Qualify as a Referrer</div>
            <div className="pinto-sm text-pinto-light">
              Sow at least 1,000 Pinto in the Field to unlock your referral link.
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green/10 flex items-center justify-center text-pinto-green pinto-sm-bold">
            2
          </div>
          <div>
            <div className="pinto-body-bold text-pinto-dark mb-1">Share Your Link</div>
            <div className="pinto-sm text-pinto-light">
              Copy your unique referral link and share it with friends, on social media, or anywhere else.
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green/10 flex items-center justify-center text-pinto-green pinto-sm-bold">
            3
          </div>
          <div>
            <div className="pinto-body-bold text-pinto-dark mb-1">Earn Rewards</div>
            <div className="pinto-sm text-pinto-light">
              When someone uses your link and Sows Pinto, you earn 10% of the Pods they receive as a referral bonus.
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pinto-green/10 flex items-center justify-center text-pinto-green pinto-sm-bold">
            4
          </div>
          <div>
            <div className="pinto-body-bold text-pinto-dark mb-1">Get Credited</div>
            <div className="pinto-sm text-pinto-light">
              Referral rewards are automatically credited to your wallet address when your referral completes their Sow
              transaction.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
