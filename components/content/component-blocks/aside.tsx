import { component, fields } from "@keystatic/core";

import { preview } from "@/components/content/component-blocks/aside.preview";

export const schema = {
	type: fields.select({
		label: "Type",
		options: [
			{ label: "Informative", value: "informative" },
			{ label: "Negative", value: "negative" },
			{ label: "Notice", value: "notice" },
			{ label: "Positive", value: "positive" },
		] as const,
		defaultValue: "informative",
	}),
	content: fields.child({
		kind: "block",
		editIn: "both",
		label: "Content",
		placeholder: "Add aside content",
		formatting: {
			inlineMarks: "inherit",
			listTypes: "inherit",
			softBreaks: "inherit",
		},
		links: "inherit",
	}),
};

export const aside = component({
	label: "Aside",
	schema,
	preview,
});
