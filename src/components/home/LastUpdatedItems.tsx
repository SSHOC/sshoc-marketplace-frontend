import { createUrlSearchParams } from "@stefanprobst/request";
import type { ReactNode } from "react";

import { ItemPreview } from "@/components/common/ItemPreview";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SectionTitle } from "@/components/common/SectionTitle";
import css from "@/components/home/LastUpdatedItems.module.css";
import { SectionHeaderLink } from "@/components/home/SectionHeaderLink";
import { useItemSearch } from "@/data/sshoc/hooks/item";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";
import { maxLastAddedItems } from "~/config/sshoc.config";

export function LastUpdatedItems(): ReactNode {
	const { t } = useI18n<"common">();
	const itemSearch = useItemSearch({ order: ["modified-on"], perpage: maxLastAddedItems });

	if (itemSearch.data == null) {
		return (
			<section className={css["container"]}>
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
		<section className={css["container"]}>
			<SectionHeader>
				<SectionTitle>{t(["common", "home", "see-what-is-new"])}</SectionTitle>
				<SectionHeaderLink href={`/search?${createUrlSearchParams({ order: ["modified-on"] })}`}>
					{t(["common", "see-all"])}
				</SectionHeaderLink>
			</SectionHeader>
			<section className={css["section"]}>
				<ul role="list" className={css["items"]}>
					{lastUpdatedItems.map((item) => {
						return (
							<li key={[item.persistentId, item.id].join("+")}>
								<ItemPreview item={item} headingLevel={4} />
							</li>
						);
					})}
				</ul>
			</section>
		</section>
	);
}
