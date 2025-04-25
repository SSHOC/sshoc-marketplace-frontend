import { Timestamp } from "@/components/common/Timestamp";
import css from "@/components/item/ItemMetadata.module.css";
import type { IsoDateString } from "@/data/sshoc/lib/types";
import { useI18n } from "@/lib/core/i18n/useI18n";

export interface ItemDateLastUpdatedProps {
	dateTime?: IsoDateString;
}

export function ItemDateLastUpdated(props: ItemDateLastUpdatedProps): JSX.Element | null {
	const { dateTime } = props;

	const { t } = useI18n<"common">();

	if (dateTime == null) {
		return null;
	}

	return (
		<div>
			<dt className={css["group-label"]}>{t(["common", "item", "date-last-modified"])}</dt>
			<dd>
				<Timestamp dateTime={dateTime} />
			</dd>
		</div>
	);
}
