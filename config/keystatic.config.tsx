import { useObjectUrl } from "@acdh-oeaw/keystatic-lib/preview";
import { cn } from "@acdh-oeaw/style-variants";
import { collection, config, fields, NotEditable, singleton } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import slugify from "@sindresorhus/slugify";
import { AppWindowIcon, ImageIcon, UserCircle2Icon } from "lucide-react";

import logo from "@/public/assets/images/logo.svg";

const socialMediaKinds = [
	{ label: "Bluesky", value: "bluesky" },
	{ label: "Email", value: "email" },
	{ label: "Facebook", value: "facebook" },
	{ label: "Flickr", value: "flickr" },
	{ label: "GitHub", value: "github" },
	{ label: "LinkedIn", value: "linkedin" },
	{ label: "Mastodon", value: "mastodon" },
	{ label: "ORCID", value: "orcid" },
	{ label: "RSS Feed", value: "rss" },
	{ label: "Twitter", value: "twitter" },
	{ label: "Website", value: "website" },
	{ label: "YouTube", value: "youtube" },
] as const;

const figureAlignments = [
	{ label: "Center", value: "center" },
	{ label: "Stretch", value: "stretch" },
] as const;

function transformFilename(fileName: string): string {
	return slugify(fileName, { preserveCharacters: ["."] });
}

const assetOptions = {
	directory: "./public/assets/cms/",
	publicPath: "/assets/cms/",
};

const Avatar = wrapper({
	label: "Avatar",
	description: "Insert rounded image of a person.",
	icon: <UserCircle2Icon />,
	schema: {
		src: fields.image({
			label: "Image",
			validation: { isRequired: true },
			...assetOptions,
		}),
	},
	ContentView(props) {
		const { children, value } = props;

		const { src } = value;

		const url = useObjectUrl(src);

		return (
			<figure className="flex flex-col gap-y-1">
				{/* @ts-expect-error Fixed in react 19 types. */}
				<NotEditable>
					{url != null ? (
						/* eslint-disable-next-line @next/next/no-img-element */
						<img
							alt=""
							className="aspect-square size-44 rounded-full border border-neutral-150 object-cover"
							src={url}
						/>
					) : null}
				</NotEditable>
				{/* @ts-expect-error Fixed in react 19 types. */}
				<figcaption className="text-sm text-neutral-700">{children}</figcaption>
			</figure>
		);
	},
});

const Embed = wrapper({
	label: "Embed",
	description: "Insert content from another website.",
	icon: <AppWindowIcon />,
	schema: {
		src: fields.url({
			label: "URL",
			validation: { isRequired: true },
		}),
	},
	ContentView(props) {
		const { children, value } = props;

		const { src } = value;

		return (
			<figure className="flex flex-col gap-y-1">
				{/* @ts-expect-error Fixed in react 19 types. */}
				<NotEditable>
					{src != null ? (
						/* eslint-disable-next-line jsx-a11y/iframe-has-title */
						<iframe
							className="aspect-video w-full overflow-hidden rounded-sm border border-neutral-150"
							src={src}
						/>
					) : null}
				</NotEditable>
				{/* @ts-expect-error Fixed in react 19 types. */}
				<figcaption className="text-sm text-neutral-700">{children}</figcaption>
			</figure>
		);
	},
});

const Figure = wrapper({
	label: "Figure",
	description: "Insert an image with caption.",
	icon: <ImageIcon />,
	schema: {
		src: fields.image({
			label: "Image",
			validation: { isRequired: true },
			...assetOptions,
		}),
		alt: fields.text({
			label: "Image description for assistive technology",
			validation: { isRequired: false },
		}),
		alignment: fields.select({
			label: "Alignment",
			options: figureAlignments,
			defaultValue: "stretch",
		}),
	},
	ContentView(props) {
		const { children, value } = props;

		const { alignment = "stretch", alt = "", src } = value;

		const url = useObjectUrl(src);

		return (
			<figure
				className={cn(
					"flex flex-col gap-y-1",
					alignment === "center" ? "justify-center" : undefined,
				)}
			>
				{/* @ts-expect-error Fixed in react 19 types. */}
				<NotEditable>
					{url != null ? (
						/* eslint-disable-next-line @next/next/no-img-element */
						<img
							alt={alt}
							className="w-full overflow-hidden rounded-sm border border-neutral-150"
							src={url}
						/>
					) : null}
				</NotEditable>
				{/* @ts-expect-error Fixed in react 19 types. */}
				<figcaption className="text-sm text-neutral-700">{children}</figcaption>
			</figure>
		);
	},
});

