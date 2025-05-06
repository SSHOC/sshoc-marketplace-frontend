import { useObjectUrl } from "@acdh-oeaw/keystatic-lib/preview";
import { isNonEmptyString } from "@acdh-oeaw/lib";
import { cn, styles } from "@acdh-oeaw/style-variants";
import { collection, config, fields, NotEditable, singleton } from "@keystatic/core";
import { block, repeating, wrapper } from "@keystatic/core/content-components";
import slugify from "@sindresorhus/slugify";
import {
	AppWindowIcon,
	CogIcon,
	GridIcon,
	ImageIcon,
	ServerIcon,
	SquareIcon,
	UserCircle2Icon,
	VideoIcon,
} from "lucide-react";
// import { createAssetOptions } from "@acdh-oeaw/keystatic-lib";

import { env } from "@/config/env.config";
import {
	figureAlignments,
	gridAlignments,
	gridLayouts,
	socialMediaKinds,
	videoProviders,
} from "@/lib/content/options";
import { createVideoUrl } from "@/lib/keystatic/create-video-url";
import logo from "@/public/assets/images/logo.svg";
// import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";

function transformFilename(fileName: string): string {
	return slugify(fileName, { preserveCharacters: ["."] });
}

const assetOptions = {
	directory: "./public/assets/cms/",
	publicPath: "/assets/cms/",
};

const ApiParamSelect = block({
	label: "Query parameter (select)",
	description: "",
	icon: <CogIcon />,
	schema: {
		label: fields.text({
			label: "Label",
			validation: { isRequired: true },
		}),
		id: fields.text({
			label: "Parameter",
			validation: { isRequired: true },
		}),
		placeholder: fields.text({
			label: "Placeholder",
			validation: { isRequired: false },
		}),
		options: fields.array(
			fields.object({
				id: fields.text({
					label: "Identifier",
					validation: { isRequired: true },
				}),
				label: fields.text({
					label: "Label",
					validation: { isRequired: true },
				}),
			}),
			{
				label: "Options",
				itemLabel(props) {
					return props.fields.label.value;
				},
				validation: { length: { min: 1 } },
			},
		),
	},
	forSpecificLocations: true,
	ContentView(props) {
		const { value } = props;

		const { id, label } = value;

		return (
			/* @ts-expect-error Fixed in react 19 types. */
			<NotEditable className="flex flex-col gap-y-1">
				<div>
					<span>Parameter:</span> {id}
				</div>
				<div>
					<span>Label:</span> {label}
				</div>
			</NotEditable>
		);
	},
});

const ApiParamTextField = block({
	label: "Query parameter (text)",
	description: "",
	icon: <CogIcon />,
	schema: {
		label: fields.text({
			label: "Label",
			validation: { isRequired: true },
		}),
		id: fields.text({
			label: "Parameter",
			validation: { isRequired: true },
		}),
		placeholder: fields.text({
			label: "Placeholder",
			validation: { isRequired: false },
		}),
	},
	forSpecificLocations: true,
	ContentView(props) {
		const { value } = props;

		const { id, label } = value;

		return (
			/* @ts-expect-error Fixed in react 19 types. */
			<NotEditable className="flex flex-col gap-y-1">
				<div>
					<span>Parameter:</span> {id}
				</div>
				<div>
					<span>Label:</span> {label}
				</div>
			</NotEditable>
		);
	},
});

const ApiEndpoint = repeating({
	label: "API Endpoint",
	description: "Insert a widget to interact with the API.",
	icon: <ServerIcon />,
	schema: {
		title: fields.text({
			label: "Title",
			validation: { isRequired: true },
		}),
		pathname: fields.url({
			label: "API endpoint pathname",
			validation: { isRequired: true },
		}),
	},
	children: ["ApiParamSelect", "ApiParamTextField"],
	ContentView(props) {
		const { children, value } = props;

		const { pathname, title } = value;

		return (
			<aside className="flex flex-col gap-y-1">
				{/* @ts-expect-error Fixed in react 19 types. */}
				<NotEditable className="flex flex-col gap-y-1">
					<div>
						<span>Title:</span> {title}
					</div>
					<div>
						<span>Pathname:</span> {pathname}
					</div>
				</NotEditable>
				{/* @ts-expect-error Fixed in react 19 types. */}
				<div>{children}</div>
			</aside>
		);
	},
});

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

