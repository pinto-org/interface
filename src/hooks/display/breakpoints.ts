import { breakpoints } from "@/utils/theme/breakpoints";
import { useState, useEffect } from "react";

const getMobile = () => window.innerWidth < breakpoints.sm;
const getTablet = () => window.innerWidth < breakpoints.lg;
const getDesktop = () => window.innerWidth >= breakpoints.lg;

const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(getMobile());

	useEffect(() => {
		const checkMobile = () => setIsMobile(getMobile());
		checkMobile();
		window.addEventListener("resize", checkMobile);

		// Cleanup
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return isMobile;
};

const useIsTablet = () => {
	const [isMd, setIsMd] = useState(getTablet());

	useEffect(() => {
		const check = () => setIsMd(getTablet());
		check();
		window.addEventListener("resize", check);

		return () => window.removeEventListener("resize", check);
	}, []);

	return isMd;
};

const useIsDesktop = () => {
	const [isLg, setIsLg] = useState(getDesktop());

	useEffect(() => {
		const check = () => setIsLg(getDesktop());
		check();
		window.addEventListener("resize", check);

		return () => window.removeEventListener("resize", check);
	}, []);

	return isLg;
};

export { useIsMobile, useIsTablet, useIsDesktop };
