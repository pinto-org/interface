import FrameAnimator from "@/components/LoadingSpinner";
import PageFullScreen from "@/components/ui/PageFrame";
import useDelayedLoading from "@/hooks/display/useDelayedLoading";
import useFarmerStatus from "@/hooks/useFarmerStatus";
import { useEffect } from "react";
import FarmerOverview from "./overview/FarmerOverview";
import NewUserView from "./overview/NewUserView";

const Overview = () => {
  const { address, hasDeposits, hasPlots, loading, didLoad } = useFarmerStatus();

  const isNewUser = !address || (!hasDeposits && !hasPlots);

  const { loading: isLoading, setLoading } = useDelayedLoading(1500, !didLoad);

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  if (isLoading) {
    return (
      <div className="absolute z-50 top-0 left-0 bg-gradient-light">
        <PageFullScreen>
          <FrameAnimator size={300} duration={75} />
        </PageFullScreen>
      </div>
    );
  }

  return <>{isNewUser ? <NewUserView /> : <FarmerOverview />}</>;
};

export default Overview;
