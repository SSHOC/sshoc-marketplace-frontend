import { component, fields } from "@keystatic/core";

import { preview } from "@/components/content/component-blocks/embed.preview";

export const schema = {
	kind: fields.select({
		label: "Kind",
		options: [
			{ label: "Vimeo video", value: "vimeo" },
			{ label: "YouTube video", value: "youtube" },
		] as const,
		defaultValue: "youtube",
	}),
	code: fields.text({
		label: "Code",
		validation: { length: { min: 1 } },
	}),
};

export const embed = component({
	label: "Embed",
	schema,
	preview,
});
