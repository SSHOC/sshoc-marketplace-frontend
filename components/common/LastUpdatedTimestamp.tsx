import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import css from "@/components/common/LastUpdatedTimestamp.module.css";
import type { IsoDateString } from "@/lib/core/types";

export interface LastUpdatedTimestampProps {
	dateTime: IsoDateString;
}

export function LastUpdatedTimestamp(props: LastUpdatedTimestampProps): ReactNode {
	const { dateTime } = props;

	const t = useTranslations();
	const format = useFormatter();

	return (
		<time className={css["container"]} dateTime={dateTime}>
			{t("common.item.last-updated-on", {
				date: format.dateTime(new Date(dateTime)),
			})}
		</time>
	);
}
