import { ExternalLinkIcon, LinkIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/app/(app)/(default)/(items)/_components/breadcrumbs";
import { CopyLinkButton } from "@/app/(app)/(default)/(items)/_components/copy-link-button";
import { ItemThumbnail } from "@/app/(app)/(default)/(items)/_components/item-thumbnail";
import { SchemaOrgMetadata } from "@/app/(app)/(default)/(items)/datasets/[persistentId]/(index)/_components/schema-org-metadata";
import { deleteDataset } from "@/app/(app)/(default)/(items)/datasets/[persistentId]/(index)/_lib/delete-dataset";
import {
	getDataset,
	getDatasetDraft,
	getDatasetSuggestion,
} from "@/app/(app)/(default)/(items)/datasets/[persistentId]/(index)/_lib/get-dataset";
import type { SearchParamsSchema as SearchPageSearchParamsSchema } from "@/app/(app)/(default)/search/_lib/validation";
import { ServerImage as Image } from "@/components/server-image";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MainContent } from "@/components/ui/main-content";
import { getCurrentUser } from "@/lib/api/client";
import { toJsx } from "@/lib/markdown/to-jsx";
import { createFullUrl } from "@/lib/navigation/create-full-url";
import { createHref } from "@/lib/navigation/create-href";
import { can } from "@/lib/server/auth/permissions";
import { getSession } from "@/lib/server/auth/session";
import bg from "@/public/assets/images/backgrounds/item@2x.png";

interface DatasetPageProps {
	params: Promise<{
		persistentId: string;
	}>;
}

export async function generateMetadata(
	props: Readonly<DatasetPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const item = await getDataset({ persistentId });

	const metadata: Metadata = {
		title: item.label,
		description: item.description,
	};

	return metadata;
}

export default async function DatasetPage(props: Readonly<DatasetPageProps>): Promise<ReactNode> {
	const { params } = props;

	const token = await getSession();

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const t = await getTranslations("DatasetPage");

	const item = await getDataset({ persistentId });
	const suggestedItem = token != null ? await getDatasetSuggestion({ persistentId, token }) : null;
	const draftItem = token != null ? await getDatasetDraft({ persistentId, token }) : null;

	const user = token != null ? await getCurrentUser({ token }) : null;
	const canDelete = user != null && can(user, item.category, "delete");
	const canEdit = user != null && can(user, item.category, "edit");

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
	];

	const description = await toJsx(item.description);

	return (
		<MainContent className="relative isolate mx-auto flex w-full max-w-[120rem] flex-col px-8">
			<SchemaOrgMetadata item={item} />

			{/* TODO: should we just use the pre-optimised image.png/image@2x.png in a `srcSet`? */}
			<Image alt="" className="absolute" src={bg} />

			<Breadcrumbs items={breadcrumbs} label={t("breadcrumbs.label")} />

			<section className="relative flex flex-col gap-y-8 py-16">
				<div className="grid grid-cols-[auto_1fr_auto] gap-x-6">
					<ItemThumbnail
						category={item.category}
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						mediaId={item.thumbnail?.info.mediaId}
					/>
					<h1 className="py-1 text-[2rem] leading-[1.25] font-medium text-neutral-800">
						{item.label}
					</h1>
					<CopyLinkButton
						className="self-start"
						href={String(createFullUrl({ pathname: `/datasets/${item.persistentId}` }))}
						kind="text"
					>
						<LinkIcon aria-hidden={true} className="size-4 shrink-0" data-slot="icon" />
						{t("copy-to-clipboard")}
					</CopyLinkButton>
				</div>
			</section>

			{canEdit || canDelete ? (
				<div className="flex gap-x-4">
					{canEdit ? (
						<ButtonLink
							href={createHref({
								pathname: `/datasets/${item.persistentId}/edit`,
							})}
							kind="negative"
							size="small"
						>
							{t("controls.edit")}
						</ButtonLink>
					) : null}
					{canEdit && draftItem != null && draftItem.status === "draft" ? (
						<ButtonLink
							href={createHref({
								pathname: `/datasets/${item.persistentId}/edit`,
								searchParams: { draft: true }, // FIXME: how do we want to deal with draft items
							})}
							kind="negative"
							size="small"
						>
							{t("controls.edit")}
						</ButtonLink>
					) : null}
					{canEdit && suggestedItem != null && suggestedItem.status === "suggested" ? (
						<ButtonLink
							href={createHref({
								pathname: `/datasets/${item.persistentId}/versions/${String(suggestedItem.id)}/edit`,
							})}
							kind="negative"
							size="small"
						>
							{t("controls.edit")}
						</ButtonLink>
					) : null}
					{canDelete && token != null ? (
						<DialogTrigger>
							<Button kind="negative" size="small">
								{t("controls.delete")}
							</Button>
							<Dialog>
								<DialogTitle>{t("dialogs.delete.title")}</DialogTitle>
								<DialogFooter>
									<Button
										kind="negative"
										// eslint-disable-next-line @typescript-eslint/no-misused-promises
										onPress={async () => {
											"use server";

											await deleteDataset({
												persistentId: item.persistentId,
												token,
											});
										}}
										slot="close"
									>
										{t("dialogs.delete.submit")}
									</Button>
									<Button kind="sceondary" slot="close">
										{t("dialogs.delete.cancel")}
									</Button>
								</DialogFooter>
							</Dialog>
						</DialogTrigger>
					) : null}
				</div>
			) : null}

			<section className="relative flex flex-col gap-y-8 py-16">
				<div className="prose">{description}</div>
			</section>

			<aside>
				<ButtonLink href={item.accessibleAt.at(0)}>
					{t("go-to-dataset")}
					<ExternalLinkIcon
						aria-hidden={true}
						className="-my-px size-4 shrink-0"
						data-slot="icon"
					/>
				</ButtonLink>
			</aside>
		</MainContent>
	);
}
