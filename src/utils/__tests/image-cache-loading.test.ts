import { afterEach, expect, test, vi } from "vitest";
import { imageToDataUrl } from "../imageCache";
class StalledImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  crossOrigin = "";
  src = "";
}
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
test("optional image caching stops when navigation cancels the load", async () => {
  vi.stubGlobal("Image", StalledImage);
  const controller = new AbortController();
  const promise = imageToDataUrl("https://art.example/1.png", controller.signal);
  const rejected = expect(promise).rejects.toMatchObject({ name: "AbortError" });
  controller.abort();
  await rejected;
});
test("a stalled CORS caching request cannot hold a network slot indefinitely", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("Image", StalledImage);
  const rejected = expect(imageToDataUrl("https://art.example/1.png")).rejects.toThrow("timed out");
  await vi.advanceTimersByTimeAsync(6_001);
  await rejected;
});
