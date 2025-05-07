import { useObjectUrl } from "@acdh-oeaw/keystatic-lib/preview";
import { isNonEmptyString } from "@acdh-oeaw/lib";
import { cn, styles } from "@acdh-oeaw/style-variants";
import { collection, config, fields, NotEditable, singleton } from "@keystatic/core";
import { block, mark, repeating, wrapper } from "@keystatic/core/content-components";
import slugify from "@sindresorhus/slugify";
import {
	AppWindowIcon,
	BlindsIcon,
	CogIcon,
	GridIcon,
	ImageIcon,
	LinkIcon,
	ServerIcon,
	SquareIcon,
	UserCircle2Icon,
	VideoIcon,
} from "lucide-react";

import { Logo } from "@/components/content/logo";
import { env } from "@/config/env.config";
import {
	figureAlignments,
	gridAlignments,
	gridLayouts,
	linkKinds,
	socialMediaKinds,
	videoProviders,
} from "@/lib/content/options";
import { createVideoUrl } from "@/lib/keystatic/create-video-url";
import * as validation from "@/lib/keystatic/validation";

function transformFilename(path: string) {
	return slugify(path, { preserveCharacters: ["."] });
}

function createAssetPaths(path: `/${string}/`) {
	return {
		downloads: {
			directory: `./public/assets/content/downloads${path}`,
			publicPath: `/assets/content/downloads${path}`,
			transformFilename,
		},
		images: {
			directory: `./public/assets/content/images${path}`,
			publicPath: `/assets/content/images${path}`,
			transformFilename,
		},
	} as const;
}

function createCollectionPaths(path: `/${string}/`) {
	return {
		assets: createAssetPaths(path),
		content: `./content${path}*/`,
	} as const;
}

type CollectionPaths = ReturnType<typeof createCollectionPaths>;

function createSingletonPaths(path: `/${string}/`) {
	return {
		assets: createAssetPaths(path),
		content: `./content${path}`,
	} as const;
}

type SingletonPaths = ReturnType<typeof createSingletonPaths>;

type Paths = CollectionPaths | SingletonPaths;

function createContentFieldOptions(paths: Paths): Parameters<typeof fields.mdx>[0]["options"] {
	return {
		heading: [2, 3, 4],
		image: paths.assets.images,
	} as const;
}

function createApiEndpointComponent() {
	return {
		ApiParamSelect: block({
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
		}),
		ApiParamTextField: block({
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
		}),
		ApiEndpoint: repeating({
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
		}),
	};
}

function createAvatarComponent(paths: Paths) {
	return {
		Avatar: wrapper({
			label: "Avatar",
			description: "Insert rounded image of a person.",
			icon: <UserCircle2Icon />,
			schema: {
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...paths.assets.images,
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
									className="aspect-square w-44 rounded-full border border-neutral-150 object-cover"
									src={url}
								/>
							) : null}
						</NotEditable>
						{/* @ts-expect-error Fixed in react 19 types. */}
						<figcaption className="text-sm text-neutral-700">{children}</figcaption>
					</figure>
				);
			},
		}),
	};
}

function createDisclosureComponent() {
	return {
		Disclosure: wrapper({
			label: "Disclosure",
			description: "Insert a disclosure panel.",
			icon: <BlindsIcon />,
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
					<details className="flex flex-col gap-y-1">
						{/* @ts-expect-error Fixed in react 19 types. */}
						<NotEditable>
							<summary className="cursor-pointer">{title}</summary>
						</NotEditable>
						{/* @ts-expect-error Fixed in react 19 types. */}
						<div>{children}</div>
					</details>
				);
			},
		}),
	};
}

function createEmbedComponent() {
	return {
		Embed: wrapper({
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
		}),
	};
}

function createFigureComponent(paths: Paths) {
	return {
		Figure: wrapper({
			label: "Figure",
			description: "Insert an image with caption.",
			icon: <ImageIcon />,
			schema: {
				src: fields.image({
					label: "Image",
					validation: { isRequired: true },
					...paths.assets.images,
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
									className={cn(
										"w-full overflow-hidden rounded-sm border border-neutral-150",
										alignment === "center" ? "max-h-100 object-contain" : undefined,
									)}
									src={url}
								/>
							) : null}
						</NotEditable>
						{/* @ts-expect-error Fixed in react 19 types. */}
						<figcaption className="text-sm text-neutral-700">{children}</figcaption>
					</figure>
				);
			},
		}),
	};
}

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

function createGridComponent() {
	return {
		Grid: repeating({
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
		}),
		GridItem: wrapper({
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
		}),
	};
}

