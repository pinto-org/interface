import { useEffect, useState } from "react";

export const ScrollHideComponent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we're at the top of the page
      const isTop = window.scrollY === 0;
      setIsVisible(isTop);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`transition-opacity duration-150 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      {children}
    </div>
  );
};
