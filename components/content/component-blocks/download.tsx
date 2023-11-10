import { component, fields } from "@keystatic/core";

import { preview } from "@/components/content/component-blocks/download.preview";
import { paths } from "@/config/content.config";

export const schema = {
	file: fields.file({
		label: "File",
		...paths.file,
		validation: { isRequired: true },
	}),
	label: fields.child({
		kind: "inline",
		placeholder: "Add label",
		formatting: {
			inlineMarks: "inherit",
		},
	}),
};

export const download = component({
	label: "Download",
	schema,
	preview,
});
