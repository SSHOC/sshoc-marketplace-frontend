import { HttpError, request } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import type { Locale } from "@/config/i18n.config";
import { createImprintUrl } from "@/config/imprint.config";

interface ImprintPageProps extends EmptyObject {}

export async function generateMetadata(
	_props: Readonly<ImprintPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("ImprintPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ImprintPage(_props: Readonly<ImprintPageProps>): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("ImprintPage");

	return (
		<MainContent className="layout-grid">
			<section className="layout-subgrid relative bg-fill-weaker py-24">
				{/* @ts-expect-error @see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/69970 */}
				<ImprintPageContent locale={locale} title={t("title")} />
			</section>
		</MainContent>
	);
}

interface ImprintPageContentProps {
	locale: Locale;
	title: string;
}

async function ImprintPageContent(props: Readonly<ImprintPageContentProps>): Promise<ReactNode> {
	const { locale, title } = props;

	const html = await getImprintHtml(locale);

	return (
		<div className="prose max-w-screen-md">
			<h1 className="text-balance font-heading text-display font-strong text-text-strong">
				{title}
			</h1>
			<div dangerouslySetInnerHTML={{ __html: html }} />
		</div>
	);
}

async function getImprintHtml(locale: Locale): Promise<string> {
	try {
		const url = createImprintUrl(locale);
		const html = await request(url, { responseType: "text" });

		return html as string;
	} catch (error) {
		if (error instanceof HttpError && error.response.status === 404) {
			notFound();
		}

		throw error;
	}
}
