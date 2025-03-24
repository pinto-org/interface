import Bottleneck from "bottleneck";

const RETRY_AFTER_MS = 200;

const MAX_RETRY_COUNT = 3;

export interface RequestWithId<T> {
  id: string;
  request: () => Promise<T>;
}

export interface FetchWithLimiterOptions {
  allowFailure?: boolean;
}

interface FetchWithLimiterError {
  id: string;
  error: any;
  status: "failure";
}

interface FetchWithLimiterSuccess<T> {
  id: string;
  result: T;
  status: "success";
}

export type FetchWithLimiterResult<T> = FetchWithLimiterSuccess<T> | FetchWithLimiterError;

/**
 * Singleton class to handle rate limiting with Bottleneck.
 * We use a singleton to ensure we are using the same limiter instance for all requests.
 */
export class Limiter {
  private static _limiter: Bottleneck;

  static get limiter() {
    if (!Limiter._limiter) {
      Limiter._limiter = Limiter.initializeLimiter();
    }
    return Limiter._limiter;
  }

  static async fetchWithBottleneckLimiter<T>(requests: RequestWithId<T>[], options?: FetchWithLimiterOptions) {
    const allowFailure = options?.allowFailure ?? false;

    const scheduledRequests = requests.map<Promise<FetchWithLimiterResult<T>>>(({ id, request }) =>
      // Schedule the request with the limiter and assign the id
      Limiter.limiter
        .schedule({ id }, request)
        .then(
          (result) => ({ id, result, status: "success" }),
          (error) => {
            return { id, error, status: "failure" };
          },
        ),
    );

    // Wait for all the scheduled requests to complete
    const results = await Promise.all(scheduledRequests);

    // Process results
    const finalResults: T[] = [];
    // biome-ignore lint/suspicious/noExplicitAny:
    const errors: { id: string | number; error: any }[] = [];

    for (const res of results) {
      if (res.status === "failure") {
        errors.push({ id: res.id, error: res.error });
      } else {
        finalResults.push(res.result);
      }
    }

    if (errors.length > 0) {
      console.error("Some requests failed:", errors);
      if (allowFailure === false) {
        throw new Error("Swap requests failed. Check console for details.");
      }
    }

    return finalResults;
  }

  private static initializeLimiter() {
    if (Limiter._limiter) {
      return Limiter._limiter;
    }

    // 0x has rate limit of 10 requests per second.
    // We set the reservoir to 4, so we can make 4 requests per every 500ms, with a minimum of 125ms between each request.
    const limiter = new Bottleneck({
      reservoir: 4,
      reservoirRefreshInterval: 500,
      reservoirRefreshAmount: 4,
      maxConcurrent: 4,
      minTime: 125,
    });

    limiter.on("failed", (error, info) => {
      // If we are being rate limited, retry after 100ms. We try until we get a successful response
      if (isRateLimitError(error)) {
        console.debug("[Limiter]: request failed: ... retrying id: ", info.options.id);
        if (info.retryCount < MAX_RETRY_COUNT) {
          return RETRY_AFTER_MS;
        }
        return null;
      }

      // Non rate limit errors are not retried
      return null;
    });

    return limiter;
  }
}

function isRateLimitError(error: any) {
  if ("message" in error && typeof error.message === "string") {
    return error.message.toLowerCase().includes("rate limit");
  }
  return false;
}
