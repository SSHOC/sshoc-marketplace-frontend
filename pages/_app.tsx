/** Needs to be imported before `src/styles/index.css` so we can overwrite custom properties. */
import "react-toastify/dist/ReactToastify.css";
import "@/styles/index.css";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import { ErrorBoundary, useError } from "@stefanprobst/next-error-boundary";
import type { NextWebVitalsMetric } from "next/app";
import Head from "next/head";
import { Fragment, type ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";

import { defaultLocale } from "@/config/i18n.config";
import { googleSiteId } from "@/config/site.config";
import metadata from "@/content/metadata/index.json";
import { reportPageView } from "@/lib/core/analytics/analytics-service";
import { AnalyticsScript } from "@/lib/core/analytics/AnalyticsScript";
import { ContextProviders } from "@/lib/core/app/Providers";
import type { AppProps, GetLayout } from "@/lib/core/app/types";
import { RootErrorBoundary } from "@/lib/core/error/RootErrorBoundary";
import { PageLayout } from "@/lib/core/layouts/PageLayout";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { FullPage } from "@/lib/core/ui/FullPage/FullPage";
import * as fonts from "@/lib/fonts";

export default function App(props: AppProps): ReactNode {
	const { Component, pageProps } = props;

	const getLayout = Component.getLayout ?? getDefaultLayout;

	const locale = defaultLocale;
	const twitter = metadata.social.find((s) => s.kind === "twitter")?.href;

	return (
		<Fragment>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />

				<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="32x32" />
				<link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
				<link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180" />

				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />

				<meta property="og:title" content={metadata.title} />
				<meta property="og:description" content={metadata.description} />
				<meta property="og:site_name" content={metadata.title} />
				<meta property="og:locale" content={locale} />
				<meta property="og:image:type" content="image/png" />
				<meta property="og:image" content="/opengraph-image.png" />
				<meta property="og:type" content="website" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content={twitter} />
				<meta name="twitter:creator" content={twitter} />

				{isNonEmptyString(googleSiteId) ? (
					<meta name="google-site-verification" content={googleSiteId} />
				) : null}

				<style>{`:root{--_font-body:${fonts.body.style.fontFamily};}`}</style>
			</Head>

			<AnalyticsScript />

			<ErrorBoundary fallback={<ErrorFallback />}>
				<ContextProviders pageProps={pageProps} isPageAccessible={Component.isPageAccessible}>
					<RootErrorBoundary>
						{getLayout(<Component {...pageProps} />, pageProps)}
					</RootErrorBoundary>
					<ReactQueryDevtools />
				</ContextProviders>
			</ErrorBoundary>
		</Fragment>
	);
}

function ErrorFallback() {
	const { error } = useError();

	return (
		<FullPage>
			<Centered>
				<div role="alert">
					<p>{error.message || "Something went wrong."}</p>
				</div>
			</Centered>
		</FullPage>
	);
}

export const getDefaultLayout: GetLayout = function getDefaultLayout(page, pageProps) {
	return <PageLayout pageProps={pageProps}>{page}</PageLayout>;
};

export function reportWebVitals(metric: NextWebVitalsMetric): void {
	switch (metric.name) {
		case "Next.js-hydration":
			/** Register right after hydration. */
			break;
		case "Next.js-route-change-to-render":
			/** Register page views after client-side transitions. */
			reportPageView();
			break;
		default:
			break;
	}
}
