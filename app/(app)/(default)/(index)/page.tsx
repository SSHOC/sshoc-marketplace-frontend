import { createUrlSearchParams } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { MaintenanceNotice } from "@/app/(app)/(default)/_components/maintenance-notice";
import { ItemSearchForm } from "@/app/(app)/(default)/(index)/_components/item-search-form";
import {
	maxBrowseFacetValues,
	maxItemFacetValues,
	maxLastAddedItems,
	numRecommendedItems,
} from "@/app/(app)/(default)/(index)/_lib/config";
import {
	type SearchParamsSchema,
	validateSearchParams,
} from "@/app/(app)/(default)/(index)/_lib/validation";
import type { SearchParamsSchema as SearchPageSearchParamsSchema } from "@/app/(app)/(default)/search/_lib/validation";
import { ItemCategoryIcon } from "@/components/item-category-icon";
import { Link } from "@/components/link";
import { ServerImage as Image } from "@/components/server-image";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { MainContent } from "@/components/ui/main-content";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import {
	type ItemCategory,
	type ItemFacet,
	pluralize,
	type SearchItems,
	searchItems,
} from "@/lib/api/client";
import { toPlaintext } from "@/lib/markdown/to-plaintext";
import { createHref } from "@/lib/navigation/create-href";
import bg from "@/public/assets/images/backgrounds/home@2x.png";
import people from "@/public/assets/images/backgrounds/home-people.svg";

interface IndexPageProps {
	searchParams: Promise<SearchParams>;
}

export async function generateMetadata(
	_props: Readonly<IndexPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const _t = await getTranslations("IndexPage");

	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
		 */
		// title: t("meta.title"),
	};

	return metadata;
}

export default async function IndexPage(props: Readonly<IndexPageProps>): Promise<ReactNode> {
	const { searchParams } = props;

	const validatedSearchParams = await validateSearchParams(await searchParams);

	return (
		<MainContent className="relative isolate mx-auto flex w-full max-w-[120rem] flex-col px-8">
			<HeroSection searchParams={validatedSearchParams} />

			<div className="mx-auto w-full max-w-[100rem]">
				<Suspense
					fallback={
						<div className="grid flex-1 place-content-center py-16 text-neutral-700">
							<LoadingIndicator />
						</div>
					}
				>
					<BrowseSection />
					<RecommendedSection />
					<LastUpdatedSection />
				</Suspense>
			</div>

			<MaintenanceNotice />
		</MainContent>
	);
}

interface HeroSectionProps {
	searchParams: SearchParamsSchema;
}

function HeroSection(props: Readonly<HeroSectionProps>): ReactNode {
	const { searchParams } = props;

	const t = useTranslations("IndexPage");

	const categories = {
		all: {
			id: "all",
			label: t("search-form.categories.all"),
		},
		"tools-services": {
			id: "tool-or-service",
			label: t("search-form.categories.tool-or-service"),
		},
		"training-materials": {
			id: "training-material",
			label: t("search-form.categories.training-material"),
		},
		datasets: {
			id: "dataset",
			label: t("search-form.categories.dataset"),
		},
		publications: {
			id: "publication",
			label: t("search-form.categories.publication"),
		},
		workflows: {
			id: "workflow",
			label: t("search-form.categories.workflow"),
		},
	} as const;

	return (
		<div className="relative">
			<div className="absolute inset-x-0 top-0 size-full overflow-hidden">
				<Image alt="" className="absolute top-0 size-full object-cover" src={bg} />
				<Image
					alt=""
					className="absolute top-0 size-full object-contain object-center"
					src={people}
				/>
			</div>

			<section className="relative mx-auto flex w-full max-w-[72rem] flex-col gap-y-8 py-32">
				<h1 className="text-[1.75rem] leading-[1.25] font-bold text-neutral-800">
					{t("hero.title")}
				</h1>
				<div className="text-base leading-[1.75] text-neutral-800">
					{t.rich("hero.lead", { link: LeadLink })}
				</div>

				<ItemSearchForm categories={categories} searchParams={searchParams} />
			</section>
		</div>
	);
}

