import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Timestamp } from "@/components/common/Timestamp";
import css from "@/components/item/ItemMetadata.module.css";
import type { IsoDateString } from "@/data/sshoc/lib/types";

export interface ItemDateLastUpdatedProps {
	dateTime?: IsoDateString;
}

export function ItemDateLastUpdated(props: ItemDateLastUpdatedProps): ReactNode {
	const { dateTime } = props;

	const t = useTranslations();

	if (dateTime == null) {
		return null;
	}

	return (
		<div>
			<dt className={css["group-label"]}>{t("common.item.date-last-modified")}</dt>
			<dd>
				<Timestamp dateTime={dateTime} />
			</dd>
		</div>
	);
}
