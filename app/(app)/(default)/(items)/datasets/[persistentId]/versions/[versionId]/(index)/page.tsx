import { promise } from "@acdh-oeaw/lib";
import { ExternalLinkIcon, LinkIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/app/(app)/(default)/(items)/_components/breadcrumbs";
import { CopyLinkButton } from "@/app/(app)/(default)/(items)/_components/copy-link-button";
import { ItemThumbnail } from "@/app/(app)/(default)/(items)/_components/item-thumbnail";
import { deleteDatasetVersion } from "@/app/(app)/(default)/(items)/datasets/[persistentId]/versions/[versionId]/(index)/_lib/delete-dataset-version";
import { getDatasetVersion } from "@/app/(app)/(default)/(items)/datasets/[persistentId]/versions/[versionId]/(index)/_lib/get-dataset-version";
import type { SearchParamsSchema as SearchPageSearchParamsSchema } from "@/app/(app)/(default)/search/_lib/validation";
import { ServerImage as Image } from "@/components/server-image";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MainContent } from "@/components/ui/main-content";
import { getCurrentUser } from "@/lib/api/client";
import { can } from "@/lib/items/can";
import { is } from "@/lib/items/is";
import { toJsx } from "@/lib/markdown/to-jsx";
import { createFullUrl } from "@/lib/navigation/create-full-url";
import { createHref } from "@/lib/navigation/create-href";
import { redirect } from "@/lib/navigation/navigation";
import { assertSession } from "@/lib/server/auth/session";
import bg from "@/public/assets/images/backgrounds/item@2x.png";

interface DatasetVersionPageProps {
	params: Promise<{
		persistentId: string;
		versionId: string;
	}>;
}

export async function generateMetadata(
	props: Readonly<DatasetVersionPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { data: token, error } = await promise(() => {
		return assertSession();
	});

	if (error != null) {
		redirect("/auth/sign-in");
	}

	const { persistentId: _persistentId, versionId: _versionId } = await params;
	const persistentId = decodeURIComponent(_persistentId);
	const versionId = Number(_versionId);

	const item = await getDatasetVersion({ persistentId, versionId, token });

	const metadata: Metadata = {
		title: item.label,
		description: item.description,
	};

	return metadata;
}

export default async function DatasetVersionPage(
	props: Readonly<DatasetVersionPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { data: token, error } = await promise(() => {
		return assertSession();
	});

	if (error != null) {
		redirect("/auth/sign-in");
	}

	const { persistentId: _persistentId, versionId: _versionId } = await params;
	const persistentId = decodeURIComponent(_persistentId);
	const versionId = Number(_versionId);

	const t = await getTranslations("DatasetVersionPage");

	// FIXME: the current marketplace also handles draft versions here
	const [item, user] = await Promise.all([
		getDatasetVersion({ persistentId, versionId, token }),
		getCurrentUser({ token }),
	]);

	const isEditable = is(item.status, "editable");
	const isDeletable = is(item.status, "deletable");
	const canDelete = isDeletable && can(user, item.category, "delete");
	const canEdit = isEditable && can(user, item.category, "edit");

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
		{
			href: createHref({
				pathname: `/datasets/${item.persistentId}/versions/${String(item.id)}`,
			}),
			label: t("breadcrumbs.items.version"),
		},
	];

	const description = await toJsx(item.description);

	return (
		<MainContent className="relative isolate mx-auto flex w-full max-w-[120rem] flex-col px-8">
			{/* TODO: should we just use the pre-optimised image.png/image@2x.png in a `srcSet`? */}
			<Image alt="" className="absolute" src={bg} />

			<div className="bg-notice-600 px-4 py-1.5 font-medium">
				{t("alert", { status: item.status })}
			</div>

			<Breadcrumbs items={breadcrumbs} label={t("breadcrumbs.label")} />

			<section className="relative flex flex-col gap-y-8 py-16">
				<div className="grid grid-cols-[auto_1fr_auto] gap-x-6">
					<ItemThumbnail category={item.category} mediaId={item.thumbnail.info.mediaId} />
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

			{/* FIXME: when does it make sense to actually show these controls? */}
			{canEdit || canDelete ? (
				<div className="flex gap-x-4">
					{canEdit ? (
						<ButtonLink
							href={createHref({
								pathname: `/datasets/${item.persistentId}/versions/${String(item.id)}/edit`,
							})}
							kind="negative"
							size="small"
						>
							{t("controls.edit")}
						</ButtonLink>
					) : null}
					{canDelete ? (
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

											await deleteDatasetVersion({
												persistentId: item.persistentId,
												versionId: item.id,
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
