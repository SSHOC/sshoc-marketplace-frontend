import { createUrlSearchParams } from "@stefanprobst/request";

import { ItemPreview } from "@/components/common/ItemPreview";
import { SectionTitle } from "@/components/common/SectionTitle";
import css from "@/components/home/LastUpdatedItems.module.css";
import { SubSectionHeader } from "@/components/home/SubSectionHeader";
import { SubSectionHeaderLink } from "@/components/home/SubSectionHeaderLink";
import { SubSectionTitle } from "@/components/home/SubSectionTitle";
import { useItemSearch } from "@/data/sshoc/hooks/item";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";
import { maxLastAddedItems } from "~/config/sshoc.config";

export function LastUpdatedItems(): JSX.Element | null {
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
			<SectionTitle>{t(["common", "home", "last-updated"])}</SectionTitle>
			<section className={css["section"]}>
				<SubSectionHeader>
					<SubSectionTitle>{t(["common", "home", "see-what-is-new"])}</SubSectionTitle>
					<SubSectionHeaderLink
						href={`/search?${createUrlSearchParams({ order: ["modified-on"] })}`}
					>
						{t(["common", "see-all"])}
					</SubSectionHeaderLink>
				</SubSectionHeader>
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
