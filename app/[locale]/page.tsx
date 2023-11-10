import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { Fragment, type ReactNode } from "react";

import { DocumentRenderer } from "@/components/content/document-renderer";
import { DraftModeToggle } from "@/components/content/draft-mode-toggle";
import { MainContent } from "@/components/main-content";
import { isValidLocale, type Locale } from "@/config/i18n.config";
import { reader } from "@/lib/content/reader";

interface IndexPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: IndexPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const document = await reader().singletons.home.read();
	if (document == null) notFound();

	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
		 */
		// title: undefined,
	};

	return metadata;
}

export default function IndexPage(props: IndexPageProps): ReactNode {
	const { params } = props;

	const { locale } = params;
	if (!isValidLocale(locale)) notFound();
	setRequestLocale(locale);

	return (
		<MainContent className="container py-8">
			<DraftModeToggle />

			<IndexPageContent locale={locale} />
		</MainContent>
	);
}

interface IndexPageContentProps {
	locale: Locale;
}

// @ts-expect-error Upstream type issue.
async function IndexPageContent(props: IndexPageContentProps): Promise<ReactNode> {
	const { locale } = props;

	const document = await reader().singletons.home.read();
	if (document == null) notFound();
	const content = await document.content();

	return (
		<Fragment>
			<h1>{document.title}</h1>
			<DocumentRenderer document={content} />
		</Fragment>
	);
}
