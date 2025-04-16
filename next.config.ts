import { createUrl } from "@acdh-oeaw/lib";
import createBundleAnalyzerPlugin from "@next/bundle-analyzer";
import localesPlugin from "@react-aria/optimize-locales-plugin";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig as Config } from "next";
import createI18nPlugin from "next-intl/plugin";

import { env } from "@/config/env.config";

const config: Config = {
	/** Compression should be handled by nginx reverse proxy. */
	compress: false,
	eslint: {
		dirs: [process.cwd()],
		ignoreDuringBuilds: true,
	},
	experimental: {
		// dynamicIO: true,
		// ppr: true,
		useCache: true,
		viewTransition: true,
	},
	headers() {
		const headers: Awaited<ReturnType<NonNullable<Config["headers"]>>> = [
			/** @see https://nextjs.org/docs/app/building-your-application/deploying#streaming-and-suspense */
			{
				source: "/:path*{/}?",
				headers: [
					{
						key: "X-Accel-Buffering",
						value: "no",
					},
				],
			},
		];

		return Promise.resolve(headers);
	},
	images: {
		remotePatterns: [createUrl({ pathname: "/**", baseUrl: env.NEXT_PUBLIC_API_BASE_URL })],
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	output: env.BUILD_MODE,
	redirects() {
		const redirects: Awaited<ReturnType<NonNullable<Config["redirects"]>>> = [
			{
				source: "/admin",
				destination: "/keystatic",
				permanent: false,
			},
			{
				source: "/dataset/:path*",
				destination: "/datasets/:path*",
				permanent: true,
			},
			{
				source: "/publication/:path*",
				destination: "/publications/:path*",
				permanent: true,
			},
			{
				source: "/tool-or-service/:path*",
				destination: "/tools-services/:path*",
				permanent: true,
			},
			{
				source: "/training-material/:path*",
				destination: "/training-materials/:path*",
				permanent: true,
			},
			{
				source: "/workflow/:path*",
				destination: "/workflows/:path*",
				permanent: true,
			},
			{
				source: "/browse/activity",
				destination: "/browse/activities",
				permanent: true,
			},
			{
				source: "/browse/keyword",
				destination: "/browse/keywords",
				permanent: true,
			},
			{
				source: "/browse/source",
				destination: "/browse/sources",
				permanent: true,
			},
			{
				source: "/browse/language",
				destination: "/browse/languages",
				permanent: true,
			},
		];

		return Promise.resolve(redirects);
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack(config, { isServer }) {
		/**
		 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#nextjs-app-router
		 */
		if (!isServer) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			config.plugins.push(localesPlugin.webpack({ locales: [] }));
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config;
	},
};

const plugins: Array<(config: Config) => Config> = [
	createBundleAnalyzerPlugin({ enabled: env.BUNDLE_ANALYZER === "enabled" }),
	createI18nPlugin({
		experimental: {
			/** @see https://v4.next-intl.dev/docs/workflows/typescript#messages-arguments */
			createMessagesDeclaration: ["./content/en/metadata/index.json", "./messages/en.json"],
		},
		requestConfig: "./lib/i18n/request.ts",
	}),
	function createSentryPlugin(config) {
		return withSentryConfig(config, {
			disableLogger: true,
			org: env.NEXT_PUBLIC_SENTRY_ORG,
			project: env.NEXT_PUBLIC_SENTRY_PROJECT,
			reactComponentAnnotation: {
				enabled: true,
			},
			silent: env.CI === true,
			/**
			 * Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent
			 * ad-blockers.
			 *
			 * Note: Check that the configured route will not match with your Next.js middleware,
			 * otherwise reporting of client-side errors will fail.
			 */
			// tunnelRoute: "/monitoring",
			widenClientFileUpload: true,
		});
	},
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
