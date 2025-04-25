/* global process */

import createBundleAnalyzer from "@next/bundle-analyzer";
import { log } from "@stefanprobst/log";
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
import withPage from "@stefanprobst/remark-mdx-page";
import withSmartQuotes from "@stefanprobst/remark-smart-quotes";
import { headingRank } from "hast-util-heading-rank";
import { h } from "hastscript";
import * as path from "path";
import withHeadingIds from "rehype-slug";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import { getHighlighter } from "shiki";

import { syntaxHighlightingTheme } from "./config/docs.config.mjs";
import { defaultLocale, locales } from "./config/i18n.config.mjs";

/** @typedef {import('~/config/i18n.config.mjs').Locale} Locale */
/** @typedef {import('next').NextConfig & {i18n?: {locales: Array<Locale>; defaultLocale: Locale}}} NextConfig */
/** @typedef {import('webpack').Configuration} WebpackConfig */
/** @typedef {import('@mdx-js/loader').Options} MdxOptions */
/** @typedef {import('@stefanprobst/remark-mdx-page').Options} MdxPageOptions */
/** @typedef {import('hast').Element} HastElement */

/** @type {NextConfig} */
const config = {
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

		if (process.env["NEXT_PUBLIC_BOTS"] !== "enabled") {
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
		// contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		// dangerouslyAllowSVG: true,
		domains:
			process.env["NEXT_PUBLIC_SSHOC_API_BASE_URL"] != null
				? [process.env["NEXT_PUBLIC_SSHOC_API_BASE_URL"]]
				: undefined,
	},
	output: "standalone",
	pageExtensions: ["page.tsx", "page.mdx", "api.ts"],
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
	webpack(/** @type {WebpackConfig} */ config, context) {
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

		/** Evaluate modules at build-time. */
		config.module?.rules?.push({
			test: /\.static\.ts$/,
			use: [{ loader: "@stefanprobst/val-loader" }],
			exclude: /node_modules/,
		});

		/** @type {(heading: HastElement, id: string) => Array<HastElement>} */
		function createPermalink(headingElement, id) {
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
					/** @type {MdxOptions} */
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
					},
				},
			],
		});

		/** About pages. */
		const aboutPageTemplate = path.join(
			process.cwd(),
			"src",
			"pages",
			"about",
			"[id].page.template.tsx",
		);
		config.module?.rules?.push({
			test: /\.page\.mdx$/,
			include: path.join(process.cwd(), "src", "pages", "about"),
			use: [
				{
					loader: path.join(process.cwd(), "scripts", "add-dependencies.loader.cjs"),
					options: { dependencies: [aboutPageTemplate] },
				},
				context.defaultLoaders.babel,
				{
					loader: "@mdx-js/loader",
					/** @type {MdxOptions} */
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
								/** @type {MdxPageOptions} */
								({
									template: aboutPageTemplate,
									imports: [
										'import { Image } from "@/components/common/Image"',
										'import { Link } from "@/components/common/Link"',
									],
									props: "{ components: { Image, Link }, metadata, tableOfContents }",
								}),
							],
						],
					},
				},
			],
		});

		/** Contribute pages. */
		const contributePageTemplate = path.join(
			process.cwd(),
			"src",
			"pages",
			"contribute",
			"[id].page.template.tsx",
		);
		config.module?.rules?.push({
			test: /\.page\.mdx$/,
			include: path.join(process.cwd(), "src", "pages", "contribute"),
			use: [
				{
					loader: path.join(process.cwd(), "scripts", "add-dependencies.loader.cjs"),
					options: { dependencies: [contributePageTemplate] },
				},
				context.defaultLoaders.babel,
				{
					loader: "@mdx-js/loader",
					/** @type {MdxOptions} */
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
								/** @type {MdxPageOptions} */
								({
									template: contributePageTemplate,
									imports: [
										'import { Image } from "@/components/common/Image"',
										'import { Link } from "@/components/common/Link"',
									],
									props: "{ components: { Image, Link }, metadata, tableOfContents }",
								}),
							],
						],
					},
				},
			],
		});

		return config;
	},
};

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
	createSvgPlugin(),
	createBundleAnalyzer({ enabled: process.env["BUNDLE_ANALYZER"] === "enabled" }),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
