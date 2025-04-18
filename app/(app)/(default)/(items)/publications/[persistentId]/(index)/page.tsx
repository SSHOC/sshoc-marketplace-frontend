import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/ui/main-content";
import { getPublication } from "@/lib/api/client";

interface PublicationPageProps {
	params: Promise<{
		persistentId: string;
	}>;
}

export async function generateMetadata(
	props: Readonly<PublicationPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const item = await getPublication(persistentId);

	const metadata: Metadata = {
		title: item.label,
	};

	return metadata;
}

export default async function PublicationPage(
	props: Readonly<PublicationPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const t = await getTranslations("PublicationPage");

	const item = await getPublication(persistentId);

	return (
		<MainContent>
			<section>
				<h1>{item.label}</h1>
			</section>

			<pre>{JSON.stringify(item, null, 2)}</pre>
		</MainContent>
	);
}
