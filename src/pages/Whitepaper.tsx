import FrameAnimator from "@/components/LoadingSpinner";
import PageFullScreen from "@/components/ui/PageFullScreen";
import { useEffect } from "react";

function Whitepaper() {
  useEffect(() => {
    window.location.replace("https://pinto.money/pinto.pdf");
  }, []);

  return (
    <div className="absolute z-50 left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2 bg-gradient-light">
      <PageFullScreen>
        <FrameAnimator size={300} duration={75} />
      </PageFullScreen>
    </div>
  );
}

export default Whitepaper;
