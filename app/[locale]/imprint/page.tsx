import { HttpError, request } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { isValidLocale, type Locale } from "@/config/i18n.config";
import { createImprintUrl } from "@/config/imprint.config";

interface ImprintPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: ImprintPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "ImprintPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function ImprintPage(props: ImprintPageProps): ReactNode {
	const { params } = props;

	const locale = params.locale;
	if (!isValidLocale(locale)) notFound();
	setRequestLocale(locale);

	const t = useTranslations("ImprintPage");

	return (
		<MainContent className="container py-8">
			<h1>{t("title")}</h1>
			<Imprint locale={locale} />
		</MainContent>
	);
}

interface ImprintProps {
	locale: Locale;
}

// @ts-expect-error Upstream type issue.
async function Imprint(props: ImprintProps): Promise<ReactNode> {
	const { locale } = props;

	const html = await getImprintHtml(locale);

	return <div className="prose max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />;
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
