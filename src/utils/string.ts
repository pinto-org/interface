import { HashString } from "./types.generic";

export const truncateAddress = (
	address: string | HashString | undefined,
	options?: { suffix?: boolean },
) => {
	if (!address) return "";

	return `${address.substring(0, 6)}...${options?.suffix ? address.substring(address.length - 4) : ""}`;
};
