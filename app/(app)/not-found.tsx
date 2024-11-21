import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";

interface NotFoundPageProps extends EmptyObject {}

export async function generateMetadata(
	_props: Readonly<NotFoundPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("NotFoundPage");

	const metadata: Metadata = {
		title: t("meta.title"),
		/**
		 * Automatically set by next.js.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/not-found
		 */
		// robots: {
		// 	index: false,
		// },
	};

	return metadata;
}

export default async function NotFoundPage(
	_props: Readonly<NotFoundPageProps>,
): Promise<ReactNode> {
	const t = await getTranslations("NotFoundPage");

	return (
		<MainContent className="layout-grid bg-fill-weaker">
			<section className="grid place-content-center place-items-center py-24">
				<h1 className="text-balance font-heading text-display font-strong text-text-strong">
					{t("title")}
				</h1>
			</section>
		</MainContent>
	);
}
