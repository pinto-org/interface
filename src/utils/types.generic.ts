// Primitives
export type HashString = `0x${string}`;

export type Lookup<T> = Record<string, T>;

export type MayNull<T> = T | null | undefined;

export type MayPromise<T> = T | Promise<T>;

// biome-ignore lint/suspicious/noExplicitAny: any function
export type AnyFn = (...args: any[]) => any;

// Objects
export type ExactPartial<T, U> = {
  [P in Extract<keyof T, U>]?: T[P];
} & {
  [P in Exclude<keyof T, U>]: T[P];
};

export type ExactRequired<T, U> = {
  [P in Extract<keyof T, U>]-?: T[P];
} & {
  [P in Exclude<keyof T, U>]: T[P];
};

// Utility
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type ChainLookup<T> = { [chainId: number]: T };

// renamed for clarity
export type AddressLookup<T> = Lookup<T>;

export type MayArray<T> = T | T[];
