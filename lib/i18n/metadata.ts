import { useMessages } from "next-intl";
import { getMessages } from "next-intl/server";

import type { IntlLocale } from "@/lib/i18n/locales";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getMetadata(locale?: IntlLocale) {
	const { metadata } = await getMessages({ locale });

	return metadata;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useMetadata() {
	const { metadata } = useMessages();

	return metadata;
}
