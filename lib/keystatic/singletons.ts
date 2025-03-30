import { fields, singleton } from "@keystatic/core";

import { createPreviewUrl } from "@/lib/keystatic/create-preview-url";
import { createContentFieldOptions, createSingleton } from "@/lib/keystatic/lib";
import { socialMediaKinds } from "@/lib/keystatic/options";

export const createMetadataSingleton = createSingleton("/metadata/", (paths) => {
	return singleton({
		label: "Metadata",
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			title: fields.text({
				label: "Title",
				validation: { isRequired: true },
			}),
			description: fields.text({
				label: "Description",
				validation: { isRequired: true },
			}),
			manifest: fields.object(
				{
					name: fields.text({
						label: "Name",
						validation: { isRequired: true },
					}),
					"short-name": fields.text({
						label: "Short name",
						validation: { isRequired: true },
					}),
					description: fields.text({
						label: "Description",
						validation: { isRequired: true },
					}),
				},
				{
					label: "Webmanifest",
				},
			),
			social: fields.array(
				fields.object(
					{
						kind: fields.select({
							label: "Kind",
							options: socialMediaKinds,
							defaultValue: "website",
						}),
						href: fields.url({
							label: "URL",
						}),
					},
					{
						label: "Social",
					},
				),
				{
					label: "Social media",
					validation: { length: { min: 1 } },
					itemLabel(props) {
						return props.fields.kind.value;
					},
				},
			),
		},
	});
});

export const createNavigationSingleton = createSingleton("/navigation/", (paths) => {
	return singleton({
		label: "Navigation",
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			about: fields.object(
				{
					links: fields.multiRelationship({
						label: "About page",
						validation: { length: { min: 1 } },
						collection: "aboutPages",
					}),
				},
				{
					label: "About page",
				},
			),
			contribute: fields.object(
				{
					links: fields.multiRelationship({
						label: "Page",
						validation: { length: { min: 1 } },
						collection: "contributePages",
					}),
				},
				{
					label: "Contribute pages",
				},
			),
		},
	});
});

export const createPrivacyPolicyPageSingleton = createSingleton("/privacy-policy/", (paths) => {
	return singleton({
		label: "Privacy policy page",
		path: paths.contentPath,
		format: { contentField: "content" },
		entryLayout: "content",
		previewUrl: createPreviewUrl("/privacy-policy"),
		schema: {
			title: fields.text({
				label: "Title",
				validation: { isRequired: true },
			}),
			content: fields.mdx({
				label: "Content",
				options: createContentFieldOptions(paths),
				components: {},
			}),
		},
	});
});
