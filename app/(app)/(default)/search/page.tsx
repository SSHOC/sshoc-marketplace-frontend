import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import * as v from "valibot";

import { searchParamsSchema } from "@/app/(app)/(default)/search/_lib/validation";
import { MainContent } from "@/components/ui/main-content";

interface SearchPageProps {
	searchParams: Promise<SearchParams>;
}

export async function generateMetadata(
	_props: Readonly<SearchPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("SearchPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function SearchPage(props: Readonly<SearchPageProps>): Promise<ReactNode> {
	const { searchParams } = props;

	const t = await getTranslations("SearchPage");

	const validatedSearchParams = await v.parseAsync(searchParamsSchema, await searchParams);

	return (
		<MainContent>
			<section>
				<h1>{t("title")}</h1>
			</section>

			<pre>{JSON.stringify(validatedSearchParams, null, 2)}</pre>
		</MainContent>
	);
}
