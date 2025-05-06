import { createUrlSearchParams } from "@stefanprobst/request";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ItemPreview } from "@/components/common/ItemPreview";
import { SectionHeader } from "@/components/home/SectionHeader";
import { SectionTitle } from "@/components/home/SectionTitle";
import { SectionHeaderLink } from "@/components/home/SectionHeaderLink";
import { maxLastAddedItems } from "@/config/sshoc.config";
import { useItemSearch } from "@/data/sshoc/hooks/item";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function LastUpdatedItems(): ReactNode {
	const t = useTranslations();
	const itemSearch = useItemSearch({
		order: ["modified-on"],
		perpage: maxLastAddedItems,
	});

	if (itemSearch.data == null) {
		return (
			<section className="grid content-start gap-8 py-16 [grid-area:last-updated-items] before:absolute before:inset-0 before:-z-1 before:[grid-column:1/-1] before:[grid-row:last-updated-items] before:bg-neutral-50 xl:-mr-12 xl:pl-8 xl:before:[grid-column:last-updated-items/-1]">
				<Centered>
					<LoadingIndicator />
				</Centered>
			</section>
		);
	}

	const lastUpdatedItems = itemSearch.data.items;

	if (lastUpdatedItems.length === 0) {
		return null;
	}

	return (
		<section className="grid content-start gap-8 py-16 [grid-area:last-updated-items] before:absolute before:inset-0 before:-z-1 before:[grid-column:1/-1] before:[grid-row:last-updated-items] before:bg-neutral-50 xl:-mr-12 xl:pl-8 xl:before:[grid-column:last-updated-items/-1]">
			<SectionHeader>
				<SectionTitle>{t("common.home.see-what-is-new")}</SectionTitle>
				<SectionHeaderLink href={`/search?${createUrlSearchParams({ order: ["modified-on"] })}`}>
					{t("common.see-all")}
				</SectionHeaderLink>
			</SectionHeader>
			<section className="grid gap-6">
				<ul role="list" className="grid gap-16">
					{lastUpdatedItems.map((item, index) => {
						return (
							<li key={[item.persistentId, item.id].join("+")}>
								{index !== 0 ? <span className="flex h-px -translate-y-9 bg-neutral-150" /> : null}
								<ItemPreview item={item} headingLevel={4} />
							</li>
						);
					})}
				</ul>
			</section>
		</section>
	);
}
