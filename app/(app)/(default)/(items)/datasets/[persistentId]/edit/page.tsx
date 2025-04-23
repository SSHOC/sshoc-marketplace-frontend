import { promise } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import {
	getDataset,
	getDatasetDraft,
} from "@/app/(app)/(default)/(items)/datasets/[persistentId]/edit/_lib/get-dataset";
import { validateSearchParams } from "@/app/(app)/(default)/(items)/datasets/[persistentId]/edit/_lib/validation";
import { MainContent } from "@/components/ui/main-content";
import { redirect } from "@/lib/navigation/navigation";
import { assertSession } from "@/lib/server/auth/session";

interface DatasetEditPageProps {
	params: Promise<{
		persistentId: string;
	}>;
	searchParams: Promise<{
		initial?: "draft";
	}>;
}

export async function generateMetadata(
	props: Readonly<DatasetEditPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { data: token, error } = await promise(() => {
		return assertSession();
	});

	if (error != null) {
		redirect("/auth/sign-in");
	}

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const t = await getTranslations("DatasetEditPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DatasetEditPage(
	props: Readonly<DatasetEditPageProps>,
): Promise<ReactNode> {
	const { params, searchParams } = props;

	const { data: token, error } = await promise(() => {
		return assertSession();
	});

	if (error != null) {
		redirect("/auth/sign-in");
	}

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const { initial } = await validateSearchParams(await searchParams);

	const t = await getTranslations("DatasetEditPage");

	const item =
		initial === "draft"
			? await getDataset({ persistentId })
			: await getDatasetDraft({ persistentId, token });

	return (
		<MainContent>
			<section>
				<h1>{t("title")}</h1>
			</section>
		</MainContent>
	);
}
