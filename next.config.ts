/* global process */

import { log } from "@acdh-oeaw/lib";
import type { Options as MdxOptions } from "@mdx-js/loader";
import createBundleAnalyzer from "@next/bundle-analyzer";
import createSvgPlugin from "@stefanprobst/next-svg";
import withToc from "@stefanprobst/rehype-extract-toc";
import withTocExport from "@stefanprobst/rehype-extract-toc/mdx";
import withHeadingFragmentLinks from "@stefanprobst/rehype-fragment-links";
import withImageCaptions from "@stefanprobst/rehype-image-captions";
import withListsWithAriaRole from "@stefanprobst/rehype-lists-with-aria-role";
import withNextImage from "@stefanprobst/rehype-next-image";
import withNextLinks from "@stefanprobst/rehype-next-links";
import withNoReferrerLinks from "@stefanprobst/rehype-noreferrer-links";
import withSyntaxHighlighting from "@stefanprobst/rehype-shiki";
import withParsedFrontmatter from "@stefanprobst/remark-extract-yaml-frontmatter";
import withParsedFrontmatterExport from "@stefanprobst/remark-extract-yaml-frontmatter/mdx";
import type { Options as MdxPageOptions } from "@stefanprobst/remark-mdx-page";
import withPage from "@stefanprobst/remark-mdx-page";
import withSmartQuotes from "@stefanprobst/remark-smart-quotes";
import type { Element as HastElement } from "hast";
import { headingRank } from "hast-util-heading-rank";
import { h } from "hastscript";
import type { NextConfig as Config } from "next";
import * as path from "path";
import withHeadingIds from "rehype-slug";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import { getHighlighter } from "shiki";

import { syntaxHighlightingTheme } from "~/config/docs.config";
import { defaultLocale, locales } from "~/config/i18n.config";

type NextConfig = Config;

