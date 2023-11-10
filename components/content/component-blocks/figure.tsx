import { component, fields } from "@keystatic/core";

import { preview } from "@/components/content/component-blocks/figure.preview";
import { paths } from "@/config/content.config";

export const schema = {
	image: fields.image({
		label: "Image",
		...paths.image,
		validation: { isRequired: true },
	}),
	caption: fields.child({
		kind: "block",
		editIn: "both",
		label: "Caption",
		placeholder: "Add image caption",
		formatting: {
			inlineMarks: "inherit",
		},
		links: "inherit",
	}),
};

export const figure = component({
	label: "Figure",
	schema,
	preview,
});
