import "tailwindcss/tailwind.css";

import { pick } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { useMessages, useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { jsonLdScriptProps } from "react-schemaorg";

import { Providers } from "@/app/[locale]/providers";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { AppLayout } from "@/components/app-layout";
import { id } from "@/components/main-content";
import { SkipLink } from "@/components/skip-link";
import { env } from "@/config/env.config";
import { isValidLocale, type Locale, locales } from "@/config/i18n.config";
import { Analytics } from "@/lib/analytics";
import * as fonts from "@/lib/fonts";

interface LocaleLayoutProps {
	children: ReactNode;
	params: {
		locale: Locale;
	};
}

export const dynamicParams = false;

export function generateStaticParams(): Array<LocaleLayoutProps["params"]> {
	return locales.map((locale) => {
		return { locale };
	});
}

export async function generateMetadata(
	props: Omit<LocaleLayoutProps, "children">,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "LocaleLayout" });

	const metadata: Metadata = {
		title: {
			default: t("meta.title"),
			template: ["%s", t("meta.title")].join(" | "),
		},
		description: t("meta.description"),
		metadataBase: new URL(env.NEXT_PUBLIC_APP_BASE_URL),
		alternates: {
			canonical: "./",
		},
		openGraph: {
			title: t("meta.title"),
			description: t("meta.description"),
			url: "./",
			siteName: t("meta.title"),
			locale,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			creator: t("meta.twitter.creator"),
			site: t("meta.twitter.site"),
		},
		verification: {
			google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
		},
	};

	return metadata;
}

export default function LocaleLayout(props: LocaleLayoutProps): ReactNode {
	const { children, params } = props;

	const { locale } = params;
	if (!isValidLocale(locale)) notFound();
	setRequestLocale(locale);

	const t = useTranslations("LocaleLayout");
	const messages = useMessages() as IntlMessages;

	return (
		/**
		 * Suppressing hydration warning because we add `data-color-scheme` before first paint.
		 *
		 * @see https://github.com/pacocoursey/next-themes#with-app
		 */
		<html className={fonts.sans.variable} lang={locale} suppressHydrationWarning>
			<body>
				{/* @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld */}
				<script
					{...jsonLdScriptProps({
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: t("meta.title"),
						description: t("meta.description"),
					})}
				/>

				<Analytics baseUrl={env.NEXT_PUBLIC_MATOMO_BASE_URL} id={env.NEXT_PUBLIC_MATOMO_ID} />

				<SkipLink targetId={id}>{t("skip-to-main-content")}</SkipLink>

				<Providers locale={locale} messages={pick(messages, ["Error"])}>
					<AppLayout>
						<AppHeader />
						{children}
						<AppFooter />
					</AppLayout>
				</Providers>
			</body>
		</html>
	);
}
