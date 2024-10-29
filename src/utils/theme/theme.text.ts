import { ClassValue } from "clsx";

// -------------------- Types --------------------

export type FontVariant =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "lg"
	| "body"
	| "body-light"
	| "body-bold"
	| "sm"
	| "sm-light"
	| "sm-bold"
	| "xs";

export type FontSize =
	| "h1" // 54px
	| "h2" // 36px
	| "h3" // 32px
	| "h4" // 24px
	| "body" // 20px
	| "sm" // 16px
	| "xs"; // 14px

export type FontWeight = "thin" | "light" | "regular" | "medium";

export type TextAlign =
	| "left"
	| "center"
	| "right"
	| "justify"
	| "start"
	| "end";

type VariantLookup<T> = Record<FontVariant, T>;

// -------------------- Theme --------------------

// biome-ignore format: keep unformatted for readability
const fontSize: Record<FontSize, ClassValue> = {
	xs: 	         "text-[0.875rem]", 		// 14px
	sm: 	         "text-[1rem]", 				// 16px
	body:          "text-[1.25rem]", 		// 20px
	h4: 	         "text-[1.5rem]", 			// 24px
	h3: 	         "text-[2rem]", 				// 32px
	h2: 	         "text-[2.25rem]", 		// 36px
	h1: 	         "text-[3.429rem]", 		// 54.86px
} as const;

// biome-ignore format: keep unformatted for readability
// size * 110%
const fontLineHeights: Record<FontSize, ClassValue> = {
	xs:            "leading-[.9625rem]",
	sm:            "leading-[1.1rem]",
	body:          "leading-[1.375rem]",
	h4:            "leading-[1.65rem]",
	h3:            "leading-[2.2rem]",
	h2:            "leading-[2.475rem]",
	h1:            "leading-[3.772rem]",
} as const;

// biome-ignore format: keep unformatted for readability
const fontWeights: Record<FontWeight, ClassValue> = {
	thin:          "font-[300]",
	light:         "font-[340]",
	regular:       "font-[400]",
	medium:        "font-[500]",
} as const;

// biome-ignore format: keep unformatted for readability
const letterSpacings: Partial<VariantLookup<ClassValue>> = {
	"body-light":  "tracking-[-0.025rem]",
	h3:            "tracking-[-.04rem]",
	h2:            "tracking-[.0315rem]",
	h1:            "tracking-[-0.069rem]",
} as const;

// biome-ignore format: keep unformatted for readability
export const config = {
	fontSize: {
		h1:        			"h1",
		h2: 		   		  "h2",
		h3:        		  "h3",
		h4:        		  "h4",
		lg:        		  "h4",
		body:      		  "body",
		"body-light":   "body",
		"body-bold":    "body",
		sm:             "sm",
		"sm-bold":      "sm",
		"sm-light":     "sm",
		xs:             "xs",
	} satisfies VariantLookup<FontSize>,
	fontWeight: {
		h1:             "thin", 		// 300
		h2:             "thin", 		// 300
		h3:             "light", 		// 340
		h4:             "regular", 	// 400
		lg:             "light", 		// 340
		"body-bold":    "medium", 	// 500
		body:           "regular", 	// 400
		"body-light":   "light", 		// 340
		"sm-bold":      "medium", 	// 500
		sm:             "regular", 	// 400
		"sm-light":     "light", 		// 340
		xs:             "light", 		// 340
	} satisfies VariantLookup<FontWeight>,
	letterSpacing: {
		h1:             "h1",
		h2:             "h2",
		h3:             "h3",
		"body-light":   "body-light",
	} satisfies Partial<VariantLookup<keyof typeof letterSpacings>>,
} as const;

// -------------------- Functions --------------------

const getTextAlign = (align?: TextAlign) => {
	return align ? `text-align: ${align}` : undefined;
};

const getTextSize = (size: FontSize = "sm") => {
	return fontSize[size];
};

const getTextWeight = (weight: FontWeight = "regular") => {
	return fontWeights[weight];
};

const getTextLetterSpacing = (letterSpacing: keyof typeof letterSpacings) => {
	return letterSpacings[letterSpacing];
};

// -------------------- Theme --------------------

export const textTheme = {
	size: fontSize,
	lineHeight: fontLineHeights,
	weight: fontWeights,
	letterSpacing: letterSpacings,
} as const;

export const textConfig = {
	theme: {
		...textTheme,
	},
	config,
	methods: {
		align: getTextAlign,
		fontSize: getTextSize,
		fontWeight: getTextWeight,
		letterSpacing: getTextLetterSpacing,
	},
} as const;

// -------------------- Functions --------------------

export const deriveTextStyles = (variant: FontVariant) => {
	return [
		fontSize[config.fontSize[variant] ?? "sm"],
		fontWeights[config.fontWeight[variant] ?? "default"],
		letterSpacings[config.letterSpacing[variant] ?? ""],
	].join(" ");
};
