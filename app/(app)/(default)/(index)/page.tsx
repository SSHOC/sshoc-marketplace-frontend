import { createUrlSearchParams } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { ItemCategoryIcon } from "@/components/item-category-icon";
import { Link } from "@/components/link";
import { SearchForm } from "@/components/search-form";
import { ServerImage as Image } from "@/components/server-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListBox, ListBoxItem } from "@/components/ui/listbox";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { MainContent } from "@/components/ui/main-content";
import { Popover } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
import { type ItemCategory, type ItemFacet, pluralize, searchItems } from "@/lib/api/client";
import { createHref } from "@/lib/navigation/create-href";
import bg from "@/public/assets/images/backgrounds/home@2x.png";
import people from "@/public/assets/images/backgrounds/home-people.svg";

// TODO: sync search form to url search params

interface IndexPageProps {}

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

export default function IndexPage(_props: Readonly<IndexPageProps>): ReactNode {
	return (
		<MainContent className="relative isolate mx-auto flex w-full max-w-[120rem] flex-col px-8">
			<HeroSection />
			<div className="mx-auto w-full max-w-[100rem]">
				<Suspense
					fallback={
						<div className="grid flex-1 place-content-center">
							<LoadingIndicator />
						</div>
					}
				>
					<BrowseSection />
					<RecommendedSection />
					<LastUpdatedSection />
				</Suspense>
			</div>
		</MainContent>
	);
}

function HeroSection(): ReactNode {
	const t = useTranslations("IndexPage");

	const categories = {
		all: { id: "all", label: "All categories" },
		"tools-services": { id: "tool-or-service", label: "Tools & services" },
		"training-materials": { id: "training-material", label: "Training materials" },
		datasets: { id: "dataset", label: "Datasets" },
		publications: { id: "publication", label: "Publications" },
		workflows: { id: "workflow", label: "Workflows" },
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
				<h1 className="text-[1.75rem] font-bold text-neutral-800">{t("hero.title")}</h1>
				<div className="text-base text-neutral-800">{t.rich("hero.lead", { link: LeadLink })}</div>
				<SearchForm
					action="/search"
					className="flex items-end gap-x-4 rounded-md border border-neutral-150 bg-neutral-0 px-6 py-2 shadow"
				>
					<Select className="min-w-55" defaultSelectedKey="all" name="categories">
						<Label className="sr-only">{t("search-form.categories.label")}</Label>
						<SelectTrigger>
							<SelectValue className="flex items-center gap-x-3" />
						</SelectTrigger>
						<Popover>
							<ListBox>
								{Object.entries(categories).map(([key, category]) => {
									return (
										<ListBoxItem key={key} id={category.id} textValue={category.label}>
											{category.id !== "all" ? (
												<ItemCategoryIcon
													category={category.id}
													className="size-5 shrink-0"
													data-slot="icon"
												/>
											) : (
												<div className="size-5 shrink-0" />
											)}
											{category.label}
										</ListBoxItem>
									);
								})}
							</ListBox>
						</Popover>
					</Select>

					<TextInput className="flex-1" name="q" type="search">
						<Label className="sr-only">{t("search-form.search-input.label")}</Label>
						<Input />
					</TextInput>

					<Button kind="gradient" type="submit">
						{t("search-form.submit")}
					</Button>
				</SearchForm>
			</section>
		</div>
	);
}

function LeadLink(chunks: ReactNode): ReactNode {
	return (
		<Link className="text-brand-750 transition hover:text-brand-600" href="/about/service">
			{chunks}
		</Link>
	);
}

interface SectionTitleProps {
	children: ReactNode;
}

function SectionTitle(props: SectionTitleProps): ReactNode {
	const { children } = props;

	return <h2 className="text-[1.625rem] font-medium text-neutral-800">{children}</h2>;
}

interface SubSectionTitleProps {
	children: ReactNode;
}

function SubSectionTitle(props: SubSectionTitleProps): ReactNode {
	const { children } = props;

	return <h3 className="text-xl font-medium text-neutral-800">{children}</h3>;
}

