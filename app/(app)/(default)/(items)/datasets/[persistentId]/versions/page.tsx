import type { Metadata, ResolvingMetadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/app/(app)/(default)/(items)/_components/breadcrumbs";
import { getDatasetVersions } from "@/app/(app)/(default)/(items)/datasets/[persistentId]/versions/_lib/get-dataset-versions";
import type { SearchParamsSchema as SearchPageSearchParamsSchema } from "@/app/(app)/(default)/search/_lib/validation";
import { Link } from "@/components/link";
import { ServerImage as Image } from "@/components/server-image";
import { Button } from "@/components/ui/button";
import { MainContent } from "@/components/ui/main-content";
import { createHref } from "@/lib/navigation/create-href";
import { assertSession } from "@/lib/server/auth/session";
import bg from "@/public/assets/images/backgrounds/item@2x.png";
import { promise } from "@acdh-oeaw/lib";
import { redirect } from "@/lib/navigation/navigation";

interface DatasetVersionsPageProps {
	params: Promise<{
		persistentId: string;
	}>;
}

export async function generateMetadata(
	props: Readonly<DatasetVersionsPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { data: token, error } = await promise(() => assertSession());

	if (error != null) {
		redirect("/auth/sign-in");
	}

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const versions = await getDatasetVersions({ persistentId, token });
	const item = versions.at(0)!;

	const metadata: Metadata = {
		title: item.label,
	};

	return metadata;
}

export default async function DatasetVersionsPage(
	props: Readonly<DatasetVersionsPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const token = await assertSession();

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const t = await getTranslations("DatasetVersionsPage");
	const format = await getFormatter();

	const versions = await getDatasetVersions({ persistentId, token });
	const item = versions.at(0)!;

	const breadcrumbs = [
		{
			href: createHref({
				pathname: "/",
			}),
			label: t("breadcrumbs.items.home"),
		},
		{
			href: createHref({
				pathname: "/search",
				searchParams: {
					categories: [item.category],
					order: "label",
				} satisfies Partial<SearchPageSearchParamsSchema>,
			}),
			label: t("breadcrumbs.items.datasets"),
		},
		{
			href: createHref({
				pathname: `/datasets/${item.persistentId}`,
			}),
			label: item.label,
		},
		{
			href: createHref({
				pathname: `/datasets/${item.persistentId}/history`,
			}),
			label: t("breadcrumbs.items.history"),
		},
	];

	return (
		<MainContent className="relative isolate mx-auto flex w-full max-w-[120rem] flex-col px-8">
			{/* TODO: should we just use the pre-optimised image.png/image@2x.png in a `srcSet`? */}
			<Image alt="" className="absolute" src={bg} />

			<Breadcrumbs items={breadcrumbs} label={t("breadcrumbs.label")} />

			<section className="relative flex flex-col gap-y-8 py-16">
				<div className="grid grid-cols-[auto_1fr_auto] gap-x-6">
					<h1 className="py-1 text-[2rem] leading-[1.25] font-medium text-neutral-800">
						{t("title")}
					</h1>
				</div>

				<ul role="list">
					{versions.map((item) => {
						return (
							<li key={item.id}>
								<article>
									<h2>{item.label}</h2>
									<div>{t(`status.${item.status}`)}</div>
									<div>{item.informationContributor.displayName}</div>
									<div>{format.dateTime(new Date(item.lastInfoUpdate), { dateStyle: "long" })}</div>
									{item.status === "approved" ? (
										<Link
											href={createHref({
												pathname: `/datasets/${item.persistentId}/edit`,
											})}
										>
											{t("controls.edit")}
										</Link>
									) : (
										<Button
											onPress={async () => {
												"use server";

												// FIXME:
												await revertDatasetVersion({
													persistentId: item.persistentId,
													versionId: item.id,
													token,
												});
											}}
										>
											{t("controls.revert")}
										</Button>
									)}
								</article>
							</li>
						);
					})}
				</ul>
			</section>
		</MainContent>
	);
}
