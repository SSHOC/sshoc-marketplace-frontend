import "@/styles/index.css";
import "@/styles/content.css";

import { pick } from "@acdh-oeaw/lib";
import { cn } from "@acdh-oeaw/style-variants";
import type { Metadata, ResolvingMetadata, Viewport } from "next";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { LocalizedStringProvider as Translations } from "react-aria-components/i18n";
import { jsonLdScriptProps } from "react-schemaorg";

import { AppFooter } from "@/app/(app)/_components/app-footer";
import { AppHeader } from "@/app/(app)/_components/app-header";
import { AppLayout } from "@/app/(app)/_components/app-layout";
import { Providers } from "@/app/(app)/_components/providers";
import { TailwindIndicator } from "@/app/(app)/_components/tailwind-indicator";
import { id } from "@/components/main-content";
import { SkipLink } from "@/components/skip-link";
import { env } from "@/config/env.config";
import { AnalyticsScript } from "@/lib/analytics-script";
import * as fonts from "@/lib/fonts";

interface LocaleLayoutProps {
	children: ReactNode;
}

export const viewport: Viewport = {
	colorScheme: "light dark",
	initialScale: 1,
	width: "device-width",
};

export async function generateMetadata(
	_props: Omit<Readonly<LocaleLayoutProps>, "children">,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const locale = await getLocale();

	const meta = await getTranslations("metadata");

	const metadata: Metadata = {
		metadataBase: new URL(env.NEXT_PUBLIC_APP_BASE_URL),
		alternates: {
			canonical: "./",
		},
		title: {
			default: meta("title"),
			template: ["%s", meta("title")].join(" | "),
		},
		description: meta("description"),
		openGraph: {
			title: meta("title"),
			description: meta("description"),
			url: "./",
			siteName: meta("title"),
			locale,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			creator: meta("twitter.creator"),
			site: meta("twitter.site"),
		},
		verification: {
			google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
		},
	};

	return metadata;
}

export default function LocaleLayout(props: Readonly<LocaleLayoutProps>): ReactNode {
	const { children } = props;

	const locale = useLocale();

	const t = useTranslations("LocaleLayout");
	const meta = useTranslations("metadata");
	const messages = useMessages() as IntlMessages;

	return (
		<html
			className={cn(
				fonts.body.variable,
				fonts.heading.variable,
				"bg-background-base text-text-strong antialiased",
			)}
			lang={locale}
			/**
			 * Suppressing hydration warning because we add `data-ui-color-scheme` before first paint.
			 */
			suppressHydrationWarning={true}
		>
			<body>
				{/* @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld */}
				<script
					{...jsonLdScriptProps({
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: meta("title"),
						description: meta("description"),
					})}
				/>

				<AnalyticsScript baseUrl={env.NEXT_PUBLIC_MATOMO_BASE_URL} id={env.NEXT_PUBLIC_MATOMO_ID} />

				<SkipLink targetId={id}>{t("skip-to-main-content")}</SkipLink>

				{/**
				 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#optimizing-bundle-size
				 *
				 * TODO: only include translations for components actually used
				 *
				 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#advanced-optimization
				 */}
				<Translations locale={locale} />

				<Providers locale={locale} messages={pick(messages, ["Error"])}>
					<AppLayout>
						{/* @ts-expect-error @see https://github.com/vercel/next.js/discussions/67365 */}
						<AppHeader />
						{children}
						<AppFooter />
					</AppLayout>
				</Providers>

				<TailwindIndicator />
			</body>
		</html>
	);
}
