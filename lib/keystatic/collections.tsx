import { createCollection, createContentFieldOptions, createLabel } from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

import {
	createDisclosure,
	createEmbed,
	createFigure,
	createFootnote,
	createGrid,
	createHeadingId,
	createLink,
	createTabs,
	createVideo,
} from "@/lib/keystatic/components";
import { createPreviewUrl } from "@/lib/keystatic/create-preview-url";

export const createAboutPages = createCollection("/about-pages/", (paths, locale) => {
	return collection({
		label: createLabel("About pages", locale),
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
			navigationMenu: fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					position: fields.number({
						label: "Position",
						validation: { isRequired: true },
					}),
				},
				{
					label: "Navigation menu",
				},
			),
			toc: fields.checkbox({
				label: "Table of contents",
				defaultValue: false,
			}),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths.assetPath),
				components: {
					...createDisclosure(paths.assetPath, locale),
					...createEmbed(paths.assetPath, locale),
					...createFigure(paths.assetPath, locale),
					...createFootnote(paths.assetPath, locale),
					...createGrid(paths.assetPath, locale),
					...createHeadingId(paths.assetPath, locale),
					...createLink(paths.assetPath, locale),
					...createTabs(paths.assetPath, locale),
					...createVideo(paths.assetPath, locale),
				},
			}),
		},
	});
});

export const createContributePages = createCollection("/contribute-pages/", (paths, locale) => {
	return collection({
		label: createLabel("Contribute pages", locale),
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
			navigationMenu: fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					position: fields.number({
						label: "Position",
						validation: { isRequired: true },
					}),
				},
				{
					label: "Navigation menu",
				},
			),
			toc: fields.checkbox({
				label: "Table of contents",
				defaultValue: false,
			}),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths.assetPath),
				components: {
					...createDisclosure(paths.assetPath, locale),
					...createEmbed(paths.assetPath, locale),
					...createFigure(paths.assetPath, locale),
					...createFootnote(paths.assetPath, locale),
					...createGrid(paths.assetPath, locale),
					...createHeadingId(paths.assetPath, locale),
					...createLink(paths.assetPath, locale),
					...createTabs(paths.assetPath, locale),
					...createVideo(paths.assetPath, locale),
				},
			}),
		},
	});
});

export const createPages = createCollection("/pages/", (paths, locale) => {
	return collection({
		label: createLabel("Pages", locale),
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "content",
		previewUrl: createPreviewUrl("/{slug}"),
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths.assetPath),
				components: {
					...createDisclosure(paths.assetPath, locale),
					...createEmbed(paths.assetPath, locale),
					...createFigure(paths.assetPath, locale),
					...createFootnote(paths.assetPath, locale),
					...createGrid(paths.assetPath, locale),
					...createHeadingId(paths.assetPath, locale),
					...createLink(paths.assetPath, locale),
					...createTabs(paths.assetPath, locale),
					...createVideo(paths.assetPath, locale),
				},
			}),
		},
	});
});
