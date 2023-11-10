import type { fields } from "@keystatic/core";

import { env } from "@/config/env.config";

type DocumentFieldConfig = Parameters<typeof fields.document>[0];
type FormattingConfig = Exclude<NonNullable<DocumentFieldConfig["formatting"]>, true>;
type FilePathsConfig = Pick<
	Exclude<NonNullable<Parameters<typeof fields.file>[0]>, true>,
	"directory" | "publicPath"
>;
type ImagePathsConfig = Pick<
	Exclude<NonNullable<Parameters<typeof fields.image>[0]>, true>,
	"directory" | "publicPath"
>;

export const formatting = {
	// alignment: true,
	blockTypes: {
		blockquote: true,
		code: true,
	},
	headingLevels: [2, 3, 4],
	inlineMarks: {
		bold: true,
		italic: true,
		strikethrough: true,
		code: true,
		// keyboard: true,
		// subscript: true,
		// superscript: true,
		// underline: true,
	},
	listTypes: {
		ordered: true,
		unordered: true,
	},
	softBreaks: true,
} satisfies FormattingConfig;

export const paths = {
	file: {
		directory: "./public/assets/images/content/",
		publicPath: "/assets/images/content/",
	} satisfies FilePathsConfig,
	image: {
		directory: "./public/assets/images/content/",
		publicPath: "/assets/images/content/",
	} satisfies ImagePathsConfig,
};

export function createPreviewUrl(previewUrl: string) {
	if (env.NEXT_PUBLIC_KEYSTATIC_MODE === "github") {
		return `/api/preview/start?branch={branch}&to=${previewUrl}`;
	}

	return previewUrl;
}
