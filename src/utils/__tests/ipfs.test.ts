import { afterEach, expect, test, vi } from "vitest";
import { convertIpfsUrl, fetchNFTMetadata, fetchWithFallback, getIpfsUrls, loadNFTImageUrl } from "../ipfs";
const cid = "bafybeid4dlkibha4ztyozwa56o2v3kp3iwpx45whiubqnqncxknhtpimza";
const original = `https://ipfs.io/ipfs/${cid}/1.json`;
const metadata = { name: "Pinto Beaver Genesis", image: `ipfs://${cid}/1.png` };
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

test("HTTP tokenURIs and ipfs URIs use distinct fallback gateways", () => {
  expect(getIpfsUrls(original)).toEqual(getIpfsUrls(`ipfs://${cid}/1.json`));
  expect(getIpfsUrls(`ipfs://ipfs/${cid}/1.json`)).toEqual(getIpfsUrls(original));
  expect(getIpfsUrls(original)[0]).toBe(`https://ipfs.filebase.io/ipfs/${cid}/1.json`);
  expect(new Set(getIpfsUrls(original)).size).toBe(4);
  expect(convertIpfsUrl(`https://${cid}.ipfs.dweb.link/1.json`)).toBe(getIpfsUrls(original)[0]);
});

test("a failing HTTP gateway advances to another host instead of repeating the original URL", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(new Response("rate limited", { status: 429 }))
    .mockResolvedValueOnce(Response.json(metadata));
  vi.stubGlobal("fetch", fetcher);
  expect(await fetchNFTMetadata(original)).toEqual(metadata);
  expect(fetcher.mock.calls.map(([url]) => new URL(url).hostname)).toEqual(["ipfs.filebase.io", "ipfs.io"]);
});

test("HTTP success with HTML or missing metadata fields also falls back", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(new Response("<html>gateway landing</html>"))
    .mockResolvedValueOnce(Response.json({ name: "missing image" }))
    .mockResolvedValueOnce(Response.json(metadata));
  vi.stubGlobal("fetch", fetcher);
  expect(await fetchNFTMetadata(original)).toEqual(metadata);
  expect(fetcher).toHaveBeenCalledTimes(3);
});

test("a hanging gateway times out before trying the next one", async () => {
  vi.useFakeTimers();
  const fetcher = vi
    .fn()
    .mockImplementationOnce(
      (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        }),
    )
    .mockResolvedValueOnce(Response.json(metadata));
  vi.stubGlobal("fetch", fetcher);
  const pending = fetchNFTMetadata(original);
  await vi.advanceTimersByTimeAsync(6_001);
  expect(await pending).toEqual(metadata);
  expect(fetcher).toHaveBeenCalledTimes(2);
});

test("cancellation stops the gateway chain", async () => {
  const fetcher = vi.fn().mockImplementation(
    (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      }),
  );
  vi.stubGlobal("fetch", fetcher);
  const controller = new AbortController();
  const pending = fetchNFTMetadata(original, controller.signal);
  const rejected = expect(pending).rejects.toMatchObject({ name: "AbortError" });
  controller.abort();
  await rejected;
  expect(fetcher).toHaveBeenCalledTimes(1);
});

test("ordinary HTTP URLs are fetched only once and are not rewritten", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not found", { status: 404 })));
  await expect(fetchWithFallback("https://example.com/metadata.json")).rejects.toThrow("404");
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(convertIpfsUrl("https://example.com/metadata.json")).toBe("https://example.com/metadata.json");
});

test("image decode failures advance to a different gateway", async () => {
  const attempted: string[] = [];
  class TestImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    crossOrigin = "";
    set src(url: string) {
      if (!url) return;
      attempted.push(url);
      queueMicrotask(() => (url.includes("filebase") ? this.onerror?.() : this.onload?.()));
    }
  }
  vi.stubGlobal("Image", TestImage);
  expect(await loadNFTImageUrl(metadata.image)).toContain("https://ipfs.io/");
  expect(attempted).toHaveLength(2);
});

test("artwork can be displayed without CORS permission for canvas caching", async () => {
  class EmbeddedImage {
    crossOrigin = "";
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(url: string) {
      if (url) queueMicrotask(() => (this.crossOrigin ? this.onerror?.() : this.onload?.()));
    }
  }
  vi.stubGlobal("Image", EmbeddedImage);
  expect(await loadNFTImageUrl("https://art.example/nft.png")).toBe("https://art.example/nft.png");
});
