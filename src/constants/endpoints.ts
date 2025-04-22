const BASE_ENDPOINT = import.meta.env.VITE_BASE_ENDPOINT;

type APIService = "router" | "pinto" | "spectra";

const makeSubdomainURL = (service: string) => {
  if (!BASE_ENDPOINT) {
    console.error(`VITE_BASE_ENDPOINT does not exist in .env. Cannot derive endpoint URL for ${service}`);
    return "";
  }

  return `https://${service}.${BASE_ENDPOINT}`;
};

export const API_SERVICES: { [Service in APIService]: string } = {
  router: makeSubdomainURL("0x"),
  pinto: makeSubdomainURL("api"),
  spectra: makeSubdomainURL("spectra"),
} as const;
