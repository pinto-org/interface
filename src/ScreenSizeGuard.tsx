import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

const MIN_WIDTH = 1100;
const MIN_HEIGHT = 820;

const screenGuardAtom = atom<boolean>(window.innerWidth < MIN_WIDTH || window.innerHeight < MIN_HEIGHT);

export const useScreenGuardStatus = () => {
  return useAtomValue(screenGuardAtom);
};

const useScreenGuard = () => {
  const setActive = useSetAtom(screenGuardAtom);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < MIN_WIDTH || window.innerHeight < MIN_HEIGHT) {
        setActive(true);
      } else {
        setActive(false);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setActive]);
};

const ScreenSizeGuard = ({ children }) => {
  useScreenGuard();

  const isActive = useScreenGuardStatus();

  console.log("screenGuardActive", isActive);
  if (isActive) {
    return (
      <div className="font-pinto fixed inset-0 bg-gradient-light flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-none border border-pinto-gray-4 p-6 max-w-md text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Screen Size Too Small</h2>
          <p className="text-black">
            This application requires at least a 1100x820 screen resolution. Please resize your window, use a different
            device, or zoom out.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ScreenSizeGuard;
