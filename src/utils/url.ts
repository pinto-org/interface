import { Token } from "@/utils/types";

const createUrlWithParams = (baseUrl: string, params: Record<string, string>) => {
  // console.log("baseUrl", baseUrl);
  // console.log("params", params);
  const url = new URL(baseUrl, window.location.origin);
  // console.log("url1", url);
  url.search = new URLSearchParams(params).toString();
  // console.log("url search:  ", url.search);
  // console.log("url combined", url.pathname + url.search);
  return url.pathname + url.search;
};

export const getSiloConvertUrl = (siloToken: Token, targetToken: Token, mode: string = "max") => {
  return createUrlWithParams(`/silo/${siloToken.address}`, {
    action: "convert",
    target: targetToken.address,
    mode,
  });
};
