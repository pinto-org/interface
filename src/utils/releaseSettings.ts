/** Explicit deployment coordination: never change the still-live whitelist by default. */
export function wstethDewhitelisted(value: string | undefined): boolean {
  if (value === undefined || value === "" || value === "false") return false;
  if (value === "true") return true;
  throw new Error("VITE_PINTO_DEWHITELIST_WSTETH must be true or false");
}
