import React, { useState, useEffect } from "react";

const ScreenSizeGuard = ({ children }) => {
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsScreenTooSmall(window.innerWidth < 1366 || window.innerHeight < 700);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // if (isScreenTooSmall) {
  //   return (
  //     <div className="font-pinto fixed inset-0 bg-gradient-light flex items-center justify-center z-50 p-4">
  //       <div className="bg-white rounded-lg shadow-none border border-pinto-gray-4 p-6 max-w-md text-center">
  //         <h2 className="text-2xl font-bold text-black mb-4">Screen Size Too Small</h2>
  //         <p className="text-black">
  //           This application requires at least a 1366x700 screen resolution. Please resize your window, use a different
  //           device, or zoom out.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return children;
};

export default ScreenSizeGuard;
