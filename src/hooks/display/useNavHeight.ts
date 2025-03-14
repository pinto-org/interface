import { useEffect, useState } from "react";

export default function useNavHeight() {
  const [navbarHeight, setNavbarHeight] = useState<number>(0);

  useEffect(() => {
    // Function to update the height of the navbar
    const updateNavbarHeight = () => {
      const navbar = document.getElementById("pinto-navbar");
      if (navbar) {
        setNavbarHeight(navbar.clientHeight); // Get the height of the navbar
      }
    };

    // Initialize height on mount
    updateNavbarHeight();

    // Add event listener to update height on window resize
    window.addEventListener("resize", updateNavbarHeight);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []); // Empty dependency array to run the effect only once on mount and unmount

  return navbarHeight;
}
