import { useI18n } from "@/lib/core/i18n/useI18n";
import type { IsoDateString } from "@/lib/core/types";
import { isNonEmptyString } from "@/lib/utils";

export interface TimestampProps {
	dateTime: IsoDateString;
	/** @default 'long' */
	dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
	timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
}

export function Timestamp(props: TimestampProps): JSX.Element | null {
	const { dateTime, dateStyle = "long", timeStyle } = props;

	const { formatDateTime } = useI18n<"common">();

	if (!isNonEmptyString(dateTime)) {
		return null;
	}

	return (
		<time dateTime={dateTime}>{formatDateTime(new Date(dateTime), { dateStyle, timeStyle })}</time>
	);
}
