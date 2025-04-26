import { promise } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { DatasetForm } from "@/app/(app)/(default)/(items)/datasets/[persistentId]/edit/_components/dataset-form";
import { getLatestDatasetVersion } from "@/app/(app)/(default)/(items)/datasets/[persistentId]/edit/_lib/get-dataset";
import { Link } from "@/components/link";
import { MainContent } from "@/components/ui/main-content";
import { getCurrentUser } from "@/lib/api/client";
import { can } from "@/lib/items/can";
import { createHref } from "@/lib/navigation/create-href";
import { redirect } from "@/lib/navigation/navigation";
import { assertSession } from "@/lib/server/auth/session";

interface DatasetEditPageProps {
	params: Promise<{
		persistentId: string;
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

	const item = await getLatestDatasetVersion({ persistentId, token });

	const metadata: Metadata = {
		title: t("meta.title", { item: item.label }),
	};

	return metadata;
}

export default async function DatasetEditPage(
	props: Readonly<DatasetEditPageProps>,
): Promise<ReactNode> {
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

	const [item, user] = await Promise.all([
		getLatestDatasetVersion({ persistentId, token }),
		getCurrentUser({ token }),
	]);

	const canPublish = can(user, "dataset", "publish");

	return (
		<MainContent>
			<section>
				<h1>{t("title")}</h1>
				<p className="text-neutral-700">
					{t.rich("lead", {
						contact: ContactLink,
						guidelines: GuidelinesLink,
					})}
				</p>
			</section>

			<section>
				{item.status === "draft"
					? t("message.draft", { date: item.lastInfoUpdate })
					: item.status === "suggested"
						? t("message.suggested", { date: item.lastInfoUpdate })
						: null}
			</section>

			<DatasetForm canPublish={canPublish} item={item} />
		</MainContent>
	);
}

function ContactLink(chunks: Readonly<ReactNode>): ReactNode {
	return (
		<Link
			className="underline transition hover:text-brand-750"
			href={createHref({
				pathname: "/contact",
			})}
		>
			{chunks}
		</Link>
	);
}

function GuidelinesLink(chunks: Readonly<ReactNode>): ReactNode {
	return (
		<Link
			className="underline transition hover:text-brand-750"
			href={createHref({
				pathname: "/contribute/metadata-guidelines",
				hash: "guidance-for-metadata-fields",
			})}
		>
			{chunks}
		</Link>
	);
}
