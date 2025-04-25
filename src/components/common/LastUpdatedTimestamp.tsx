import type { ReactNode } from "react";

import css from "@/components/common/LastUpdatedTimestamp.module.css";
import { useI18n } from "@/lib/core/i18n/useI18n";
import type { IsoDateString } from "@/lib/core/types";

export interface LastUpdatedTimestampProps {
	dateTime: IsoDateString;
}

export function LastUpdatedTimestamp(props: LastUpdatedTimestampProps): ReactNode {
	const { dateTime } = props;

	const { t, formatDateTime } = useI18n<"common">();

	return (
		<time className={css["container"]} dateTime={dateTime}>
			{t(["common", "item", "last-updated-on"], {
				values: { date: formatDateTime(new Date(dateTime)) },
			})}
		</time>
	);
}
