import { ExternalLinkIcon, LinkIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/app/(app)/(default)/(items)/_components/breadcrumbs";
import { CopyLinkButton } from "@/app/(app)/(default)/(items)/_components/copy-link-button";
import { ItemThumbnail } from "@/app/(app)/(default)/(items)/_components/item-thumbnail";
import { SchemaOrgMetadata } from "@/app/(app)/(default)/(items)/publications/[persistentId]/(index)/_components/schema-org-metadata";
import { getPublication } from "@/app/(app)/(default)/(items)/publications/[persistentId]/(index)/_lib/get-publication";
import type { SearchParamsSchema as SearchPageSearchParamsSchema } from "@/app/(app)/(default)/search/_lib/validation";
import { ServerImage as Image } from "@/components/server-image";
import { ButtonLink } from "@/components/ui/button";
import { MainContent } from "@/components/ui/main-content";
import { toJsx } from "@/lib/markdown/to-jsx";
import { createFullUrl } from "@/lib/navigation/create-full-url";
import { createHref } from "@/lib/navigation/create-href";
import bg from "@/public/assets/images/backgrounds/item@2x.png";

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
		description: item.description,
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
			label: t("breadcrumbs.items.publications"),
		},
		{
			href: createHref({
				pathname: `/publications/${item.persistentId}`,
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
						href={String(createFullUrl({ pathname: `/publications/${item.persistentId}` }))}
						kind="text"
					>
						<LinkIcon aria-hidden={true} className="size-4 shrink-0" data-slot="icon" />
						{t("copy-to-clipboard")}
					</CopyLinkButton>
				</div>
			</section>

			<section className="relative flex flex-col gap-y-8 py-16">
				<div className="prose">{description}</div>
			</section>

			<aside>
				<ButtonLink href={item.accessibleAt.at(0)}>
					{t("go-to-publication")}
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
