// Path gateways also support browser CORS requests for metadata and images.
const IPFS_GATEWAYS = [
  "https://ipfs.filebase.io/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://dweb.link/ipfs/",
] as const;
const GATEWAY_TIMEOUT_MS = 6_000;

function ipfsPath(uri: string): string | undefined {
  if (uri.startsWith("ipfs://")) return uri.slice(7).replace(/^ipfs\//, "");
  if (/^(Qm|baf)[a-zA-Z0-9]+(?:\/|$)/.test(uri)) return uri;
  try {
    const url = new URL(uri);
    if (url.protocol !== "https:" && url.protocol !== "http:") return;
    // On-chain tokenURIs often already point to a particular HTTP gateway.
    if (/^\/ipfs\/(Qm|baf)[a-zA-Z0-9]+(?:\/|$)/.test(url.pathname))
      return url.pathname.slice(6) + url.search + url.hash;
    const subdomain = url.hostname.match(/^((?:Qm|baf)[a-zA-Z0-9]+)\.ipfs\./);
    if (subdomain) return subdomain[1] + url.pathname + url.search + url.hash;
  } catch {
    // Leave non-IPFS URLs alone.
  }
}

export function getIpfsUrls(uri: string): string[] {
  if (!uri) return [];
  const path = ipfsPath(uri);
  return path ? IPFS_GATEWAYS.map((gateway) => gateway + path) : [uri];
}

export const convertIpfsUrl = (uri: string, gatewayIndex = 0): string => getIpfsUrls(uri)[gatewayIndex] ?? uri;

async function fromGateways<T>(
  uri: string,
  read: (response: Response) => Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  let lastError: unknown = new Error("No IPFS URL provided");
  for (const url of getIpfsUrls(uri)) {
    signal?.throwIfAborted();
    const controller = new AbortController();
    const abort = () => controller.abort(signal?.reason);
    signal?.addEventListener("abort", abort, { once: true });
    const timeout = setTimeout(() => controller.abort(), GATEWAY_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json, image/*" },
      });
      if (!response.ok) throw new Error(`IPFS gateway returned ${response.status}`);
      return await read(response);
    } catch (error) {
      signal?.throwIfAborted();
      lastError = error;
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abort);
    }
  }
  throw lastError;
}

export const fetchWithFallback = (uri: string, signal?: AbortSignal): Promise<Response> =>
  fromGateways(uri, async (response) => response, signal);

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
  external_url?: string;
  animation_url?: string;
}

export const fetchNFTMetadata = (tokenURI: string, signal?: AbortSignal): Promise<NFTMetadata> =>
  fromGateways(
    tokenURI,
    async (response) => {
      const metadata = await response.json();
      // An HTML gateway landing page or malformed JSON must advance to the next gateway too.
      if (
        typeof metadata?.name !== "string" ||
        !metadata.name ||
        typeof metadata?.image !== "string" ||
        !metadata.image
      )
        throw new Error("Invalid NFT metadata: missing name or image");
      return metadata as NFTMetadata;
    },
    signal,
  );

export const getOptimizedImageUrl = (imageUrl: string): string => convertIpfsUrl(imageUrl);

/** Test image decoding, not just HTTP success, before choosing a gateway. */
export async function loadNFTImageUrl(uri: string, signal?: AbortSignal): Promise<string> {
  let lastError: unknown = new Error("No image URL provided");
  for (const url of getIpfsUrls(uri)) {
    signal?.throwIfAborted();
    try {
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        const cleanup = () => {
          clearTimeout(timeout);
          signal?.removeEventListener("abort", abort);
          image.onload = image.onerror = null;
        };
        const fail = (error: Error) => {
          cleanup();
          image.src = "";
          reject(error);
        };
        const abort = () => fail(new Error("Image loading cancelled"));
        const timeout = setTimeout(() => fail(new Error("Image gateway timed out")), GATEWAY_TIMEOUT_MS);
        image.onload = () => {
          cleanup();
          resolve();
        };
        image.onerror = () => fail(new Error("Image gateway failed"));
        signal?.addEventListener("abort", abort, { once: true });
        image.src = url;
      });
      return url;
    } catch (error) {
      signal?.throwIfAborted();
      lastError = error;
    }
  }
  throw lastError;
}
