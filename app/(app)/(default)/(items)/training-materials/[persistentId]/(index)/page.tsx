import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/ui/main-content";
import { getTrainingMaterial } from "@/lib/api/client";
import { isHttpError } from "@/lib/server/errors";
import { tryAsync } from "@/lib/try-async";

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

	const { data: item, error } = await tryAsync(() => {
		return getTrainingMaterial(persistentId);
	});

	if (error != null) {
		if (isHttpError(error) && error.response.status === 404) {
			notFound();
		}

		throw error;
	}

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

	const { data: item, error } = await tryAsync(() => {
		return getTrainingMaterial(persistentId);
	});

	if (error != null) {
		if (isHttpError(error) && error.response.status === 404) {
			notFound();
		}

		throw error;
	}

	return (
		<MainContent>
			<section>
				<h1>{item.label}</h1>
			</section>

			<pre>{JSON.stringify(item, null, 2)}</pre>
		</MainContent>
	);
}
