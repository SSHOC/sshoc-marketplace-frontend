import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import css from "@/components/item/ItemMetadata.module.css";
import type { Item } from "@/data/sshoc/api/item";
import { createKey } from "@/lib/utils/create-key";

export interface ItemExternalIdsProps {
	ids: Item["externalIds"];
}

export function ItemExternalIds(props: ItemExternalIdsProps): ReactNode {
	const { ids } = props;

	const t = useTranslations();

	if (ids.length === 0) {
		return null;
	}

	return (
		<div>
			<dt>
				<VisuallyHidden>{t("common.item.external-ids.other")}</VisuallyHidden>
			</dt>
			<dd>
				<ul role="list">
					{ids.map((id) => {
						if (internalExternalIds.includes(id.identifierService.code)) {
							return null;
						}

						if (id.identifierService.urlTemplate == null) {
							return (
								<li key={createKey(id.identifierService.code, id.identifier)}>
									{id.identifierService.label}: {id.identifier}
								</li>
							);
						}

						const href = id.identifierService.urlTemplate.replace(
							"{source-item-id}",
							id.identifier,
						);

						return (
							<li key={createKey(id.identifierService.code, id.identifier)}>
								<div>
									<a href={href} target="_blank" rel="noreferrer" className={css["link"]}>
										{id.identifierService.label}
									</a>
								</div>
							</li>
						);
					})}
				</ul>
			</dd>
		</div>
	);
}

const internalExternalIds = ["SourceItemId"];
