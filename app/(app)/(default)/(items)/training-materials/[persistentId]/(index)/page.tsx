import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/ui/main-content";
import { getTrainingMaterial } from "@/lib/api/client";

interface TrainingMaterialPageProps {
	params: Promise<{
		persistentId: string;
	}>;
}

export async function generateMetadata(
	props: Readonly<TrainingMaterialPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const item = await getTrainingMaterial(persistentId);

	const metadata: Metadata = {
		title: item.label,
	};

	return metadata;
}

export default async function TrainingMaterialPage(
	props: Readonly<TrainingMaterialPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const t = await getTranslations("TrainingMaterialPage");

	const item = await getTrainingMaterial(persistentId);

	return (
		<MainContent>
			<section>
				<h1>{item.label}</h1>
			</section>

			<pre>{JSON.stringify(item, null, 2)}</pre>
		</MainContent>
	);
}
