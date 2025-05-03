import { useFormatter } from "next-intl";
import type { ReactNode } from "react";

import type { IsoDateString } from "@/lib/core/types";
import { isNonEmptyString } from "@/lib/utils";

export interface TimestampProps {
	dateTime: IsoDateString;
	/** @default 'long' */
	dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
	timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
}

export function Timestamp(props: TimestampProps): ReactNode {
	const { dateTime, dateStyle = "long", timeStyle } = props;

	const format = useFormatter();

	if (!isNonEmptyString(dateTime)) {
		return null;
	}

	return (
		<time dateTime={dateTime}>{format.dateTime(new Date(dateTime), { dateStyle, timeStyle })}</time>
	);
}