async function BrowseSection(): Promise<ReactNode> {
	const t = await getTranslations("IndexPage");

	/**
	 * Match the request from `<LastUpdatedSection>` so it can be deduplicated.
	 * Here we only need the list of facet values.
	 */
	const items = await searchItems({
		order: ["modified-on"],
		perpage: maxLastAddedItems,
	});

	const { activity, keyword } = items.facets;

	const sections: Array<{
		id: ItemFacet;
		title: string;
		items: Record<string, { checked: boolean; count: string }>;
	}> = [
		{ id: "activity", title: t("section-browse.by-activity"), items: activity },
		{ id: "keyword", title: t("section-browse.by-keyword"), items: keyword },
	];

	return (
		<section className="flex flex-col gap-y-8 py-16">
			<SectionTitle>{t("section-browse.title")}</SectionTitle>

			{sections.map((section) => {
				const { id: facet, items, title } = section;

				return (
					<section key={facet} className="flex flex-col gap-y-6">
						<SubSectionHeader>
							<SubSectionTitle>{title}</SubSectionTitle>
							<Link
								aria-label={t(`see-all.${facet}`)}
								className="text-base text-brand-750 transition hover:text-brand-600"
								href={createHref({
									pathname: `/browse/${pluralize.facets(facet)}`,
								})}
							>
								{t("see-all.label")}
							</Link>
						</SubSectionHeader>

						<ul className="flex flex-wrap gap-x-6 gap-y-3" role="list">
							{Object.entries(items)
								.slice(0, maxBrowseFacetValues)
								.map(([id, item]) => {
									return (
										<li key={id}>
											<Link
												className="inline-flex gap-x-1 text-regular text-brand-750 transition hover:text-brand-600"
												href={createHref({
													pathname: "/search",
													searchParams: createUrlSearchParams({
														[`f.${facet}`]: [id],
													} satisfies Partial<SearchPageSearchParamsSchema>),
												})}
											>
												{id}
												<span className="text-neutral-600">({item.count})</span>
											</Link>
										</li>
									);
								})}
						</ul>
					</section>
				);
			})}
		</section>
	);
}

async function RecommendedSection(): Promise<ReactNode> {
	const t = await getTranslations("IndexPage");

	const categories: Array<{ id: ItemCategory; title: string }> = [
		{ id: "tool-or-service", title: t("section-recommended.tools-services") },
		{ id: "training-material", title: t("section-recommended.training-materials") },
		{ id: "publication", title: t("section-recommended.publications") },
		{ id: "dataset", title: t("section-recommended.datasets") },
		{ id: "workflow", title: t("section-recommended.workflows") },
	];

	const sections = await Promise.all(
		categories.map(async (category) => {
			const { items } = await searchItems({
				categories: [category.id],
				"f.keyword": ["recommended"],
				order: ["modified-on"],
				perpage: numRecommendedItems,
			});

			return { ...category, items };
		}),
	);

	return (
		<section className="flex flex-col gap-y-8 py-16">
			<SectionTitle>{t("section-recommended.title")}</SectionTitle>

			{sections.map((section) => {
				const { id, items, title } = section;

				if (items.length === 0) {
					return null;
				}

				return (
					<section key={id} className="flex flex-col gap-y-6">
						<SubSectionHeader>
							<SubSectionTitle>{title}</SubSectionTitle>
							<Link
								aria-label={t(`see-all.${id}`)}
								className="text-base text-brand-750 transition hover:text-brand-600"
								href={createHref({
									pathname: "/search",
									searchParams: createUrlSearchParams({
										categories: [id],
										order: "label",
									} satisfies Partial<SearchPageSearchParamsSchema>),
								})}
							>
								{t("see-all.label")}
							</Link>
						</SubSectionHeader>

						<ul
							className="grid grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),1fr))] gap-16"
							role="list"
						>
							{items.map((item) => {
								return (
									<li key={item.persistentId}>
										<ItemPreview item={item} />
									</li>
								);
							})}
						</ul>
					</section>
				);
			})}
		</section>
	);
}

async function LastUpdatedSection(): Promise<ReactNode> {
	const t = await getTranslations("IndexPage");

	const { items } = await searchItems({
		order: ["modified-on"],
		perpage: maxLastAddedItems,
	});

	return (
		<section className="flex flex-col gap-y-8 py-16">
			<SectionTitle>{t("section-last-updated.title")}</SectionTitle>

			<section className="flex flex-col gap-y-6">
				<SubSectionHeader>
					<SubSectionTitle>{t("section-last-updated.lead")}</SubSectionTitle>
					<Link
						aria-label={t("see-all.recent-changes")}
						className="text-base text-brand-750 transition hover:text-brand-600"
						href={createHref({
							pathname: "/search",
							searchParams: createUrlSearchParams({
								order: "modified-on",
							} satisfies Partial<SearchPageSearchParamsSchema>),
						})}
					>
						{t("see-all.label")}
					</Link>
				</SubSectionHeader>

				<ul className="flex flex-col gap-y-16" role="list">
					{items.map((item) => {
						return (
							<li key={item.persistentId}>
								<ItemPreview item={item} />
							</li>
						);
					})}
				</ul>
			</section>
		</section>
	);
}