function createLinkSchema(paths: Paths) {
	return fields.conditional(
		fields.select({
			label: "Kind",
			options: linkKinds,
			defaultValue: "external",
		}),
		{
			"about-pages": fields.object({
				id: fields.relationship({
					label: "About page",
					validation: { isRequired: true },
					collection: "about-pages",
				}),
				search: fields.text({
					label: "Query params",
					validation: { isRequired: true, pattern: validation.urlSearchParams },
				}),
				hash: fields.text({
					label: "URL fragment",
					validation: { isRequired: true, pattern: validation.urlFragment },
				}),
			}),
			"contribute-pages": fields.object({
				id: fields.relationship({
					label: "Contribute page",
					validation: { isRequired: true },
					collection: "contribute-pages",
				}),
				search: fields.text({
					label: "Query params",
					validation: { isRequired: true, pattern: validation.urlSearchParams },
				}),
				hash: fields.text({
					label: "URL fragment",
					validation: { isRequired: true, pattern: validation.urlFragment },
				}),
			}),
			"contact-page": fields.relationship({
				label: "Contact page",
				validation: { isRequired: true },
				collection: "contact-page",
			}),
			"current-page": fields.text({
				label: "URL fragment",
				validation: { isRequired: true, pattern: validation.urlFragment },
			}),
			download: fields.file({
				label: "Download",
				validation: { isRequired: true },
				...paths.assets.downloads,
			}),
			email: fields.text({
				label: "Email",
				validation: { isRequired: true, pattern: validation.email },
			}),
			external: fields.url({
				label: "URL",
				validation: { isRequired: true },
			}),
			"search-page": fields.object({
				search: fields.text({
					label: "Query params",
					validation: { isRequired: true, pattern: validation.urlSearchParams },
				}),
				hash: fields.text({
					label: "URL fragment",
					validation: { isRequired: true, pattern: validation.urlFragment },
				}),
			}),
		},
	);
}

function createLinkComponent(paths: Paths) {
	return {
		Link: mark({
			label: "Link",
			icon: <LinkIcon />,
			schema: {
				link: createLinkSchema(paths),
			},
			tag: "a",
		}),
	};
}

function createVideoComponent() {
	return {
		Video: wrapper({
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
		}),
	};
}

function createAboutPagesCollection() {
	const paths = createCollectionPaths("/about/");

	return collection({
		label: "About pages",
		path: paths.content,
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
				options: createContentFieldOptions(paths),
				components: {
					...createApiEndpointComponent(),
					...createAvatarComponent(paths),
					...createDisclosureComponent(),
					...createEmbedComponent(),
					...createFigureComponent(paths),
					...createGridComponent(),
					...createLinkComponent(paths),
					...createVideoComponent(),
				},
			}),
		},
	});
}

function createContributePagesCollection() {
	const paths = createCollectionPaths("/contribute/");

	return collection({
		label: "Contribute pages",
		path: paths.content,
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
				options: createContentFieldOptions(paths),
				components: {
					...createApiEndpointComponent(),
					...createAvatarComponent(paths),
					...createDisclosureComponent(),
					...createEmbedComponent(),
					...createFigureComponent(paths),
					...createGridComponent(),
					...createLinkComponent(paths),
					...createVideoComponent(),
				},
			}),
		},
	});
}

function createContactPageSingleton() {
	const paths = createSingletonPaths("/contact/");

	return singleton({
		label: "Contact page",
		path: paths.content,
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
	});
}

function createMetadataSingleton() {
	const paths = createSingletonPaths("/metadata/");

	return singleton({
		label: "Site metadata",
		path: paths.content,
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
	});
}

function createNavigationSingleton() {
	const paths = createSingletonPaths("/navigation/");

	return singleton({
		label: "Navigation",
		path: paths.content,
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
	});
}

function createPrivacyPolicyPageSingleton() {
	const paths = createSingletonPaths("/privacy-policy/");

	return singleton({
		label: "Privacy policy page",
		path: paths.content,
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
	});
}

function createTermsOfUsePageSingleton() {
	const paths = createSingletonPaths("/terms-of-use/");

	return singleton({
		label: "Terms of use page",
		path: paths.content,
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
	});
}

const collections = {
	"about-pages": createAboutPagesCollection(),
	"contribute-pages": createContributePagesCollection(),
};

const singletons = {
	"contact-page": createContactPageSingleton(),
	metadata: createMetadataSingleton(),
	navigation: createNavigationSingleton(),
	"privacy-policy-page": createPrivacyPolicyPageSingleton(),
	"terms-of-use-page": createTermsOfUsePageSingleton(),
};

export default config({
	collections,
	singletons,
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
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			mark() {
				return <Logo />;
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