export default config({
	collections: {
		"about-pages": collection({
			label: "About pages",
			path: "./content/about/*/",
			format: { contentField: "content" },
			slugField: "title",
			columns: ["title"],
			entryLayout: "form",
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				toc: fields.checkbox({
					label: "Table of contents",
				}),
				content: fields.mdx({
					label: "Content",
					options: {
						heading: [2, 3, 4],
						image: {
							...assetOptions,
							transformFilename,
						},
					},
					components: {
						Avatar,
						Embed,
						Figure,
						// Grid,
						// ApiEndpoint,
					},
				}),
			},
		}),
		"contribute-pages": collection({
			label: "Contribute pages",
			path: "./content/contribute/*/",
			format: { contentField: "content" },
			slugField: "title",
			columns: ["title"],
			entryLayout: "form",
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				toc: fields.checkbox({
					label: "Table of contents",
				}),
				content: fields.mdx({
					label: "Content",
					options: {
						heading: [2, 3, 4],
						image: {
							...assetOptions,
							transformFilename,
						},
					},
					components: {
						Avatar,
						Embed,
						Figure,
						// Grid,
						// ApiEndpoint,
					},
				}),
			},
		}),
	},
	singletons: {
		"contact-page": singleton({
			label: "Contact page",
			path: "./content/contact/",
			format: { contentField: "content" },
			entryLayout: "form",
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
				content: fields.mdx({
					label: "Content",
				}),
			},
		}),
		metadata: singleton({
			label: "Site metadata",
			path: "./content/metadata/",
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
							label: "Social medium",
						},
					),
					{
						label: "Social media",
						itemLabel(props) {
							return props.fields.kind.value;
						},
						validation: { length: { min: 1 } },
					},
				),
			},
		}),
		navigation: singleton({
			label: "Navigation",
			path: "./content/navigation/",
			format: { data: "json" },
			entryLayout: "form",
			schema: {
				"about-pages": fields.object(
					{
						items: fields.array(
							fields.object({
								id: fields.relationship({
									label: "Page",
									collection: "about-pages",
									validation: { isRequired: true },
								}),
								label: fields.text({
									label: "Label",
									validation: { isRequired: true },
								}),
							}),
							{
								label: "Pages",
								itemLabel(props) {
									return props.fields.label.value;
								},
								validation: { length: { min: 1 } },
							},
						),
					},
					{
						label: "About pages",
					},
				),
				"contribute-pages": fields.object(
					{
						items: fields.array(
							fields.object({
								id: fields.relationship({
									label: "Page",
									collection: "contribute-pages",
									validation: { isRequired: true },
								}),
								label: fields.text({
									label: "Label",
									validation: { isRequired: true },
								}),
							}),
							{
								label: "Pages",
								itemLabel(props) {
									return props.fields.label.value;
								},
								validation: { length: { min: 1 } },
							},
						),
					},
					{
						label: "Contribute pages",
					},
				),
			},
		}),
		"privacy-policy-page": singleton({
			label: "Privacy policy page",
			path: "./content/privacy-policy/",
			format: { contentField: "content" },
			entryLayout: "form",
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
				content: fields.mdx({
					label: "Content",
				}),
			},
		}),
		"terms-of-use-page": singleton({
			label: "Terms of use page",
			path: "./content/terms-of-use/",
			format: { contentField: "content" },
			entryLayout: "form",
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
				content: fields.mdx({
					label: "Content",
				}),
			},
		}),
	},
	storage:
		process.env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "./content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			mark() {
				// eslint-disable-next-line @next/next/no-img-element
				return <img width="32" src={logo.src} alt="" />;
			},
			name: "SSHOC",
		},
		navigation: {
			Pages: [
				"about-pages",
				"contribute-pages",
				"contact-page",
				"privacy-policy-page",
				"terms-of-use-page",
			],
			Settings: ["metadata", "navigation"],
		},
	},
});
