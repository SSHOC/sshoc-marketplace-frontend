import { createUrlSearchParams } from "@stefanprobst/request";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ItemPreview } from "@/components/common/ItemPreview";
import { SectionTitle } from "@/components/common/SectionTitle";
import { SectionHeader } from "@/components/home/SectionHeader";
import { SectionHeaderLink } from "@/components/home/SectionHeaderLink";
import { maxRecommendedItems } from "@/config/sshoc.config";
import { useItemSearch } from "@/data/sshoc/hooks/item";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function FeaturedResources(): ReactNode {
	const t = useTranslations();

	return (
		<section className="grid content-start gap-8 py-16 [grid-area:recommended-items]">
			<SectionHeader>
				<SectionTitle>{t("common.home.recommended")}</SectionTitle>
				<SectionHeaderLink
					href={`/search?${createUrlSearchParams({ "f.keyword": "recommended", order: ["modified-on"] })}`}
				>
					{t("common.see-all")}
				</SectionHeaderLink>
			</SectionHeader>
			<ul role="list" className="grid gap-12">
				<ItemsRecommended />
			</ul>
		</section>
	);
}

function ItemsRecommended(): ReactNode {
	const itemSearch = useItemSearch({
		"f.keyword": ["recommended"],
		order: ["modified-on"],
		perpage: maxRecommendedItems,
	});

	if (itemSearch.data == null) {
		return (
			<Centered elementType="li">
				<LoadingIndicator />
			</Centered>
		);
	}

	const recommendedItems = itemSearch.data.items;

	if (recommendedItems.length === 0) {
		return null;
	}

	return (
		<li>
			<section className="grid gap-6">
				<ul role="list" className="grid grid-cols-[repeat(auto-fill,minmax(24rem,1fr))] gap-16">
					{recommendedItems.map((item) => {
						return (
							<li key={[item.persistentId, item.id].join("+")}>
								<ItemPreview item={item} headingLevel={4} />
							</li>
						);
					})}
				</ul>
			</section>
		</li>
	);
}
