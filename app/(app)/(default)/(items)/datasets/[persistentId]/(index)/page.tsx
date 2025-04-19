import { ExternalLinkIcon, LinkIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { CopyLinkButton } from "@/app/(app)/(default)/(items)/_components/copy-link-button";
import { SchemaOrgMetadata } from "@/app/(app)/(default)/(items)/datasets/[persistentId]/(index)/_components/schema-org-metadata";
import { getDataset } from "@/app/(app)/(default)/(items)/datasets/[persistentId]/(index)/_lib/get-dataset";
import type { SearchParamsSchema as SearchPageSearchParamsSchema } from "@/app/(app)/(default)/search/_lib/validation";
import { ItemCategoryIcon } from "@/components/item-category-icon";
import { ServerImage as Image } from "@/components/server-image";
import { ButtonLink } from "@/components/ui/button";
import { MainContent } from "@/components/ui/main-content";
import { getMediaThumbnailUrl } from "@/lib/api/client";
import { toJsx } from "@/lib/markdown/to-jsx";
import { createFullUrl } from "@/lib/navigation/create-full-url";
import { createHref } from "@/lib/navigation/create-href";
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

	const item = await getDataset(persistentId);

	const metadata: Metadata = {
		title: item.label,
		description: item.description,
	};

	return metadata;
}

export default async function DatasetPage(props: Readonly<DatasetPageProps>): Promise<ReactNode> {
	const { params } = props;

	const { persistentId: _persistentId } = await params;
	const persistentId = decodeURIComponent(_persistentId);

	const t = await getTranslations("DatasetPage");

	const item = await getDataset(persistentId);

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

			<nav aria-label={t("breadcrumbs.label")}></nav>

			<section className="relative flex flex-col gap-y-8 py-16">
				<div className="grid grid-cols-[auto_1fr_auto] gap-x-6">
					{
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						item.thumbnail != null ? (
							// TODO: priority?
							// eslint-disable-next-line @next/next/no-img-element
							<img
								alt=""
								className="size-20 shrink-0 object-contain"
								src={String(getMediaThumbnailUrl(item.thumbnail.info.mediaId))}
							/>
						) : (
							// TODO: priority?
							<ItemCategoryIcon
								aria-hidden={true}
								category={item.category}
								className="size-20 shrink-0"
							/>
						)
					}
					<h1 className="text-[2rem] leading-[1.25] font-medium text-neutral-800">{item.label}</h1>
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

			<section className="relative flex flex-col gap-y-8 py-16">{description}</section>

			<aside>
				<ButtonLink href={item.accessibleAt.at(0)}>
					{t("go-to-dataset")}
					<ExternalLinkIcon aria-hidden={true} className="size-5 shrink-0" data-slot="icon" />
				</ButtonLink>
			</aside>
		</MainContent>
	);
}
