/* global process */

import { log } from "@acdh-oeaw/lib";
import createBundleAnalyzer from "@next/bundle-analyzer";
import createSvgPlugin from "@stefanprobst/next-svg";
import type { NextConfig as Config } from "next";

import { defaultLocale, locales } from "@/config/i18n.config";

type NextConfig = Config;

const config: NextConfig = {
	allowedDevOrigins: ["127.0.0.1"],
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
			process.env.NEXT_PUBLIC_API_BASE_URL != null
				? [new URL(process.env.NEXT_PUBLIC_API_BASE_URL)]
				: undefined,
	},
	output: "standalone",
	poweredByHeader: false,
	/**
	 * React Spectrum currently has issues with `StrictMode`.
	 *
	 * @see e.g. https://github.com/adobe/react-spectrum/issues/977
	 */
	reactStrictMode: false,
	redirects() {
		const redirects: Awaited<ReturnType<NonNullable<Config["redirects"]>>> = [
			{
				source: "/admin",
				destination: "/keystatic",
				permanent: false,
			},
		];

		return Promise.resolve(redirects);
	},
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
	webpack(config: any) {
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
