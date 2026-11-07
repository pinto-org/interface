import { useNFTImage } from "@/hooks/useNFTImage";
// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  image: vi.fn(),
  metadata: vi.fn(),
  fetchMetadata: vi.fn(),
  loadImage: vi.fn(),
  cacheImage: vi.fn(),
}));
vi.mock("wagmi", () => ({ useReadContract: () => ({ data: "ipfs://metadata", isPending: false }) }));
vi.mock("@/utils/imageCache", () => ({
  imageCache: { get: mocks.image, set: vi.fn() },
  metadataCache: { get: mocks.metadata, set: vi.fn() },
  imageToDataUrl: mocks.cacheImage,
}));
vi.mock("@/utils/ipfs", () => ({ fetchNFTMetadata: mocks.fetchMetadata, loadNFTImageUrl: mocks.loadImage }));
let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
function NFT({ address }: { address: string }) {
  const data = useNFTImage(address, 1);
  return <div>{JSON.stringify(data)}</div>;
}
beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  vi.resetAllMocks();
  mocks.cacheImage.mockResolvedValue("data:image/png;base64,cached");
  container = document.createElement("div");
  root = createRoot(container);
});
afterEach(() => act(() => root.unmount()));
const render = async (address: string) => {
  await act(async () => {
    root.render(<NFT address={address} />);
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  return JSON.parse(container.textContent || "{}");
};
test("cached images for identical token IDs remain isolated by collection", async () => {
  mocks.image.mockImplementation(async (key: string) => `cached:${key}`);
  mocks.metadata.mockReturnValue({ name: "Beaver", image: "ipfs://art" });
  expect((await render("0xAAAA")).imageUrl).toBe("cached:0xaaaa_1");
  expect((await render("0xBBBB")).imageUrl).toBe("cached:0xbbbb_1");
  expect(mocks.fetchMetadata).not.toHaveBeenCalled();
});
test("cached artwork stays visible when uncached metadata gateways fail", async () => {
  mocks.image.mockResolvedValue("cached-artwork");
  mocks.metadata.mockReturnValue(null);
  mocks.fetchMetadata.mockRejectedValue(new Error("gateways offline"));
  expect(await render("0xAAAA")).toMatchObject({ imageUrl: "cached-artwork", loading: false, error: null });
});
test("a cancelled request cannot replace a newly selected NFT", async () => {
  mocks.image.mockResolvedValue(null);
  mocks.metadata.mockReturnValue(null);
  let finish: (value: { name: string; image: string }) => void = () => {};
  mocks.fetchMetadata
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    )
    .mockResolvedValue({ name: "New NFT", image: "new-art" });
  mocks.loadImage.mockResolvedValue("loaded-new-art");
  await render("0xAAAA");
  expect((await render("0xBBBB")).metadata.name).toBe("New NFT");
  await act(async () => {
    finish({ name: "Old NFT", image: "old-art" });
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  expect(JSON.parse(container.textContent || "{}").metadata.name).toBe("New NFT");
});

test("cached details bypass a saturated gateway queue", async () => {
  mocks.image.mockImplementation(async (key: string) => (key === "cached_1" ? "cached-art" : null));
  mocks.metadata.mockImplementation((key: string) =>
    key === "cached_1" ? { name: "Cached NFT", image: "art" } : null,
  );
  mocks.fetchMetadata.mockImplementation(
    (_uri: string, signal: AbortSignal) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new Error("cancelled")));
      }),
  );
  function Grid({ cached = false }) {
    return (
      <>
        <NFT address="slow-a" />
        <NFT address="slow-b" />
        <NFT address="slow-c" />
        <NFT address="slow-d" />
        {cached && (
          <section data-cached>
            <NFT address="cached" />
          </section>
        )}
      </>
    );
  }
  await act(async () => {
    root.render(<Grid />);
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  expect(mocks.fetchMetadata).toHaveBeenCalledTimes(4);
  await act(async () => {
    root.render(<Grid cached />);
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  expect(JSON.parse(container.querySelector("[data-cached]")?.textContent || "{}")).toMatchObject({
    imageUrl: "cached-art",
    loading: false,
  });
});

test("optional caching holds a network slot and is cancelled on unmount", async () => {
  mocks.image.mockResolvedValue(null);
  mocks.metadata.mockReturnValue(null);
  mocks.fetchMetadata.mockResolvedValue({ name: "NFT", image: "art" });
  mocks.loadImage.mockResolvedValue("loaded-art");
  mocks.cacheImage.mockImplementation(
    (_uri: string, signal: AbortSignal) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new Error("cancelled")));
      }),
  );
  await act(async () => {
    root.render(
      <>
        {["a", "b", "c", "d", "e", "f"].map((address) => (
          <NFT key={address} address={address} />
        ))}
      </>,
    );
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  expect(mocks.cacheImage).toHaveBeenCalledTimes(4);
  expect(mocks.fetchMetadata).toHaveBeenCalledTimes(4);
  expect(container.textContent?.match(/loaded-art/g)).toHaveLength(4);
});
