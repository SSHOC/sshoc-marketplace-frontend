import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListBox, ListBoxItem } from "@/components/ui/listbox";
import { MainContent } from "@/components/ui/main-content";
import { Popover } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";

interface IndexPageProps {}

export default function IndexPage(_props: Readonly<IndexPageProps>): ReactNode {
	return (
		<MainContent>
			<HeroSection />
		</MainContent>
	);
}

function LeadLink(chunks: ReactNode): ReactNode {
	return (
		<Link className="text-primary-750 transition hover:text-primary-600" href="/about/service">
			{chunks}
		</Link>
	);
}

function HeroSection(): ReactNode {
	const t = useTranslations("IndexPage");

	const categories = {
		all: { id: "all", label: "All categories" },
		"tool-services": { id: "tool-or-service", label: "Tools & services" },
		"training-materials": { id: "training-materials", label: "Training materials" },
		datasets: { id: "dataset", label: "Datasets" },
		publications: { id: "publication", label: "Publications" },
		workflows: { id: "workflow", label: "Workflows" },
	};

	return (
		<section>
			<h1>{t("title")}</h1>
			<div className="text-base text-neutral-800">{t.rich("lead", { link: LeadLink })}</div>
			<SearchForm action="/search" className="flex gap-x-4">
				<Select defaultSelectedKey="all" name="categories">
					<Label>{t("form.categories.label")}</Label>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<Popover>
						<ListBox>
							{Object.entries(categories).map(([key, category]) => {
								return (
									<ListBoxItem key={key} id={category.id} textValue={category.label}>
										{category.label}
									</ListBoxItem>
								);
							})}
						</ListBox>
					</Popover>
				</Select>

				<TextInput name="q" type="search">
					<Label>{t("form.search-input.label")}</Label>
					<Input />
				</TextInput>

				<Button type="submit">{t("form.submit")}</Button>
			</SearchForm>
		</section>
	);
}
