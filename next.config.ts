import createBundleAnalyzer from "@next/bundle-analyzer";
import localesPlugin from "@react-aria/optimize-locales-plugin";
import type { NextConfig } from "next";
import createI18nPlugin from "next-intl/plugin";

import { env } from "@/config/env.config";

const config: NextConfig = {
	eslint: {
		dirs: [process.cwd()],
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: env.NEXT_PUBLIC_API_BASE_URL
			? [
					{
						protocol: "https",
						hostname: new URL(env.NEXT_PUBLIC_API_BASE_URL).hostname,
						port: "",
						search: "",
					},
				]
			: undefined,
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	output: env.BUILD_MODE,
	redirects() {
		const redirects: Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>> = [
			{
				source: "/admin",
				destination: "/keystatic",
				permanent: false,
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

const plugins: Array<(config: NextConfig) => NextConfig> = [
	createBundleAnalyzer({ enabled: env.BUNDLE_ANALYZER === "enabled" }),
	createI18nPlugin("./lib/i18n/get-request-config.ts"),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
