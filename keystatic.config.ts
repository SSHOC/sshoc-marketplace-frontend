import { collection, config, fields, singleton } from "@keystatic/core";

import { aside } from "@/components/content/component-blocks/aside";
import { download } from "@/components/content/component-blocks/download";
import { embed } from "@/components/content/component-blocks/embed";
import { figure } from "@/components/content/component-blocks/figure";
import { Logo } from "@/components/logo";
import { createPreviewUrl, formatting, paths } from "@/config/content.config";
import { env } from "@/config/env.config";

export default config({
	ui: {
		brand: {
			name: "SSHOC Open Marketplace",
			// @ts-expect-error `ReactNode` is a valid return type.
			mark: Logo,
		},
		navigation: {
			Content: ["home", "contact", "privacyPolicy", "termsOfUse", "---", "about", "contribute"],
			// Settings: [],
		},
	},
	storage:
		/**
		 * @see https://keystatic.com/docs/github-mode
		 */
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
			  }
			: {
					kind: "local",
			  },
	collections: {
		about: collection({
			label: "About pages",
			path: "./content/about/*",
			slugField: "title",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/about/{slug}"),
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { length: { min: 1 } },
					},
				}),
				content: fields.document({
					label: "Content",
					dividers: true,
					formatting,
					images: paths.image,
					layouts: [[1, 1]],
					links: true,
					tables: true,
					componentBlocks: {
						aside,
						download,
						embed,
						figure,
					},
				}),
			},
		}),
		contribute: collection({
			label: "Contribute pages",
			path: "./content/contribute/*",
			slugField: "title",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/contribute/{slug}"),
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { length: { min: 1 } },
					},
				}),
				content: fields.document({
					label: "Content",
					dividers: true,
					formatting,
					images: paths.image,
					layouts: [[1, 1]],
					links: true,
					tables: true,
					componentBlocks: {
						aside,
						download,
						embed,
						figure,
					},
				}),
			},
		}),
	},
	singletons: {
		// TODO: i18n
		contact: singleton({
			label: "Contact page",
			path: "./content/pages/contact",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/contact"),
			schema: {
				title: fields.text({
					label: "Title",
					validation: { length: { min: 1 } },
				}),
				content: fields.document({
					label: "Content",
					dividers: true,
					formatting: true,
					links: true,
				}),
			},
		}),
		// TODO: i18n
		home: singleton({
			label: "Home page",
			path: "./content/pages/home",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/"),
			schema: {
				title: fields.text({
					label: "Title",
					validation: { length: { min: 1 } },
				}),
				content: fields.document({
					label: "Content",
					dividers: true,
					formatting: true,
					links: true,
				}),
			},
		}),
		// TODO: i18n
		privacyPolicy: singleton({
			label: "Privacy policy page",
			path: "./content/pages/privacy-policy",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/privacy-policy"),
			schema: {
				title: fields.text({
					label: "Title",
					validation: { length: { min: 1 } },
				}),
				content: fields.document({
					label: "Content",
					dividers: true,
					formatting: true,
					links: true,
				}),
			},
		}),
		// TODO: i18n
		termsOfUse: singleton({
			label: "Terms of use page",
			path: "./content/pages/terms-of-use",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/terms-of-use"),
			schema: {
				title: fields.text({
					label: "Title",
					validation: { length: { min: 1 } },
				}),
				content: fields.document({
					label: "Content",
					dividers: true,
					formatting: true,
					links: true,
				}),
			},
		}),
	},
});
