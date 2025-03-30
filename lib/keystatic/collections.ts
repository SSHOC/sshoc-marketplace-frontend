import { collection, fields } from "@keystatic/core";

import { createPreviewUrl } from "@/lib/keystatic/create-preview-url";
import { createCollection, createContentFieldOptions } from "@/lib/keystatic/lib";

export const createAboutPagesCollection = createCollection("/about/", (paths) => {
	return collection({
		label: "About pages",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "content",
		previewUrl: createPreviewUrl("/about/{slug}"),
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths),
				components: {},
			}),
		},
	});
});

export const createContributePagesCollection = createCollection("/contribute/", (paths) => {
	return collection({
		label: "Contribute pages",
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "content",
		previewUrl: createPreviewUrl("/contribute/{slug}"),
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths),
				components: {},
			}),
		},
	});
});
