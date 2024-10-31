import clsx, { ClassValue } from "clsx";

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

export type FontWeight = "thin" | "light" | "regular" | "medium" | "default";

export type TextAlign = "left" | "center" | "right" | "justify" | "start" | "end";

export type LetterSpacing = "body-light" | "h3" | "h2" | "h1" | "none";

export type TextColor = "primary" | "secondary" | "light";

type VariantLookup<T> = Record<FontVariant, T>;

export interface ITextBase {
  variant?: FontVariant;
  size?: FontSize;
  weight?: FontWeight;
  align?: TextAlign;
  color?: TextColor;
}

// -------------------- Theme --------------------

// biome-ignore format: keep unformatted for readability
const textColors = {
	'primary':     clsx("text-black"),
	'secondary':   clsx("text-pinto-gray-5"),
	'light':       clsx("text-pinto-gray-4"),
} as const;

// biome-ignore format: keep unformatted for readability
const fontSize = {
	xs: 	         clsx("text-[0.875rem]"), 		// 14px
	sm: 	         clsx("text-[1rem]"), 				// 16px
	body:          clsx("text-[1.25rem]"), 		// 20px
	h4: 	         clsx("text-[1.5rem]"), 			// 24px
	h3: 	         clsx("text-[2rem]"), 				// 32px
	h2: 	         clsx("text-[2.25rem]"), 		// 36px
	h1: 	         clsx("text-[3.429rem]"), 		// 54.86px
} as const;

// biome-ignore format: keep unformatted for readability
const noLineHeight = {
	xs: 	         clsx("leading-[0.875rem]"), 		// 14px
	sm: 	         clsx("leading-[1rem]"), 				// 16px
	body:          clsx("leading-[1.25rem]"), 		// 20px
	h4: 	         clsx("leading-[1.5rem]"), 			// 24px
	h3: 	         clsx("leading-[2rem]"), 				// 32px
	h2: 	         clsx("leading-[2.25rem]"), 		// 36px
	h1: 	         clsx("leading-[3.429rem]"), 		// 54.86px
}

// biome-ignore format: keep unformatted for readability
// size * 110%
const fontLineHeights = {
	xs:            clsx("leading-[.9625rem]"),
	sm:            clsx("leading-[1.1rem]"),
	body:          clsx("leading-[1.375rem]"),
	h4:            clsx("leading-[1.65rem]"),
	h3:            clsx("leading-[2.2rem]"),
	h2:            clsx("leading-[2.475rem]"),
	h1:            clsx("leading-[3.772rem]"),
} as const;

// biome-ignore format: keep unformatted for readability
const fontWeights = {
	thin:          clsx("font-[300]"),
	light:         clsx("font-[340]"),
	regular:       clsx("font-[400]"),
	medium:        clsx("font-[500]"),
} as const;

// biome-ignore format: keep unformatted for readability
const letterSpacings = {
	"body-light":  clsx("tracking-[-0.025rem]"),
	h3:            clsx("tracking-[-.04rem]"),
	h2:            clsx("tracking-[.0315rem]"),
	h1:            clsx("tracking-[-0.069rem]"),
	none:          clsx("tracking-[0rem]"),
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
		none:           "none",
	} satisfies Partial<VariantLookup<LetterSpacing> & { none: LetterSpacing }>,
} as const;

// -------------------- Functions --------------------

const getTextAlign = (align: TextAlign = "left") => {
  return `text-${align}`;
};

const getTextSize = (size: FontSize = "sm") => {
  return fontSize[size];
};

const getTextWeight = (weight: FontWeight = "regular") => {
  return fontWeights[weight];
};

const getLetterSpacing = (letterSpacing: LetterSpacing = "none") => {
  return letterSpacings[letterSpacing];
};

const getTextColor = (color: TextColor = "primary") => {
  return textColors[color];
};

// -------------------- Functions --------------------

export const deriveTextClassValues = ({
  variant = "sm",
  size,
  weight,
  align,
  color = "primary",
}: Partial<ITextBase>) => {
  const classNames: ClassValue[] = [
    fontSize[size ?? config.fontSize[variant] ?? "sm"],
    fontLineHeights[size ?? config.letterSpacing[variant] ?? "sm"],
    fontWeights[weight ?? config.fontWeight[variant] ?? "default"],
    letterSpacings[config.letterSpacing[variant] ?? "none"],
    getTextColor(color),
    getTextAlign(align),
  ];

  return classNames;
};

export const deriveTextStyles = (variant: FontVariant, sameHeight: boolean = false) => {
  return [
    fontSize[config.fontSize[variant] ?? "sm"],
    (sameHeight ? noLineHeight : fontLineHeights)[config.letterSpacing[variant] ?? "sm"],
    fontWeights[config.fontWeight[variant] ?? "default"],
    letterSpacings[config.letterSpacing[variant] ?? "none"],
  ].join(" ");
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
  variantConfig: config,
  methods: {
    align: getTextAlign,
    fontSize: getTextSize,
    fontWeight: getTextWeight,
    letterSpacing: getLetterSpacing,
    color: getTextColor,
    textClass: deriveTextClassValues,
    variant: deriveTextStyles,
  },
} as const;
