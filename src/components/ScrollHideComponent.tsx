import { useEffect, useState } from "react";

export const ScrollHideComponent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we're at the top of the page
      const isTop = document.body.scrollTop < 50;
      setIsVisible(isTop);
    };

    // Add scroll event listener
    document.body.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Cleanup
    return () => document.body.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`transition-opacity duration-150 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      {children}
    </div>
  );
};
