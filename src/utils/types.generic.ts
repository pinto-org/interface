// Primitives
export type HashString = `0x${string}`;

export type Lookup<T> = Record<string, T>;

export type MayNull<T> = T | null | undefined;

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
