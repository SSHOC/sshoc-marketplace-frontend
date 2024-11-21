import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";

interface IndexPageProps extends EmptyObject {}

export async function generateMetadata(
	_props: Readonly<IndexPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const _t = await getTranslations("IndexPage");

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

export default async function IndexPage(_props: Readonly<IndexPageProps>): Promise<ReactNode> {
	const t = await getTranslations("IndexPage");

	return (
		<MainContent className="layout-grid">
			<section className="layout-subgrid relative py-8">
				<h1>{t("title")}</h1>
				<p>{t("lead-in")}</p>
			</section>
		</MainContent>
	);
}