const config: NextConfig = {
	eslint: {
		dirs: ["."],
		ignoreDuringBuilds: true,
	},
	async headers() {
		const headers = [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
				],
			},
			{
				source: "/assets/fonts/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, immutable, max-age=31536000",
					},
				],
			},
		];

		if (process.env.NEXT_PUBLIC_BOTS !== "enabled") {
			headers.push({
				source: "/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex, nofollow",
					},
				],
			});

			log.warn("Indexing by search engines is disallowed.");
		}

		return headers;
	},
	i18n: {
		locales,
		defaultLocale,
	},
	images: {
		remotePatterns:
			process.env.NEXT_PUBLIC_SSHOC_API_BASE_URL != null
				? [new URL(process.env.NEXT_PUBLIC_SSHOC_API_BASE_URL)]
				: undefined,
	},
	output: "standalone",
	pageExtensions: ["tsx", "ts", "mdx"],
	poweredByHeader: false,
	/**
	 * React Spectrum currently has issues with `StrictMode`.
	 *
	 * @see e.g. https://github.com/adobe/react-spectrum/issues/977
	 */
	reactStrictMode: false,
	async rewrites() {
		return [
			{
				source: "/about",
				destination: "/about/service",
			},
			{
				source: "/browse",
				destination: "/browse/activity",
			},
		];
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack(config, context) {
		/**
		 * @see https://github.com/vercel/next.js/discussions/30870
		 */
		config.infrastructureLogging = { ...config.infrastructureLogging, level: "error" };

		/** Enable top-level await. */
		config.experiments = config.experiments ?? {};
		config.experiments.topLevelAwait = true;

		/**
		 * @see https://github.com/vercel/next.js/issues/17806
		 */
		config.module?.rules?.push({
			test: /\.mjs$/,
			type: "javascript/auto",
			resolve: {
				fullySpecified: false,
			},
		});

		function createPermalink(headingElement: HastElement, id: string): Array<HastElement> {
			const permaLinkId = ["permalink", id].join("-");
			const ariaLabelledBy = [permaLinkId, id].join(" ");

			return [
				h("div", { dataPermalink: true, dataRank: headingRank(headingElement) }, [
					h("a", { ariaLabelledBy, href: "#" + id }, [
						h("span", { id: permaLinkId, hidden: true }, "Permalink to"),
						h("span", "#"),
					]),
					headingElement,
				]),
			];
		}

		/** Page sections. */
		config.module?.rules?.push({
			test: /\.mdx$/,
			include: path.join(process.cwd(), "src", "components"),
			use: [
				context.defaultLoaders.babel,
				{
					loader: "@mdx-js/loader",
					options: {
						jsx: true,
						remarkPlugins: [
							withFrontmatter,
							withParsedFrontmatter,
							withParsedFrontmatterExport,
							withGfm,
							withSmartQuotes,
						],
						rehypePlugins: [
							withNoReferrerLinks,
							withNextLinks,
							withImageCaptions,
							withNextImage,
							withListsWithAriaRole,
							withHeadingIds,
							[withHeadingFragmentLinks, { generate: createPermalink }],
						],
					} satisfies MdxOptions,
				},
			],
		});

		/** About pages. */
		const aboutPageTemplate = path.join(
			process.cwd(),
			"src",
			"templates",
			"about",
			"[id].template.tsx",
		);
		config.module?.rules?.push({
			test: /\.mdx$/,
			include: path.join(process.cwd(), "src", "pages", "about"),
			use: [
				{
					loader: path.join(process.cwd(), "scripts", "add-dependencies.loader.cjs"),
					options: { dependencies: [aboutPageTemplate] },
				},
				context.defaultLoaders.babel,
				{
					loader: "@mdx-js/loader",

					options: {
						jsx: true,
						remarkPlugins: [
							withFrontmatter,
							withParsedFrontmatter,
							withParsedFrontmatterExport,
							withGfm,
							withSmartQuotes,
						],
						remarkRehypeOptions: {
							footnoteLabel: "Footnotes",
							footnoteBackLabel: "Back to content",
						},
						rehypePlugins: [
							withNoReferrerLinks,
							withNextLinks,
							withImageCaptions,
							withNextImage,
							withListsWithAriaRole,
							withHeadingIds,
							[withHeadingFragmentLinks, { generate: createPermalink }],
							withToc,
							withTocExport,
							() => {
								return async (tree, file) => {
									const highlighter = await getHighlighter({ theme: syntaxHighlightingTheme });
									/* @ts-expect-error Attacher always returns a transformer. */
									return withSyntaxHighlighting({ highlighter })(tree, file);
								};
							},
						],
						recmaPlugins: [
							[
								withPage,
								{
									template: aboutPageTemplate,
									imports: [
										'import { Image } from "@/components/common/Image"',
										'import { Link } from "@/components/common/Link"',
									],
									props: "{ components: { Image, Link }, metadata, tableOfContents }",
								} satisfies MdxPageOptions,
							],
						],
					} satisfies MdxOptions,
				},
			],
		});

		/** Contribute pages. */
		const contributePageTemplate = path.join(
			process.cwd(),
			"src",
			"templates",
			"contribute",
			"[id].template.tsx",
		);
		config.module?.rules?.push({
			test: /\.mdx$/,
			include: path.join(process.cwd(), "src", "pages", "contribute"),
			use: [
				{
					loader: path.join(process.cwd(), "scripts", "add-dependencies.loader.cjs"),
					options: { dependencies: [contributePageTemplate] },
				},
				context.defaultLoaders.babel,
				{
					loader: "@mdx-js/loader",
					options: {
						jsx: true,
						remarkPlugins: [
							withFrontmatter,
							withParsedFrontmatter,
							withParsedFrontmatterExport,
							withGfm,
							withSmartQuotes,
						],
						remarkRehypeOptions: {
							footnoteLabel: "Footnotes",
							footnoteBackLabel: "Back to content",
						},
						rehypePlugins: [
							withNoReferrerLinks,
							withNextLinks,
							withImageCaptions,
							withNextImage,
							withListsWithAriaRole,
							withHeadingIds,
							[withHeadingFragmentLinks, { generate: createPermalink }],
							withToc,
							withTocExport,
							() => {
								return async (tree, file) => {
									const highlighter = await getHighlighter({ theme: syntaxHighlightingTheme });
									/* @ts-expect-error Attacher always returns a transformer. */
									return withSyntaxHighlighting({ highlighter })(tree, file);
								};
							},
						],
						recmaPlugins: [
							[
								withPage,
								{
									template: contributePageTemplate,
									imports: [
										'import { Image } from "@/components/common/Image"',
										'import { Link } from "@/components/common/Link"',
									],
									props: "{ components: { Image, Link }, metadata, tableOfContents }",
								} satisfies MdxPageOptions,
							],
						],
					} satisfies MdxOptions,
				},
			],
		});

		return config;
	},
};

const plugins: Array<(config: NextConfig) => NextConfig> = [
	createSvgPlugin(),
	createBundleAnalyzer({ enabled: process.env.BUNDLE_ANALYZER === "enabled" }),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
