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
import { type ItemCategory, searchItems } from "@/lib/api/client";
import { createHref } from "@/lib/navigation/create-href";
import bg from "@/public/assets/images/backgrounds/home@2x.png";
import people from "@/public/assets/images/backgrounds/home-people.svg";

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

	const sections = [
		{ id: "activity", title: t("section-browse.by-activity"), items: activity },
		{ id: "keyword", title: t("section-browse.by-keyword"), items: keyword },
	];

	return (
		<section>
			<h2>{t("section-browse.title")}</h2>

			{sections.map((section) => {
				const { id: facet, items, title } = section;

				return (
					<section key={facet}>
						<h3>{title}</h3>
						<ul role="list">
							{Object.entries(items).map(([id, item]) => {
								return (
									<li key={id}>
										<Link
											href={createHref({
												pathname: "/search",
												// FIXME: no need to leak backend shape
												searchParams: createUrlSearchParams({
													[`f.${facet}`]: id,
												}),
											})}
										>
											{id}
											<span>({item.count})</span>
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
		<section>
			<h2>{t("section-recommended.title")}</h2>

			{sections.map((section) => {
				const { id, items, title } = section;

				return (
					<section key={id}>
						<h3>{title}</h3>
						<ul role="list">
							{Object.entries(items).map(([id, item]) => {
								const { category, label, persistentId } = item;

								return (
									<li key={id}>
										<article>
											<h4>
												<Link
													href={createHref({
														pathname: `/${category}s/${persistentId}`,
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
			<h2>{t("section-last-updated.title")}</h2>

			<h3>{t("section-last-updated.lead")}</h3>

			<ul role="list">
				{items.map((item) => {
					const { category, label, persistentId } = item;

					return (
						<article key={persistentId}>
							<h4>
								<Link
									href={createHref({
										pathname: `/${category}s/${persistentId}`,
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