const Disclosure = wrapper({
	label: "Disclosure",
	description: "Insert a disclosure panel.",
	schema: {
		title: fields.text({
			label: "Title",
			validation: { isRequired: true },
		}),
	},
	ContentView(props) {
		const { children, value } = props;

		const { title } = value;

		return (
			<details>
				{/* @ts-expect-error Fixed in react 19 types. */}
				<NotEditable>{title}</NotEditable>
				<summary></summary>
				{/* @ts-expect-error Fixed in react 19 types. */}
				<div>{children}</div>
			</details>
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
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen={true}
							className="aspect-video w-full overflow-hidden rounded-sm border border-neutral-150"
							referrerPolicy="strict-origin-when-cross-origin"
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

const gridStyles = styles({
	base: "grid content-start gap-x-8",
	variants: {
		alignment: {
			center: "items-center",
			stretch: "",
		},
		layout: {
			"two-columns": "sm:grid-cols-2",
			"three-columns": "sm:grid-cols-3",
			"four-columns": "sm:grid-cols-4",
			"one-two-columns": "sm:grid-cols-[1fr_2fr]",
			"one-three-columns": "sm:grid-cols-[1fr_3fr]",
			"one-four-columns": "sm:grid-cols-[1fr_4fr]",
		},
	},
	defaults: {
		alignment: "stretch",
		layout: "two-columns",
	},
});

const Grid = repeating({
	label: "Grid",
	description: "Insert a layout grid.",
	icon: <GridIcon />,
	schema: {
		layout: fields.select({
			label: "Layout",
			options: gridLayouts,
			defaultValue: "two-columns",
		}),
		alignment: fields.select({
			label: "Vertical alignment",
			options: gridAlignments,
			defaultValue: "stretch",
		}),
	},
	children: ["GridItem"],
	ContentView(props) {
		const { children, value } = props;

		const { alignment = "stretch", layout = "two-columns" } = value;

		/* @ts-expect-error Fixed in react 19 types. */
		return <div className={gridStyles({ alignment, layout })}>{children}</div>;
	},
});

const GridItem = wrapper({
	label: "Grid item",
	description: "Insert a layout grid cell.",
	icon: <SquareIcon />,
	schema: {
		alignment: fields.select({
			label: "Vertical alignment",
			options: gridAlignments,
			defaultValue: "stretch",
		}),
	},
	forSpecificLocations: true,
	ContentView(props) {
		const { children, value } = props;

		const { alignment = "stretch" } = value;

		/* @ts-expect-error Fixed in react 19 types. */
		return <div className={alignment === "center" ? "self-center" : undefined}>{children}</div>;
	},
});

const Video = wrapper({
	label: "Video",
	description: "Insert a video.",
	icon: <VideoIcon />,
	schema: {
		provider: fields.select({
			label: "Provider",
			options: videoProviders,
			defaultValue: "youtube",
		}),
		id: fields.text({
			label: "ID",
			validation: { isRequired: true },
		}),
		startTime: fields.number({
			label: "Start time",
			validation: { isRequired: false },
		}),
	},
	ContentView(props) {
		const { children, value } = props;

		const { id, provider, startTime } = value;

		const src = isNonEmptyString(id) ? String(createVideoUrl(provider, id, startTime)) : null;

		return (
			<figure className="flex flex-col gap-y-1">
				{/* @ts-expect-error Fixed in react 19 types. */}
				<NotEditable>
					{src != null ? (
						// eslint-disable-next-line jsx-a11y/iframe-has-title
						<iframe
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen={true}
							className="rounded-2 border-stroke-weak aspect-video w-full overflow-hidden border"
							referrerPolicy="strict-origin-when-cross-origin"
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
						ApiEndpoint,
						ApiParamSelect,
						ApiParamTextField,
						Avatar,
						Disclosure,
						Embed,
						Figure,
						Grid,
						GridItem,
						Video,
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
						ApiEndpoint,
						ApiParamSelect,
						ApiParamTextField,
						Avatar,
						Disclosure,
						Embed,
						Figure,
						Grid,
						GridItem,
						Video,
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
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
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