function LeadLink(chunks: Readonly<ReactNode>): ReactNode {
	return (
		<Link className="text-brand-750 transition hover:text-brand-600" href="/about/service">
			{chunks}
		</Link>
	);
}

interface SectionTitleProps {
	children: ReactNode;
}

function SectionTitle(props: Readonly<SectionTitleProps>): ReactNode {
	const { children } = props;

	return <h2 className="text-[1.625rem] font-medium text-neutral-800">{children}</h2>;
}

interface SubSectionHeaderProps {
	children: ReactNode;
}

function SubSectionHeader(props: Readonly<SubSectionHeaderProps>): ReactNode {
	const { children } = props;

	return (
		<div className="flex items-baseline justify-between border-b border-neutral-150 py-4">
			{children}
		</div>
	);
}

interface SubSectionTitleProps {
	children: ReactNode;
}

function SubSectionTitle(props: Readonly<SubSectionTitleProps>): ReactNode {
	const { children } = props;

	return <h3 className="text-xl font-medium text-neutral-800">{children}</h3>;
}

interface ItemPreviewProps {
	item: SearchItems.Response["items"][number];
}

async function ItemPreview(props: Readonly<ItemPreviewProps>): Promise<ReactNode> {
	const { item } = props;

	const t = await getTranslations("IndexPage");

	const { category, description: _description, label, persistentId, properties } = item;
	const description = await toPlaintext(_description);

	const pathname = `/${pluralize.categories(category)}/${persistentId}`;

	const activities = properties
		.filter((property) => {
			return property.type.code === "activity";
		})
		.slice(0, maxItemFacetValues);

	const keywords = properties
		.filter((property) => {
			return property.type.code === "keyword";
		})
		.slice(0, maxItemFacetValues);

	const metadata = [
		{ id: "activity", label: t("facets.activities"), properties: activities },
		{ id: "keyword", label: t("facets.keywords"), properties: keywords },
	];

	return (
		<article className="flex flex-col gap-y-4">
			<h4>
				<TooltipTrigger>
					<Link
						className="inline-flex items-center gap-x-3 text-[1.0625rem] font-medium text-neutral-800 transition hover:text-brand-750"
						href={createHref({ pathname })}
					>
						<ItemCategoryIcon category={category} className="size-10 shrink-0" />

						{label}
					</Link>
					<Tooltip>{t(`categories.${category}`)}</Tooltip>
				</TooltipTrigger>
			</h4>

			<dl className="flex flex-col gap-y-1 text-xs">
				{metadata.map(({ id, label, properties }) => {
					if (properties.length === 0) {
						return null;
					}

					return (
						<div key={id} className="flex gap-x-2">
							<dt className="text-neutral-600">{label}</dt>
							<dd className="flex flex-wrap gap-x-1.5 gap-y-1 text-brand-750">
								{properties.map((property) => {
									/**
									 * Both `activity` and `keyword` values should be concepts, i.e. vocabulary-based,
									 * but they are not in the backend's initial development data.
									 */
									const isConcept = property.type.type === "concept";
									const label = isConcept ? property.concept.label : property.value;
									const id = isConcept ? property.concept.code : property.value;

									return (
										<Link
											key={id}
											className="transition hover:text-brand-600"
											href={createHref({
												pathname: "/search",
												searchParams: createUrlSearchParams({
													[`f.${id}`]: [label],
												} satisfies Partial<SearchPageSearchParamsSchema>),
											})}
										>
											{label}
										</Link>
									);
								})}
							</dd>
						</div>
					);
				})}
			</dl>

			<div className="line-clamp-3 text-base leading-[1.75] text-neutral-700">{description}</div>

			<Link
				aria-label={t("read-more-about", { item: label })}
				className="self-end text-sm text-brand-750 transition hover:text-brand-600"
				href={createHref({ pathname })}
			>
				{t("read-more")}
			</Link>
		</article>
	);
}