async function BrowseSection(): Promise<ReactNode> {
	const t = await getTranslations("IndexPage");

	/**
	 * Same request as in `<LastUpdatedSection>`, so it can be de-duplicated.
	 * Here we only need the facet values and counts.
	 */
	const items = await searchItems({
		order: ["modified-on"],
		perpage: 5,
	});

	const { activity, keyword } = items.facets;

	const maxItems = 20;

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
						<div className="flex items-baseline justify-between border-b border-neutral-150 py-4">
							<SubSectionTitle>{title}</SubSectionTitle>
							<Link
								className="text-base text-brand-750 transition hover:text-brand-600"
								href={createHref({
									pathname: `/browse/${pluralize.facets(facet)}`,
								})}
							>
								{t("see-all")}
							</Link>
						</div>

						<ul className="flex flex-wrap gap-x-6 gap-y-3" role="list">
							{Object.entries(items)
								.slice(0, maxItems)
								.map(([id, item]) => {
									return (
										<li key={id}>
											<Link
												className="inline-flex gap-x-1 text-regular text-brand-750 transition hover:text-brand-600"
												href={createHref({
													pathname: "/search",
													// FIXME: typecheck
													searchParams: createUrlSearchParams({
														[`f.${facet}`]: [id],
													}),
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
				perpage: 2,
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
						<div className="flex items-baseline justify-between border-b border-neutral-150 py-4">
							<SubSectionTitle>{title}</SubSectionTitle>
							<Link
								className="text-base text-brand-750 transition hover:text-brand-600"
								href={createHref({
									pathname: "/search",
									// FIXME: typecheck
									searchParams: createUrlSearchParams({
										categories: [id],
										order: ["label"],
									}),
								})}
							>
								{t("see-all")}
							</Link>
						</div>

						<ul
							className="grid grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),1fr))] gap-16"
							role="list"
						>
							{Object.entries(items).map(([id, item]) => {
								const { category, description, label, persistentId, properties } = item;

								const pathname = `/${pluralize.categories(category)}/${persistentId}`;

								const activities = properties.filter((property) => {
									return property.type.code === "activity";
								});
								const keywords = properties.filter((property) => {
									return property.type.code === "keyword";
								});

								return (
									<li key={id}>
										<article className="flex flex-col gap-y-4">
											<h4 className="inline-flex items-center gap-x-3">
												<ItemCategoryIcon
													category={category}
													className="size-10 shrink-0"
													data-slot="icon"
												/>
												<Link
													className="text-[1.0625rem] font-medium text-neutral-800 transition hover:text-brand-750"
													href={createHref({ pathname })}
												>
													{label}
												</Link>
											</h4>

											<dl className="flex flex-col gap-y-1 text-xs">
												<div className="flex gap-x-2">
													<dt className="text-neutral-600">{t("activities")}</dt>
													<dd className="flex flex-wrap gap-x-1.5 gap-y-1 text-brand-750">{}</dd>
												</div>
												<div className="flex gap-x-2">
													<dt className="text-neutral-600">{t("keywords")}</dt>
													<dd className="flex flex-wrap gap-x-1.5 gap-y-1 text-brand-750">{}</dd>
												</div>
											</dl>

											<div className="line-clamp-3 text-base leading-[1.75] text-neutral-700">
												{description}
											</div>

											<Link
												className="self-end text-sm text-brand-750 transition hover:text-brand-600"
												href={createHref({ pathname })}
											>
												{t("read-more")}
											</Link>
										</article>
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
		perpage: 5,
	});

	return (
		<section>
			<SectionTitle>{t("section-last-updated.title")}</SectionTitle>

			<h3>{t("section-last-updated.lead")}</h3>

			<ul role="list">
				{items.map((item) => {
					const { category, label, persistentId } = item;

					return (
						<article key={persistentId}>
							<h4>
								<Link
									href={createHref({
										pathname: `/${pluralize.categories(category)}/${persistentId}`,
									})}
								>
									<ItemCategoryIcon
										category={category}
										className="size-6 shrink-0"
										data-slot="icon"
									/>
									{label}
								</Link>
							</h4>
						</article>
					);
				})}
			</ul>
		</section>
	);
}
